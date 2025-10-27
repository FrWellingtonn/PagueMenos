import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Calendar, Search, Filter, Bot } from 'lucide-react';
import { mockAppointments, mockPatients } from '../data/mockData';
import { AIChat } from './AIChat';

export function AppointmentHistory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAIChat, setShowAIChat] = useState(false);

  const filteredAppointments = mockAppointments.filter(appointment => {
    const patient = mockPatients.find(p => p.id === appointment.patientId);
    return patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           appointment.type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 lg:flex-row">
      <div className={`flex-1 space-y-6 ${showAIChat ? 'lg:pr-6' : ''}`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-gray-900 font-semibold">Histórico de Atendimentos</h1>
            <p className="text-sm text-gray-600">Visualize todos os atendimentos realizados</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowAIChat(!showAIChat)}
            className="transition-transform duration-200 hover:-translate-y-0.5"
          >
            <Bot className="mr-2 h-4 w-4" />
            Nenna
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="animate-scale-in p-4 md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Buscar por paciente ou tipo de atendimento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </Card>

          <Card className="animate-scale-in p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <Input type="date" defaultValue="2025-10-18" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {filteredAppointments.map((appointment, index) => {
            const patient = mockPatients.find(p => p.id === appointment.patientId);

            return (
              <Card
                key={appointment.id}
                className="animate-fade-in-up p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      <span>{patient?.name.charAt(0)}</span>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900">{patient?.name}</h3>
                      <p className="mb-2 text-sm text-gray-600">{appointment.type}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>{appointment.date} às {appointment.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <Badge variant={appointment.priority === 'urgent' ? 'destructive' : 'outline'}>
                      {appointment.priority === 'urgent' ? 'Urgente' : 'Normal'}
                    </Badge>
                    <span className="text-sm text-gray-500">{appointment.pharmacist}</span>
                  </div>
                </div>

                <div className="pl-16">
                  <p className="text-gray-700">{appointment.notes}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {showAIChat && (
        <div className="animate-scale-in w-full max-w-full rounded-2xl border border-gray-100 bg-white/90 p-4 shadow-sm backdrop-blur-sm lg:w-80 xl:w-96">
          <AIChat onClose={() => setShowAIChat(false)} />
        </div>
      )}
    </div>
  );
}
