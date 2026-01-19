import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-primary-400 mb-4">Liney Visión</h3>
            <p className="text-gray-400 mb-4">
              Tu tienda de confianza para gafas de sol, monturas oftálmicas y lentes de contacto de las mejores marcas.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Categorías</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/productos?categoria=MONTURAS_SOL" className="text-gray-400 hover:text-white transition-colors">
                  Monturas de Sol
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=MONTURAS_OFTALMICA" className="text-gray-400 hover:text-white transition-colors">
                  Monturas Oftálmicas
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=LENTES_CONTACTO" className="text-gray-400 hover:text-white transition-colors">
                  Lentes de Contacto
                </Link>
              </li>
              <li>
                <Link to="/productos?categoria=ACCESORIOS" className="text-gray-400 hover:text-white transition-colors">
                  Accesorios
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/sobre-nosotros" className="text-gray-400 hover:text-white transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contacto" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/politicas" className="text-gray-400 hover:text-white transition-colors">
                  Políticas de Envío
                </Link>
              </li>
              <li>
                <Link to="/terminos" className="text-gray-400 hover:text-white transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-5 h-5 text-primary-400" />
                <span>Calle 123 #45-67, Bogotá</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-5 h-5 text-primary-400" />
                <span>+57 300 123 4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-5 h-5 text-primary-400" />
                <span>info@lineyvision.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Liney Visión. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
