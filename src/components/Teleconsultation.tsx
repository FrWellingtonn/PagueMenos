import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import {
  Video,
  Clock,
  Calendar,
  User,
  Plus,
  Search,
} from 'lucide-react';
import { mockPatients, mockTeleconsultations } from '../data/mockData';
import { TeleconsultationDialog } from './TeleconsultationDialog';
import { ActiveCallDialog } from './ActiveCallDialog';

interface TeleconsultationProps {
  onPatientSelect: (patientId: string) => void;
}

export function Teleconsultation({ onPatientSelect }: TeleconsultationProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewConsultationOpen, setIsNewConsultationOpen] = useState(false);
  const [activeCall, setActiveCall] = useState<string | null>(null);

  const filteredConsultations = mockTeleconsultations.filter(consultation => {
    const patient = mockPatients.find(p => p.id === consultation.patientId);
    return patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const scheduledConsultations = filteredConsultations.filter(c => c.status === 'scheduled');
  const completedConsultations = filteredConsultations.filter(c => c.status === 'completed');

  const handleStartCall = (consultationId: string) => {
    setActiveCall(consultationId);
  };

  const currentConsultation = mockTeleconsultations.find(c => c.id === activeCall);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 font-semibold">Teleconsulta médica</h1>
          <p className="text-sm text-gray-600">Atendimentos à distância com prescrição eletrônica</p>
        </div>

        <Button
          className="bg-blue-600 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-blue-700"
          onClick={() => setIsNewConsultationOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Agendar teleconsulta
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[{
          title: 'Agendadas hoje',
          value: scheduledConsultations.filter(c => c.date === '2025-10-18').length,
          icon: <Calendar className="h-6 w-6 text-blue-600" />,
          accent: 'bg-blue-50',
        }, {
          title: 'Total agendadas',
          value: scheduledConsultations.length,
          icon: <Clock className="h-6 w-6 text-blue-600" />,
          accent: 'bg-blue-50',
        }, {
          title: 'Realizadas',
          value: completedConsultations.length,
          icon: <Video className="h-6 w-6 text-purple-600" />,
          accent: 'bg-purple-50',
        }, {
          title: 'Prescrições emitidas',
          value: completedConsultations.filter(c => c.prescription).length,
          icon: <User className="h-6 w-6 text-orange-600" />,
          accent: 'bg-orange-50',
        }].map((metric, index) => (
          <Card
            key={metric.title}
            className="animate-scale-in p-6"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">{metric.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{metric.value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${metric.accent}`}>
                {metric.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="animate-scale-in p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Buscar por paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Consultas agendadas</h2>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {scheduledConsultations.map((consultation, index) => {
              const patient = mockPatients.find(p => p.id === consultation.patientId);

              return (
                <Card
                  key={consultation.id}
                  className="animate-fade-in-up space-y-4 p-6"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                        <span>{patient?.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient?.name}</h3>
                        <div className="mt-1 flex items-center gap-3 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {consultation.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {consultation.time}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-blue-50 text-blue-700">Agendada</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>Dr. {consultation.doctorName} — CRM {consultation.doctorCRM}</span>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleStartCall(consultation.id)}
                    >
                      <Video className="mr-2 h-4 w-4" />
                      Iniciar consulta
                    </Button>
                    <Button variant="outline" onClick={() => onPatientSelect(consultation.patientId)}>
                      Ver prontuário
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Consultas realizadas</h2>
          <div className="space-y-4">
            {completedConsultations.map((consultation, index) => {
              const patient = mockPatients.find(p => p.id === consultation.patientId);

              return (
                <Card
                  key={consultation.id}
                  className="animate-fade-in-up p-6"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-1 items-start gap-4">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                        <span>{patient?.name.charAt(0)}</span>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-semibold text-gray-900">{patient?.name}</h3>
                          <Badge variant="outline" className="border-blue-200 text-blue-700">
                            Concluída
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{consultation.reason}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {consultation.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {consultation.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            Dr. {consultation.doctorName}
                          </span>
                        </div>

                        {consultation.diagnosis && (
                          <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-900">
                            <span className="font-medium">Diagnóstico: </span>
                            {consultation.diagnosis}
                          </div>
                        )}

                        {consultation.prescription && (
                          <div className="rounded-lg bg-blue-50 p-3">
                            <p className="mb-2 text-sm font-medium text-blue-900">Prescrição médica emitida:</p>
                            <ul className="space-y-1 text-sm text-blue-800">
                              {consultation.prescription.map((med, itemIndex) => (
                                <li key={itemIndex}>• {med}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button variant="outline" onClick={() => onPatientSelect(consultation.patientId)}>
                      Ver prontuário
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      <TeleconsultationDialog
        isOpen={isNewConsultationOpen}
        onClose={() => setIsNewConsultationOpen(false)}
      />

      {activeCall && currentConsultation && (
        <ActiveCallDialog
          consultation={currentConsultation}
          onClose={() => setActiveCall(null)}
        />
      )}
    </div>
  );
}
