import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Productos', path: '/admin/productos', icon: <Package className="w-5 h-5" /> },
  { label: 'Pedidos', path: '/admin/pedidos', icon: <ShoppingCart className="w-5 h-5" /> },
  { label: 'Usuarios', path: '/admin/usuarios', icon: <Users className="w-5 h-5" /> },
  { label: 'Configuración', path: '/admin/configuracion', icon: <Settings className="w-5 h-5" /> },
];

export function AdminSidebar({ collapsed, onToggle }: AdminSidebarProps) {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={`
        ${collapsed ? 'w-16' : 'w-64'} 
        bg-gray-900 text-white h-full flex flex-col transition-all duration-300 flex-shrink-0
      `}
    >
      {/* Header con botón hamburguesa */}
      <div className={`p-4 border-b border-gray-800 flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <Link to="/admin" className="text-lg font-bold text-white">
            Liney Visión
          </Link>
        )}
        <button
          onClick={onToggle}
          className="p-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          title={collapsed ? 'Expandir menú' : 'Colapsar menú'}
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Actions */}
      <div className="p-2 border-t border-gray-800">
        {!collapsed && (
          <div className="mb-3 px-3">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        )}
        
        <Link
          to="/"
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800`}
          title={collapsed ? 'Volver a la tienda' : undefined}
        >
          <ChevronLeft className="w-5 h-5" />
          {!collapsed && <span>Volver a la tienda</span>}
        </Link>
        
        <button
          onClick={logout}
          className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2 text-gray-300 hover:text-red-400 transition-colors w-full rounded-lg hover:bg-gray-800`}
          title={collapsed ? 'Cerrar sesión' : undefined}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Cerrar sesión</span>}
        </button>
      </div>
    </aside>
  );
}
