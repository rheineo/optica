import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus, Check, Shield, Truck, RotateCcw } from 'lucide-react';
import { productsApi } from '../api/products';
import type { Product } from '../types';
import { formatPrice, getCategoryLabel } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await productsApi.getById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Inicia sesión para agregar al carrito');
      return;
    }
    if (!product) return;
    await addToCart(product.id, quantity);
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-32 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="aspect-square bg-gray-300 rounded-2xl" />
              <div className="space-y-4">
                <div className="h-4 bg-gray-300 rounded w-24" />
                <div className="h-8 bg-gray-300 rounded w-3/4" />
                <div className="h-4 bg-gray-300 rounded w-1/2" />
                <div className="h-10 bg-gray-300 rounded w-1/3 mt-8" />
                <div className="h-32 bg-gray-300 rounded mt-8" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-200">
            <h1 className="text-2xl font-bold text-[#0a0c10] mb-4">Producto no encontrado</h1>
            <Link 
              to="/productos" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a0c10] text-[#FFD700] font-semibold rounded-lg hover:bg-[#1a1c20] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const finalPrice = product.descuento
    ? product.precio * (1 - product.descuento / 100)
    : product.precio;

  const placeholderImage = `https://placehold.co/600x600/0a0c10/FFD700?text=${encodeURIComponent(product.marca)}`;
  const images = product.imagenes?.length > 0 ? product.imagenes : [placeholderImage];

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-4">
          <ol className="flex items-center space-x-2 text-sm flex-wrap">
            <li>
              <Link to="/" className="text-gray-500 hover:text-[#996600] transition-colors">
                Inicio
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/productos" className="text-gray-500 hover:text-[#996600] transition-colors">
                Productos
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link
                to={`/productos?categoria=${product.categoria}`}
                className="text-gray-500 hover:text-[#996600] transition-colors"
              >
                {getCategoryLabel(product.categoria)}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-[#0a0c10] font-medium truncate max-w-[200px]">
              {product.nombre}
            </li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          {/* Images */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 md:p-4">
            <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden mb-2">
              <img
                src={images[selectedImage]}
                alt={product.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = placeholderImage;
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === i ? 'border-[#FFD700] shadow-md' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.nombre} ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-5">
              <span className="inline-block px-2 py-0.5 bg-[#FFD700]/20 text-[#996600] text-xs font-semibold rounded-full uppercase tracking-wide mb-2">
                {product.marca}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-[#0a0c10] mb-1">{product.nombre}</h1>
              <p className="text-gray-500 text-sm mb-3">{getCategoryLabel(product.categoria)}</p>

              {/* Price */}
              <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                {product.descuento && product.descuento > 0 ? (
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-2xl font-bold text-[#0a0c10]">
                      {formatPrice(finalPrice)}
                    </span>
                    <span className="text-lg text-gray-400 line-through">
                      {formatPrice(product.precio)}
                    </span>
                    <span className="bg-[#FFD700] text-[#0a0c10] text-sm font-bold px-3 py-1 rounded-full">
                      -{product.descuento}% OFF
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl font-bold text-[#0a0c10]">
                    {formatPrice(product.precio)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="mb-3">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="w-5 h-5" />
                    <span className="font-medium">En stock ({product.stock} disponibles)</span>
                  </div>
                ) : (
                  <span className="text-red-600 font-medium">Agotado</span>
                )}
              </div>

              {/* Quantity */}
              {product.stock > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="w-12 text-center text-lg font-bold text-[#0a0c10]">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-all"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full py-3 bg-[#0a0c10] text-[#FFD700] font-bold rounded-lg hover:bg-[#1a1c20] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
              </button>

              {/* Trust Badges */}
              <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Shield className="w-6 h-6 text-[#996600] mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Garantía</span>
                </div>
                <div className="text-center">
                  <Truck className="w-6 h-6 text-[#996600] mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Envío Gratis</span>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-6 h-6 text-[#996600] mx-auto mb-1" />
                  <span className="text-xs text-gray-600">Devoluciones</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <h2 className="text-base font-bold text-[#0a0c10] mb-2">Descripción</h2>
              <p className="text-gray-600 leading-relaxed">{product.descripcion}</p>
            </div>

            {/* Characteristics */}
            {product.caracteristicas && Object.keys(product.caracteristicas).length > 0 && (
              <div className="mt-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
                <h2 className="text-base font-bold text-[#0a0c10] mb-2">Características</h2>
                <dl className="grid grid-cols-2 gap-2">
                  {Object.entries(product.caracteristicas).map(([key, value]) => (
                    <div key={key} className="p-2 bg-gray-50 rounded-lg">
                      <dt className="text-sm text-gray-500 capitalize mb-1">
                        {key.replace(/_/g, ' ')}
                      </dt>
                      <dd className="text-[#0a0c10] font-semibold">
                        {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* SKU */}
            <div className="mt-3 text-center text-xs text-gray-500">
              SKU: <span className="font-medium">{product.sku}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
