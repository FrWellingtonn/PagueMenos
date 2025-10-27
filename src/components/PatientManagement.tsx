import { useState } from 'react';
import { Card } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Search, Plus, Phone, Mail } from 'lucide-react';
import { mockPatients } from '../data/mockData';

interface PatientManagementProps {
  onPatientSelect: (patientId: string) => void;
}

export function PatientManagement({ onPatientSelect }: PatientManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.cpf.includes(searchTerm)
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 font-semibold">Gestão de Pacientes</h1>
          <p className="text-sm text-gray-600">Cadastro e busca de pacientes</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 transition-transform duration-200 hover:-translate-y-0.5 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-3xl">
            <DialogHeader>
              <DialogTitle>Cadastrar novo paciente</DialogTitle>
            </DialogHeader>
            <div className="mx-auto w-full max-w-2xl space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input id="name" placeholder="Digite o nome completo" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" placeholder="000.000.000-00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Data de nascimento</Label>
                  <Input id="birthdate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Sexo</Label>
                  <Input id="gender" placeholder="Masculino/Feminino" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" placeholder="(00) 00000-0000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" type="email" placeholder="email@exemplo.com" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Endereço completo</Label>
                  <Input id="address" placeholder="Rua, número, bairro, cidade, UF" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="observations">Observações</Label>
                  <Input id="observations" placeholder="Informações adicionais" />
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsDialogOpen(false)}>
                  Cadastrar paciente
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="animate-scale-in p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {filteredPatients.map((patient, index) => (
          <Card
            key={patient.id}
            className="animate-fade-in-up cursor-pointer p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            style={{ animationDelay: `${index * 0.04}s` }}
            onClick={() => onPatientSelect(patient.id)}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-xl text-blue-700">
                <span>{patient.name.charAt(0)}</span>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <h3 className="text-gray-900 font-medium">{patient.name}</h3>
                  <p className="text-sm text-gray-600">
                    {patient.age} anos • {patient.gender} • CPF: {patient.cpf}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{patient.email}</span>
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {patient.allergies.map((allergy, index) => (
                      <span key={index} className="rounded bg-red-50 px-2 py-1 text-red-700">
                        Alergia: {allergy}
                      </span>
                    ))}
                  </div>
                )}

                {patient.conditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    {patient.conditions.slice(0, 2).map((condition, index) => (
                      <span key={index} className="rounded bg-blue-50 px-2 py-1 text-blue-700">
                        {condition}
                      </span>
                    ))}
                    {patient.conditions.length > 2 && (
                      <span className="rounded bg-gray-100 px-2 py-1 text-gray-700">
                        +{patient.conditions.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
