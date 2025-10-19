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
    { name: 'Alta Adesão', value: 65, color: '#2563eb' },
    { name: 'Média Adesão', value: 25, color: '#eab308' },
    { name: 'Baixa Adesão', value: 10, color: '#dc2626' },
  ];

  return (
    <div className="h-screen overflow-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Relatórios e Análises</h1>
          <p className="text-gray-600">Indicadores de desempenho do serviço clínico</p>
        </div>
        
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Exportar Relatórios
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-gray-900">1,184</h3>
          <p className="text-gray-600 text-sm">Total de Atendimentos</p>
          <p className="text-blue-600 text-xs mt-1">+12% vs mês anterior</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-gray-900">487</h3>
          <p className="text-gray-600 text-sm">Pacientes Ativos</p>
          <p className="text-blue-600 text-xs mt-1">+8% vs mês anterior</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-gray-900">87%</h3>
          <p className="text-gray-600 text-sm">Taxa de Adesão</p>
          <p className="text-blue-600 text-xs mt-1">+3% vs mês anterior</p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="text-gray-900">42</h3>
          <p className="text-gray-600 text-sm">Média por Dia</p>
          <p className="text-blue-600 text-xs mt-1">+15% vs mês anterior</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">Atendimentos por Tipo</h3>
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

        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">Tendência Mensal</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-6">Taxa de Adesão ao Tratamento</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={adherenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
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

        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Principais Indicadores</h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-900">Satisfação dos Pacientes</span>
                <span className="text-blue-700">4.8/5.0</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-900">Tempo Médio de Atendimento</span>
                <span className="text-blue-700">18 min</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-purple-900">Resolutividade</span>
                <span className="text-purple-700">92%</span>
              </div>
              <div className="w-full bg-purple-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '92%' }}></div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-orange-900">Taxa de Retorno</span>
                <span className="text-orange-700">78%</span>
              </div>
              <div className="w-full bg-orange-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
