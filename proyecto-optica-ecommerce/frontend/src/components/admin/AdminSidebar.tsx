import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings,
  LogOut,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Productos', path: '/admin/productos', icon: <Package className="w-5 h-5" /> },
  { label: 'Pedidos', path: '/admin/pedidos', icon: <ShoppingCart className="w-5 h-5" /> },
  { label: 'Usuarios', path: '/admin/usuarios', icon: <Users className="w-5 h-5" /> },
  { label: 'Configuración', path: '/admin/configuracion', icon: <Settings className="w-5 h-5" /> },
];

export function AdminSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Link to="/admin" className="text-xl font-bold text-white">
          Liney Visión
        </Link>
        <p className="text-xs text-gray-400 mt-1">Panel de Administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive(item.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Actions */}
      <div className="p-4 border-t border-gray-800">
        <div className="mb-4 px-4">
          <p className="text-sm font-medium text-white">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.email}</p>
        </div>
        
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver a la tienda</span>
        </Link>
        
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:text-red-400 transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
