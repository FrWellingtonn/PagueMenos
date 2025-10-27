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
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-gray-900">
          <span className="font-semibold">Health Sharp</span> Dashboard
        </h1>
        <p className="text-gray-600">Visão geral dos atendimentos e métricas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${index * 0.06}s` }}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`${stat.bgColor} ${stat.color} rounded-lg p-3 transition group-hover:scale-105`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </Card>
          );
        })}
      </div>

      {/* Próximos Atendimentos */}
      <Card className="animate-fade-in-up space-y-4 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm">
        <h2 className="mb-4 text-gray-900">Próximos Atendimentos</h2>
        <div className="space-y-4">
          {todayAppointments.slice(0, 5).map((appointment, index) => {
            const patient = mockPatients.find(p => p.id === appointment.patientId);
            return (
              <div
                key={appointment.id}
                className="animate-fade-in-up flex cursor-pointer items-center justify-between rounded-xl bg-gray-50 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-50/60 hover:shadow-md"
                style={{ animationDelay: `${index * 0.04 + 0.1}s` }}
                onClick={() => patient && onPatientSelect(patient.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <span>{patient?.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium">{patient?.name}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-medium">{appointment.time}</p>
                  {appointment.priority === 'urgent' && (
                    <span className="text-xs font-semibold text-red-600">Urgente</span>
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
