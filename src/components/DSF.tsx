import { useState } from 'react';
import { Card } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockPatients } from '../data/mockData';

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Dispensação Sem Formulação (DSF)</h1>
          <p className="text-gray-600">Sistema de laudo para dispensação assistida</p>
        </div>
        {showPreview && (
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">Laudo Gerado</Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-gray-900 mb-4">Dados do Laudo</h3>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">Buscar CPF</Label>
              <div className="flex gap-2">
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearchCpf(); }}
                />
                <Button variant="outline" onClick={handleSearchCpf}>Buscar</Button>
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

            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={handleClear}>Limpar</Button>
              <Button onClick={handleGenerate}>Gerar Laudo</Button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
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
                <Button onClick={() => window.print()}>Imprimir</Button>
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
