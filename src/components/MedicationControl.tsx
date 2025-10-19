import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { mockMedications, mockPatients } from '../data/mockData';

export function MedicationControl() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMedications = mockMedications.filter(medication => {
    const patient = mockPatients.find(p => p.id === medication.patientId);
    return medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const activeMedications = filteredMedications.filter(med => med.status === 'active');
  const withInteractions = filteredMedications.filter(med => med.interactions);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Controle de Medicamentos</h1>
        <p className="text-gray-600">Gestão de prescrições e alertas de interações</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Medicamentos Ativos</p>
              <h3 className="text-gray-900">{activeMedications.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Com Interações</p>
              <h3 className="text-gray-900">{withInteractions.length}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total de Prescrições</p>
              <h3 className="text-gray-900">{mockMedications.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por medicamento ou paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Medications List */}
      <div className="space-y-4">
        {filteredMedications.map((medication) => {
          const patient = mockPatients.find(p => p.id === medication.patientId);
          const isMedicalPrescription = medication.prescriptionType === 'medical';
          
          return (
            <Card 
              key={medication.id} 
              className={`p-6 ${isMedicalPrescription ? 'border-2 border-blue-200 bg-blue-50/30' : ''}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{medication.name}</h3>
                    {isMedicalPrescription && (
                      <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                        Prescrição Médica
                      </Badge>
                    )}
                    <Badge variant={medication.status === 'active' ? 'default' : 'outline'}>
                      {medication.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-1">{medication.dosage}</p>
                  <p className="text-gray-500 text-sm">Paciente: {patient?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500">Frequência</p>
                  <p className="text-gray-900">{medication.frequency}</p>
                </div>
                <div>
                  <p className="text-gray-500">Início</p>
                  <p className="text-gray-900">{medication.startDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duração</p>
                  <p className="text-gray-900">{medication.duration}</p>
                </div>
                <div>
                  <p className="text-gray-500">{isMedicalPrescription ? 'Médico Prescritor' : 'Orientado por'}</p>
                  <p className="text-gray-900">{medication.prescribedBy}</p>
                </div>
              </div>

              {isMedicalPrescription && (
                <div className="mb-3 p-3 bg-blue-100 rounded-lg">
                  <p className="text-blue-900 text-sm">
                    <span className="font-medium">⚕️ Medicamento prescrito por médico:</span> Apenas o médico prescritor pode alterar ou suspender esta prescrição.
                  </p>
                </div>
              )}

              {medication.interactions && (
                <Alert className="border-orange-200 bg-orange-50 mb-3">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-900">
                    <span className="font-medium">Alerta de Interação: </span>
                    {medication.interactions}
                  </AlertDescription>
                </Alert>
              )}

              {medication.notes && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-yellow-900 text-sm">
                    <span className="font-medium">Observações: </span>
                    {medication.notes}
                  </p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
