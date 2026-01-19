import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Cart, CartItem } from '../types';
import { cartApi } from '../api/cart';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  addToCart: (productId: string, cantidad?: number) => Promise<void>;
  updateQuantity: (itemId: string, cantidad: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setIsLoading(true);
      const response = await cartApi.get();
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: string, cantidad: number = 1) => {
    try {
      const response = await cartApi.addItem(productId, cantidad);
      if (response.success && response.data) {
        setCart(response.data);
        toast.success('Producto agregado al carrito');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Error al agregar al carrito');
    }
  };

  const updateQuantity = async (itemId: string, cantidad: number) => {
    try {
      const response = await cartApi.updateItem(itemId, cantidad);
      if (response.success && response.data) {
        setCart(response.data);
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Error al actualizar cantidad');
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      await cartApi.removeItem(itemId);
      await fetchCart();
      toast.success('Producto eliminado del carrito');
    } catch (error) {
      toast.error('Error al eliminar del carrito');
    }
  };

  const clearCart = async () => {
    try {
      await cartApi.clear();
      setCart(null);
      toast.success('Carrito vaciado');
    } catch (error) {
      toast.error('Error al vaciar carrito');
    }
  };

  const totalItems = cart?.items?.reduce((sum: number, item: CartItem) => sum + item.cantidad, 0) || 0;
  const totalPrice = cart?.items?.reduce((sum: number, item: CartItem) => {
    const precio = item.product.descuento
      ? item.product.precio * (1 - item.product.descuento / 100)
      : item.product.precio;
    return sum + precio * item.cantidad;
  }, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
