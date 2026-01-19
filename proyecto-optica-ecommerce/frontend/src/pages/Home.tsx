import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowRight, Shield, Truck, Award, Eye } from 'lucide-react';
import { productsApi } from '../api/products';
import type { Product, Category } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';

export function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          productsApi.getAll({ limit: 8 }),
          productsApi.getCategories(),
        ]);
        if (productsRes.success) {
          setFeaturedProducts(productsRes.data);
        }
        if (categoriesRes.success && categoriesRes.data) {
          setCategories(categoriesRes.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryImages: Record<string, string> = {
    MONTURAS_SOL: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=300&fit=crop',
    MONTURAS_OFTALMICA: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=300&fit=crop',
    LENTES_CONTACTO: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    ACCESORIOS: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=400&h=300&fit=crop',
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-primary-900 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <img
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&h=600&fit=crop"
          alt="Hero"
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              La visión perfecta está a un clic de distancia
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Descubre nuestra colección de gafas de sol, monturas oftálmicas y lentes de contacto de las mejores marcas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/productos"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Ver Catálogo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/productos?categoria=MONTURAS_SOL"
                className="btn-secondary inline-flex items-center justify-center gap-2 bg-white/10 border-white text-white hover:bg-white hover:text-primary-700"
              >
                Monturas de Sol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Categorías</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explora nuestra amplia selección de productos ópticos de las mejores marcas del mundo.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/productos?categoria=${category.slug}`}
                className="group relative overflow-hidden rounded-xl aspect-[4/3]"
              >
                <img
                  src={category.imagen || categoryImages[category.slug] || 'https://placehold.co/400x300'}
                  alt={category.nombre}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-bold text-white mb-1">{category.nombre}</h3>
                  <p className="text-gray-300 text-sm">
                    {category._count?.products || 0} productos
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados</h2>
              <p className="text-gray-600">Los favoritos de nuestros clientes</p>
            </div>
            <Link
              to="/productos"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              Ver todos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProductGrid products={featuredProducts} isLoading={isLoading} />
          <div className="mt-8 text-center sm:hidden">
            <Link to="/productos" className="btn-primary inline-flex items-center gap-2">
              Ver todos los productos
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Calidad Garantizada</h3>
              <p className="text-gray-600">
                Trabajamos solo con marcas reconocidas mundialmente para ofrecerte productos de la más alta calidad.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Envío Gratis</h3>
              <p className="text-gray-600">
                Envío gratis en compras mayores a $100.000 a cualquier parte del país.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Garantía Extendida</h3>
              <p className="text-gray-600">
                Todos nuestros productos cuentan con garantía de 1 año contra defectos de fabricación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eye className="w-16 h-16 text-white/80 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿Necesitas ayuda para elegir?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Nuestros expertos están listos para asesorarte y ayudarte a encontrar las gafas perfectas para ti.
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
          >
            Contáctanos
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
