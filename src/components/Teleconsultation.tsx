import { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Clock,
  Calendar,
  User,
  Plus,
  Search
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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Teleconsulta Médica</h1>
          <p className="text-gray-600">Atendimentos médicos à distância com prescrição eletrônica</p>
        </div>
        
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setIsNewConsultationOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Agendar Teleconsulta
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Agendadas Hoje</p>
              <h3 className="text-gray-900">{scheduledConsultations.filter(c => c.date === '2025-10-18').length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Total Agendadas</p>
              <h3 className="text-gray-900">{scheduledConsultations.length}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Realizadas</p>
              <h3 className="text-gray-900">{completedConsultations.length}</h3>
            </div>
            <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
              <Video className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Prescrições Emitidas</p>
              <h3 className="text-gray-900">{completedConsultations.filter(c => c.prescription).length}</h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Scheduled Consultations */}
      <div className="mb-8">
        <h2 className="text-gray-900 mb-4">Consultas Agendadas</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {scheduledConsultations.map((consultation) => {
            const patient = mockPatients.find(p => p.id === consultation.patientId);
            
            return (
              <Card key={consultation.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700">{patient?.name.charAt(0)}</span>
                    </div>
                    
                    <div>
                      <h3 className="text-gray-900 mb-1">{patient?.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{consultation.reason}</p>
                      <div className="flex items-center gap-4 text-gray-500 text-sm">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{consultation.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{consultation.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Agendada
                  </Badge>
                </div>

                <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Dr. {consultation.doctorName} - CRM {consultation.doctorCRM}</span>
                </div>

                <div className="flex gap-2">
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleStartCall(consultation.id)}
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Iniciar Consulta
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onPatientSelect(consultation.patientId)}
                  >
                    Ver Prontuário
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Completed Consultations */}
      <div>
        <h2 className="text-gray-900 mb-8">Consultas Realizadas</h2>
        <div className="space-y-4">
          {completedConsultations.map((consultation) => {
            const patient = mockPatients.find(p => p.id === consultation.patientId);
            
            return (
              <Card key={consultation.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-700">{patient?.name.charAt(0)}</span>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-gray-900">{patient?.name}</h3>
                        <Badge variant="outline" className="text-blue-700 border-blue-200">
                          Concluída
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">{consultation.reason}</p>
                      
                      <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{consultation.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{consultation.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>Dr. {consultation.doctorName}</span>
                        </div>
                      </div>

                      {consultation.diagnosis && (
                        <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm">
                            <span className="text-blue-900">Diagnóstico: </span>
                            <span className="text-blue-800">{consultation.diagnosis}</span>
                          </p>
                        </div>
                      )}

                      {consultation.prescription && (
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-900 mb-2">Prescrição Médica Emitida:</p>
                          <ul className="space-y-1">
                            {consultation.prescription.map((med, index) => (
                              <li key={index} className="text-sm text-blue-800">
                                • {med}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    variant="outline"
                    onClick={() => onPatientSelect(consultation.patientId)}
                  >
                    Ver Prontuário
                  </Button>
                </div>
              </Card>
            );
          })}
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
