import React, { useState, useEffect } from 'react';
import { api } from '../services/apiService';

const ApiExample: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.getData();
        
        if (response.error) {
          setError(response.error);
        } else {
          setData(response.data);
        }
      } catch (err) {
        setError('Erro ao buscar dados da API');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handlePostData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Exemplo de dados para enviar
      const response = await api.postData({
        // Adicione os dados que você deseja enviar
        timestamp: new Date().toISOString(),
        // ...outros campos
      });
      
      if (response.error) {
        setError(response.error);
      } else {
        // Atualiza os dados após o POST
        const fetchResponse = await api.getData();
        if (!fetchResponse.error) {
          setData(fetchResponse.data);
        }
      }
    } catch (err) {
      setError('Erro ao enviar dados para a API');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Dados da API</h2>
      
      <div className="mb-4 p-4 bg-gray-100 rounded">
        <pre className="text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      
      <button
        onClick={handlePostData}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? 'Enviando...' : 'Enviar Dados'}
      </button>
    </div>
  );
};

export default ApiExample;
