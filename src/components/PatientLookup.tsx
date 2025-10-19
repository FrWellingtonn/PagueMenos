import { useState, useEffect } from 'react';
import { Search, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { mockPatients } from '@/data/mockData';

interface PatientLookupProps {
  onPatientFound: (patient: any) => void;
  onNewPatient: () => void;
}

export function PatientLookup({ onPatientFound, onNewPatient }: PatientLookupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundPatient, setFoundPatient] = useState<any>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const cpf = searchTerm.replace(/[^\d]/g, '');
      const patient = mockPatients.find(p => 
        p.cpf.includes(cpf) || 
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      if (patient) {
        setFoundPatient(patient);
      }
      setIsLoading(false);
    }, 800);
  };

  const handleUseThisPatient = () => {
    if (foundPatient) {
      onPatientFound(foundPatient);
    }
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por CPF ou nome..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isLoading || !searchTerm.trim()}>
          {isLoading ? 'Buscando...' : 'Buscar'}
        </Button>
      </div>

      {foundPatient ? (
        <div className="p-4 border rounded-lg bg-muted/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{foundPatient.name}</h4>
              <p className="text-sm text-muted-foreground">CPF: {foundPatient.cpf}</p>
              <p className="text-sm text-muted-foreground">
                {foundPatient.age} anos • {foundPatient.gender}
              </p>
            </div>
            <Button onClick={handleUseThisPatient} variant="outline">
              Usar este paciente
            </Button>
          </div>
        </div>
      ) : searchTerm && !isLoading ? (
        <div className="text-center py-4">
          <p className="text-muted-foreground mb-4">Paciente não encontrado</p>
          <Button onClick={onNewPatient} variant="outline" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Cadastrar novo paciente
          </Button>
        </div>
      ) : null}
    </div>
  );
}
