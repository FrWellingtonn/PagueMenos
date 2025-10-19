import { LayoutDashboard, Users, FileText, History, Pill, BarChart3, Video, FileCheck, ShoppingCart, Cpu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuItem } from '../App';

interface SidebarProps {
  setActiveMenu: (menu: MenuItem) => void;
}

export function Sidebar({ setActiveMenu }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as MenuItem, label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'patients' as MenuItem, label: 'Pacientes', icon: Users, path: '/patients' },
    { id: 'record' as MenuItem, label: 'Prontuário', icon: FileText, path: '/record' },
    { id: 'history' as MenuItem, label: 'Histórico', icon: History, path: '/history' },
    { id: 'medications' as MenuItem, label: 'Medicamentos', icon: Pill, path: '/medications' },
    { id: 'teleconsultation' as MenuItem, label: 'Teleconsulta', icon: Video, path: '/teleconsultation' },
    { id: 'dsf' as MenuItem, label: 'Laudo DSF', icon: FileCheck, path: '/dsf' },
    { id: 'sales-history' as MenuItem, label: 'Histórico de Vendas', icon: ShoppingCart, path: '/sales-history' },
    { id: 'reports' as MenuItem, label: 'Relatórios', icon: BarChart3, path: '/reports' },
    { id: 'api-example' as MenuItem, label: 'Exemplo API', icon: Cpu, path: '/api-example' },
  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Determina o menu ativo com base no caminho da URL
  const activePath = location.pathname.substring(1) || 'dashboard';
  
  const handleMenuClick = (menuId: MenuItem, path: string) => {
    setActiveMenu(menuId);
    navigate(path);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Pill className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-blue-700">Health Sharp</h1>
            <p className="text-gray-500 text-sm">Sistema Clínico</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePath === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.id, item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
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
