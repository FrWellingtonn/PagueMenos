import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
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
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuLabels: Record<MenuItem, string> = {
    dashboard: 'Dashboard',
    patients: 'Pacientes',
    record: 'Prontuário',
    history: 'Histórico',
    medications: 'Medicamentos',
    teleconsultation: 'Teleconsulta',
    reports: 'Relatórios',
    dsf: 'Laudo DSF',
    'sales-history': 'Histórico de Vendas',
    'api-example': 'API Example',
  };

  const currentMenuLabel = menuLabels[activeMenu] ?? 'Dashboard';

  const handlePatientSelect = (patientId: string) => {
    console.log('Selecting patient with ID:', patientId);
    setSelectedPatientId(patientId);
    navigate('/record');
    setActiveMenu('record');
  };

  React.useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        setActiveMenu={setActiveMenu}
        isOpen={isSidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64">
        {/* Global glass header */}
        <header className="glass-header flex items-center justify-between h-16 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex items-center justify-center rounded-apple-sm border border-blue-100 bg-white p-2 text-blue-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 md:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <img src="/health-sharp.png" alt="Health Sharp" className="h-8 w-8 object-contain" />
            <div className="flex flex-col leading-tight">
              <span className="text-base font-semibold text-blue-700 tracking-tight">Health Sharp</span>
              <span className="text-xs text-gray-500">{currentMenuLabel}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 md:px-8">
            <div className="max-w-7xl mx-auto">
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
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
