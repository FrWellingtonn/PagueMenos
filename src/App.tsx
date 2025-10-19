import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { PatientManagement } from './components/PatientManagement';
import { ClinicalRecord } from './components/ClinicalRecord';
import { AppointmentHistory } from './components/AppointmentHistory';
import { MedicationControl } from './components/MedicationControl';
import { Reports } from './components/Reports';
import { Teleconsultation } from './components/Teleconsultation';
import { DSF } from './components/DSF';

export type MenuItem = 'dashboard' | 'patients' | 'record' | 'history' | 'medications' | 'teleconsultation' | 'reports' | 'dsf';

export default function App() {
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
    setActiveMenu('record');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
      
      <main className="flex-1 overflow-auto">
        {activeMenu === 'dashboard' && <Dashboard onPatientSelect={handlePatientSelect} />}
        {activeMenu === 'patients' && <PatientManagement onPatientSelect={handlePatientSelect} />}
        {activeMenu === 'record' && <ClinicalRecord selectedPatientId={selectedPatientId} />}
        {activeMenu === 'history' && <AppointmentHistory />}
        {activeMenu === 'medications' && <MedicationControl />}
        {activeMenu === 'teleconsultation' && <Teleconsultation onPatientSelect={handlePatientSelect} />}
        {activeMenu === 'dsf' && <DSF />}
        {activeMenu === 'reports' && <Reports />}
      </main>
    </div>
  );
}
