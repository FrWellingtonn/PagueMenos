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
      content: 'Olá! Sou seu assistente de IA powered by Amazon Nova Premier v1:0. Posso ajudar com informações sobre pacientes, histórico médico, medicamentos e vendas. Como posso ajudar?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Preparar contexto do paciente se disponível
      let patientContext = null;
      if (patientCpf) {
        const patient = mockPatients.find(p => p.cpf === patientCpf);
        if (patient) {
          const appointments = mockAppointments.filter(a => a.patientId === patient.id);
          const medications = mockMedications.filter(m => m.patientId === patient.id);
          const sales = mockSales.filter(s => s.patientCpf === patient.cpf);
          
          patientContext = {
            patient: {
              name: patient.name,
              age: patient.age,
              cpf: patient.cpf,
              allergies: patient.allergies,
              conditions: patient.conditions
            },
            appointments: appointments.map(a => ({
              date: a.date,
              type: a.type,
              notes: a.notes
            })),
            medications: medications.map(m => ({
              name: m.name,
              dosage: m.dosage,
              status: m.status
            })),
            sales: sales.map(s => ({
              date: s.date,
              products: s.products.map(p => p.name),
              total: s.totalAmount
            }))
          };
        }
      }
      
      const response = await fetch('https://xzyrgf6hy7oxnukqbedda5xblq0omzrx.lambda-url.us-east-2.on.aws/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Sistema: Health Sharp - Sistema Clínico Farmacêutico

Contexto do Paciente: ${patientContext ? JSON.stringify(patientContext, null, 2) : 'Nenhum paciente selecionado'}

Pergunta: ${userMessage}`
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response || data.message || 'Desculpe, não consegui processar sua solicitação.';
      } else {
        console.error('Erro HTTP:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Erro na API:', error);
    }
    
    // Fallback para resposta local se API falhar
    return generateLocalResponse(userMessage);
  };

  const generateLocalResponse = (userMessage: string): string => {
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
    return '**Health Sharp AI Assistant** \n*Powered by Amazon Nova Premier v1:0*\n\nPosso ajudar com:\n• Histórico de atendimentos\n• Medicamentos e interações\n• Histórico de vendas\n• Alergias e condições de saúde\n\nInforme o CPF do paciente ou faça uma pergunta específica.';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    try {
      const aiResponseContent = await generateAIResponse(currentInput);
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponseContent,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Desculpe, ocorreu um erro ao processar sua mensagem.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorResponse]);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-blue-600" />
          <div>
            <h3 className="font-semibold">Health Sharp AI</h3>
            <p className="text-xs text-gray-500">Amazon Nova Premier v1:0</p>
          </div>
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
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-blue-600" />
              </div>
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="animate-pulse flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-xs text-gray-500">Digitando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Digite sua pergunta..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
          />
          <Button onClick={handleSendMessage} size="sm" disabled={isLoading}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}