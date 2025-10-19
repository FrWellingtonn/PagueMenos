import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Patient {
  id: string;
  name: string;
}

interface NewAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
}

export function NewAppointmentDialog({ isOpen, onClose, patient }: NewAppointmentDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Novo Atendimento - {patient.name}</DialogTitle>
        </DialogHeader>
        
        <div className="w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="type">Tipo de Atendimento</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consultation">Consulta Farmacêutica</SelectItem>
                <SelectItem value="medication-review">Revisão de Medicamentos</SelectItem>
                <SelectItem value="vaccination">Vacinação</SelectItem>
                <SelectItem value="pressure-check">Aferição de Pressão</SelectItem>
                <SelectItem value="glucose-test">Teste de Glicemia</SelectItem>
                <SelectItem value="orientation">Orientação Farmacêutica</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input id="date" type="date" defaultValue="2025-10-18" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input id="time" type="time" />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="complaint">Queixa Principal</Label>
            <Textarea id="complaint" placeholder="Descreva a queixa ou motivo do atendimento" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blood-pressure">Pressão Arterial</Label>
            <Input id="blood-pressure" placeholder="Ex: 120/80 mmHg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="heart-rate">Frequência Cardíaca</Label>
            <Input id="heart-rate" placeholder="Ex: 72 bpm" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="temperature">Temperatura</Label>
            <Input id="temperature" placeholder="Ex: 36.5°C" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weight">Peso</Label>
            <Input id="weight" placeholder="Ex: 75 kg" />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="assessment">Avaliação Farmacêutica</Label>
            <Textarea 
              id="assessment" 
              placeholder="Registro da avaliação, observações clínicas e orientações fornecidas"
              className="min-h-[100px]"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="plan">Plano de Cuidado</Label>
            <Textarea 
              id="plan" 
              placeholder="Descreva o plano terapêutico, intervenções e acompanhamento"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="follow-up">Acompanhamento</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onClose}>
            Salvar Atendimento
          </Button>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
