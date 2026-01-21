import { Response } from 'express';
import prisma from '../config/database';
import { ApiResponse, AuthRequest } from '../types';

export const getCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Verificar que el usuario existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      res.status(401).json({
        success: false,
        error: 'Usuario no encontrado. Por favor inicie sesión nuevamente.',
      } as ApiResponse);
      return;
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: userId! },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.cantidad, 0);
    const totalPrice = cart.items.reduce((sum, item) => {
      const precio = item.product.descuento
        ? item.product.precio * (1 - item.product.descuento / 100)
        : item.product.precio;
      return sum + precio * item.cantidad;
    }, 0);

    res.json({
      success: true,
      data: {
        ...cart,
        totalItems,
        totalPrice,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener carrito',
    } as ApiResponse);
  }
};

export const addToCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { productId, cantidad = 1 } = req.body;

    // Verificar que el usuario existe
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!userExists) {
      res.status(401).json({
        success: false,
        error: 'Usuario no encontrado. Por favor inicie sesión nuevamente.',
      } as ApiResponse);
      return;
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.activo) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado',
      } as ApiResponse);
      return;
    }

    if (product.stock < cantidad) {
      res.status(400).json({
        success: false,
        error: 'Stock insuficiente',
      } as ApiResponse);
      return;
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: userId! },
      });
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { cantidad: existingItem.cantidad + cantidad },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          cantidad,
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedCart,
      message: 'Producto agregado al carrito',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al agregar al carrito',
    } as ApiResponse);
  }
};

export const updateCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;
    const { cantidad } = req.body;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
        product: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      res.status(404).json({
        success: false,
        error: 'Item no encontrado',
      } as ApiResponse);
      return;
    }

    if (cartItem.product.stock < cantidad) {
      res.status(400).json({
        success: false,
        error: 'Stock insuficiente',
      } as ApiResponse);
      return;
    }

    if (cantidad <= 0) {
      await prisma.cartItem.delete({
        where: { id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { cantidad },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedCart,
      message: 'Carrito actualizado',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al actualizar carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar carrito',
    } as ApiResponse);
  }
};

export const removeFromCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const id = req.params.id as string;

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== userId) {
      res.status(404).json({
        success: false,
        error: 'Item no encontrado',
      } as ApiResponse);
      return;
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Producto eliminado del carrito',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al eliminar del carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar del carrito',
    } as ApiResponse);
  }
};

export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    const cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (cart) {
      await prisma.cartItem.deleteMany({
        where: { cartId: cart.id },
      });
    }

    res.json({
      success: true,
      message: 'Carrito vaciado',
    } as ApiResponse);
  } catch (error) {
    console.error('Error al vaciar carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error al vaciar carrito',
    } as ApiResponse);
  }
};
