import { LayoutDashboard, Users, FileText, History, Pill, BarChart3, Video, FileCheck } from 'lucide-react';
import type { MenuItem } from '../App';

interface SidebarProps {
  activeMenu: MenuItem;
  setActiveMenu: (menu: MenuItem) => void;
}

export function Sidebar({ activeMenu, setActiveMenu }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients' as MenuItem, label: 'Pacientes', icon: Users },
    { id: 'record' as MenuItem, label: 'Prontuário', icon: FileText },
    { id: 'history' as MenuItem, label: 'Histórico', icon: History },
    { id: 'medications' as MenuItem, label: 'Medicamentos', icon: Pill },
    { id: 'teleconsultation' as MenuItem, label: 'Teleconsulta', icon: Video },
    { id: 'dsf' as MenuItem, label: 'Laudo DSF', icon: FileCheck },
    { id: 'reports' as MenuItem, label: 'Relatórios', icon: BarChart3 },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-blue-700">Pague Menos</h1>
            <p className="text-gray-500 text-sm">Atendimento Clínico</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveMenu(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-700 text-sm">FM</span>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-900">Farmacêutico</p>
            <p className="text-xs text-gray-500">CRF 12345</p>
          </div>
        </div>
      </div>
    </div>
  );
}
