import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Minus, Plus, Check } from 'lucide-react';
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-32 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-square bg-gray-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-8" />
              <div className="h-32 bg-gray-200 rounded mt-8" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h1>
        <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const finalPrice = product.descuento
    ? product.precio * (1 - product.descuento / 100)
    : product.precio;

  const placeholderImage = `https://placehold.co/600x600/e2e8f0/64748b?text=${encodeURIComponent(product.marca)}`;
  const images = product.imagenes?.length > 0 ? product.imagenes : [placeholderImage];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm">
          <li>
            <Link to="/" className="text-gray-500 hover:text-primary-600">
              Inicio
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link to="/productos" className="text-gray-500 hover:text-primary-600">
              Productos
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li>
            <Link
              to={`/productos?categoria=${product.categoria}`}
              className="text-gray-500 hover:text-primary-600"
            >
              {getCategoryLabel(product.categoria)}
            </Link>
          </li>
          <li className="text-gray-400">/</li>
          <li className="text-gray-900 font-medium truncate max-w-[200px]">
            {product.nombre}
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
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
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === i ? 'border-primary-600' : 'border-transparent'
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
          <span className="text-sm text-primary-600 font-medium uppercase tracking-wide">
            {product.marca}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">{product.nombre}</h1>
          <p className="text-gray-500 mb-4">{getCategoryLabel(product.categoria)}</p>

          {/* Price */}
          <div className="mb-6">
            {product.descuento && product.descuento > 0 ? (
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary-600">
                  {formatPrice(finalPrice)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(product.precio)}
                </span>
                <span className="bg-red-100 text-red-600 text-sm font-medium px-2 py-1 rounded">
                  -{product.descuento}%
                </span>
              </div>
            ) : (
              <span className="text-3xl font-bold text-primary-600">
                {formatPrice(product.precio)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <div className="flex items-center gap-2 text-green-600">
                <Check className="w-5 h-5" />
                <span>En stock ({product.stock} disponibles)</span>
              </div>
            ) : (
              <span className="text-red-600">Agotado</span>
            )}
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-5 h-5" />
            {product.stock > 0 ? 'Agregar al Carrito' : 'Agotado'}
          </button>

          {/* Description */}
          <div className="mt-8 pt-8 border-t">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
            <p className="text-gray-600 leading-relaxed">{product.descripcion}</p>
          </div>

          {/* Characteristics */}
          {product.caracteristicas && Object.keys(product.caracteristicas).length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Características</h2>
              <dl className="grid grid-cols-2 gap-4">
                {Object.entries(product.caracteristicas).map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-sm text-gray-500 capitalize">
                      {key.replace(/_/g, ' ')}
                    </dt>
                    <dd className="text-gray-900 font-medium">
                      {typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* SKU */}
          <div className="mt-8 pt-8 border-t text-sm text-gray-500">
            SKU: {product.sku}
          </div>
        </div>
      </div>
    </div>
  );
}
