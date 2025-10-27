const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL as string | undefined;

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiRequest<T = any>(
  endpoint: string = '',
  method: string = 'GET',
  body?: any
): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    return {
      error: 'API base URL não configurada. Defina VITE_API_BASE_URL no seu .env',
      status: 500,
    };
  }

  const base = API_BASE_URL.replace(/\/+$/g, '');
  const url = `${base}${endpoint ? `/${endpoint}` : ''}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    method,
    headers,
    mode: 'cors',
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    let data;
    
    // Tenta fazer o parse da resposta como JSON
    try {
      data = await response.json();
    } catch (e) {
      // Se não for JSON, pega o texto da resposta
      const text = await response.text();
      data = text || { message: 'Resposta vazia do servidor' };
    }

    if (!response.ok) {
      return {
        error: data.message || `Erro na requisição: ${response.statusText}`,
        status: response.status,
      };
    }

    return {
      data,
      status: response.status,
    };
  } catch (error) {
    console.error('Erro na requisição:', error);
    return {
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      status: 500,
    };
  }
}

// Funções específicas para os endpoints da API
export const api = {
  // Exemplo de função para buscar dados
  getData: async <T = any>(): Promise<ApiResponse<T>> => 
    apiRequest<T>(),
    
  // Exemplo de função para enviar dados
  postData: async <T = any>(data: any): Promise<ApiResponse<T>> => 
    apiRequest<T>('', 'POST', data),
    
  // Adicione mais funções conforme necessário
};

export default api;
