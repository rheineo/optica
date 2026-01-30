import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { Category } from '../../types';

interface CategoriesSectionProps {
  categories: Category[];
  isLoading: boolean;
}

const categoryImages: Record<string, string> = {
  MONTURAS_SOL: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=400&fit=crop',
  MONTURAS_OFTALMICA: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=400&fit=crop',
  LENTES_CONTACTO: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop',
  ACCESORIOS: 'https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=600&h=400&fit=crop',
};

export function CategoriesSection({ categories, isLoading }: CategoriesSectionProps) {
  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] bg-gray-100 rounded-2xl animate-pulse" />
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
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestras Categorías
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos ópticos de las mejores marcas del mundo.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                to={`/productos?categoria=${category.slug}`}
                className="group relative block overflow-hidden rounded-xl aspect-[4/3] border border-gray-200 shadow-sm hover:shadow-lg transition-shadow"
              >
                <img
                  src={category.imagen || categoryImages[category.slug] || 'https://placehold.co/600x400'}
                  alt={category.nombre}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="text-lg font-bold text-white mb-1">
                    {category.nombre}
                  </h3>
                  <div className="flex items-center justify-between">
                    <p className="text-white/70 text-sm">
                      {category._count?.products || 0} productos
                    </p>
                    <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
