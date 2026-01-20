import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin';
import { Home } from './pages/Home';
import { Products } from './pages/Products';
import { ProductDetail } from './pages/ProductDetail';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { Cart } from './pages/Cart';
import { AdminDashboard, AdminProducts, AdminProductForm, AdminOrders, AdminOrderDetail, AdminUsers, AdminUserDetail } from './pages/admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Auth pages - sin Layout */}
              <Route path="login" element={<Login />} />
              <Route path="registro" element={<Register />} />
              <Route path="recuperar" element={<ForgotPassword />} />
              <Route path="reset-password" element={<ResetPassword />} />
              
              {/* Admin pages - con AdminLayout */}
              <Route path="admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="productos" element={<AdminProducts />} />
                <Route path="productos/nuevo" element={<AdminProductForm />} />
                <Route path="productos/:id/editar" element={<AdminProductForm />} />
                <Route path="pedidos" element={<AdminOrders />} />
                <Route path="pedidos/:id" element={<AdminOrderDetail />} />
                <Route path="usuarios" element={<AdminUsers />} />
                <Route path="usuarios/:id" element={<AdminUserDetail />} />
              </Route>
              
              {/* Main pages - con Layout */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="productos" element={<Products />} />
                <Route path="producto/:id" element={<ProductDetail />} />
                <Route path="carrito" element={<Cart />} />
              </Route>
            </Routes>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#333',
                  color: '#fff',
                },
              }}
            />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
