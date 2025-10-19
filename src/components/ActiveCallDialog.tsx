import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor,
  User,
  Clock,
  FileText,
  Plus,
  X
} from 'lucide-react';
import { mockPatients } from '../data/mockData';
import type { Teleconsultation } from '../data/mockData';

interface ActiveCallDialogProps {
  consultation: Teleconsultation;
  onClose: () => void;
}

export function ActiveCallDialog({ consultation, onClose }: ActiveCallDialogProps) {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callDuration, setCallDuration] = useState('00:00');
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptions, setPrescriptions] = useState<string[]>([]);
  const [newPrescription, setNewPrescription] = useState('');

  const patient = mockPatients.find(p => p.id === consultation.patientId);

  const handleEndCall = () => {
    if (window.confirm('Deseja encerrar a teleconsulta?')) {
      onClose();
    }
  };

  const handleAddPrescription = () => {
    if (newPrescription.trim()) {
      setPrescriptions([...prescriptions, newPrescription.trim()]);
      setNewPrescription('');
    }
  };

  const handleRemovePrescription = (index: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent
        className="h-[90vh] p-0 overflow-y-auto"
        aria-describedby="teleconsultation-description"
        style={{ width: '90vw', maxWidth: '90vw' }}
      >
        <DialogTitle className="sr-only">
          Teleconsulta em andamento - {patient?.name} com Dr. {consultation.doctorName}
        </DialogTitle>
        <DialogDescription id="teleconsultation-description" className="sr-only">
          Interface de videochamada para teleconsulta médica com controles de áudio e vídeo, e painel para anotações clínicas e prescrições
        </DialogDescription>
        <div className="flex h-full">
          {/* Video Area */}
          <div className="flex-1 bg-gray-900 relative">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10">
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-medium">{patient?.name}</h3>
                  <p className="text-sm opacity-90">Teleconsulta com Dr. {consultation.doctorName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">{callDuration}</span>
                </div>
              </div>
            </div>

            {/* Main Video (Patient) */}
            <div className="h-full flex items-center justify-center">
              {isVideoOn ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-16 h-16" />
                    </div>
                    <p className="text-xl">{patient?.name}</p>
                    <p className="text-sm opacity-75">Vídeo do Paciente</p>
                  </div>
                </div>
              ) : (
                <div className="text-center text-white">
                  <VideoOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Câmera desligada</p>
                </div>
              )}
            </div>

            {/* Self Video (Doctor) - Picture in Picture */}
            <div className="absolute bottom-24 right-4 w-48 h-36 bg-gray-700 rounded-lg overflow-hidden shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="w-8 h-8" />
                  </div>
                  <p className="text-sm">Dr. {consultation.doctorName}</p>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <div className="flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant={isVideoOn ? 'secondary' : 'destructive'}
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
                </Button>

                <Button
                  size="lg"
                  variant={isAudioOn ? 'secondary' : 'destructive'}
                  className="rounded-full w-14 h-14"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="rounded-full w-14 h-14"
                >
                  <Monitor className="w-6 h-6" />
                </Button>

                <Button
                  size="lg"
                  variant="destructive"
                  className="rounded-full w-14 h-14"
                  onClick={handleEndCall}
                >
                  <PhoneOff className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>

          {/* Side Panel - Clinical Notes and Prescription */}
          <div className="w-64 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-gray-900">Anotações e Prescrição</h3>
              <p className="text-sm text-gray-600">Registros da consulta</p>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-4">
              {/* Patient Info */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">Dados do Paciente</span>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>Idade: {patient?.age} anos</p>
                  <p>CPF: {patient?.cpf}</p>
                  {patient?.allergies && patient.allergies.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-gray-200">
                      <p className="text-red-600 font-medium">Alergias: {patient.allergies.join(', ')}</p>
                    </div>
                  )}
                  {patient?.conditions && patient.conditions.length > 0 && (
                    <div className="mt-2">
                      <p className="font-medium text-gray-900">Condições:</p>
                      <p>{patient.conditions.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Diagnosis */}
              <div>
                <Label htmlFor="diagnosis">Diagnóstico</Label>
                <Textarea 
                  id="diagnosis"
                  placeholder="Registre o diagnóstico médico"
                  className="mt-2 min-h-[80px]"
                />
              </div>

              {/* Clinical Notes */}
              <div>
                <Label htmlFor="notes">Anotações Clínicas</Label>
                <Textarea 
                  id="notes"
                  placeholder="Anamnese, exame físico, orientações..."
                  className="mt-2 min-h-[100px]"
                />
              </div>

              {/* Medical Prescription */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <Label className="mb-0">Prescrição Médica</Label>
                  </div>
                  <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    Apenas Médico
                  </Badge>
                </div>

                {prescriptions.length > 0 && (
                  <div className="mb-3 space-y-2">
                    {prescriptions.map((prescription, index) => (
                      <div key={index} className="flex items-start gap-2 p-2 bg-blue-50 rounded">
                        <span className="text-sm text-blue-900 flex-1">{index + 1}. {prescription}</span>
                        <button
                          onClick={() => handleRemovePrescription(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {showPrescriptionForm ? (
                  <div className="space-y-2">
                    <Input
                      value={newPrescription}
                      onChange={(e) => setNewPrescription(e.target.value)}
                      placeholder="Ex: Amoxicilina 500mg - 1 cp 8/8h por 7 dias"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddPrescription();
                        }
                      }}
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={handleAddPrescription}
                      >
                        Adicionar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setShowPrescriptionForm(false);
                          setNewPrescription('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowPrescriptionForm(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Medicamento
                  </Button>
                )}

                <p className="text-xs text-gray-500 mt-2">
                  As prescrições serão integradas ao prontuário do paciente após o término da consulta.
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-200 space-y-2">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Salvar e Continuar
              </Button>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleEndCall}
              >
                Finalizar Consulta
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
