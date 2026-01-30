import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

export function PreOrderSection() {
  return (
    <section className="py-20 bg-[#0a0c10] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="rounded-3xl p-8 md:p-16 text-center border border-gold/30 bg-[#1a1d24] shadow-[0_0_30px_-5px_rgba(255,215,0,0.3)]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-xs font-display tracking-[0.3em] uppercase text-[#FFD700] border border-[#FFD700]/40 rounded-full bg-[#FFD700]/10">
              ¿Listo para ver mejor?
            </span>
          </motion.div>

          <motion.h2
            className="font-display text-4xl md:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            ENCUENTRA TUS <span className="text-gradient-gold">GAFAS PERFECTAS</span>
          </motion.h2>

          <motion.p
            className="text-white/60 text-lg max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Visita nuestra tienda o explora nuestro catálogo en línea. 
            Nuestros expertos están listos para ayudarte a encontrar el estilo perfecto.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link
              to="/productos"
              className="group inline-flex items-center gap-2 bg-[#FFD700] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#FFE44D] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            >
              Explorar Catálogo
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="tel:+573001234567"
              className="inline-flex items-center gap-2 border-2 border-[#FFD700] text-[#FFD700] px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#FFD700]/10 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              Llamar Ahora
            </a>
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8 text-white/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#FFD700]" />
              <span>+57 300 123 4567</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#FFD700]" />
              <span>info@lineyvision.com</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FFD700]" />
              <span>Bogotá, Colombia</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
