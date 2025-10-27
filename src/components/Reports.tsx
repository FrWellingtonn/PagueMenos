import { Card } from './ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, Calendar } from 'lucide-react';
import { Button } from './ui/button';

export function Reports() {
  const appointmentsByType = [
    { name: 'Consulta', value: 45 },
    { name: 'Revisão', value: 32 },
    { name: 'Vacinação', value: 28 },
    { name: 'Aferição PA', value: 67 },
    { name: 'Glicemia', value: 24 },
    { name: 'Orientação', value: 54 },
  ];

  const monthlyTrend = [
    { month: 'Abr', atendimentos: 120 },
    { month: 'Mai', atendimentos: 145 },
    { month: 'Jun', atendimentos: 168 },
    { month: 'Jul', atendimentos: 192 },
    { month: 'Ago', atendimentos: 215 },
    { month: 'Set', atendimentos: 234 },
    { month: 'Out', atendimentos: 250 },
  ];

  const adherenceData = [
    { name: 'Alta adesão', value: 65, color: '#2563eb' },
    { name: 'Média adesão', value: 25, color: '#eab308' },
    { name: 'Baixa adesão', value: 10, color: '#dc2626' },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 font-semibold">Relatórios e análises</h1>
          <p className="text-sm text-gray-600">Indicadores de desempenho do serviço clínico</p>
        </div>

        <Button className="bg-blue-600 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
          <Download className="mr-2 h-4 w-4" />
          Exportar relatórios
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          {
            title: 'Total de atendimentos',
            value: '1.184',
            subtitle: '+12% vs mês anterior',
            icon: <Calendar className="h-5 w-5 text-blue-600" />,
            accent: 'bg-blue-50',
          },
          {
            title: 'Pacientes ativos',
            value: '487',
            subtitle: '+8% vs mês anterior',
            icon: <Users className="h-5 w-5 text-blue-600" />,
            accent: 'bg-blue-50',
          },
          {
            title: 'Taxa de adesão',
            value: '87%',
            subtitle: '+3% vs mês anterior',
            icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
            accent: 'bg-purple-50',
          },
          {
            title: 'Média por dia',
            value: '42',
            subtitle: '+15% vs mês anterior',
            icon: <Calendar className="h-5 w-5 text-orange-600" />,
            accent: 'bg-orange-50',
          },
        ].map((card, index) => (
          <Card
            key={card.title}
            className="animate-scale-in p-6 shadow-sm"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.accent}`}>
                {card.icon}
              </div>
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900">{card.value}</h3>
            <p className="text-sm text-gray-600">{card.title}</p>
            <p className="mt-1 text-xs text-blue-600">{card.subtitle}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="animate-fade-in-up p-6" style={{ animationDelay: '0.05s' }}>
          <h3 className="mb-4 text-gray-900">Atendimentos por tipo</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentsByType}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#2563eb" name="Atendimentos" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="animate-fade-in-up p-6" style={{ animationDelay: '0.1s' }}>
          <h3 className="mb-4 text-gray-900">Tendência mensal</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="atendimentos" stroke="#2563eb" strokeWidth={2} name="Atendimentos" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="animate-fade-in-up p-6" style={{ animationDelay: '0.15s' }}>
          <h3 className="mb-4 text-gray-900">Taxa de adesão ao tratamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={adherenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={110}
                dataKey="value"
              >
                {adherenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="animate-fade-in-up space-y-4 p-6" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-gray-900">Principais indicadores</h3>
          {[{
            title: 'Satisfação dos pacientes',
            value: '4.8/5.0',
            color: 'bg-blue-600',
            base: 'bg-blue-200',
            width: '96%',
            accent: 'text-blue-900',
          }, {
            title: 'Tempo médio de atendimento',
            value: '18 min',
            color: 'bg-blue-600',
            base: 'bg-blue-200',
            width: '75%',
            accent: 'text-blue-900',
          }, {
            title: 'Resolutividade',
            value: '92%',
            color: 'bg-purple-600',
            base: 'bg-purple-200',
            width: '92%',
            accent: 'text-purple-900',
          }, {
            title: 'Taxa de retorno',
            value: '78%',
            color: 'bg-orange-600',
            base: 'bg-orange-200',
            width: '78%',
            accent: 'text-orange-900',
          }].map((indicator) => (
            <div key={indicator.title} className="space-y-2 rounded-lg bg-blue-50 p-4">
              <div className="flex items-center justify-between">
                <span className={indicator.accent}>{indicator.title}</span>
                <span className="text-sm text-blue-700">{indicator.value}</span>
              </div>
              <div className={`h-2 w-full rounded-full ${indicator.base}`}>
                <div className={`h-2 rounded-full ${indicator.color}`} style={{ width: indicator.width }} />
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
