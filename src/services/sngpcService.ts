import Papa from 'papaparse';

interface SNGPCData {
  // Add the actual CSV fields here once we know the structure
  // This is a placeholder interface that should be updated with actual CSV fields
  [key: string]: string | number;
}

let sngpcData: SNGPCData[] = [];

// Function to load SNGPC data
const loadSNGPCData = async (): Promise<SNGPCData[]> => {
  if (sngpcData.length > 0) {
    return sngpcData;
  }

  try {
    // Load the most recent SNGPC file (assuming higher numbers are more recent)
    const files = [
      'SNGPC/EDA_Manipulados_202510.csv',
      'SNGPC/EDA_Manipulados_202509.csv',
      'SNGPC/EDA_Manipulados_202508.csv',
      'SNGPC/EDA_Manipulados_202507.csv',
      'SNGPC/EDA_Manipulados_202506.csv',
      'SNGPC/EDA_Manipulados_202505.csv',
      'SNGPC/EDA_Manipulados_202504.csv',
      'SNGPC/EDA_Manipulados_202503.csv',
      'SNGPC/EDA_Manipulados_202502.csv',
      'SNGPC/EDA_Manipulados_202501.csv',
    ];

    for (const file of files) {
      try {
        const response = await fetch(file);
        if (!response.ok) continue;
        
        const csvText = await response.text();
        const result = Papa.parse<SNGPCData>(csvText, {
          header: true,
          skipEmptyLines: true,
        });
        
        if (result.data.length > 0) {
          sngpcData = result.data;
          console.log(`Loaded ${sngpcData.length} records from ${file}`);
          return sngpcData;
        }
      } catch (error) {
        console.error(`Error loading SNGPC data from ${file}:`, error);
        continue;
      }
    }
    
    throw new Error('No valid SNGPC data files found');
  } catch (error) {
    console.error('Failed to load SNGPC data:', error);
    return [];
  }
};

// Function to search for medication information
export const searchMedication = async (searchTerm: string): Promise<SNGPCData[]> => {
  try {
    const data = await loadSNGPCData();
    if (!searchTerm.trim()) return [];
    
    const searchLower = searchTerm.toLowerCase();
    return data.filter(item => 
      Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchLower)
      )
    ).slice(0, 10); // Limit to 10 results for performance
  } catch (error) {
    console.error('Error searching SNGPC data:', error);
    return [];
  }
};

// Function to get medication details by ID
export const getMedicationDetails = async (id: string): Promise<SNGPCData | null> => {
  try {
    const data = await loadSNGPCData();
    return data.find(item => item.id === id) || null;
  } catch (error) {
    console.error('Error getting medication details:', error);
    return null;
  }
};
