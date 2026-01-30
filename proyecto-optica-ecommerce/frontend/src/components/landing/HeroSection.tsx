import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&h=1080&fit=crop"
          alt="Liney Vision Hero"
          className="w-full h-full object-cover"
        />
        {/* Dark overlay */}
        <div className="hero-overlay" />
      </div>

      {/* Animated particles/dots */}
      <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 4 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="inline-block px-4 py-2 mb-6 text-sm font-display tracking-[0.3em] uppercase text-[#FFD700] border border-[#FFD700]/40 rounded-full backdrop-blur-sm bg-[#FFD700]/10">
            Innovación Óptica 2025
          </span>
        </motion.div>

        <motion.h1
          className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <span className="text-white">EL FUTURO DE LA</span>
          <br />
          <span className="text-gradient-gold">VISIÓN PERFECTA</span>
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 font-light"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Descubre nuestra colección de gafas y lentes de contacto con tecnología de vanguardia. 
          Diseño premium que redefine el estilo y la claridad visual.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link
            to="/productos"
            className="group inline-flex items-center gap-2 bg-[#FFD700] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#FFE44D] transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
          >
            <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Ver Colección
          </Link>
          <Link
            to="/productos?categoria=MONTURAS_SOL"
            className="inline-flex items-center gap-2 border-2 border-[#FFD700] text-[#FFD700] px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-[#FFD700]/10 transition-all duration-300"
          >
            Pre-Ordenar Ahora
          </Link>
        </motion.div>

        {/* Social proof mini */}
        <motion.div
          className="mt-12 flex items-center justify-center gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="text-center">
            <span className="block text-3xl font-display font-bold text-[#FFD700]">500+</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Clientes</span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <span className="block text-3xl font-display font-bold text-[#FFD700]">4.9★</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Rating</span>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center">
            <span className="block text-3xl font-display font-bold text-[#FFD700]">15+</span>
            <span className="text-xs text-white/50 uppercase tracking-wider">Marcas</span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2 cursor-pointer group"
        >
          <span className="text-xs text-white/40 uppercase tracking-widest group-hover:text-gold transition-colors">
            Explorar
          </span>
          <ChevronDown className="w-5 h-5 text-[#FFD700]" />
        </motion.div>
      </motion.div>
    </section>
  );
}
