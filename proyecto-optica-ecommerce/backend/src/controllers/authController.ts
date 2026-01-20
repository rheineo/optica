import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/database';
import { config } from '../config/env';
import { ApiResponse, AuthRequest } from '../types';
import { sendPasswordResetEmail } from '../services/emailService';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, phone, tipoDocumento, numeroDocumento } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({
        success: false,
        error: 'El email ya está registrado',
      } as ApiResponse);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        tipoDocumento: tipoDocumento || null,
        numeroDocumento: numeroDocumento || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        tipoDocumento: true,
        numeroDocumento: true,
        createdAt: true,
      },
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: { user, token },
      message: 'Usuario registrado exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error al registrar usuario',
    } as ApiResponse);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      } as ApiResponse);
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        error: 'Credenciales inválidas',
      } as ApiResponse);
      return;
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
        token,
      },
      message: 'Login exitoso',
    } as ApiResponse);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error al iniciar sesión',
    } as ApiResponse);
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: user,
    } as ApiResponse);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener información del usuario',
    } as ApiResponse);
  }
};

// Solicitar recuperación de contraseña
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        error: 'El email es requerido',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Siempre responder con éxito para no revelar si el email existe
    if (!user) {
      res.json({
        success: true,
        message: 'Si el email está registrado, recibirás un correo con instrucciones',
      } as ApiResponse);
      return;
    }

    // Generar token de recuperación
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
      },
    });

    // Enviar email
    const emailSent = await sendPasswordResetEmail(user.email, user.name, resetToken);

    if (!emailSent) {
      console.error('Error enviando email de recuperación');
    }

    res.json({
      success: true,
      message: 'Si el email está registrado, recibirás un correo con instrucciones',
    } as ApiResponse);
  } catch (error) {
    console.error('Error en forgot password:', error);
    res.status(500).json({
      success: false,
      error: 'Error al procesar la solicitud',
    } as ApiResponse);
  }
};

// Resetear contraseña con token
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        error: 'Token y contraseña son requeridos',
      } as ApiResponse);
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: 'La contraseña debe tener al menos 6 caracteres',
      } as ApiResponse);
      return;
    }

    // Buscar usuario con token válido
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: 'Token inválido o expirado',
      } as ApiResponse);
      return;
    }

    // Hash de la nueva contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Actualizar contraseña y limpiar token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente',
    } as ApiResponse);
  } catch (error) {
    console.error('Error en reset password:', error);
    res.status(500).json({
      success: false,
      error: 'Error al restablecer la contraseña',
    } as ApiResponse);
  }
};

// Validar token de recuperación
export const validateResetToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const token = req.params.token as string;

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date(),
        },
      },
      select: {
        email: true,
        name: true,
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        error: 'Token inválido o expirado',
      } as ApiResponse);
      return;
    }

    res.json({
      success: true,
      data: {
        email: user.email,
        name: user.name,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Error validando token:', error);
    res.status(500).json({
      success: false,
      error: 'Error al validar el token',
    } as ApiResponse);
  }
};
