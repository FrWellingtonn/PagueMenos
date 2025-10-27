import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Send, Bot, User, X } from 'lucide-react';
import { mockPatients, mockAppointments, mockMedications, mockSales, mockTeleconsultations, mockExams, mockMedicationDoses } from '../data/mockData';
import { searchMedication } from '../services/sngpcService';

// TODO: Replace with actual authentication context
const getCurrentPharmacist = () => {
  // This should be replaced with actual authentication context
  return 'Farmacêutico Responsável'; // Default fallback
};

// Simulação da API Gemini (substitua pela real quando instalar @google/genai)
const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY não configurada. Pulei chamada à API Gemini.');
      return '';
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
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
      content: patientCpf 
        ? `Olá ${getCurrentPharmacist()}, estou aqui para auxiliar com as informações do paciente selecionado. Como posso ajudar?` 
        : `Olá ${getCurrentPharmacist()}, sou seu assistente de IA farmacêutico. Por favor, selecione um paciente no prontuário para começarmos.`,
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Check if user is asking about medication information
    const medicationQuery = userMessage.match(/sobre o medicamento (.*?)[.?!]/i) || 
                          userMessage.match(/informações do medicamento (.*?)[.?!]/i) ||
                          userMessage.match(/detalhes do medicamento (.*?)[.?!]/i);

    if (medicationQuery && medicationQuery[1]) {
      const medName = medicationQuery[1].trim();
      const sngpcResults = await searchMedication(medName);
      
      if (sngpcResults.length > 0) {
        const medInfo = sngpcResults[0];
        const patient = patientCpf ? mockPatients.find(p => p.cpf === patientCpf) : null;
        const patientName = patient ? patient.name : 'Paciente';
        
        let response = `**Informações do Medicamento**\n\n`;
        
        // Add available fields from SNGPC data
        if (medInfo.nome) response += `**Medicamento:** ${medInfo.nome}\n`;
        if (medInfo.principioAtivo) response += `**Princípio Ativo:** ${medInfo.principioAtivo}\n`;
        if (medInfo.apresentacao) response += `**Apresentação:** ${medInfo.apresentacao}\n`;
        if (medInfo.laboratorio) response += `**Laboratório:** ${medInfo.laboratorio}\n`;
        if (medInfo.tarja) response += `**Classificação:** ${medInfo.tarja}\n`;
        
        response += `\n*Fonte: Sistema Nacional de Gerenciamento de Produtos Controlados (SNGPC)*`;
        
        if (patient) {
          response += `\n\n**Atenção ${getCurrentPharmacist()}:**`;
          if (patient.allergies && patient.allergies.length > 0) {
            response += `\n- Verifique se ${patientName.split(' ')[0]} possui alergia a este medicamento.`;
          }
          if (patient.conditions && patient.conditions.length > 0) {
            response += `\n- Considere as condições de saúde do paciente: ${patient.conditions.join(', ')}.`;
          }
        }
        
        return response;
      } else {
        return `Não encontrei informações sobre o medicamento "${medName}" no sistema SNGPC.`;
      }
    }

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
    <>
      {/* Header */}
      <div className="flex items-center justify-between h-12 px-4 sticky top-0 z-10 backdrop-blur-md bg-white/70 dark:bg-[#1C1C1E]/70 border-b rounded-tl-2xl lg:rounded-tl-none">
        <h3 className="font-semibold text-sm">Assistente Farmacêutico</h3>
        <Button variant="ghost" size="sm" aria-label="Fechar chat" className="text-foreground hover:bg-accent h-8 w-8 p-0 rounded-full" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className="max-w-[85%]">
              <div className={`rounded-2xl p-2.5 text-xs ${
                message.type === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <div className="flex items-start gap-2">
                  {message.type === 'ai' && <Bot className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />}
                  <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  {message.type === 'user' && <User className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />}
                </div>
              </div>
              <div className={`text-[10px] mt-1 opacity-70 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}>
                {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-2xl p-2.5 max-w-[85%]">
              <div className="flex items-center gap-2 text-xs">
                <Bot className="h-3.5 w-3.5 animate-pulse" />
                <span>Pensando...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input */}
      <div className="p-3 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Digite sua mensagem..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            aria-label="Mensagem para o assistente" className="flex-1 text-sm rounded-[10px] h-10 input-apple"
          />
          <Button onClick={handleSendMessage} disabled={isLoading} size="icon" className="h-10 w-10 rounded-apple-sm btn-apple btn-primary-apple">
            <Send className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </>
  );
}
