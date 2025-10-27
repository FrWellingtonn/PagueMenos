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
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="space-y-2">
        <h1 className="text-gray-900 font-semibold">Controle de Medicamentos</h1>
        <p className="text-sm text-gray-600">Gestão de prescrições e alertas de interações</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="animate-scale-in p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medicamentos ativos</p>
              <h3 className="text-2xl font-semibold text-gray-900">{activeMedications.length}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="animate-scale-in p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Com interações</p>
              <h3 className="text-2xl font-semibold text-gray-900">{withInteractions.length}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="animate-scale-in p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de prescrições</p>
              <h3 className="text-2xl font-semibold text-gray-900">{mockMedications.length}</h3>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="animate-scale-in p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Buscar por medicamento ou paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="space-y-4">
        {filteredMedications.map((medication, index) => {
          const patient = mockPatients.find(p => p.id === medication.patientId);
          const isMedicalPrescription = medication.prescriptionType === 'medical';

          return (
            <Card
              key={medication.id}
              className={`animate-fade-in-up p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${isMedicalPrescription ? 'border-2 border-blue-200 bg-blue-50/30' : ''}`}
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <h3 className="text-gray-900 font-medium">{medication.name}</h3>
                    {isMedicalPrescription && (
                      <Badge className="bg-blue-600 text-white hover:bg-blue-700">
                        Prescrição médica
                      </Badge>
                    )}
                    <Badge variant={medication.status === 'active' ? 'default' : 'outline'}>
                      {medication.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="mb-1 text-sm text-gray-600">{medication.dosage}</p>
                  <p className="text-sm text-gray-500">Paciente: {patient?.name}</p>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Frequência</p>
                  <p className="text-gray-900">{medication.frequency}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Início</p>
                  <p className="text-gray-900">{medication.startDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">Duração</p>
                  <p className="text-gray-900">{medication.duration}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">{isMedicalPrescription ? 'Médico prescritor' : 'Orientado por'}</p>
                  <p className="text-gray-900">{medication.prescribedBy}</p>
                </div>
              </div>

              {isMedicalPrescription && (
                <div className="mb-3 rounded-lg bg-blue-100 p-3">
                  <p className="text-sm text-blue-900">
                    <span className="font-semibold">⚕ Medicamento prescrito por médico:</span> apenas o médico prescritor pode alterar ou suspender esta prescrição.
                  </p>
                </div>
              )}

              {medication.interactions && (
                <Alert className="mb-3 border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-sm text-orange-900">
                    <span className="font-medium">Alerta de interação: </span>
                    {medication.interactions}
                  </AlertDescription>
                </Alert>
              )}

              {medication.notes && (
                <div className="rounded-lg bg-yellow-50 p-3">
                  <p className="text-sm text-yellow-900">
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
