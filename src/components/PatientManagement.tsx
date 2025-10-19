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
    <div className="h-screen overflow-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Gestão de Pacientes</h1>
          <p className="text-gray-600">Cadastro e busca de pacientes</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Novo Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
            </DialogHeader>
            <div className="w-full max-w-2xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input id="name" placeholder="Digite o nome completo" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="birthdate">Data de Nascimento</Label>
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
                <Label htmlFor="address">Endereço Completo</Label>
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
                Cadastrar Paciente
              </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search Bar */}
      <Card className="p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="Buscar por nome ou CPF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Patients List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => onPatientSelect(patient.id)}>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 text-xl">{patient.name.charAt(0)}</span>
              </div>
              
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">{patient.name}</h3>
                <p className="text-gray-600 text-sm mb-3">
                  {patient.age} anos • {patient.gender} • CPF: {patient.cpf}
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{patient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <Mail className="w-4 h-4" />
                    <span>{patient.email}</span>
                  </div>
                </div>

                {patient.allergies.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {patient.allergies.map((allergy, index) => (
                      <span key={index} className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded">
                        Alergia: {allergy}
                      </span>
                    ))}
                  </div>
                )}

                {patient.conditions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {patient.conditions.slice(0, 2).map((condition, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {condition}
                      </span>
                    ))}
                    {patient.conditions.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
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
