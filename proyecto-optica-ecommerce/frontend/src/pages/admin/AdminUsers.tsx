import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye, Users, UserCheck, UserPlus, Crown, Filter, X, Ban, Unlock, Plus } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { UserListItem, UserFilters, CreateUserData } from '../../api/admin';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../components/ui';

export function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [stats, setStats] = useState({
    totalUsuarios: 0,
    activos: 0,
    bloqueados: 0,
    nuevosEsteMes: 0,
  });

  const [filters, setFilters] = useState<UserFilters>({
    role: '',
    estado: '',
    nivelCliente: '',
  });

  // Modal de bloqueo
  const [blockModal, setBlockModal] = useState<{ open: boolean; user: UserListItem | null; motivo: string }>({
    open: false,
    user: null,
    motivo: '',
  });

  // Modal de desbloqueo
  const [unblockModal, setUnblockModal] = useState<{ open: boolean; user: UserListItem | null }>({
    open: false,
    user: null,
  });

  // Modal de crear usuario
  const [createModal, setCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState<CreateUserData>({
    email: '',
    name: '',
    password: '',
    phone: '',
    role: 'CLIENTE',
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: filters.role || undefined,
        estado: filters.estado || undefined,
        nivelCliente: filters.nivelCliente || undefined,
      });

      if (response.success) {
        setUsers(response.data);
        setTotalPages(response.pagination.totalPages);
        setTotal(response.pagination.total);
        setStats(response.stats);
      }
    } catch (error) {
      toast.error('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleFilterChange = (key: keyof UserFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({ role: '', estado: '', nivelCliente: '' });
    setSearch('');
    setPage(1);
  };

  const handleBlockUser = async () => {
    if (!blockModal.user || !blockModal.motivo.trim()) {
      toast.error('Debes ingresar un motivo');
      return;
    }

    try {
      await adminApi.blockUser(blockModal.user.id, blockModal.motivo);
      toast.success('Usuario bloqueado');
      setBlockModal({ open: false, user: null, motivo: '' });
      fetchUsers();
    } catch (error) {
      toast.error('Error al bloquear usuario');
    }
  };

  const handleUnblockUser = async () => {
    if (!unblockModal.user) return;

    try {
      await adminApi.unblockUser(unblockModal.user.id);
      toast.success('Usuario desbloqueado');
      setUnblockModal({ open: false, user: null });
      fetchUsers();
    } catch (error) {
      toast.error('Error al desbloquear usuario');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.email || !newUser.name || !newUser.password) {
      toast.error('Email, nombre y contraseña son requeridos');
      return;
    }

    try {
      setCreating(true);
      await adminApi.createUser(newUser);
      toast.success('Usuario creado exitosamente');
      setCreateModal(false);
      setNewUser({ email: '', name: '', password: '', phone: '', role: 'CLIENTE' });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error al crear usuario');
    } finally {
      setCreating(false);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const styles: Record<string, string> = {
      ACTIVO: 'bg-green-100 text-green-800',
      INACTIVO: 'bg-gray-100 text-gray-800',
      BLOQUEADO: 'bg-red-100 text-red-800',
      PENDIENTE: 'bg-yellow-100 text-yellow-800',
      ELIMINADO: 'bg-black text-white',
    };
    return styles[estado] || 'bg-gray-100 text-gray-800';
  };

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      ADMIN: 'bg-purple-100 text-purple-800',
      SUPER_ADMIN: 'bg-indigo-100 text-indigo-800',
      CLIENTE: 'bg-blue-100 text-blue-800',
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  const getNivelBadge = (nivel: string) => {
    const styles: Record<string, string> = {
      NUEVO: 'bg-gray-100 text-gray-600',
      REGULAR: 'bg-blue-100 text-blue-600',
      FRECUENTE: 'bg-green-100 text-green-600',
      VIP: 'bg-yellow-100 text-yellow-700',
      PLATINUM: 'bg-purple-100 text-purple-700',
    };
    return styles[nivel] || 'bg-gray-100 text-gray-600';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">Gestión de Usuarios</h1>
        <button
          onClick={() => setCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus size={18} />
          Agregar Usuario
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total</p>
              <p className="text-lg font-bold text-gray-900">{stats.totalUsuarios}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-green-50 rounded-lg">
              <UserCheck className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Activos</p>
              <p className="text-lg font-bold text-gray-900">{stats.activos}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 rounded-lg">
              <UserPlus className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Nuevos (mes)</p>
              <p className="text-lg font-bold text-gray-900">{stats.nuevosEsteMes}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-3 border border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 rounded-lg">
              <Ban className="w-4 h-4 text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Bloqueados</p>
              <p className="text-lg font-bold text-gray-900">{stats.bloqueados}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-lg shadow-sm p-3 mb-4 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-3 items-center">
          <form onSubmit={handleSearch} className="flex-1 w-full md:max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10 w-full"
              />
            </div>
          </form>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`btn ${showFilters ? 'btn-primary' : 'btn-neutral'} flex items-center gap-2`}
          >
            <Filter size={16} />
            Filtros
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Rol</label>
              <select
                value={filters.role || ''}
                onChange={(e) => handleFilterChange('role', e.target.value)}
                className="input-field w-full text-sm"
              >
                <option value="">Todos</option>
                <option value="CLIENTE">Cliente</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Estado</label>
              <select
                value={filters.estado || ''}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                className="input-field w-full text-sm"
              >
                <option value="">Todos</option>
                <option value="ACTIVO">Activo</option>
                <option value="INACTIVO">Inactivo</option>
                <option value="BLOQUEADO">Bloqueado</option>
                <option value="PENDIENTE">Pendiente</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Nivel</label>
              <select
                value={filters.nivelCliente || ''}
                onChange={(e) => handleFilterChange('nivelCliente', e.target.value)}
                className="input-field w-full text-sm"
              >
                <option value="">Todos</option>
                <option value="NUEVO">Nuevo</option>
                <option value="REGULAR">Regular</option>
                <option value="FRECUENTE">Frecuente</option>
                <option value="VIP">VIP</option>
                <option value="PLATINUM">Platinum</option>
              </select>
            </div>
            <div className="flex items-end">
              <button onClick={clearFilters} className="btn btn-neutral flex items-center gap-1 text-sm">
                <X size={14} />
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Cargando usuarios...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Rol / Nivel</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Compras</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Registro</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-indigo-600 font-medium text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm flex items-center gap-1">
                            {user.name}
                            {user.etiquetas?.includes('VIP') && (
                              <Crown className="w-3 h-3 text-yellow-500" />
                            )}
                          </div>
                          <div className="text-xs text-gray-500">ID: {user.id.substring(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-sm">
                        <div className="flex items-center gap-1">
                          {user.email}
                          {user.emailVerified && (
                            <span className="text-green-500 text-xs">✓</span>
                          )}
                        </div>
                        <div className="text-gray-500 text-xs">{user.phone || '-'}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="space-y-1">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                        <div>
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${getNivelBadge(user.nivelCliente)}`}>
                            {user.nivelCliente}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(user.estado)}`}>
                        {user.estado}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-sm">
                        <div className="font-medium">{user.totalCompras} pedidos</div>
                        <div className="text-gray-500 text-xs">{formatPrice(user.totalGastado)}</div>
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="text-xs text-gray-500">{formatDate(user.createdAt)}</div>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex gap-1">
                        <button
                          onClick={() => navigate(`/admin/usuarios/${user.id}`)}
                          className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          title="Ver detalle"
                        >
                          <Eye size={16} />
                        </button>
                        {user.estado === 'BLOQUEADO' ? (
                          <button
                            onClick={() => setUnblockModal({ open: true, user })}
                            className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded"
                            title="Desbloquear"
                          >
                            <Unlock size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => setBlockModal({ open: true, user, motivo: '' })}
                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            title="Bloquear"
                            disabled={user.role === 'SUPER_ADMIN'}
                          >
                            <Ban size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {(page - 1) * 10 + 1} a {Math.min(page * 10, total)} de {total}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn btn-neutral text-sm disabled:opacity-50"
              >
                Anterior
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn btn-neutral text-sm disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Block Modal */}
      {blockModal.open && blockModal.user && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bloquear Usuario</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de bloquear a <strong>{blockModal.user.name}</strong>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Motivo del bloqueo *</label>
              <textarea
                value={blockModal.motivo}
                onChange={(e) => setBlockModal((prev) => ({ ...prev, motivo: e.target.value }))}
                className="input-field w-full"
                rows={3}
                placeholder="Ingresa el motivo del bloqueo..."
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setBlockModal({ open: false, user: null, motivo: '' })}
                className="btn btn-neutral"
              >
                Cancelar
              </button>
              <button onClick={handleBlockUser} className="btn btn-danger">
                Bloquear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Unblock Modal */}
      <ConfirmModal
        isOpen={unblockModal.open}
        onClose={() => setUnblockModal({ open: false, user: null })}
        onConfirm={handleUnblockUser}
        title="Desbloquear Usuario"
        message={`¿Estás seguro de desbloquear a ${unblockModal.user?.name}?`}
        confirmText="Desbloquear"
        confirmVariant="primary"
      />

      {/* Create User Modal */}
      {createModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Agregar Usuario</h3>
              <button
                onClick={() => setCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))}
                  className="input-field w-full"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña *</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))}
                  className="input-field w-full"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="tel"
                  value={newUser.phone || ''}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, phone: e.target.value }))}
                  className="input-field w-full"
                  placeholder="3001234567"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select
                  value={newUser.role || 'CLIENTE'}
                  onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="CLIENTE">Cliente</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setCreateModal(false)}
                className="btn btn-neutral"
                disabled={creating}
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateUser}
                className="btn btn-primary"
                disabled={creating}
              >
                {creating ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
