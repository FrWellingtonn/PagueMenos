import { DynamoDB } from 'aws-sdk';

interface PatientMemory {
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
      status: 'on_time' | 'delayed' | 'missed';
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

const dynamoDb = new DynamoDB.DocumentClient();
const TABLE_NAME = process.env.PATIENT_MEMORY_TABLE || 'PatientMemory';

export const handler = async (event: { body?: string }) => {
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required' })
      };
    }
    
    const { action, cpf, data } = JSON.parse(event.body);
    
    if (!cpf) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'CPF is required' })
      };
    }

    switch (action) {
      case 'save':
        if (!data) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Data is required for save action' })
          };
        }
        await savePatientMemory(cpf, data);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Memory saved successfully' })
        };

      case 'retrieve':
        const memory = await getPatientMemory(cpf);
        return {
          statusCode: 200,
          body: JSON.stringify({ memory })
        };

      case 'delete':
        await deletePatientMemory(cpf);
        return {
          statusCode: 200,
          body: JSON.stringify({ message: 'Memory deleted successfully' })
        };

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
        };
    }
  } catch (error) {
    console.error('Error in patientMemory lambda:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};

async function savePatientMemory(cpf: string, data: PatientMemory['data']) {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      cpf,
      data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  };

  await dynamoDb.put(params).promise();
}

async function getPatientMemory(cpf: string): Promise<PatientMemory | null> {
  const params = {
    TableName: TABLE_NAME,
    Key: { cpf }
  };

  const result = await dynamoDb.get(params).promise();
  return (result.Item as PatientMemory) || null;
}

async function deletePatientMemory(cpf: string) {
  const params = {
    TableName: TABLE_NAME,
    Key: { cpf }
  };

  await dynamoDb.delete(params).promise();
}
