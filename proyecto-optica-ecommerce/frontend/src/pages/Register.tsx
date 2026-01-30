import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TIPOS_DOCUMENTO = [
  { value: '', label: 'Seleccionar...' },
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
];

export function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tipoDocumento: '',
    numeroDocumento: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setIsLoading(true);
    const success = await register({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      tipoDocumento: formData.tipoDocumento || undefined,
      numeroDocumento: formData.numeroDocumento || undefined,
      password: formData.password,
    });
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  };

  const inputStyles = "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all";

  return (
    <div className="min-h-screen relative flex items-center justify-center py-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&h=1080&fit=crop"
          alt="Liney Vision Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left Side - Branding */}
        <div className="flex-1 text-center lg:text-left hidden lg:block">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-bold text-[#FFD700]">Liney</span>
            <span className="text-3xl font-bold text-white"> Visión</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Únete a Nuestra
            <span className="block text-[#FFD700] italic">Comunidad</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md">
            Crea tu cuenta y accede a ofertas exclusivas, seguimiento de pedidos y mucho más.
          </p>
          
          {/* Benefits */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-gray-300">
              <span className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">✓</span>
              <span>Ofertas exclusivas para miembros</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <span className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">✓</span>
              <span>Seguimiento de tus pedidos</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300">
              <span className="w-6 h-6 rounded-full bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700]">✓</span>
              <span>Historial de compras</span>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:p-8">
            <div className="lg:hidden text-center mb-4">
              <Link to="/" className="inline-block">
                <span className="text-2xl font-bold text-[#FFD700]">Liney</span>
                <span className="text-2xl font-bold text-gray-900"> Visión</span>
              </Link>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Crear Cuenta
            </h2>
            <p className="text-gray-500 mb-6">
              Completa tus datos para registrarte
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={inputStyles}
                    placeholder="Juan Pérez"
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={inputStyles}
                    placeholder="tu@email.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono (opcional)
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={inputStyles}
                    placeholder="300 123 4567"
                  />
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tipoDocumento" className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo Doc.
                  </label>
                  <div className="relative">
                    <select
                      id="tipoDocumento"
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all appearance-none bg-white"
                    >
                      {TIPOS_DOCUMENTO.map((tipo) => (
                        <option key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </option>
                      ))}
                    </select>
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div>
                  <label htmlFor="numeroDocumento" className="block text-sm font-medium text-gray-700 mb-1">
                    Número Doc.
                  </label>
                  <input
                    id="numeroDocumento"
                    name="numeroDocumento"
                    type="text"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all"
                    placeholder="1234567890"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={inputStyles}
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0a0c10] text-[#FFD700] font-semibold rounded-lg hover:bg-[#1a1c20] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </button>
            </form>

            <p className="mt-4 text-xs text-gray-500 text-center">
              Al registrarte, aceptas nuestros{' '}
              <Link to="/terminos" className="text-[#996600] hover:text-[#FFD700]">
                Términos
              </Link>{' '}
              y{' '}
              <Link to="/privacidad" className="text-[#996600] hover:text-[#FFD700]">
                Política de Privacidad
              </Link>
            </p>

            <p className="mt-4 text-center text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link 
                to="/login" 
                className="text-[#996600] hover:text-[#FFD700] font-semibold"
              >
                Inicia sesión
              </Link>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Liney Visión. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
