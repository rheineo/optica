import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// POST /api/admin/users - Crear nuevo usuario
export const createUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, phone, role } = req.body;

    // Validar campos requeridos
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email, nombre y contraseña son requeridos',
      });
    }

    // Verificar si el email ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está registrado',
      });
    }

    // Verificar permisos para crear ADMIN
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      const adminRole = (req as any).user?.role;
      if (adminRole !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          error: 'Solo SUPER_ADMIN puede crear administradores',
        });
      }
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        phone: phone || null,
        role: role || 'CLIENTE',
        estado: 'ACTIVO',
        nivelCliente: 'NUEVO',
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        estado: true,
        nivelCliente: true,
        createdAt: true,
      },
    });

    res.status(201).json({
      success: true,
      data: newUser,
      message: 'Usuario creado exitosamente',
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al crear usuario',
    });
  }
};

// GET /api/admin/users - Listar usuarios con filtros
export const getUsers = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'desc',
      role,
      estado,
      nivelCliente,
      search,
      fechaInicio,
      fechaFin,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {
      deletedAt: null, // Excluir usuarios eliminados
    };

    if (role) {
      where.role = role;
    }

    if (estado) {
      where.estado = estado;
    }

    if (nivelCliente) {
      where.nivelCliente = nivelCliente;
    }

    if (fechaInicio || fechaFin) {
      where.createdAt = {};
      if (fechaInicio) {
        where.createdAt.gte = new Date(fechaInicio as string);
      }
      if (fechaFin) {
        where.createdAt.lte = new Date(fechaFin as string);
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    // Obtener usuarios
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          estado: true,
          nivelCliente: true,
          emailVerified: true,
          lastLogin: true,
          totalCompras: true,
          totalGastado: true,
          etiquetas: true,
          createdAt: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    // Obtener estadísticas
    const [totalUsuarios, activos, bloqueados, nuevosEsteMes] = await Promise.all([
      prisma.user.count({ where: { deletedAt: null } }),
      prisma.user.count({ where: { deletedAt: null, estado: 'ACTIVO' } }),
      prisma.user.count({ where: { deletedAt: null, estado: 'BLOQUEADO' } }),
      prisma.user.count({
        where: {
          deletedAt: null,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

    res.json({
      success: true,
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      stats: {
        totalUsuarios,
        activos,
        bloqueados,
        nuevosEsteMes,
      },
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuarios',
    });
  }
};

// GET /api/admin/users/:id - Detalle de un usuario
export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          take: 10,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            numero: true,
            total: true,
            estadoPedido: true,
            createdAt: true,
            items: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    // Calcular estadísticas
    const orderStats = await prisma.order.aggregate({
      where: { userId: id },
      _count: { id: true },
      _sum: { total: true },
      _avg: { total: true },
    });

    const ultimaCompra = await prisma.order.findFirst({
      where: { userId: id },
      orderBy: { createdAt: 'desc' },
      select: { createdAt: true },
    });

    const formattedUser = {
      perfil: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        estado: user.estado,
        nivelCliente: user.nivelCliente,
        etiquetas: user.etiquetas,
      },
      verificaciones: {
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        phoneVerified: user.phoneVerified,
      },
      estadisticas: {
        totalCompras: orderStats._count.id || 0,
        totalGastado: orderStats._sum.total || 0,
        pedidoPromedio: orderStats._avg.total || 0,
        ultimaCompra: ultimaCompra?.createdAt || null,
        clienteDesde: user.createdAt,
      },
      direcciones: user.addresses,
      seguridad: {
        lastLogin: user.lastLogin,
        loginAttempts: user.loginAttempts,
        blockedAt: user.blockedAt,
        blockedBy: user.blockedBy,
        motivoBloqueo: user.motivoBloqueo,
      },
      admin: {
        notasInternas: user.notasInternas,
        etiquetas: user.etiquetas,
      },
      pedidosRecientes: user.orders.map((order) => ({
        id: order.id,
        numero: order.numero,
        total: order.total,
        estadoPedido: order.estadoPedido,
        fecha: order.createdAt,
        itemsCount: order.items.length,
      })),
      timestamps: {
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        deletedAt: user.deletedAt,
      },
    };

    res.json({
      success: true,
      data: formattedUser,
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener usuario',
    });
  }
};

// PUT /api/admin/users/:id - Actualizar usuario
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, phone, role, estado, nivelCliente, etiquetas, notasInternas } = req.body;
    const adminId = (req as any).user?.id;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    // Verificar permisos para cambiar rol a ADMIN
    if (role === 'ADMIN' || role === 'SUPER_ADMIN') {
      const adminRole = (req as any).user?.role;
      if (adminRole !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          error: 'Solo SUPER_ADMIN puede asignar rol de administrador',
        });
      }
    }

    // No permitir que un admin se cambie su propio rol
    if (id === adminId && role && role !== user.role) {
      return res.status(403).json({
        success: false,
        error: 'No puedes cambiar tu propio rol',
      });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (estado !== undefined) updateData.estado = estado;
    if (nivelCliente !== undefined) updateData.nivelCliente = nivelCliente;
    if (etiquetas !== undefined) updateData.etiquetas = etiquetas;
    if (notasInternas !== undefined) updateData.notasInternas = notasInternas;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        estado: true,
        nivelCliente: true,
        etiquetas: true,
        notasInternas: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Usuario actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar usuario',
    });
  }
};

// POST /api/admin/users/:id/bloquear - Bloquear usuario
export const blockUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { motivo } = req.body;
    const adminId = (req as any).user?.id;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    if (user.estado === 'BLOQUEADO') {
      return res.status(400).json({
        success: false,
        error: 'El usuario ya está bloqueado',
      });
    }

    // No permitir bloquear a un SUPER_ADMIN
    if (user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'No se puede bloquear a un SUPER_ADMIN',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        estado: 'BLOQUEADO',
        blockedAt: new Date(),
        blockedBy: adminId,
        motivoBloqueo: motivo,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Usuario bloqueado exitosamente',
    });
  } catch (error) {
    console.error('Error al bloquear usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al bloquear usuario',
    });
  }
};

// POST /api/admin/users/:id/desbloquear - Desbloquear usuario
export const unblockUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    if (user.estado !== 'BLOQUEADO') {
      return res.status(400).json({
        success: false,
        error: 'El usuario no está bloqueado',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        estado: 'ACTIVO',
        blockedAt: null,
        blockedBy: null,
        motivoBloqueo: null,
        loginAttempts: 0,
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Usuario desbloqueado exitosamente',
    });
  } catch (error) {
    console.error('Error al desbloquear usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al desbloquear usuario',
    });
  }
};

// POST /api/admin/users/:id/reset-password - Resetear contraseña
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    // Generar contraseña temporal
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
        loginAttempts: 0,
      },
    });

    // TODO: Enviar email con la contraseña temporal

    res.json({
      success: true,
      data: {
        tempPassword, // En producción, esto se enviaría por email, no en la respuesta
      },
      message: 'Contraseña reseteada exitosamente',
    });
  } catch (error) {
    console.error('Error al resetear contraseña:', error);
    res.status(500).json({
      success: false,
      error: 'Error al resetear contraseña',
    });
  }
};

// DELETE /api/admin/users/:id - Eliminar usuario (soft delete)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const adminId = (req as any).user?.id;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    // No permitir eliminar a un ADMIN o SUPER_ADMIN
    if (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') {
      return res.status(403).json({
        success: false,
        error: 'No se puede eliminar a un administrador',
      });
    }

    // No permitir auto-eliminación
    if (id === adminId) {
      return res.status(403).json({
        success: false,
        error: 'No puedes eliminarte a ti mismo',
      });
    }

    // Soft delete
    await prisma.user.update({
      where: { id },
      data: {
        estado: 'ELIMINADO',
        deletedAt: new Date(),
        deletedBy: adminId,
        email: `deleted_${id}@deleted.com`, // Anonimizar email
      },
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario',
    });
  }
};

// POST /api/admin/users/:id/notas - Agregar notas internas
export const addNotes = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { nota } = req.body;
    const adminEmail = (req as any).user?.email;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    const notasActuales = user.notasInternas || '';
    const nuevaNota = `[${new Date().toLocaleString()}] ${adminEmail}: ${nota}`;
    const notasActualizadas = notasActuales ? `${notasActuales}\n${nuevaNota}` : nuevaNota;

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { notasInternas: notasActualizadas },
    });

    res.json({
      success: true,
      data: { notasInternas: updatedUser.notasInternas },
      message: 'Nota agregada exitosamente',
    });
  } catch (error) {
    console.error('Error al agregar nota:', error);
    res.status(500).json({
      success: false,
      error: 'Error al agregar nota',
    });
  }
};

// PUT /api/admin/users/:id/etiquetas - Actualizar etiquetas
export const updateTags = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { etiquetas } = req.body;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { etiquetas },
    });

    res.json({
      success: true,
      data: { etiquetas: updatedUser.etiquetas },
      message: 'Etiquetas actualizadas exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar etiquetas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar etiquetas',
    });
  }
};

// GET /api/admin/users/:id/orders - Historial de pedidos del usuario
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: id },
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nombre: true,
                  imagenes: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: id } }),
    ]);

    const stats = await prisma.order.aggregate({
      where: { userId: id },
      _sum: { total: true },
      _avg: { total: true },
    });

    res.json({
      success: true,
      data: orders.map((order) => ({
        id: order.id,
        numero: order.numero,
        fecha: order.createdAt,
        total: order.total,
        estadoPedido: order.estadoPedido,
        estadoPago: order.estadoPago,
        itemsCount: order.items.length,
      })),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      stats: {
        totalCompras: total,
        totalGastado: stats._sum.total || 0,
        pedidoPromedio: stats._avg.total || 0,
      },
    });
  } catch (error) {
    console.error('Error al obtener pedidos del usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener pedidos del usuario',
    });
  }
};

// GET /api/admin/users/stats - Estadísticas generales de usuarios
export const getUserStats = async (req: Request, res: Response) => {
  try {
    const { periodo = 'mes' } = req.query;

    let fechaInicio: Date;
    const fechaFin = new Date();

    switch (periodo) {
      case 'hoy':
        fechaInicio = new Date();
        fechaInicio.setHours(0, 0, 0, 0);
        break;
      case 'semana':
        fechaInicio = new Date();
        fechaInicio.setDate(fechaInicio.getDate() - 7);
        break;
      case 'mes':
      default:
        fechaInicio = new Date();
        fechaInicio.setMonth(fechaInicio.getMonth() - 1);
        break;
    }

    const where = { deletedAt: null };
    const whereNuevos = {
      deletedAt: null,
      createdAt: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    };

    const [
      totalUsuarios,
      nuevosUsuarios,
      porRol,
      porEstado,
      porNivel,
    ] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.count({ where: whereNuevos }),
      prisma.user.groupBy({
        by: ['role'],
        where,
        _count: { id: true },
      }),
      prisma.user.groupBy({
        by: ['estado'],
        where,
        _count: { id: true },
      }),
      prisma.user.groupBy({
        by: ['nivelCliente'],
        where,
        _count: { id: true },
      }),
    ]);

    const rolMap = porRol.reduce((acc, item) => {
      acc[item.role] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const estadoMap = porEstado.reduce((acc, item) => {
      acc[item.estado] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const nivelMap = porNivel.reduce((acc, item) => {
      acc[item.nivelCliente] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Top 10 clientes por total gastado
    const topClientes = await prisma.user.findMany({
      where: { deletedAt: null, role: 'CLIENTE' },
      orderBy: { totalGastado: 'desc' },
      take: 10,
      select: {
        id: true,
        name: true,
        email: true,
        totalGastado: true,
        totalCompras: true,
      },
    });

    res.json({
      success: true,
      data: {
        periodo,
        general: {
          totalUsuarios,
          nuevosUsuarios,
          usuariosActivos: estadoMap.ACTIVO || 0,
        },
        porRol: rolMap,
        porEstado: estadoMap,
        porNivel: nivelMap,
        topClientes,
      },
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener estadísticas',
    });
  }
};

// POST /api/admin/users/:id/verify-email - Verificar email manualmente
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado',
      });
    }

    if (user.emailVerified) {
      return res.status(400).json({
        success: false,
        error: 'El email ya está verificado',
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        emailVerified: true,
        emailVerifiedAt: new Date(),
      },
    });

    res.json({
      success: true,
      data: updatedUser,
      message: 'Email verificado exitosamente',
    });
  } catch (error) {
    console.error('Error al verificar email:', error);
    res.status(500).json({
      success: false,
      error: 'Error al verificar email',
    });
  }
};
