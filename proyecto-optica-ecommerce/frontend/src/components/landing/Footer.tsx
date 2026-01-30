import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const footerLinks = {
  productos: [
    { name: 'Monturas de Sol', href: '/productos?categoria=MONTURAS_SOL' },
    { name: 'Monturas Oftálmicas', href: '/productos?categoria=MONTURAS_OFTALMICA' },
    { name: 'Lentes de Contacto', href: '/productos?categoria=LENTES_CONTACTO' },
    { name: 'Accesorios', href: '/productos?categoria=ACCESORIOS' },
  ],
  empresa: [
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contacto', href: '/contacto' },
  ],
  legal: [
    { name: 'Términos y Condiciones', href: '/terminos' },
    { name: 'Política de Privacidad', href: '/privacidad' },
    { name: 'Política de Devoluciones', href: '/devoluciones' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0c10] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <span className="font-display text-2xl font-bold text-gradient-gold">
                LINEY VISION
              </span>
            </Link>
            <p className="text-white/60 mb-6 max-w-sm">
              Tu destino para gafas de alta calidad y servicios ópticos profesionales. 
              Innovación y estilo para tu visión.
            </p>
            
            {/* Contact info */}
            <div className="space-y-3">
              <a href="tel:+573001234567" className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors">
                <Phone className="w-4 h-4 text-[#FFD700]" />
                +57 300 123 4567
              </a>
              <a href="mailto:info@lineyvision.com" className="flex items-center gap-3 text-white/60 hover:text-gold transition-colors">
                <Mail className="w-4 h-4 text-[#FFD700]" />
                info@lineyvision.com
              </a>
              <div className="flex items-center gap-3 text-white/60">
                <MapPin className="w-4 h-4 text-[#FFD700]" />
                Bogotá, Colombia
              </div>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">
              Productos
            </h4>
            <ul className="space-y-3">
              {footerLinks.productos.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-[#FFD700] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">
              Empresa
            </h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-[#FFD700] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-display text-sm font-bold text-white uppercase tracking-wider mb-6">
              Legal
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-[#FFD700] transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Liney Vision. Todos los derechos reservados.
          </p>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white/60 hover:border-[#FFD700] hover:text-[#FFD700] transition-colors"
                aria-label={social.label}
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
