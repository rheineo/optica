import { motion } from 'framer-motion';
import { Eye, Wrench, Truck, ShoppingBag } from 'lucide-react';

const services = [
  {
    icon: Eye,
    title: 'Optometría',
    description: 'Exámenes visuales completos realizados por profesionales certificados. Diagnóstico preciso y recomendaciones personalizadas.',
    features: ['Examen visual completo', 'Diagnóstico profesional', 'Recetas actualizadas'],
  },
  {
    icon: Wrench,
    title: 'Repuestos',
    description: 'Servicio técnico especializado para reparación y mantenimiento de tus gafas. Repuestos originales de todas las marcas.',
    features: ['Repuestos originales', 'Reparación express', 'Garantía incluida'],
  },
  {
    icon: Truck,
    title: 'Proveedores',
    description: 'Trabajamos con los mejores proveedores internacionales para ofrecerte productos de la más alta calidad.',
    features: ['Marcas premium', 'Importación directa', 'Precios competitivos'],
  },
  {
    icon: ShoppingBag,
    title: 'Accesorios',
    description: 'Complementa tu estilo con nuestra selección de accesorios para el cuidado y protección de tus gafas.',
    features: ['Estuches premium', 'Paños de limpieza', 'Cordones y cadenas'],
  },
];

export function ServicesSection() {
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
            Más que una Óptica
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Ofrecemos servicios integrales para el cuidado de tu visión y tus gafas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="rounded-xl p-6 h-full border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
                {/* Icon */}
                <div className="w-14 h-14 bg-[#FFD700]/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#FFD700]/20 transition-colors">
                  <service.icon className="w-7 h-7 text-[#CC9900]" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#CC9900] transition-colors">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-500 mb-5 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-gray-600">
                      <div className="w-1.5 h-1.5 bg-[#FFD700] rounded-full" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
