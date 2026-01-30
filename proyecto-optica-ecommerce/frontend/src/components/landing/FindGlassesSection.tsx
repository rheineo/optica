import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react';

export function FindGlassesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="rounded-3xl p-8 md:p-16 text-center bg-gradient-to-b from-gray-100 to-gray-300 border border-gray-200 shadow-sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-xs font-display tracking-[0.3em] uppercase text-[#996600] border border-[#996600] rounded-full bg-[#FFD700]/20">
              ¿Listo para ver mejor?
            </span>
          </motion.div>

          <motion.h2
            className="text-3xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            ENCUENTRA TUS <span className="text-[#CC9900]">GAFAS PERFECTAS</span>
          </motion.h2>

          <motion.p
            className="text-gray-500 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Visita nuestra tienda o explora nuestro catálogo en línea. Nuestros expertos 
            están listos para ayudarte a encontrar el estilo perfecto.
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
              className="inline-flex items-center gap-2 border-2 border-[#996600] text-[#996600] px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#996600]/10 transition-all duration-300"
            >
              <Phone className="w-5 h-5" />
              Llamar Ahora
            </a>
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="flex flex-col md:flex-row items-center justify-center gap-8 text-gray-500"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#CC9900]" />
              <span>+57 300 123 4567</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#CC9900]" />
              <span>info@lineyvision.com</span>
            </div>
            <div className="hidden md:block w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#CC9900]" />
              <span>Bogotá, Colombia</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
