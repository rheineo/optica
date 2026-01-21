import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Clock,
  MessageSquare,
  XCircle,
  CheckCircle,
  Send,
} from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { OrderDetail } from '../../api/admin';
import { formatPrice } from '../../utils/formatters';
import { ConfirmModal } from '../../components/ui';
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

const TRANSICIONES_PERMITIDAS: Record<string, string[]> = {
  PENDIENTE_PAGO: ['PAGADO', 'CANCELADO'],
  PAGADO: ['PROCESANDO', 'CANCELADO'],
  PROCESANDO: ['LISTO_PARA_ENVIO', 'CANCELADO'],
  LISTO_PARA_ENVIO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['EN_DISTRIBUCION', 'ENTREGADO'],
  EN_DISTRIBUCION: ['ENTREGADO', 'DEVOLUCION'],
  ENTREGADO: ['DEVOLUCION'],
  DEVOLUCION: ['REEMBOLSADO'],
};

function getEstadoStyle(estado: string) {
  return ESTADOS_PEDIDO.find((e) => e.value === estado)?.color || 'bg-gray-100 text-gray-800';
}

function getEstadoLabel(estado: string) {
  return ESTADOS_PEDIDO.find((e) => e.value === estado)?.label || estado;
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

function getMetodoPagoLabel(metodo: string) {
  const metodos: Record<string, string> = {
    TARJETA_CREDITO: 'Tarjeta de Crédito',
    TARJETA_DEBITO: 'Tarjeta de Débito',
    PSE: 'PSE',
    EFECTIVO_CONTRAENTREGA: 'Contraentrega',
    TRANSFERENCIA: 'Transferencia',
  };
  return metodos[metodo] || metodo;
}

export function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    transportadora: '',
    numeroGuia: '',
    fechaEstimadaEntrega: '',
  });
  const [newNote, setNewNote] = useState('');

  const fetchOrder = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await adminApi.getOrder(id);
      if (response.success && response.data) {
        setOrder(response.data);
        setShippingInfo({
          transportadora: response.data.envio.transportadora || '',
          numeroGuia: response.data.envio.numeroGuia || '',
          fechaEstimadaEntrega: response.data.envio.fechaEstimada?.split('T')[0] || '',
        });
      }
    } catch (error) {
      toast.error('Error al cargar el pedido');
      navigate('/admin/pedidos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async () => {
    if (!order || !newStatus) return;

    setIsUpdating(true);
    try {
      const payload: any = {
        nuevoEstado: newStatus,
        notificarCliente: true,
        notasInternas: statusNotes || undefined,
      };

      if (newStatus === 'ENVIADO') {
        payload.transportadora = shippingInfo.transportadora;
        payload.numeroGuia = shippingInfo.numeroGuia;
        payload.fechaEstimadaEntrega = shippingInfo.fechaEstimadaEntrega;
      }

      const response = await adminApi.updateOrderStatus(order.id, payload);
      if (response.success) {
        toast.success('Estado actualizado');
        fetchOrder();
        setShowStatusModal(false);
        setNewStatus('');
        setStatusNotes('');
      }
    } catch (error) {
      toast.error('Error al actualizar estado');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order || !cancelReason) return;

    setIsUpdating(true);
    try {
      const response = await adminApi.cancelOrder(order.id, {
        motivo: cancelReason,
        reembolsar: order.pago.estado === 'APROBADO',
        notificarCliente: true,
      });
      if (response.success) {
        toast.success('Pedido cancelado');
        fetchOrder();
        setShowCancelModal(false);
        setCancelReason('');
      }
    } catch (error) {
      toast.error('Error al cancelar pedido');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddNote = async () => {
    if (!order || !newNote.trim()) return;

    try {
      const response = await adminApi.addOrderNotes(order.id, newNote);
      if (response.success) {
        toast.success('Nota agregada');
        fetchOrder();
        setNewNote('');
      }
    } catch (error) {
      toast.error('Error al agregar nota');
    }
  };

  const getAvailableTransitions = () => {
    if (!order) return [];
    return TRANSICIONES_PERMITIDAS[order.estados.actual] || [];
  };

  if (isLoading) {
    return (
      <div className="p-3 md:p-4 lg:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg p-4 h-48" />
              <div className="bg-white rounded-lg p-4 h-64" />
            </div>
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 h-40" />
              <div className="bg-white rounded-lg p-4 h-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Pedido no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin/pedidos')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a pedidos
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Pedido #{order.numero}
            </h1>
            <p className="text-gray-500 text-sm">
              Creado el {formatDate(order.timestamps.createdAt)}
            </p>
          </div>
          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getEstadoStyle(order.estados.actual)}`}>
            {getEstadoLabel(order.estados.actual)}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Products */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">
                Productos ({order.items.length})
              </h2>
            </div>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 p-2 bg-gray-50 rounded-lg">
                  <img
                    src={item.producto.imagen || `https://placehold.co/60x60/e2e8f0/64748b?text=${item.producto.nombre.charAt(0)}`}
                    alt={item.producto.nombre}
                    className="w-14 h-14 object-cover rounded border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{item.producto.nombre}</p>
                    <p className="text-xs text-gray-500">SKU: {item.producto.sku}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-600">
                        {item.cantidad} x {formatPrice(item.precioUnitario)}
                      </span>
                      <span className="font-semibold text-sm">{formatPrice(item.subtotal)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Totals */}
            <div className="border-t border-gray-200 mt-4 pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(order.montos.subtotal)}</span>
              </div>
              {order.montos.descuento > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento</span>
                  <span>-{formatPrice(order.montos.descuento)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Envío</span>
                <span>{formatPrice(order.montos.costoEnvio)}</span>
              </div>
              <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>{formatPrice(order.montos.total)}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Historial</h2>
            </div>
            <div className="space-y-3">
              {order.estados.historial.length === 0 ? (
                <p className="text-gray-500 text-sm">Sin historial de cambios</p>
              ) : (
                order.estados.historial.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${index === order.estados.historial.length - 1 ? 'bg-indigo-500' : 'bg-gray-300'}`} />
                      {index < order.estados.historial.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getEstadoStyle(item.estado)}`}>
                          {getEstadoLabel(item.estado)}
                        </span>
                        <span className="text-xs text-gray-500">{formatDate(item.fecha)}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">Por: {item.usuario}</p>
                      {item.notas && <p className="text-xs text-gray-500 mt-1">{item.notas}</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Notas Internas</h2>
            </div>
            {order.notas.internas && (
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">{order.notas.internas}</pre>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Agregar nota interna..."
                className="input flex-1"
              />
              <button onClick={handleAddNote} className="btn btn-primary">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Acciones</h2>
            <div className="space-y-2">
              {getAvailableTransitions().length > 0 && (
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="btn btn-primary w-full"
                >
                  <CheckCircle className="w-4 h-4" />
                  Cambiar Estado
                </button>
              )}
              {!['CANCELADO', 'ENTREGADO', 'REEMBOLSADO'].includes(order.estados.actual) && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="btn btn-secondary w-full"
                >
                  <XCircle className="w-4 h-4" />
                  Cancelar Pedido
                </button>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Cliente</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">{order.cliente.nombre}</p>
              <p className="text-gray-600">{order.cliente.email}</p>
              {order.cliente.telefono && <p className="text-gray-600">{order.cliente.telefono}</p>}
              <p className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                {order.cliente.totalCompras} compras realizadas
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Dirección de Envío</h2>
            </div>
            <div className="space-y-1 text-sm">
              <p className="font-medium text-gray-900">{order.direccionEnvio.nombre}</p>
              <p className="text-gray-600">{order.direccionEnvio.direccion}</p>
              <p className="text-gray-600">
                {order.direccionEnvio.ciudad}
                {order.direccionEnvio.departamento && `, ${order.direccionEnvio.departamento}`}
              </p>
              <p className="text-gray-600">{order.direccionEnvio.telefono}</p>
              {order.direccionEnvio.instrucciones && (
                <p className="text-xs text-gray-500 pt-2 border-t border-gray-100 mt-2">
                  {order.direccionEnvio.instrucciones}
                </p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-gray-400" />
              <h2 className="text-base font-semibold text-gray-900">Pago</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Método</span>
                <span className="font-medium">{getMetodoPagoLabel(order.pago.metodo)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estado</span>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  order.pago.estado === 'APROBADO' ? 'bg-green-100 text-green-800' :
                  order.pago.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.pago.estado}
                </span>
              </div>
              {order.pago.fechaPago && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha</span>
                  <span className="text-xs">{formatDate(order.pago.fechaPago)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          {order.envio.transportadora && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Truck className="w-5 h-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">Envío</h2>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transportadora</span>
                  <span className="font-medium">{order.envio.transportadora}</span>
                </div>
                {order.envio.numeroGuia && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guía</span>
                    <span className="font-mono text-xs">{order.envio.numeroGuia}</span>
                  </div>
                )}
                {order.envio.fechaEstimada && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entrega estimada</span>
                    <span className="text-xs">{formatDate(order.envio.fechaEstimada)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Customer Notes */}
          {order.notas.cliente && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-gray-400" />
                <h2 className="text-base font-semibold text-gray-900">Notas del Cliente</h2>
              </div>
              <p className="text-sm text-gray-600">{order.notas.cliente}</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Cambiar Estado</h3>
            </div>
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nuevo Estado</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input"
                >
                  <option value="">Seleccionar estado</option>
                  {getAvailableTransitions().map((estado) => (
                    <option key={estado} value={estado}>
                      {getEstadoLabel(estado)}
                    </option>
                  ))}
                </select>
              </div>

              {newStatus === 'ENVIADO' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transportadora</label>
                    <input
                      type="text"
                      value={shippingInfo.transportadora}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, transportadora: e.target.value })}
                      className="input"
                      placeholder="Ej: Servientrega"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Número de Guía</label>
                    <input
                      type="text"
                      value={shippingInfo.numeroGuia}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, numeroGuia: e.target.value })}
                      className="input"
                      placeholder="Ej: 123456789"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Estimada Entrega</label>
                    <input
                      type="date"
                      value={shippingInfo.fechaEstimadaEntrega}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, fechaEstimadaEntrega: e.target.value })}
                      className="input"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas (opcional)</label>
                <textarea
                  value={statusNotes}
                  onChange={(e) => setStatusNotes(e.target.value)}
                  className="input"
                  rows={2}
                  placeholder="Notas internas sobre el cambio..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setNewStatus('');
                  setStatusNotes('');
                }}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={!newStatus || isUpdating}
                className="btn btn-primary disabled:opacity-50"
              >
                {isUpdating ? 'Actualizando...' : 'Actualizar Estado'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      <ConfirmModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setCancelReason('');
        }}
        onConfirm={handleCancelOrder}
        title="Cancelar Pedido"
        message={`¿Estás seguro de cancelar el pedido #${order.numero}? Esta acción no se puede deshacer.`}
        confirmText="Cancelar Pedido"
        cancelText="Volver"
        isLoading={isUpdating}
        variant="danger"
      />
    </div>
  );
}
