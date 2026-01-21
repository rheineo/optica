import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Package, Filter, X, Calendar, TrendingUp, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { OrderListItem, OrderFilters } from '../../api/admin';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';

const ESTADOS_PEDIDO = [
  { value: 'PENDIENTE_PAGO', label: 'Pendiente Pago', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'PAGADO', label: 'Pagado', color: 'bg-green-100 text-green-800' },
  { value: 'PROCESANDO', label: 'Procesando', color: 'bg-blue-100 text-blue-800' },
  { value: 'LISTO_PARA_ENVIO', label: 'Listo para Envío', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'ENVIADO', label: 'Enviado', color: 'bg-purple-100 text-purple-800' },
  { value: 'EN_DISTRIBUCION', label: 'En Distribución', color: 'bg-orange-100 text-orange-800' },
  { value: 'ENTREGADO', label: 'Entregado', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'CANCELADO', label: 'Cancelado', color: 'bg-red-100 text-red-800' },
  { value: 'DEVOLUCION', label: 'Devolución', color: 'bg-amber-100 text-amber-800' },
  { value: 'REEMBOLSADO', label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
];

const ESTADOS_PAGO = [
  { value: 'PENDIENTE', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'APROBADO', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
  { value: 'RECHAZADO', label: 'Rechazado', color: 'bg-red-100 text-red-800' },
  { value: 'REEMBOLSADO', label: 'Reembolsado', color: 'bg-gray-100 text-gray-800' },
];

const METODOS_PAGO = [
  { value: 'TARJETA_CREDITO', label: 'Tarjeta Crédito' },
  { value: 'TARJETA_DEBITO', label: 'Tarjeta Débito' },
  { value: 'PSE', label: 'PSE' },
  { value: 'EFECTIVO_CONTRAENTREGA', label: 'Contraentrega' },
  { value: 'TRANSFERENCIA', label: 'Transferencia' },
];

function getEstadoPedidoStyle(estado: string) {
  return ESTADOS_PEDIDO.find((e) => e.value === estado)?.color || 'bg-gray-100 text-gray-800';
}

function getEstadoPagoStyle(estado: string) {
  return ESTADOS_PAGO.find((e) => e.value === estado)?.color || 'bg-gray-100 text-gray-800';
}

function getEstadoPedidoLabel(estado: string) {
  return ESTADOS_PEDIDO.find((e) => e.value === estado)?.label || estado;
}

function getEstadoPagoLabel(estado: string) {
  return ESTADOS_PAGO.find((e) => e.value === estado)?.label || estado;
}

function getMetodoPagoLabel(metodo: string) {
  return METODOS_PAGO.find((m) => m.value === metodo)?.label || metodo;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function AdminOrders() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<OrderFilters>({
    page: 1,
    limit: 10,
    sort: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [stats, setStats] = useState({
    pendientes: 0,
    pagados: 0,
    procesando: 0,
    enviados: 0,
    entregados: 0,
    cancelados: 0,
  });

  const fetchOrders = async (newFilters?: OrderFilters) => {
    setIsLoading(true);
    try {
      const currentFilters = newFilters || filters;
      const response = await adminApi.getOrders({
        ...currentFilters,
        search: search || undefined,
      });
      if (response.success) {
        setOrders(response.data);
        setPagination(response.pagination);
        setStats(response.stats);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders({ ...filters, page: 1 });
  };

  const handleFilterChange = (key: keyof OrderFilters, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined, page: 1 };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    fetchOrders({ ...filters, page: 1 });
    setShowFilters(false);
  };

  const clearFilters = () => {
    const newFilters: OrderFilters = { page: 1, limit: 10, sort: 'desc' };
    setFilters(newFilters);
    setSearch('');
    fetchOrders(newFilters);
    setShowFilters(false);
  };

  const goToPage = (page: number) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    fetchOrders(newFilters);
  };

  return (
    <div className="p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 text-sm">Gestiona los pedidos de la tienda</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-100 rounded-lg">
              <Clock className="w-4 h-4 text-yellow-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pendientes</p>
              <p className="text-lg font-bold text-gray-900">{stats.pendientes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 rounded-lg">
              <TrendingUp className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Procesando</p>
              <p className="text-lg font-bold text-gray-900">{stats.procesando}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-100 rounded-lg">
              <Truck className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Enviados</p>
              <p className="text-lg font-bold text-gray-900">{stats.enviados}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-100 rounded-lg">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Entregados</p>
              <p className="text-lg font-bold text-gray-900">{stats.entregados}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <Package className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Pagados</p>
              <p className="text-lg font-bold text-gray-900">{stats.pagados}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-red-100 rounded-lg">
              <XCircle className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Cancelados</p>
              <p className="text-lg font-bold text-gray-900">{stats.cancelados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 md:p-4 mb-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative w-full sm:w-1/2 lg:w-2/5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por # orden o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-with-icon"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            <Search className="w-4 h-4" />
            Buscar
          </button>
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-neutral'}`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Pedido</label>
                <select
                  value={filters.estadoPedido || ''}
                  onChange={(e) => handleFilterChange('estadoPedido', e.target.value)}
                  className="input"
                >
                  <option value="">Todos</option>
                  {ESTADOS_PEDIDO.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Pago</label>
                <select
                  value={filters.estadoPago || ''}
                  onChange={(e) => handleFilterChange('estadoPago', e.target.value)}
                  className="input"
                >
                  <option value="">Todos</option>
                  {ESTADOS_PAGO.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Método Pago</label>
                <select
                  value={filters.metodoPago || ''}
                  onChange={(e) => handleFilterChange('metodoPago', e.target.value)}
                  className="input"
                >
                  <option value="">Todos</option>
                  {METODOS_PAGO.map((metodo) => (
                    <option key={metodo.value} value={metodo.value}>
                      {metodo.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Desde</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="date"
                    value={filters.fechaInicio || ''}
                    onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
                    className="input pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button type="button" onClick={clearFilters} className="btn btn-secondary">
                <X className="w-4 h-4" />
                Limpiar
              </button>
              <button type="button" onClick={applyFilters} className="btn btn-primary">
                Aplicar Filtros
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Pedido
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                  Fecha
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">
                  Estado
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                  Pago
                </th>
                <th className="px-3 md:px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 md:px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-28" />
                        <div className="h-2 bg-gray-200 rounded w-36" />
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden md:table-cell">
                      <div className="h-3 bg-gray-200 rounded w-24" />
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="h-4 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden lg:table-cell">
                      <div className="h-5 bg-gray-200 rounded w-20" />
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden sm:table-cell">
                      <div className="h-5 bg-gray-200 rounded w-16" />
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="h-6 bg-gray-200 rounded w-8 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium text-sm">No se encontraron pedidos</p>
                        <p className="text-gray-400 text-xs mt-1">Ajusta los filtros o espera nuevos pedidos</p>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 md:px-4 py-2">
                      <div>
                        <Link
                          to={`/admin/pedidos/${order.id}`}
                          className="font-semibold text-indigo-600 hover:text-indigo-800"
                        >
                          #{order.numero}
                        </Link>
                        <p className="text-xs text-gray-500">{order.itemsCount} items</p>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{order.cliente.nombre}</p>
                        <p className="text-xs text-gray-500 truncate">{order.cliente.email}</p>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-2 text-gray-600 text-xs hidden md:table-cell">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <p className="font-semibold text-gray-900">{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden lg:table-cell">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getEstadoPedidoStyle(
                          order.estadoPedido
                        )}`}
                      >
                        {getEstadoPedidoLabel(order.estadoPedido)}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden sm:table-cell">
                      <span
                        className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${getEstadoPagoStyle(
                          order.estadoPago
                        )}`}
                      >
                        {getEstadoPagoLabel(order.estadoPago)}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="flex items-center justify-end">
                        <Link
                          to={`/admin/pedidos/${order.id}`}
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                          title="Ver detalle"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 md:px-6 py-3 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
              Mostrando{' '}
              <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span> -{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              de <span className="font-medium">{pagination.total}</span> pedidos
            </p>
            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-neutral disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <div className="hidden sm:flex gap-1">
                {[...Array(Math.min(pagination.totalPages, 5))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={i}
                      onClick={() => goToPage(pageNum)}
                      className={`btn ${pagination.page === pageNum ? 'btn-primary' : 'btn-neutral'}`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <span className="sm:hidden flex items-center px-3 text-sm text-gray-600">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn btn-neutral disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
