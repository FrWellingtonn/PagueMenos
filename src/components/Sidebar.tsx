import { LayoutDashboard, Users, FileText, History, Pill, BarChart3, Video, FileCheck, ShoppingCart, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { MenuItem } from '../App';

interface SidebarProps {
  setActiveMenu: (menu: MenuItem) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ setActiveMenu, isOpen, onClose }: SidebarProps) {
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

  ];

  const navigate = useNavigate();
  const location = useLocation();

  // Determina o menu ativo com base no caminho da URL
  const activePath = location.pathname.substring(1) || 'dashboard';
  
  const handleMenuClick = (menuId: MenuItem, path: string) => {
    setActiveMenu(menuId);
    navigate(path);
    onClose();
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 transform flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out md:fixed md:inset-y-0 md:left-0 md:h-screen md:w-64 md:translate-x-0 md:border-r md:border-gray-200 md:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="relative border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <img
            src="/health-sharp.png"
            alt="Health Sharp"
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-blue-700 font-semibold">Health Sharp</h1>
            <p className="text-gray-500 text-sm">Sistema Clínico</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-blue-50 p-1.5 text-blue-600 transition hover:bg-blue-100 md:hidden"
          aria-label="Fechar menu"
        >
          <X className="h-5 w-5" />
        </button>
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
    </aside>
  );
}






