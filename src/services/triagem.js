const API_BASE_URL = (import.meta && import.meta.env) ? import.meta.env.VITE_API_BASE_URL : undefined;

export async function gerarPerguntas(dadosPaciente) {
  if (!API_BASE_URL) {
    throw new Error("API base URL não configurada. Defina VITE_API_BASE_URL no seu .env");
  }

  const base = API_BASE_URL.replace(/\/+$/g, "");
  const response = await fetch(`${base}/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dadosPaciente),
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar perguntas");
  }

  return await response.json();
}
