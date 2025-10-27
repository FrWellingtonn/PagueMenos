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
  Bot,
  Clock,
  ClipboardList,
  TestTube2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { mockPatients, mockAppointments, mockMedications, mockExams } from '../data/mockData';
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
  const patientExams = mockExams.filter(exam => exam.patientId === patient.id);

  const toDate = (date: string, time?: string) => {
    const normalizedTime = time ? `${time}${time.length === 5 ? ':00' : ''}` : '00:00:00';
    return new Date(`${date}T${normalizedTime}`);
  };

  const formatDateTime = (date: string, time?: string) => {
    const dateObj = toDate(date, time);
    if (Number.isNaN(dateObj.getTime())) {
      return `${date}${time ? ` ${time}` : ''}`;
    }

    const formatterOptions = time
      ? { dateStyle: 'short', timeStyle: 'short' } as const
      : { dateStyle: 'short' } as const;

    return new Intl.DateTimeFormat('pt-BR', formatterOptions).format(dateObj);
  };

  const now = new Date();
  const sortedAppointments = [...patientAppointments].sort(
    (a, b) => toDate(a.date, a.time).getTime() - toDate(b.date, b.time).getTime()
  );
  const upcomingAppointments = sortedAppointments.filter(
    appointment => toDate(appointment.date, appointment.time) >= now
  );
  const nextAppointment = upcomingAppointments[0];
  const recentAppointments = [...sortedAppointments].reverse().slice(0, 3);

  const activeMedications = patientMedications.filter(med => med.status === 'active');
  const pendingExams = patientExams.filter(exam => exam.status !== 'completed');
  const recentExams = [...patientExams]
    .sort((a, b) => toDate(b.date).getTime() - toDate(a.date).getTime())
    .slice(0, 3);

  const overviewMetrics = [
    {
      label: 'Consultas registradas',
      value: patientAppointments.length,
      icon: ClipboardList
    },
    {
      label: 'Medicamentos ativos',
      value: activeMedications.length,
      icon: Pill
    },
    {
      label: 'Condições acompanhadas',
      value: patient.conditions.length,
      icon: Activity
    },
    {
      label: 'Exames pendentes',
      value: pendingExams.length,
      icon: TestTube2
    }
  ];

  return (
    <div className={`relative flex flex-col lg:flex-row transition-apple ${showAIChat ? 'lg:mr-[420px]' : ''}`}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Sticky Header with Glassmorphism */}
        <section className="px-4 lg:px-6 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">Prontuário clínico</h1>
              <p className="text-sm text-gray-600">Resumo integrado das informações do paciente</p>
            </div>
            <Button 
              variant="outline"
              size="sm"
              onClick={() => setShowAIChat(!showAIChat)}
              className="lg:hidden rounded-apple-sm" aria-label="Abrir assistente de IA"
            >
              <Bot className="w-4 h-4" />
            </Button>
          </div>
        </section>

        {/* Scrollable Content */}
        <main className="p-4 lg:p-6">
          <Card className="mb-6 p-4 lg:p-6 rounded-apple-lg glass-card animate-fade-in">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-700 text-xl lg:text-2xl">{patient.name.charAt(0)}</span>
                </div>
                
                <div className="min-w-0">
                  <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2 tracking-tight">{patient.name}</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 text-sm">
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

              <div className="flex gap-2 flex-shrink-0">
                <Button 
                  variant="outline"
                  onClick={() => setShowAIChat(!showAIChat)}
                  className="hidden lg:flex rounded-apple-sm btn-apple btn-secondary-apple"
                >
                  <Bot className="w-4 h-4 mr-2" />
                  Nenna
                </Button>
                <Button 
                  className="btn-apple btn-primary-apple"
                  onClick={() => setIsNewAppointmentOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Novo Atendimento</span>
                  <span className="sm:hidden">Novo</span>
                </Button>
              </div>
            </div>

            {/* Alerts */}
            {patient.allergies.length > 0 && (
              <Alert className="mt-4 border-red-200/70 bg-red-50/80 rounded-apple-sm">
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
            <TabsList className="grid w-full grid-cols-3 rounded-apple-sm">
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
            <TabsContent value="overview" className="animate-fade-in">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {overviewMetrics.map(metric => (
                    <Card key={metric.label} className="p-4 flex items-center gap-3 rounded-apple-sm glass-card hover-lift">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <metric.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{metric.label}</p>
                        <p className="text-xl font-semibold text-gray-900">{metric.value}</p>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 rounded-apple-sm glass-card">
                    <h3 className="text-lg font-semibold mb-4">Dados de contato</h3>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-blue-600" />
                        <span>{patient.email}</span>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin className="w-4 h-4 text-blue-600 mt-1" />
                        <span>{patient.address}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 rounded-apple-sm glass-card">
                    <h3 className="text-lg font-semibold mb-4">Próximo atendimento</h3>
                    {nextAppointment ? (
                      <div className="space-y-2 text-sm text-gray-700">
                        <div className="flex items-center gap-2 text-blue-600 font-medium">
                          <Clock className="w-4 h-4" />
                          <span>{formatDateTime(nextAppointment.date, nextAppointment.time)}</span>
                        </div>
                        <p className="font-semibold text-gray-900">{nextAppointment.type}</p>
                        <p>{nextAppointment.notes}</p>
                        <p className="text-xs text-gray-500">
                          Responsável: {nextAppointment.pharmacist} - {nextAppointment.priority === 'urgent' ? 'Prioridade urgente' : 'Atendimento normal'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Não há atendimentos futuros agendados.</p>
                    )}
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 rounded-apple-sm glass-card">
                    <h3 className="text-lg font-semibold mb-4">Condições de saúde</h3>
                    <div className="flex flex-wrap gap-2">
                      {patient.conditions.map((condition, index) => (
                        <Badge key={index} variant="outline" className="rounded-full">
                          {condition}
                        </Badge>
                      ))}
                      {patient.conditions.length === 0 && (
                        <p className="text-sm text-gray-600">Nenhuma condição cadastrada.</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 rounded-apple-sm glass-card">
                    <h3 className="text-lg font-semibold mb-4">Medicamentos ativos</h3>
                    <div className="space-y-3">
                      {activeMedications.slice(0, 4).map(medication => (
                        <div key={medication.id} className="p-3 bg-gray-50 rounded-apple-sm border border-gray-100">
                          <p className="font-medium text-gray-900">{medication.name}</p>
                          <p className="text-sm text-gray-600">
                            {medication.dosage} - {medication.frequency}
                          </p>
                          <p className="text-xs text-gray-500">Prescrito por {medication.prescribedBy}</p>
                        </div>
                      ))}
                      {activeMedications.length === 0 && (
                        <p className="text-sm text-gray-600">Nenhum medicamento ativo registrado.</p>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 rounded-apple-sm glass-card">
                    <h3 className="text-lg font-semibold mb-4">Exames recentes</h3>
                    <div className="space-y-3">
                      {recentExams.map(exam => (
                        <div key={exam.id} className="p-3 border rounded-apple-sm">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900">{exam.type}</p>
                            <Badge variant={exam.status === 'completed' ? 'default' : exam.status === 'pending' ? 'secondary' : 'outline'}>
                              {exam.status === 'completed' ? 'Concluído' : exam.status === 'pending' ? 'Pendente' : 'Alterado'}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(exam.date)} - {exam.result}
                          </p>
                          {exam.notes && <p className="text-xs text-gray-500 mt-1">{exam.notes}</p>}
                        </div>
                      ))}
                      {recentExams.length === 0 && (
                        <p className="text-sm text-gray-600">Nenhum exame registrado para este paciente.</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 rounded-apple-sm glass-card">
                    <h3 className="text-lg font-semibold mb-4">Atendimentos recentes</h3>
                    <div className="space-y-3">
                      {recentAppointments.map(appointment => (
                        <div key={appointment.id} className="p-3 border rounded-apple-sm">
                          <div className="flex justify-between items-center">
                            <p className="font-medium text-gray-900">{appointment.type}</p>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(appointment.date, appointment.time)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{appointment.notes}</p>
                          <p className="text-xs text-gray-500 mt-1">Farmacêutico: {appointment.pharmacist}</p>
                        </div>
                      ))}
                      {recentAppointments.length === 0 && (
                        <p className="text-sm text-gray-600">Nenhum atendimento registrado até o momento.</p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Medications Tab */}
            <TabsContent value="medications" className="animate-fade-in">
              <Card className="p-6 rounded-apple-sm glass-card">
                <h3 className="text-lg font-semibold mb-4">Todos os Medicamentos</h3>
                <div className="space-y-4">
                  {patientMedications.map((medication) => (
                    <div key={medication.id} className="p-4 border rounded-apple-sm">
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
            <TabsContent value="history" className="animate-fade-in">
              <Card className="p-6 rounded-apple-sm glass-card">
                <h3 className="text-lg font-semibold mb-4">Histórico de Atendimentos</h3>
                <div className="space-y-4">
                  {patientAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-apple-sm">
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
        </main>
      </div>

      {/* AI Chat Sidebar */}
      {showAIChat && (
        <>
          {/* Backdrop for tablet/mobile */}
          <div
            className="chat-backdrop glass lg:hidden"
            onClick={() => setShowAIChat(false)}
            aria-hidden="true"
          />
          <aside
            className="fixed inset-0 z-50 chat-aside fixed-lg border-t lg:border-t-0 lg:border-l border-gray-200 bg-white/80 dark:bg-[#1C1C1E]/70 glass-card flex flex-col rounded-tl-2xl lg:rounded-tl-none lg:rounded-l-2xl animate-fade-in"
            role="complementary"
            aria-label="Assistente de IA"
          >
            <AIChat
              patientCpf={patient.cpf}
              onClose={() => setShowAIChat(false)}
            />
          </aside>
        </>
      )}

      <NewAppointmentDialog
        isOpen={isNewAppointmentOpen}
        onClose={() => setIsNewAppointmentOpen(false)}
        patient={patient}
      />
    </div>
  );
}



