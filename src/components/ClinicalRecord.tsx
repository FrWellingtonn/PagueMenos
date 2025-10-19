import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  User, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Calendar,
  Plus,
  Bot
} from 'lucide-react';
import { mockPatients, mockAppointments, mockMedications } from '../data/mockData';
import { NewAppointmentDialog } from './NewAppointmentDialog';
import { AIChat } from './AIChat';

interface ClinicalRecordProps {
  selectedPatientId: string | null;
}

export function ClinicalRecord({ selectedPatientId }: ClinicalRecordProps) {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  
  const patient = selectedPatientId 
    ? mockPatients.find(p => p.id === selectedPatientId)
    : mockPatients[0];

  if (!patient) {
    return (
      <div className="p-8">
        <Card className="p-8 text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">Nenhum paciente selecionado</h2>
          <p className="text-gray-600">Selecione um paciente para visualizar o prontuário</p>
        </Card>
      </div>
    );
  }

  const patientAppointments = mockAppointments.filter(apt => apt.patientId === patient.id);
  const patientMedications = mockMedications.filter(med => med.patientId === patient.id);

  return (
    <div className="h-screen overflow-auto p-8">
      <div className="flex gap-6">
        <div className={showAIChat ? 'flex-1' : 'w-full'}>
          {/* Patient Header */}
          <Card className="p-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-700 text-2xl">{patient.name.charAt(0)}</span>
                </div>
                
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{patient.name}</h1>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Idade</p>
                      <p className="text-gray-900">{patient.age} anos</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Sexo</p>
                      <p className="text-gray-900">{patient.gender}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">CPF</p>
                      <p className="text-gray-900">{patient.cpf}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Telefone</p>
                      <p className="text-gray-900">{patient.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setShowAIChat(!showAIChat)}
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Modo IA
                </Button>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setIsNewAppointmentOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Atendimento
                </Button>
              </div>
            </div>

            {/* Alerts */}
            {patient.allergies.length > 0 && (
              <Alert className="mt-4 border-red-200 bg-red-50">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-900">
                  <span>Alergias: </span>
                  {patient.allergies.join(', ')}
                </AlertDescription>
              </Alert>
            )}
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">
                <Activity className="w-4 h-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="medications">
                <Pill className="w-4 h-4 mr-2" />
                Medicamentos
              </TabsTrigger>
              <TabsTrigger value="history">
                <Calendar className="w-4 h-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Condições de Saúde</h3>
                  <div className="space-y-2">
                    {patient.conditions.map((condition, index) => (
                      <Badge key={index} variant="outline" className="mr-2">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Medicamentos Atuais</h3>
                  <div className="space-y-3">
                    {patientMedications.filter(med => med.status === 'active').slice(0, 3).map((medication) => (
                      <div key={medication.id} className="p-3 bg-gray-50 rounded">
                        <p className="font-medium">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage} - {medication.frequency}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Todos os Medicamentos</h3>
                <div className="space-y-4">
                  {patientMedications.map((medication) => (
                    <div key={medication.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{medication.name}</h4>
                        <Badge variant={medication.status === 'active' ? 'default' : 'secondary'}>
                          {medication.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{medication.dosage} - {medication.frequency}</p>
                      <p className="text-xs text-gray-500">Prescrito por: {medication.prescribedBy}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Histórico de Atendimentos</h3>
                <div className="space-y-4">
                  {patientAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{appointment.type}</h4>
                        <span className="text-sm text-gray-500">{appointment.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{appointment.notes}</p>
                      <p className="text-xs text-gray-500">Farmacêutico: {appointment.pharmacist}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {showAIChat && (
          <div className="w-96 h-[calc(100vh-8rem)]">
            <AIChat 
              patientCpf={patient.cpf}
              onClose={() => setShowAIChat(false)}
            />
          </div>
        )}
      </div>

      <NewAppointmentDialog 
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        patient={patient}
      />
    </div>
  );
}