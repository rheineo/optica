import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../../types';
import { formatPrice, getCategoryLabel } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar al carrito');
      return;
    }
    await addToCart(product.id);
  };

  const finalPrice = product.descuento
    ? product.precio * (1 - product.descuento / 100)
    : product.precio;

  const placeholderImage = `https://placehold.co/400x300/e2e8f0/64748b?text=${encodeURIComponent(product.marca)}`;

  return (
    <div className="card group overflow-hidden">
      <Link to={`/producto/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={product.imagenes?.[0] || placeholderImage}
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholderImage;
            }}
          />
          {product.descuento && product.descuento > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              -{product.descuento}%
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">
              ¡Últimas unidades!
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute top-2 right-2 bg-gray-500 text-white text-xs font-bold px-2 py-1 rounded">
              Agotado
            </span>
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
            <Link
              to={`/producto/${product.id}`}
              className="bg-white text-gray-900 p-3 rounded-full hover:bg-primary-600 hover:text-white transition-colors"
            >
              <Eye className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <span className="text-xs text-primary-600 font-medium uppercase tracking-wide">
          {product.marca}
        </span>
        <Link to={`/producto/${product.id}`}>
          <h3 className="mt-1 text-gray-900 font-medium line-clamp-2 hover:text-primary-600 transition-colors">
            {product.nombre}
          </h3>
        </Link>
        <p className="text-xs text-gray-500 mt-1">
          {getCategoryLabel(product.categoria)}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <div>
            {product.descuento && product.descuento > 0 ? (
              <>
                <span className="text-lg font-bold text-primary-600">
                  {formatPrice(finalPrice)}
                </span>
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {formatPrice(product.precio)}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-primary-600">
                {formatPrice(product.precio)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
