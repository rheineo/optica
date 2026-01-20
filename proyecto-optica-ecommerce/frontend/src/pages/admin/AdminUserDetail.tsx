import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  DollarSign,
  Edit,
  Ban,
  Unlock,
  Key,
  Trash2,
  CheckCircle,
  Crown,
  Clock,
  MapPin,
  Save,
  X,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { UserDetail } from '../../api/admin';
import { formatPrice } from '../../utils/formatters';
import toast from 'react-hot-toast';
import { ConfirmModal } from '../../components/ui';

export function AdminUserDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'pedidos' | 'seguridad'>('general');

  // Estados para modales
  const [blockModal, setBlockModal] = useState<{ open: boolean; motivo: string }>({ open: false, motivo: '' });
  const [unblockModal, setUnblockModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [resetPasswordModal, setResetPasswordModal] = useState(false);

  // Estado para edición
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    nivelCliente: '',
    etiquetas: [] as string[],
  });

  // Estado para notas
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const fetchUser = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await adminApi.getUser(id);
      if (response.success && response.data) {
        setUser(response.data);
        setEditData({
          name: response.data.perfil.name,
          phone: response.data.perfil.phone || '',
          nivelCliente: response.data.perfil.nivelCliente,
          etiquetas: response.data.perfil.etiquetas || [],
        });
      }
    } catch (error) {
      toast.error('Error al cargar usuario');
      navigate('/admin/usuarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSaveEdit = async () => {
    if (!id) return;
    try {
      await adminApi.updateUser(id, editData);
      toast.success('Usuario actualizado');
      setEditMode(false);
      fetchUser();
    } catch (error) {
      toast.error('Error al actualizar usuario');
    }
  };

  const handleBlockUser = async () => {
    if (!id || !blockModal.motivo.trim()) {
      toast.error('Debes ingresar un motivo');
      return;
    }
    try {
      await adminApi.blockUser(id, blockModal.motivo);
      toast.success('Usuario bloqueado');
      setBlockModal({ open: false, motivo: '' });
      fetchUser();
    } catch (error) {
      toast.error('Error al bloquear usuario');
    }
  };

  const handleUnblockUser = async () => {
    if (!id) return;
    try {
      await adminApi.unblockUser(id);
      toast.success('Usuario desbloqueado');
      setUnblockModal(false);
      fetchUser();
    } catch (error) {
      toast.error('Error al desbloquear usuario');
    }
  };

  const handleResetPassword = async () => {
    if (!id) return;
    try {
      const response = await adminApi.resetUserPassword(id);
      if (response.success && response.data) {
        toast.success(`Contraseña temporal: ${response.data.tempPassword}`);
      }
      setResetPasswordModal(false);
    } catch (error) {
      toast.error('Error al resetear contraseña');
    }
  };

  const handleDeleteUser = async () => {
    if (!id) return;
    try {
      await adminApi.deleteUser(id);
      toast.success('Usuario eliminado');
      navigate('/admin/usuarios');
    } catch (error) {
      toast.error('Error al eliminar usuario');
    }
  };

  const handleAddNote = async () => {
    if (!id || !newNote.trim()) return;
    try {
      setSavingNote(true);
      await adminApi.addUserNotes(id, newNote);
      toast.success('Nota agregada');
      setNewNote('');
      fetchUser();
    } catch (error) {
      toast.error('Error al agregar nota');
    } finally {
      setSavingNote(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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

  const getOrderStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDIENTE_PAGO: 'bg-yellow-100 text-yellow-800',
      PAGADO: 'bg-blue-100 text-blue-800',
      PROCESANDO: 'bg-indigo-100 text-indigo-800',
      ENVIADO: 'bg-purple-100 text-purple-800',
      ENTREGADO: 'bg-green-100 text-green-800',
      CANCELADO: 'bg-red-100 text-red-800',
    };
    return styles[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Usuario no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin/usuarios')}
          className="flex items-center gap-1 text-gray-600 hover:text-gray-900 mb-3"
        >
          <ArrowLeft size={18} />
          <span className="text-sm">Volver a usuarios</span>
        </button>

        <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-2xl">
                  {user.perfil.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{user.perfil.name}</h1>
                  {user.perfil.etiquetas?.includes('VIP') && (
                    <Crown className="w-5 h-5 text-yellow-500" />
                  )}
                </div>
                <p className="text-gray-600">{user.perfil.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.perfil.role)}`}>
                    {user.perfil.role}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getEstadoBadge(user.perfil.estado)}`}>
                    {user.perfil.estado}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => setEditMode(true)} className="btn btn-neutral flex items-center gap-1">
                <Edit size={16} />
                Editar
              </button>
              {user.perfil.estado === 'BLOQUEADO' ? (
                <button onClick={() => setUnblockModal(true)} className="btn btn-primary flex items-center gap-1">
                  <Unlock size={16} />
                  Desbloquear
                </button>
              ) : (
                <button
                  onClick={() => setBlockModal({ open: true, motivo: '' })}
                  className="btn btn-danger flex items-center gap-1"
                  disabled={user.perfil.role === 'SUPER_ADMIN'}
                >
                  <Ban size={16} />
                  Bloquear
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500">Total Compras</p>
              <p className="text-xl font-bold text-gray-900">{user.estadisticas.totalCompras}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Gastado</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(user.estadisticas.totalGastado)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Promedio</p>
              <p className="text-xl font-bold text-gray-900">{formatPrice(user.estadisticas.pedidoPromedio)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Cliente desde</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(user.estadisticas.clienteDesde)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-4">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'general'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('pedidos')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'pedidos'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pedidos ({user.estadisticas.totalCompras})
          </button>
          <button
            onClick={() => setActiveTab('seguridad')}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              activeTab === 'seguridad'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Seguridad
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Info Personal */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="text-sm font-medium">{user.perfil.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <div className="flex items-center gap-1">
                  <Mail size={14} className="text-gray-400" />
                  <p className="text-sm">{user.perfil.email}</p>
                  {user.verificaciones.emailVerified && (
                    <CheckCircle size={14} className="text-green-500" />
                  )}
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Teléfono</p>
                <div className="flex items-center gap-1">
                  <Phone size={14} className="text-gray-400" />
                  <p className="text-sm">{user.perfil.phone || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Nivel Cliente</p>
                <p className="text-sm font-medium">{user.perfil.nivelCliente}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Última Compra</p>
                <p className="text-sm">{formatDate(user.estadisticas.ultimaCompra)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Registro</p>
                <p className="text-sm">{formatDate(user.timestamps.createdAt)}</p>
              </div>
            </div>

            {/* Etiquetas */}
            {user.perfil.etiquetas && user.perfil.etiquetas.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-2">Etiquetas</p>
                <div className="flex flex-wrap gap-1">
                  {user.perfil.etiquetas.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Direcciones */}
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Direcciones</h3>
            {user.direcciones && user.direcciones.length > 0 ? (
              <div className="space-y-3">
                {user.direcciones.map((dir) => (
                  <div key={dir.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gray-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{dir.nombre}</p>
                        <p className="text-xs text-gray-600">{dir.direccion}</p>
                        <p className="text-xs text-gray-500">{dir.ciudad}</p>
                        {dir.esDefault && (
                          <span className="text-xs text-indigo-600">Principal</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Sin direcciones</p>
            )}
          </div>

          {/* Notas Internas */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Notas Internas (solo admin)</h3>
            {user.admin.notasInternas && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3 whitespace-pre-wrap text-sm text-gray-700">
                {user.admin.notasInternas}
              </div>
            )}
            <div className="flex gap-2">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Agregar nueva nota..."
                className="input-field flex-1"
                rows={2}
              />
              <button
                onClick={handleAddNote}
                disabled={!newNote.trim() || savingNote}
                className="btn btn-primary self-end"
              >
                {savingNote ? '...' : 'Agregar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pedidos' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {user.pedidosRecientes && user.pedidosRecientes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Pedido</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {user.pedidosRecientes.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <Link
                          to={`/admin/pedidos/${order.id}`}
                          className="text-indigo-600 hover:underline font-medium text-sm"
                        >
                          {order.numero}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-600">{formatDate(order.fecha)}</td>
                      <td className="px-4 py-2 text-sm">{order.itemsCount} items</td>
                      <td className="px-4 py-2 text-sm font-medium">{formatPrice(order.total)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getOrderStatusBadge(order.estadoPedido)}`}>
                          {order.estadoPedido}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <Link
                          to={`/admin/pedidos/${order.id}`}
                          className="btn btn-neutral text-xs"
                        >
                          Ver
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Sin pedidos registrados</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'seguridad' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Información de Sesiones</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Último acceso</span>
                <span className="text-sm font-medium">{formatDateTime(user.seguridad.lastLogin)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Intentos fallidos</span>
                <span className="text-sm font-medium">{user.seguridad.loginAttempts}</span>
              </div>
              {user.seguridad.blockedAt && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Bloqueado</span>
                    <span className="text-sm font-medium text-red-600">{formatDateTime(user.seguridad.blockedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Motivo</span>
                    <span className="text-sm">{user.seguridad.motivoBloqueo}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Acciones de Seguridad</h3>
            <div className="space-y-2">
              <button
                onClick={() => setResetPasswordModal(true)}
                className="btn btn-neutral w-full flex items-center justify-center gap-2"
              >
                <Key size={16} />
                Resetear Contraseña
              </button>
              {user.perfil.estado === 'BLOQUEADO' ? (
                <button
                  onClick={() => setUnblockModal(true)}
                  className="btn btn-primary w-full flex items-center justify-center gap-2"
                >
                  <Unlock size={16} />
                  Desbloquear Usuario
                </button>
              ) : (
                <button
                  onClick={() => setBlockModal({ open: true, motivo: '' })}
                  className="btn btn-danger w-full flex items-center justify-center gap-2"
                  disabled={user.perfil.role === 'SUPER_ADMIN'}
                >
                  <Ban size={16} />
                  Bloquear Usuario
                </button>
              )}
              {user.perfil.role === 'CLIENTE' && (
                <button
                  onClick={() => setDeleteModal(true)}
                  className="btn btn-danger w-full flex items-center justify-center gap-2"
                >
                  <Trash2 size={16} />
                  Eliminar Usuario
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Editar Usuario</h3>
              <button onClick={() => setEditMode(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData((prev) => ({ ...prev, name: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={editData.phone}
                  onChange={(e) => setEditData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="input-field w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nivel Cliente</label>
                <select
                  value={editData.nivelCliente}
                  onChange={(e) => setEditData((prev) => ({ ...prev, nivelCliente: e.target.value }))}
                  className="input-field w-full"
                >
                  <option value="NUEVO">Nuevo</option>
                  <option value="REGULAR">Regular</option>
                  <option value="FRECUENTE">Frecuente</option>
                  <option value="VIP">VIP</option>
                  <option value="PLATINUM">Platinum</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditMode(false)} className="btn btn-neutral">
                Cancelar
              </button>
              <button onClick={handleSaveEdit} className="btn btn-primary flex items-center gap-1">
                <Save size={16} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Block Modal */}
      {blockModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bloquear Usuario</h3>
            <p className="text-gray-600 mb-4">
              ¿Estás seguro de bloquear a <strong>{user.perfil.name}</strong>?
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
              <button onClick={() => setBlockModal({ open: false, motivo: '' })} className="btn btn-neutral">
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
        isOpen={unblockModal}
        onClose={() => setUnblockModal(false)}
        onConfirm={handleUnblockUser}
        title="Desbloquear Usuario"
        message={`¿Estás seguro de desbloquear a ${user.perfil.name}?`}
        confirmText="Desbloquear"
        confirmVariant="primary"
      />

      {/* Reset Password Modal */}
      <ConfirmModal
        isOpen={resetPasswordModal}
        onClose={() => setResetPasswordModal(false)}
        onConfirm={handleResetPassword}
        title="Resetear Contraseña"
        message={`Se generará una contraseña temporal para ${user.perfil.name}. ¿Continuar?`}
        confirmText="Resetear"
        confirmVariant="primary"
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Eliminar Usuario"
        message={`¿Estás seguro de eliminar a ${user.perfil.name}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        confirmVariant="danger"
      />
    </div>
  );
}
