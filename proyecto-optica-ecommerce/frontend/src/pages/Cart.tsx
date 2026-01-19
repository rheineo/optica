import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

export function Cart() {
  const { cart, isLoading, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Inicia sesión para ver tu carrito</h1>
        <p className="text-gray-600 mb-8">
          Necesitas iniciar sesión para agregar productos a tu carrito.
        </p>
        <Link to="/login" className="btn-primary inline-flex items-center gap-2">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="h-32 bg-gray-200 rounded" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8">
          Parece que aún no has agregado productos a tu carrito.
        </p>
        <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Explorar Productos
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Vaciar carrito
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => {
            const finalPrice = item.product.descuento
              ? item.product.precio * (1 - item.product.descuento / 100)
              : item.product.precio;
            const placeholderImage = `https://placehold.co/120x120/e2e8f0/64748b?text=${encodeURIComponent(item.product.marca)}`;

            return (
              <div key={item.id} className="bg-white rounded-xl shadow-sm p-4 flex gap-4">
                <Link to={`/producto/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product.imagenes?.[0] || placeholderImage}
                    alt={item.product.nombre}
                    className="w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = placeholderImage;
                    }}
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/producto/${item.product.id}`}
                    className="font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                  >
                    {item.product.nombre}
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">{item.product.marca}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="flex items-center border rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-3 font-medium">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        disabled={item.cantidad >= item.product.stock}
                        className="p-2 hover:bg-gray-100 disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary-600">
                    {formatPrice(finalPrice * item.cantidad)}
                  </p>
                  {item.cantidad > 1 && (
                    <p className="text-sm text-gray-500">
                      {formatPrice(finalPrice)} c/u
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen del Pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cart.items.length} productos)</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Envío</span>
                <span className="text-green-600">Gratis</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-600">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <button className="w-full btn-primary mb-4">
              Proceder al Pago
            </button>

            <Link
              to="/productos"
              className="block text-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Continuar Comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
