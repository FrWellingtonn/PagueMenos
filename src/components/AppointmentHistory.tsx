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
    <div className={`h-screen overflow-auto p-8 ${showAIChat ? 'pr-4' : ''}`}>
      <div className="flex gap-6">
        <div className={showAIChat ? 'flex-1' : 'w-full'}>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-gray-900 mb-2">Histórico de Atendimentos</h1>
              <p className="text-gray-600">Visualize todos os atendimentos realizados</p>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowAIChat(!showAIChat)}
            >
              <Bot className="w-4 h-4 mr-2" />
              Modo IA
            </Button>
          </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar por paciente ou tipo de atendimento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <Input type="date" defaultValue="2025-10-18" />
          </div>
        </Card>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.map((appointment) => {
          const patient = mockPatients.find(p => p.id === appointment.patientId);
          
          return (
            <Card key={appointment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700">{patient?.name.charAt(0)}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-gray-900 mb-1">{patient?.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{appointment.type}</p>
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar className="w-4 h-4" />
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
          <div className="w-96 h-[calc(100vh-8rem)]">
            <AIChat onClose={() => setShowAIChat(false)} />
          </div>
        )}
      </div>
    </div>
  );
}
