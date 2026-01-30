import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatters';

export function Cart() {
  const { cart, isLoading, updateQuantity, removeFromCart, clearCart, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-[#0a0c10] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-[#FFD700]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0a0c10] mb-3">Inicia sesión para ver tu carrito</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Necesitas iniciar sesión para agregar productos a tu carrito y realizar compras.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#0a0c10] text-[#FFD700] font-semibold rounded-lg hover:bg-[#1a1c20] transition-colors"
            >
              Iniciar Sesión
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-300 rounded w-48" />
            <div className="h-40 bg-gray-300 rounded-2xl" />
            <div className="h-40 bg-gray-300 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-200">
            <div className="w-20 h-20 bg-[#0a0c10] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[#FFD700]" />
            </div>
            <h1 className="text-3xl font-bold text-[#0a0c10] mb-3">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Parece que aún no has agregado productos a tu carrito. ¡Explora nuestra colección!
            </p>
            <Link 
              to="/productos" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-[#FFD700] text-[#0a0c10] font-semibold rounded-lg hover:bg-[#e6c200] transition-colors"
            >
              Explorar Catálogo
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#0a0c10]">Tu Carrito</h1>
            <p className="text-gray-600 mt-1">{cart.items.length} {cart.items.length === 1 ? 'producto' : 'productos'}</p>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
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
              const placeholderImage = `https://placehold.co/120x120/0a0c10/FFD700?text=${encodeURIComponent(item.product.marca)}`;

              return (
                <div key={item.id} className="bg-white rounded-2xl shadow-md border border-gray-200 p-4 md:p-6 flex gap-4 md:gap-6 hover:shadow-lg transition-shadow">
                  <Link to={`/producto/${item.product.id}`} className="flex-shrink-0">
                    <img
                      src={item.product.imagenes?.[0] || placeholderImage}
                      alt={item.product.nombre}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-xl border border-gray-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = placeholderImage;
                      }}
                    />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/producto/${item.product.id}`}
                      className="font-semibold text-[#0a0c10] hover:text-[#996600] line-clamp-2 text-lg transition-colors"
                    >
                      {item.product.nombre}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{item.product.marca}</p>
                    
                    {item.product.descuento && (
                      <span className="inline-block mt-2 px-2 py-1 bg-[#FFD700]/20 text-[#996600] text-xs font-semibold rounded">
                        -{item.product.descuento}% OFF
                      </span>
                    )}
                    
                    <div className="mt-4 flex items-center gap-4">
                      <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                        </button>
                        <span className="px-4 font-semibold text-[#0a0c10] min-w-[40px] text-center">{item.cantidad}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.product.stock}
                          className="p-2 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                        >
                          <Plus className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-xl text-[#0a0c10]">
                        {formatPrice(finalPrice * item.cantidad)}
                      </p>
                      {item.cantidad > 1 && (
                        <p className="text-sm text-gray-500 mt-1">
                          {formatPrice(finalPrice)} c/u
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a0c10] rounded-2xl shadow-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">Resumen del Pedido</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal ({cart.items.length} productos)</span>
                  <span className="text-white">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Envío</span>
                  <span className="text-[#FFD700] font-medium">Gratis</span>
                </div>
                <div className="border-t border-gray-700 pt-4 flex justify-between">
                  <span className="text-white font-semibold">Total</span>
                  <span className="text-2xl font-bold text-[#FFD700]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button className="w-full py-4 bg-[#FFD700] text-[#0a0c10] font-bold rounded-lg hover:bg-[#e6c200] transition-colors mb-4 flex items-center justify-center gap-2">
                Proceder al Pago
                <ArrowRight className="w-5 h-5" />
              </button>

              <Link
                to="/productos"
                className="block text-center text-gray-400 hover:text-[#FFD700] text-sm font-medium transition-colors"
              >
                Continuar Comprando
              </Link>
              
              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-center gap-4 text-gray-500 text-xs">
                  <span>🔒 Pago Seguro</span>
                  <span>🚚 Envío Gratis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
