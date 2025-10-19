import { useState } from "react";
import { gerarPerguntas } from "../services/triagem";
import { Button } from "./ui/button";

export default function Triagem() {
  const [loading, setLoading] = useState(false);
  const [perguntas, setPerguntas] = useState([]);

  async function iniciarTriagem() {
    setLoading(true);

    const dados = {
      nome: "Gabriel",
      sintomas: ["febre", "tosse"],
    };

    try {
      const result = await gerarPerguntas(dados);
      setPerguntas(result.perguntas);
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao gerar perguntas");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4">
      <Button
        onClick={iniciarTriagem}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700"
      >
        {loading ? "Gerando..." : "Iniciar Triagem"}
      </Button>

      <div className="mt-4 space-y-2">
        {perguntas.map((p, i) => (
          <p key={i} className="text-gray-800">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}