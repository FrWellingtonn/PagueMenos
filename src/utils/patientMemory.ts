const API_ENDPOINT = process.env.REACT_APP_PATIENT_MEMORY_API || 'YOUR_API_GATEWAY_ENDPOINT';

export interface PatientMemory {
  cpf: string;
  data: {
    summary: string;
    lastUpdated: string;
    alerts: string[];
    recommendations: string[];
    medications: Array<{
      name: string;
      dosage: string;
      frequency: string;
      lastTaken?: string;
      nextDose?: string;
      status?: 'on_time' | 'delayed' | 'missed';
      alert?: string;
    }>;
    exams: Array<{
      name: string;
      date: string;
      result: string;
      status: 'normal' | 'warning' | 'critical';
      notes?: string;
    }>;
  };
}

export const savePatientMemory = async (cpf: string, data: any): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'save',
        cpf,
        data: {
          ...data,
          lastUpdated: new Date().toISOString(),
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save patient memory');
    }
  } catch (error) {
    console.error('Error saving patient memory:', error);
    throw error;
  }
};

export const getPatientMemory = async (cpf: string): Promise<PatientMemory | null> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'retrieve',
        cpf,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch patient memory');
    }

    const result = await response.json();
    return result.memory;
  } catch (error) {
    console.error('Error fetching patient memory:', error);
    return null;
  }
};

export const deletePatientMemory = async (cpf: string): Promise<void> => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'delete',
        cpf,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete patient memory');
    }
  } catch (error) {
    console.error('Error deleting patient memory:', error);
    throw error;
  }
};
