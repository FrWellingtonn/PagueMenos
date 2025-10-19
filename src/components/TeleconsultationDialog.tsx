import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockPatients } from '../data/mockData';

interface TeleconsultationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TeleconsultationDialog({ isOpen, onClose }: TeleconsultationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Agendar Nova Teleconsulta</DialogTitle>
        </DialogHeader>
        
        <div className="w-full max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="patient">Paciente</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o paciente" />
              </SelectTrigger>
              <SelectContent>
                {mockPatients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name} - {patient.cpf}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data da Consulta</Label>
            <Input id="date" type="date" defaultValue="2025-10-18" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input id="time" type="time" />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="doctor">Médico</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o médico" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Dr. Ricardo Mendes - CRM 12345/CE - Clínico Geral</SelectItem>
                <SelectItem value="2">Dra. Fernanda Lima - CRM 23456/CE - Cardiologista</SelectItem>
                <SelectItem value="3">Dr. Paulo Castro - CRM 34567/CE - Endocrinologista</SelectItem>
                <SelectItem value="4">Dra. Ana Beatriz - CRM 45678/CE - Geriatra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="reason">Motivo da Consulta</Label>
            <Textarea 
              id="reason" 
              placeholder="Descreva o motivo da consulta e sintomas apresentados"
              className="min-h-[100px]"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 space-y-2">
            <Label htmlFor="observations">Observações Prévias</Label>
            <Textarea 
              id="observations" 
              placeholder="Informações adicionais relevantes para o médico"
            />
          </div>

          <div className="col-span-1 sm:col-span-2 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-900">
              <span className="font-medium">Atenção:</span> Apenas o médico pode prescrever medicamentos durante a teleconsulta. 
              As prescrições serão automaticamente integradas ao prontuário do paciente.
            </p>
          </div>
          </div>

          <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={onClose}>
            Agendar Teleconsulta
          </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
