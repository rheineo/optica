import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Users, ShoppingCart, TrendingUp } from 'lucide-react';
import { adminApi } from '../../api/admin';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    revenue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const productsRes = await adminApi.getProducts({ limit: 1 });
        setStats({
          totalProducts: productsRes.pagination.total,
          totalOrders: 0,
          totalUsers: 0,
          revenue: 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Total Productos',
      value: stats.totalProducts,
      icon: <Package className="w-8 h-8" />,
      color: 'bg-blue-500',
      link: '/admin/productos',
    },
    {
      label: 'Pedidos',
      value: stats.totalOrders,
      icon: <ShoppingCart className="w-8 h-8" />,
      color: 'bg-green-500',
      link: '/admin/pedidos',
    },
    {
      label: 'Usuarios',
      value: stats.totalUsers,
      icon: <Users className="w-8 h-8" />,
      color: 'bg-purple-500',
      link: '/admin/usuarios',
    },
    {
      label: 'Ingresos',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'bg-orange-500',
      link: '/admin',
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/admin/productos/nuevo"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            + Nuevo Producto
          </Link>
          <Link
            to="/admin/productos"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </div>
  );
}
