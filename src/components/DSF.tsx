import { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockPatients } from '../data/mockData';
import '../styles/print.css';

export function DSF() {
  const [patientId, setPatientId] = useState<string>('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const [posology, setPosology] = useState('');
  const [justification, setJustification] = useState('');
  const [orientation, setOrientation] = useState('');
  const [contraindications, setContraindications] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [cpf, setCpf] = useState('');
  const [cpfError, setCpfError] = useState('');

  const selectedPatient = mockPatients.find(p => p.id === patientId);

  const normalizeCPF = (v: string) => v.replace(/\D/g, '');

  const handleSearchCpf = () => {
    const n = normalizeCPF(cpf);
    const found = mockPatients.find(p => normalizeCPF(p.cpf) === n);
    if (found) {
      setPatientId(found.id);
      setCpfError('');
    } else {
      setPatientId('');
      setCpfError('CPF não encontrado');
    }
  };

  const handleGenerate = () => {
    setShowPreview(true);
  };

  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.className = 'print-content';
    printContent.innerHTML = `
      <div class="print-header">
        <div class="print-title">LAUDO FARMACÊUTICO</div>
        <div class="print-subtitle">Dispensação Sem Formulação (DSF)</div>
        <div style="font-size: 11px; margin-top: 10px;">
          <strong>Health Sharp</strong> - Sistema Clínico<br>
          Data: ${new Date().toLocaleDateString('pt-BR')}
        </div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Identificação do Paciente</div>
        <div class="print-field">
          <span class="print-field-label">Nome:</span> ${selectedPatient?.name || '—'}
        </div>
        <div class="print-field">
          <span class="print-field-label">CPF:</span> ${selectedPatient?.cpf || '—'}
        </div>
        <div class="print-field">
          <span class="print-field-label">Idade:</span> ${selectedPatient?.age || '—'} anos
        </div>
        <div class="print-field">
          <span class="print-field-label">Sexo:</span> ${selectedPatient?.gender || '—'}
        </div>
        <div class="print-field">
          <span class="print-field-label">Telefone:</span> ${selectedPatient?.phone || '—'}
        </div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Medicamento Dispensado</div>
        <div class="print-field">
          <span class="print-field-label">Produto:</span> ${product || '—'}
        </div>
        <div class="print-field">
          <span class="print-field-label">Quantidade:</span> ${quantity || '—'}
        </div>
        <div class="print-field">
          <span class="print-field-label">Posologia:</span> ${posology || '—'}
        </div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Justificativa Técnica</div>
        <div style="text-align: justify; line-height: 1.5;">
          ${justification || 'Não informado'}
        </div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Orientações ao Paciente</div>
        <div style="text-align: justify; line-height: 1.5;">
          ${orientation || 'Não informado'}
        </div>
      </div>
      
      <div class="print-section">
        <div class="print-section-title">Contraindicações e Precauções</div>
        <div style="text-align: justify; line-height: 1.5;">
          ${contraindications || 'Não informado'}
        </div>
      </div>
      
      <div class="print-signature">
        <div class="print-signature-line"></div>
        <div style="margin-top: 10px; font-weight: bold;">
          Dr. Fernando Martins<br>
          Farmacêutico Responsável<br>
          CRF/CE 12345
        </div>
      </div>
      
      <div class="print-footer">
        Este laudo foi gerado pelo <strong>Health Sharp</strong>
      </div>
    `;
    
    document.body.appendChild(printContent);
    window.print();
    document.body.removeChild(printContent);
  };

  const handleClear = () => {
    setProduct('');
    setQuantity('');
    setPosology('');
    setJustification('');
    setOrientation('');
    setContraindications('');
    setShowPreview(false);
    setCpf('');
    setCpfError('');
    setPatientId('');
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-2">Dispensação Sem Formulação (DSF)</h1>
          <p className="text-gray-600">Sistema de laudo para dispensação assistida</p>
        </div>
        {showPreview && (
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">Laudo Gerado</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="animate-scale-in space-y-4 rounded-2xl border border-gray-100 bg-white/90 p-6 shadow-sm backdrop-blur-sm">
          <h3 className="text-gray-900 mb-4">Dados do Laudo</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">Buscar CPF</Label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchCpf(); }}
                />
                <Button variant="outline" onClick={handleSearchCpf} className="transition-transform duration-200 hover:-translate-y-0.5">Buscar</Button>
              </div>
              {selectedPatient ? (
                <p className="text-sm text-gray-600">Selecionado: {selectedPatient.name}</p>
              ) : (
                cpfError && <p className="text-sm text-red-600">{cpfError}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product">Produto</Label>
                <Input id="product" value={product} onChange={(e) => setProduct(e.target.value)} placeholder="Ex: Dipirona 500mg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input id="quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Ex: 12 comprimidos" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="posology">Posologia</Label>
              <Input id="posology" value={posology} onChange={(e) => setPosology(e.target.value)} placeholder="Ex: 1 cp a cada 8 horas, por 3 dias" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="justification">Justificativa Técnica</Label>
              <Textarea id="justification" value={justification} onChange={(e) => setJustification(e.target.value)} placeholder="Fundamente a necessidade de dispensação (sintomas, avaliação, elegibilidade)" className="min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="orientation">Orientações ao Paciente</Label>
              <Textarea id="orientation" value={orientation} onChange={(e) => setOrientation(e.target.value)} placeholder="Modo de uso, possíveis efeitos, quando procurar assistência" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contraindications">Contraindicações/Precauções</Label>
              <Textarea id="contraindications" value={contraindications} onChange={(e) => setContraindications(e.target.value)} placeholder="Liste contraindicações observadas e precauções" />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button variant="outline" onClick={handleClear} className="transition-transform duration-200 hover:-translate-y-0.5">Limpar</Button>
              <Button onClick={handleGenerate} className="transition-transform duration-200 hover:-translate-y-0.5">Gerar Laudo</Button>
            </div>
          </div>
        </Card>

        <Card
          className="animate-scale-in space-y-4 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm"
          style={{ animationDelay: '0.1s' }}
        >
          <h3 className="text-gray-900 mb-4">Pré-visualização</h3>
          {showPreview ? (
            <div className="space-y-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-900 font-medium">Identificação do Paciente</p>
                <p className="text-gray-600">{selectedPatient?.name} • {selectedPatient?.age} anos • {selectedPatient?.gender}</p>
                <p className="text-gray-600">CPF: {selectedPatient?.cpf} • Telefone: {selectedPatient?.phone}</p>
              </div>

              <div>
                <p className="text-gray-900 font-medium mb-1">Produto e Posologia</p>
                <p className="text-gray-700">Produto: <span className="text-gray-900">{product || '—'}</span></p>
                <p className="text-gray-700">Quantidade: <span className="text-gray-900">{quantity || '—'}</span></p>
                <p className="text-gray-700">Posologia: <span className="text-gray-900">{posology || '—'}</span></p>
              </div>

              <div>
                <p className="text-gray-900 font-medium mb-1">Justificativa Técnica</p>
                <p className="text-gray-700 whitespace-pre-wrap">{justification || '—'}</p>
              </div>

              <div>
                <p className="text-gray-900 font-medium mb-1">Orientações ao Paciente</p>
                <p className="text-gray-700 whitespace-pre-wrap">{orientation || '—'}</p>
              </div>

              <div>
                <p className="text-gray-900 font-medium mb-1">Contraindicações/Precauções</p>
                <p className="text-gray-700 whitespace-pre-wrap">{contraindications || '—'}</p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowPreview(false)}>Editar</Button>
                <Button onClick={handlePrint}>Imprimir Laudo</Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">
              Preencha os dados e clique em "Gerar Laudo" para visualizar aqui.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

