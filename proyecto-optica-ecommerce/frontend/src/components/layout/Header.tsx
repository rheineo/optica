import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Detectar si estamos en la página de inicio
  const isHomePage = location.pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/productos?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/productos' },
    { name: 'Monturas de Sol', href: '/productos?categoria=MONTURAS_SOL' },
    { name: 'Lentes de Contacto', href: '/productos?categoria=LENTES_CONTACTO' },
  ];

  // Header siempre oscuro
  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-[#0a0c10] backdrop-blur-xl border-b border-white/10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="font-display text-xl font-bold text-gradient-gold">
              LINEY VISION
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-white/70 hover:text-gold transition-colors font-medium uppercase tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-40 lg:w-56 pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 text-sm focus:outline-none focus:border-gold/50 focus:bg-white/15 transition-all"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-4 h-4" />
                </div>
              </form>

              {/* Cart */}
              <Link
                to="/carrito"
                className="relative w-10 h-10 flex items-center justify-center text-white/70 hover:text-gold transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-dark-surface text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-gold transition-colors">
                    <User className="w-5 h-5" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-dark-surface border border-white/10 rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-white font-medium text-sm">{user?.name?.split(' ')[0]}</p>
                      <p className="text-white/50 text-xs">{user?.email}</p>
                    </div>
                    <Link
                      to="/perfil"
                      className="block px-4 py-2 text-white/70 hover:text-gold hover:bg-white/5 transition-colors"
                    >
                      Mi Perfil
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 text-gold hover:bg-white/5 transition-colors"
                      >
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-white/70 hover:text-gold hover:bg-white/5 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 text-white/70 hover:text-gold transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Ingresar</span>
                </Link>
              )}

              {/* Mobile menu button */}
              <button
                className="lg:hidden w-10 h-10 flex items-center justify-center text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-dark-surface pt-20 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-6 py-8">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-gold/50"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 w-5 h-5" />
                </div>
              </form>

              {/* Mobile Nav Links */}
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-2xl font-display text-white hover:text-gold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Mobile Auth */}
              <div className="mt-8 pt-8 border-t border-white/10">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <Link
                      to="/perfil"
                      className="block text-white/70 hover:text-gold"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Mi Perfil
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        className="block text-gold"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Panel Admin
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-white/70 hover:text-gold"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 bg-gold text-dark-surface px-6 py-3 rounded-full font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    Ingresar
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer para páginas que no son home */}
      {!isHomePage && <div className="h-20" />}
    </>
  );
}
