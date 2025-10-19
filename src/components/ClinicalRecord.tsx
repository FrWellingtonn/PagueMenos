import { useState } from 'react';
import { Card } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { 
  User, 
  FileText, 
  Pill, 
  Activity, 
  AlertTriangle, 
  Calendar,
  Plus,
  Thermometer,
  Heart,
  Weight,
  Edit2,
  Check,
  X as XIcon
} from 'lucide-react';
import { mockPatients, mockAppointments, mockMedications } from '../data/mockData';
import { NewAppointmentDialog } from './NewAppointmentDialog';

interface ClinicalRecordProps {
  selectedPatientId: string | null;
}

export function ClinicalRecord({ selectedPatientId }: ClinicalRecordProps) {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isEditingVitals, setIsEditingVitals] = useState(false);
  const [isEditingConditions, setIsEditingConditions] = useState(false);
  const [newCondition, setNewCondition] = useState('');
  
  // Vital Signs State
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: '120/80',
    heartRate: '72',
    temperature: '36.5',
    weight: '75'
  });
  
  const [editedVitals, setEditedVitals] = useState(vitalSigns);
  
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
    <div className="p-8">
      {/* Patient Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-700 text-2xl">{patient.name.charAt(0)}</span>
            </div>
            
            <div>
              <h1 className="text-gray-900 mb-2">{patient.name}</h1>
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

          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => setIsNewAppointmentOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Atendimento
          </Button>
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
        <TabsList>
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
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vital Signs */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <Thermometer className="w-5 h-5 text-blue-600" />
                  Sinais Vitais
                </h3>
                {!isEditingVitals ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setIsEditingVitals(true);
                      setEditedVitals(vitalSigns);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setVitalSigns(editedVitals);
                        setIsEditingVitals(false);
                      }}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setIsEditingVitals(false);
                        setEditedVitals(vitalSigns);
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XIcon className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Pressão Arterial</span>
                  {isEditingVitals ? (
                    <Input 
                      value={editedVitals.bloodPressure}
                      onChange={(e) => setEditedVitals({...editedVitals, bloodPressure: e.target.value})}
                      className="w-28 h-8 text-right"
                      placeholder="120/80"
                    />
                  ) : (
                    <span className="text-gray-900">{vitalSigns.bloodPressure} mmHg</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Frequência Cardíaca</span>
                  {isEditingVitals ? (
                    <Input 
                      value={editedVitals.heartRate}
                      onChange={(e) => setEditedVitals({...editedVitals, heartRate: e.target.value})}
                      className="w-28 h-8 text-right"
                      placeholder="72"
                    />
                  ) : (
                    <span className="text-gray-900">{vitalSigns.heartRate} bpm</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Temperatura</span>
                  {isEditingVitals ? (
                    <Input 
                      value={editedVitals.temperature}
                      onChange={(e) => setEditedVitals({...editedVitals, temperature: e.target.value})}
                      className="w-28 h-8 text-right"
                      placeholder="36.5"
                    />
                  ) : (
                    <span className="text-gray-900">{vitalSigns.temperature}°C</span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Peso</span>
                  {isEditingVitals ? (
                    <Input 
                      value={editedVitals.weight}
                      onChange={(e) => setEditedVitals({...editedVitals, weight: e.target.value})}
                      className="w-28 h-8 text-right"
                      placeholder="75"
                    />
                  ) : (
                    <span className="text-gray-900">{vitalSigns.weight} kg</span>
                  )}
                </div>
              </div>
            </Card>

            {/* Conditions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  Condições de Saúde
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsEditingConditions(!isEditingConditions)}
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {patient.conditions.map((condition, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <Badge variant="outline" className="flex-1 justify-start">
                      {condition}
                    </Badge>
                    {isEditingConditions && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="ml-2 h-6 w-6 p-0 text-red-600 hover:text-red-700"
                      >
                        <XIcon className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                ))}
                {isEditingConditions && (
                  <div className="flex gap-2 mt-3">
                    <Input 
                      placeholder="Nova condição"
                      value={newCondition}
                      onChange={(e) => setNewCondition(e.target.value)}
                      className="h-8"
                    />
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 h-8"
                      onClick={() => {
                        if (newCondition.trim()) {
                          setNewCondition('');
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Current Medications */}
            <Card className="p-6">
              <h3 className="text-gray-900 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-blue-600" />
                Medicamentos Atuais
              </h3>
              <div className="space-y-3">
                {patientMedications.filter(med => med.status === 'active').slice(0, 4).map((medication) => (
                  <div key={medication.id} className="text-sm p-2 bg-gray-50 rounded">
                    <p className="text-gray-900">{medication.name}</p>
                    <p className="text-gray-500 text-xs">{medication.dosage}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-3">
                Para editar medicamentos, acesse a aba "Medicamentos"
              </p>
            </Card>
          </div>

          {/* Recent Appointments */}
          <Card className="p-6">
            <h3 className="text-gray-900 mb-4">Últimos Atendimentos</h3>
            <div className="space-y-4">
              {patientAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-gray-900">{appointment.type}</p>
                      <p className="text-gray-500 text-sm">{appointment.date} às {appointment.time}</p>
                    </div>
                    <Badge variant={appointment.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {appointment.priority === 'urgent' ? 'Urgente' : 'Normal'}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-sm">{appointment.notes}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications">
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Prescrições Médicas</h3>
                <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                  Apenas Médicos
                </Badge>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Medicamentos prescritos por médicos em consultas e teleconsultas
              </p>

              <div className="space-y-4">
                {patientMedications.filter(m => m.prescriptionType === 'medical').map((medication) => (
                  <div key={medication.id} className="p-4 border-2 border-blue-200 bg-blue-50/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-gray-900">{medication.name}</h4>
                          <Badge className="bg-blue-600 text-white hover:bg-blue-700 text-xs">
                            Prescrição Médica
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm">{medication.dosage}</p>
                      </div>
                      <Badge variant={medication.status === 'active' ? 'default' : 'outline'}>
                        {medication.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                        <p className="text-gray-500">Prescritor</p>
                        <p className="text-gray-900">{medication.prescribedBy}</p>
                      </div>
                    </div>

                    {medication.interactions && (
                      <Alert className="mt-3 border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-900">
                          {medication.interactions}
                        </AlertDescription>
                      </Alert>
                    )}

                    {medication.notes && (
                      <div className="mt-3 p-3 bg-white rounded">
                        <p className="text-sm text-gray-700">{medication.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Orientações Farmacêuticas</h3>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Orientação
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Suplementos e orientações de cuidado farmacêutico (sem prescrição)
              </p>

              {patientMedications.filter(m => m.prescriptionType === 'pharmacy').length > 0 ? (
                <div className="space-y-4">
                  {patientMedications.filter(m => m.prescriptionType === 'pharmacy').map((medication) => (
                    <div key={medication.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-gray-900">{medication.name}</h4>
                          <p className="text-gray-600 text-sm">{medication.dosage}</p>
                        </div>
                        <Badge variant={medication.status === 'active' ? 'default' : 'outline'}>
                          {medication.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">Frequência</p>
                          <p className="text-gray-900">{medication.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Início</p>
                          <p className="text-gray-900">{medication.startDate}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Orientado por</p>
                          <p className="text-gray-900">{medication.prescribedBy}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma orientação farmacêutica registrada</p>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history">
          <Card className="p-6">
            <h3 className="text-gray-900 mb-6">Histórico Completo de Atendimentos</h3>
            <div className="space-y-4">
              {patientAppointments.map((appointment) => (
                <div key={appointment.id} className="p-5 border border-gray-200 rounded-lg hover:border-blue-200 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-gray-900">{appointment.type}</h4>
                      <p className="text-gray-500 text-sm">{appointment.date} às {appointment.time}</p>
                    </div>
                    <Badge variant={appointment.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {appointment.priority === 'urgent' ? 'Urgente' : 'Normal'}
                    </Badge>
                  </div>
                  <p className="text-gray-700 mb-3">{appointment.notes}</p>
                  <div className="text-sm text-gray-500">
                    Farmacêutico: {appointment.pharmacist}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <NewAppointmentDialog 
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        patient={patient}
      />
    </div>
  );
}
