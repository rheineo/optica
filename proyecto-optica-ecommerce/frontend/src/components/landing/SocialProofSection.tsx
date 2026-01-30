import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'María García',
    role: 'Cliente frecuente',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Excelente atención y productos de primera calidad. Mis gafas Ray-Ban llegaron perfectas y el servicio de optometría fue muy profesional.',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Empresario',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Increíble variedad de monturas. El equipo me ayudó a encontrar las gafas perfectas para mi estilo. Totalmente recomendado.',
  },
  {
    name: 'Ana Martínez',
    role: 'Diseñadora',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    rating: 5,
    text: 'Los lentes de contacto que compré son de excelente calidad. El proceso de compra fue muy fácil y la entrega súper rápida.',
  },
];

const stats = [
  { value: '500+', label: 'Clientes Satisfechos' },
  { value: '15+', label: 'Marcas Premium' },
  { value: '1000+', label: 'Productos' },
  { value: '5★', label: 'Calificación' },
];

export function SocialProofSection() {
  return (
    <section className="py-20 bg-[#0d0f14]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Stats Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 mb-6 text-xs font-display tracking-[0.3em] uppercase text-[#FFD700] border border-[#FFD700]/40 rounded-full bg-[#FFD700]/10">
            Confianza Global
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            ÚNETE A <span className="text-[#FFD700]">500+</span> USUARIOS
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            Miles de personas ya han transformado su experiencia visual con Liney Vision
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-[#1a1d24] border border-gray-700/50"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="block text-3xl md:text-4xl font-bold text-[#FFD700] mb-2">
                {stat.value}
              </span>
              <span className="text-white/60 text-xs uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block px-4 py-2 mb-4 text-xs font-display tracking-[0.3em] uppercase text-[#FFD700] border border-[#FFD700]/40 rounded-full bg-[#FFD700]/10">
            Testimonios
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            LO QUE DICEN <span className="text-gradient-gold">NUESTROS CLIENTES</span>
          </h2>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="bg-white rounded-2xl p-8 h-full relative border border-gray-200 shadow-lg">
                {/* Quote icon */}
                <Quote className="absolute top-6 right-6 w-8 h-8 text-gold/20" />

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-500 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
