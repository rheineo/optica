import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../types';

interface FeaturedProductsSectionProps {
  products: Product[];
  isLoading: boolean;
}

export function FeaturedProductsSection({ products, isLoading }: FeaturedProductsSectionProps) {
  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex items-center justify-between mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Productos Destacados
            </h2>
            <p className="text-gray-500 mt-2">Los favoritos de nuestros clientes</p>
          </div>
          <Link
            to="/productos"
            className="hidden sm:inline-flex items-center gap-2 text-gray-700 hover:text-[#FFD700] font-medium transition-colors group"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 8).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={`/producto/${product.id}`} className="group block">
                <div className="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm hover:shadow-lg transition-shadow">
                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.imagenes?.[0] || 'https://placehold.co/400x400'}
                      alt={product.nombre}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Discount badge */}
                    {product.descuento && product.descuento > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        -{product.descuento}%
                      </div>
                    )}

                    {/* Out of stock badge */}
                    {product.stock === 0 && (
                      <div className="absolute top-3 right-3 bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
                        Agotado
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">
                      {product.marca}
                    </p>
                    <h3 className="font-medium text-gray-900 group-hover:text-[#CC9900] transition-colors line-clamp-1">
                      {product.nombre}
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                      {product.category?.nombre || product.categoria}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {product.descuento && product.descuento > 0 ? (
                        <>
                          <span className="text-gray-900 font-bold">
                            $ {(product.precio * (1 - product.descuento / 100)).toLocaleString()}
                          </span>
                          <span className="text-gray-400 line-through text-sm">
                            ${product.precio.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-gray-900 font-bold">
                          $ {product.precio.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <motion.div
          className="mt-8 text-center sm:hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <Link
            to="/productos"
            className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-6 py-3 rounded-full font-bold"
          >
            Ver todos los productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
