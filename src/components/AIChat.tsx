import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Send, Bot, User, X } from 'lucide-react';
import { mockPatients, mockAppointments, mockMedications, mockSales, mockTeleconsultations, mockExams, mockMedicationDoses } from '../data/mockData';

// Simulação da API Gemini (substitua pela real quando instalar @google/genai)
const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyCKbOq-ySqQoz4XCE-HU7NyL3hI6MmHR0M', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      })
    });

    if (response.ok) {
      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    }
  } catch (error) {
    console.error('Erro na API Gemini:', error);
  }
  return '';
};

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
      content: patientCpf ? `Olá! 😊 Estou aqui para ajudar com informações do paciente selecionado. Pergunte sobre dados, medicamentos, histórico ou alergias.` : 'Olá! 😊 Sou seu assistente de IA farmacêutico powered by Gemini. Selecione um paciente no prontuário para começar.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Buscar paciente
    let patient = null;
    if (patientCpf) {
      patient = mockPatients.find(p => p.cpf === patientCpf);
    }

    // Preparar contexto completo do paciente para a IA
    let patientContext = '';
    if (patient) {
      const medications = mockMedications.filter(m => m.patientId === patient.id);
      const appointments = mockAppointments.filter(a => a.patientId === patient.id);
      const sales = mockSales.filter(s => s.patientCpf === patient.cpf);
      const teleconsultations = mockTeleconsultations.filter(t => t.patientId === patient.id);
      const exams = mockExams.filter(e => e.patientId === patient.id);
      const doses = mockMedicationDoses.filter(d => d.patientId === patient.id);
      
      patientContext = `
CONTEXTO COMPLETO DO PACIENTE:

=== DADOS PESSOAIS ===
Nome: ${patient.name}
Idade: ${patient.age} anos
Sexo: ${patient.gender}
CPF: ${patient.cpf}
Telefone: ${patient.phone}
Email: ${patient.email}
Endereço: ${patient.address}

=== CONDIÇÕES DE SAÚDE ===
Condições: ${patient.conditions.join(', ')}
Alergias: ${patient.allergies.join(', ') || 'Nenhuma'}

=== MEDICAMENTOS ===
Medicamentos ativos: ${medications.filter(m => m.status === 'active').map(m => `${m.name} ${m.dosage} - ${m.frequency} (${m.prescribedBy})`).join('; ')}
Medicamentos inativos: ${medications.filter(m => m.status !== 'active').map(m => `${m.name} - Status: ${m.status}`).join('; ')}
Interações: ${medications.filter(m => m.interactions).map(m => `${m.name}: ${m.interactions}`).join('; ')}

=== HISTÓRICO DE ATENDIMENTOS ===
${appointments.map(a => `${a.date} - ${a.type} (${a.pharmacist}): ${a.notes}`).join('\n')}

=== TELECONSULTAS ===
${teleconsultations.map(t => `${t.date} - Dr. ${t.doctorName} (${t.doctorCRM}): ${t.reason} - Status: ${t.status}${t.diagnosis ? ' - Diagnóstico: ' + t.diagnosis : ''}`).join('\n')}

=== EXAMES ===
${exams.map(e => `${e.date} - ${e.type}: ${e.result} (Referência: ${e.reference}) - Status: ${e.status}`).join('\n')}

=== HISTÓRICO DE VENDAS ===
${sales.map(s => `${s.date} - R$ ${s.totalAmount.toFixed(2)} - Produtos: ${s.products.map(p => p.name).join(', ')} - Pagamento: ${s.paymentMethod}`).join('\n')}

=== CONTROLE DE DOSES ===
${doses.map(d => `Medicamento ID ${d.medicationId} - ${d.date} ${d.time}: ${d.status}${d.notes ? ' - ' + d.notes : ''}`).join('\n')}
`;
    }

    // Tentar usar a API Gemini
    const geminiPrompt = `Você é um assistente de IA especializado em farmácia e saúde do sistema Health Sharp. Você tem acesso completo aos dados do paciente e deve responder de forma profissional, clara e útil.

${patientContext}

Pergunta do usuário: ${userMessage}

INSTRUÇÕES:
- Responda de forma RESUMIDA e CONCISA (máximo 200 palavras)
- Para dados do paciente: apenas informações essenciais (nome, idade, condições principais, alergias)
- Para medicamentos: apenas os ativos mais importantes
- Para histórico: apenas os 2-3 atendimentos mais recentes
- Use emojis para organizar a informação
- Evite textos longos e repetitivos
- Seja direto e objetivo

Responda agora:`;

    const geminiResponse = await callGeminiAPI(geminiPrompt);
    if (geminiResponse) {
      return geminiResponse;
    }

    // Fallback para respostas locais se a API falhar
    const message = userMessage.toLowerCase();

    if (message.includes('dados') || message.includes('informações') || message.includes('paciente')) {
      if (patient) {
        const activeMeds = mockMedications.filter(m => m.patientId === patient.id && m.status === 'active').length;
        return `📋 **${patient.name}** (${patient.age} anos)\n\n🏥 **Condições:** ${patient.conditions.slice(0, 3).join(', ')}\n⚠️ **Alergias:** ${patient.allergies.length > 0 ? patient.allergies.join(', ') : 'Nenhuma'}\n💊 **Medicamentos ativos:** ${activeMeds}\n📞 **Contato:** ${patient.phone}`;
      }
      return 'Nenhum paciente selecionado. Selecione um paciente no prontuário para ver os dados.';
    }

    if (message.includes('medicamento') || message.includes('remédio')) {
      if (patient) {
        const medications = mockMedications.filter(m => m.patientId === patient.id && m.status === 'active');
        if (medications.length > 0) {
          return `💊 **Medicamentos de ${patient.name}:**\n\n${medications.map(med => 
            `• **${med.name}** ${med.dosage}\n  Frequência: ${med.frequency}\n  Prescrito por: ${med.prescribedBy}`
          ).join('\n\n')}`;
        }
        return `${patient.name} não possui medicamentos ativos no momento.`;
      }
      return 'Selecione um paciente para consultar medicamentos.';
    }

    if (patient) {
      return `Olá! 😊 Estou aqui para ajudar com informações sobre **${patient.name}**.\n\nPosso responder sobre:\n• Dados do paciente\n• Medicamentos atuais\n• Histórico de atendimentos\n• Alergias e condições\n\nO que você gostaria de saber?`;
    }
    
    return 'Olá! 😊 Sou seu assistente de IA farmacêutico powered by Gemini.\n\nPara começar, selecione um paciente no prontuário e depois faça perguntas!';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

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
      console.error('Erro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.type === 'user' && (
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
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
              <div className="bg-gray-100 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Digitando...</p>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}