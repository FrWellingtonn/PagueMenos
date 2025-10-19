export async function gerarPerguntas(dadosPaciente) {
  const response = await fetch(
    "https://xzyrgf6hy7oxnukqbedda5xblq0omzrx.lambda-url.us-east-2.on.aws/",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dadosPaciente),
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao gerar perguntas");
  }

  return await response.json();
}