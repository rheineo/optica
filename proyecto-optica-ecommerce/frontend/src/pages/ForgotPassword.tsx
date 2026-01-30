import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authApi } from '../api/auth';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('El email es requerido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authApi.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err) {
      setError('Error al procesar la solicitud. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&h=1080&fit=crop"
            alt="Liney Vision Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

        <div className="relative z-10 w-full max-w-md mx-auto px-6">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[#FFD700]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Revisa tu correo!</h2>
            <p className="text-gray-600 mb-6">
              Si el email <strong>{email}</strong> está registrado, recibirás un enlace para restablecer tu contraseña.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              El enlace expirará en 1 hora. Revisa también tu carpeta de spam.
            </p>
            <Link 
              to="/login" 
              className="block w-full py-3 bg-[#0a0c10] text-[#FFD700] font-semibold rounded-lg hover:bg-[#1a1c20] transition-colors text-center"
            >
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Side - Branding */}
        <div className="flex-1 text-center lg:text-left">
          <Link to="/" className="inline-block mb-6">
            <span className="text-3xl font-bold text-[#FFD700]">Liney</span>
            <span className="text-3xl font-bold text-white"> Visión</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¿Olvidaste tu
            <span className="block text-[#FFD700] italic">Contraseña?</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-md mx-auto lg:mx-0">
            No te preocupes, te ayudaremos a recuperar el acceso a tu cuenta.
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="w-full max-w-md">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Recuperar Contraseña
            </h2>
            <p className="text-gray-500 mb-6">
              Ingresa tu email y te enviaremos instrucciones
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError('');
                    }}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-[#FFD700] outline-none transition-all"
                    placeholder="tu@email.com"
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                {isLoading ? 'Enviando...' : 'Enviar instrucciones'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-[#996600] hover:text-[#FFD700] font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al inicio de sesión
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Liney Visión. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
