import { createReadStream } from "fs";
import { readdir, stat } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import chalk from "chalk";
import csv from "csv-parser";
import { MongoClient, ServerApiVersion } from "mongodb";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.resolve(__dirname, "dados");
const BATCH_SIZE = 10_000;
const DATABASE_NAME = "sngpc_cloud";
const COLLECTION_NAME = "industrializados";

const DEFAULT_URI =
  "mongodb+srv://gabdrawed14:SUA_SENHA_AQUI@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority";
const MONGODB_URI = process.env.MONGODB_URI ?? DEFAULT_URI;

if (
  MONGODB_URI.includes("SUA_SENHA_AQUI") ||
  MONGODB_URI.includes("xxxxx")
) {
  throw new Error(
    "Atualize a string de conexão do MongoDB com a senha e o host corretos (ou defina MONGODB_URI).",
  );
}

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function ensureDataDir() {
  try {
    const stats = await stat(DATA_DIR);
    if (!stats.isDirectory()) {
      throw new Error(`${DATA_DIR} existe, mas não é um diretório.`);
    }
  } catch (error) {
    throw new Error(
      `Diretório de dados não encontrado em ${DATA_DIR}. Crie a pasta e adicione os arquivos CSV.`,
    );
  }
}

async function listCsvFiles() {
  const entries = await readdir(DATA_DIR, { withFileTypes: true });
  return entries
    .filter(
      (entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".csv"),
    )
    .map((entry) => entry.name)
    .sort();
}

async function insertBatch(collection, batch, fileName) {
  if (!batch.length) return 0;

  try {
    const result = await collection.insertMany(batch, { ordered: false });
    return result.insertedCount ?? batch.length;
  } catch (error) {
    const inserted =
      error.result?.result?.nInserted ??
      error.result?.insertedCount ??
      error.insertedCount ??
      0;
    console.error(
      chalk.yellow(
        `    ⚠ Falha ao inserir lote do arquivo ${fileName}: ${error.message}`,
      ),
    );
    return inserted;
  }
}

async function importFile(collection, fileName, index, total) {
  const filePath = path.join(DATA_DIR, fileName);
  console.log(
    chalk.blueBright(
      `→ Processando ${fileName} (${index}/${total} arquivos)...`,
    ),
  );

  const stream = createReadStream(filePath, {
    encoding: "latin1",
  }).pipe(
    csv({
      separator: ";",
      mapValues: ({ value }) => (typeof value === "string" ? value.trim() : value),
    }),
  );

  let batch = [];
  let insertedCount = 0;
  let lineCount = 0;

  try {
    for await (const record of stream) {
      batch.push(record);
      lineCount += 1;

      if (batch.length >= BATCH_SIZE) {
        insertedCount += await insertBatch(collection, batch, fileName);
        batch = [];
        process.stdout.write(
          chalk.gray(`    ${lineCount} linhas processadas...\r`),
        );
      }
    }

    if (batch.length) {
      insertedCount += await insertBatch(collection, batch, fileName);
    }

    process.stdout.write("".padEnd(40, " ") + "\r");
    console.log(
      chalk.greenBright(
        `   ✔ ${fileName}: ${insertedCount} registros inseridos (${index}/${total})`,
      ),
    );
    return insertedCount;
  } catch (error) {
    process.stdout.write("".padEnd(40, " ") + "\r");
    console.error(
      chalk.redBright(
        `   ✖ Erro ao importar ${fileName}: ${error.message}`,
      ),
    );
    return insertedCount;
  }
}

async function main() {
  console.log(chalk.cyan("\n📦 Iniciando importação de CSVs para o MongoDB...\n"));

  await ensureDataDir();
  const files = await listCsvFiles();

  if (files.length === 0) {
    console.log(
      chalk.yellow(
        "Nenhum arquivo .csv encontrado na pasta ./dados. Adicione os arquivos e execute novamente.",
      ),
    );
    return;
  }

  await client.connect();
  console.log(chalk.cyan("Conexão com MongoDB estabelecida."));

  const db = client.db(DATABASE_NAME);
  const collection = db.collection(COLLECTION_NAME);

  let totalInserted = 0;

  for (let i = 0; i < files.length; i += 1) {
    const fileName = files[i];
    const insertedForFile = await importFile(collection, fileName, i + 1, files.length);
    totalInserted += insertedForFile;
    console.log(
      chalk.magenta(
        `   ↳ Progresso geral: ${i + 1}/${files.length} arquivos concluídos.`,
      ),
    );
  }

  console.log(
    chalk.greenBright(
      `\n✅ Importação concluída! ${totalInserted} registros inseridos no total.\n`,
    ),
  );
}

main()
  .catch((error) => {
    console.error(chalk.redBright(`Erro durante a importação: ${error.message}`));
    process.exitCode = 1;
  })
  .finally(async () => {
    await client.close();
    console.log(chalk.gray("Conexão com MongoDB encerrada."));
  });

