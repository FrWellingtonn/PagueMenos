import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { ClinicalRecord } from './components/ClinicalRecord';
import { AppointmentHistory } from './components/AppointmentHistory';
import { MedicationControl } from './components/MedicationControl';
import { Reports } from './components/Reports';
import { Teleconsultation } from './components/Teleconsultation';
import { DSF } from './components/DSF';
import { SalesHistory } from './components/SalesHistory';
import ApiExample from './components/ApiExample';

export type MenuItem = 'dashboard' | 'patients' | 'record' | 'history' | 'medications' | 'teleconsultation' | 'reports' | 'dsf' | 'sales-history' | 'api-example';

// Componente para sincronizar o estado ativo do menu com a rota atual
function RouteHandler({ setActiveMenu }: { setActiveMenu: (menu: MenuItem) => void }) {
  const location = useLocation();

  // Sincroniza o menu ativo com a rota atual
  React.useEffect(() => {
    const path = location.pathname.substring(1) || 'dashboard';
    if (path in {
      'dashboard': 1, 'patients': 1, 'record': 1, 'history': 1, 
      'medications': 1, 'teleconsultation': 1, 'reports': 1, 
      'dsf': 1, 'sales-history': 1, 'api-example': 1
    }) {
      setActiveMenu(path as MenuItem);
    }
  }, [location.pathname, setActiveMenu]);

  return null;
}

export default function App() {
  const [_, setActiveMenu] = useState<MenuItem>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handlePatientSelect = (patientId: string) => {
    console.log('Selecting patient with ID:', patientId);
    setSelectedPatientId(patientId);
    navigate('/record');
    setActiveMenu('record');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 overflow-auto">
        <RouteHandler setActiveMenu={setActiveMenu} />
        
        <Routes>
          <Route path="/" element={<Dashboard onPatientSelect={handlePatientSelect} />} />
          <Route path="/dashboard" element={<Dashboard onPatientSelect={handlePatientSelect} />} />
          <Route path="/patients" element={<PatientManagement onPatientSelect={handlePatientSelect} />} />
          <Route path="/record" element={<ClinicalRecord selectedPatientId={selectedPatientId} />} />
          <Route path="/history" element={<AppointmentHistory />} />
          <Route path="/medications" element={<MedicationControl />} />
          <Route path="/teleconsultation" element={<Teleconsultation onPatientSelect={handlePatientSelect} />} />
          <Route path="/dsf" element={<DSF />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sales-history" element={<SalesHistory />} />
          <Route path="/api-example" element={<ApiExample />} />
        </Routes>
      </main>
    </div>
  );
}
