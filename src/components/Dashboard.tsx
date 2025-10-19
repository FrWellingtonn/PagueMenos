import { Card } from './ui/card';
import { Users, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { mockPatients, mockAppointments } from '../data/mockData';

interface DashboardProps {
  onPatientSelect: (patientId: string) => void;
}

export function Dashboard({ onPatientSelect }: DashboardProps) {
  const todayAppointments = mockAppointments.filter(apt => apt.date === '2025-10-18');
  const urgentCases = mockAppointments.filter(apt => apt.priority === 'urgent');

  const stats = [
    { 
      label: 'Total de Pacientes', 
      value: mockPatients.length.toString(), 
      icon: Users, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    },
    { 
      label: 'Atendimentos Hoje', 
      value: todayAppointments.length.toString(), 
      icon: Calendar, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50' 
    },
    { 
      label: 'Casos Urgentes', 
      value: urgentCases.length.toString(), 
      icon: AlertTriangle, 
      color: 'text-red-600', 
      bgColor: 'bg-red-50' 
    },
    { 
      label: 'Taxa de Adesão', 
      value: '87%', 
      icon: TrendingUp, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50' 
    },
  ];

  return (
    <div className="h-screen overflow-auto p-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Health Sharp Dashboard</h1>
        <p className="text-gray-600">Visão geral dos atendimentos e métricas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-gray-900">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Próximos Atendimentos */}
      <Card className="p-6">
        <h2 className="text-gray-900 mb-4">Próximos Atendimentos</h2>
        <div className="space-y-4">
          {todayAppointments.slice(0, 5).map((appointment) => {
            const patient = mockPatients.find(p => p.id === appointment.patientId);
            return (
              <div 
                key={appointment.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => patient && onPatientSelect(patient.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-700">{patient?.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-900">{patient?.name}</p>
                    <p className="text-gray-500 text-sm">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900">{appointment.time}</p>
                  {appointment.priority === 'urgent' && (
                    <span className="text-red-600 text-xs">Urgente</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
