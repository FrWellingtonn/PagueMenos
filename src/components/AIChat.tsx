import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, X } from 'lucide-react';
import { mockPatients, mockAppointments, mockMedications, mockSales } from '../data/mockData';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface AIChatProps {
  patientCpf?: string;
  onClose: () => void;
}

export function AIChat({ patientCpf, onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou seu assistente de IA. Posso ajudar com informações sobre pacientes, histórico médico, medicamentos e vendas. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');

  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Buscar paciente por CPF se fornecido
    let patient = null;
    if (patientCpf) {
      patient = mockPatients.find(p => p.cpf === patientCpf);
    }
    
    // Extrair CPF da mensagem se mencionado
    const cpfMatch = userMessage.match(/\d{3}\.?\d{3}\.?\d{3}-?\d{2}/);
    if (cpfMatch && !patient) {
      const extractedCpf = cpfMatch[0];
      patient = mockPatients.find(p => p.cpf.replace(/\D/g, '') === extractedCpf.replace(/\D/g, ''));
    }

    // Respostas sobre medicamentos
    if (message.includes('medicamento') || message.includes('remédio') || message.includes('prescrição')) {
      if (patient) {
        const medications = mockMedications.filter(m => m.patientId === patient.id);
        const activeMeds = medications.filter(m => m.status === 'active');
        
        return `**Medicamentos de ${patient.name}:**\n\n${activeMeds.map(med => 
          `• **${med.name}** ${med.dosage}\n  - Frequência: ${med.frequency}\n  - Prescrito por: ${med.prescribedBy}`
        ).join('\n\n')}\n\n${medications.some(m => m.interactions) ? 
          '⚠️ **Atenção:** Há medicamentos com possíveis interações. Verifique na aba Medicamentos.' : 
          '✅ Não foram identificadas interações medicamentosas.'
        }`;
      }
      return 'Para consultar medicamentos, informe o CPF do paciente ou selecione um paciente no prontuário.';
    }

    // Respostas sobre histórico
    if (message.includes('histórico') || message.includes('atendimento') || message.includes('consulta')) {
      if (patient) {
        const appointments = mockAppointments.filter(a => a.patientId === patient.id);
        const recent = appointments.slice(0, 3);
        
        return `**Histórico de ${patient.name}:**\n\n${recent.map(apt => 
          `• **${apt.type}** - ${apt.date}\n  ${apt.notes.substring(0, 100)}...`
        ).join('\n\n')}\n\n📊 Total de atendimentos: ${appointments.length}`;
      }
      return 'Para consultar o histórico, informe o CPF do paciente.';
    }

    // Respostas sobre vendas
    if (message.includes('venda') || message.includes('compra') || message.includes('produto')) {
      if (patient) {
        const sales = mockSales.filter(s => s.patientCpf === patient.cpf);
        const totalSpent = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
        
        return `**Histórico de Vendas - ${patient.name}:**\n\n${sales.map(sale => 
          `• **${sale.date}** - R$ ${sale.totalAmount.toFixed(2)}\n  ${sale.products.map(p => p.name).join(', ')}`
        ).join('\n\n')}\n\n💰 **Total gasto:** R$ ${totalSpent.toFixed(2)}\n📦 **Total de compras:** ${sales.length}`;
      }
      return 'Para consultar vendas, informe o CPF do paciente.';
    }

    // Respostas sobre alergias
    if (message.includes('alergia') || message.includes('alérgico')) {
      if (patient) {
        return patient.allergies.length > 0 
          ? `⚠️ **Alergias de ${patient.name}:**\n${patient.allergies.map(a => `• ${a}`).join('\n')}\n\n**Importante:** Sempre verificar antes de dispensar medicamentos!`
          : `✅ ${patient.name} não possui alergias registradas.`;
      }
      return 'Para consultar alergias, informe o CPF do paciente.';
    }

    // Respostas sobre condições de saúde
    if (message.includes('condição') || message.includes('doença') || message.includes('problema')) {
      if (patient) {
        return `**Condições de Saúde - ${patient.name}:**\n${patient.conditions.map(c => `• ${c}`).join('\n')}\n\n📋 Essas informações são importantes para orientações farmacêuticas adequadas.`;
      }
      return 'Para consultar condições de saúde, informe o CPF do paciente.';
    }

    // Respostas sobre interações
    if (message.includes('interação') || message.includes('compatível')) {
      if (patient) {
        const medications = mockMedications.filter(m => m.patientId === patient.id && m.status === 'active');
        const withInteractions = medications.filter(m => m.interactions);
        
        if (withInteractions.length > 0) {
          return `⚠️ **Possíveis Interações - ${patient.name}:**\n\n${withInteractions.map(med => 
            `• **${med.name}**\n  ${med.interactions}`
          ).join('\n\n')}\n\n**Recomendação:** Monitorar sinais vitais e orientar o paciente.`;
        }
        return `✅ Não foram identificadas interações medicamentosas para ${patient.name}.`;
      }
      return 'Para verificar interações, informe o CPF do paciente.';
    }

    // Resposta padrão
    return 'Posso ajudar com:\n• Histórico de atendimentos\n• Medicamentos e interações\n• Histórico de vendas\n• Alergias e condições de saúde\n\nInforme o CPF do paciente ou faça uma pergunta específica.';
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: generateAIResponse(inputValue),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setInputValue('');
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <h3 className="font-semibold">Assistente IA</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="whitespace-pre-wrap text-sm">
                  {message.content}
                </div>
                <div className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>

              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua pergunta..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}