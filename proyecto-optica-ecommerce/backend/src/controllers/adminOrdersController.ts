import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Transiciones de estado permitidas
const transicionesPermitidas: Record<string, string[]> = {
  PENDIENTE_PAGO: ['PAGADO', 'CANCELADO'],
  PAGADO: ['PROCESANDO', 'CANCELADO'],
  PROCESANDO: ['LISTO_PARA_ENVIO', 'CANCELADO'],
  LISTO_PARA_ENVIO: ['ENVIADO', 'CANCELADO'],
  ENVIADO: ['EN_DISTRIBUCION', 'ENTREGADO'],
  EN_DISTRIBUCION: ['ENTREGADO', 'DEVOLUCION'],
  ENTREGADO: ['DEVOLUCION'],
  DEVOLUCION: ['REEMBOLSADO'],
};

function validarTransicion(estadoActual: string, nuevoEstado: string): boolean {
  return transicionesPermitidas[estadoActual]?.includes(nuevoEstado) || false;
}

// GET /api/admin/orders - Listar pedidos con filtros
export const getOrders = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '10',
      sort = 'desc',
      estadoPedido,
      estadoPago,
      fechaInicio,
      fechaFin,
      search,
      metodoPago,
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {};

    if (estadoPedido) {
      where.estadoPedido = estadoPedido;
    }

    if (estadoPago) {
      where.estadoPago = estadoPago;
    }

    if (metodoPago) {
      where.metodoPago = metodoPago;
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
        { numero: { contains: search as string, mode: 'insensitive' } },
        { user: { email: { contains: search as string, mode: 'insensitive' } } },
        { user: { name: { contains: search as string, mode: 'insensitive' } } },
      ];
    }

    // Obtener pedidos
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: sort === 'asc' ? 'asc' : 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  nombre: true,
                  imagenes: true,
                  sku: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    // Obtener estadísticas
    const stats = await prisma.order.groupBy({
      by: ['estadoPedido'],
      _count: { id: true },
    });

    const statsMap = stats.reduce((acc, stat) => {
      acc[stat.estadoPedido] = stat._count.id;
      return acc;
    }, {} as Record<string, number>);

    // Formatear respuesta
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      numero: order.numero,
      cliente: {
        id: order.user.id,
        nombre: order.user.name,
        email: order.user.email,
        telefono: order.user.phone,
      },
      total: order.total,
      estadoPedido: order.estadoPedido,
      estadoPago: order.estadoPago,
      metodoPago: order.metodoPago,
      createdAt: order.createdAt,
      itemsCount: order.items.length,
    }));

    res.json({
      success: true,
      data: formattedOrders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
      stats: {
        pendientes: statsMap.PENDIENTE_PAGO || 0,
        pagados: statsMap.PAGADO || 0,
        procesando: statsMap.PROCESANDO || 0,
        enviados: statsMap.ENVIADO || 0,
        entregados: statsMap.ENTREGADO || 0,
        cancelados: statsMap.CANCELADO || 0,
      },
    });
  } catch (error) {
    console.error('Error al obtener pedidos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener pedidos',
    });
  }
};

// GET /api/admin/orders/:id - Detalle de un pedido
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                nombre: true,
                marca: true,
                imagenes: true,
                sku: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    // Contar total de compras del cliente
    const totalComprasCliente = await prisma.order.count({
      where: { userId: order.userId },
    });

    const formattedOrder = {
      id: order.id,
      numero: order.numero,
      cliente: {
        id: order.user.id,
        nombre: order.user.name,
        email: order.user.email,
        telefono: order.user.phone,
        totalCompras: totalComprasCliente,
        clienteDesde: order.user.createdAt,
      },
      items: order.items.map((item) => ({
        id: item.id,
        producto: {
          id: item.product.id,
          nombre: item.product.nombre,
          marca: item.product.marca,
          imagen: item.product.imagenes?.[0] || null,
          sku: item.product.sku,
        },
        cantidad: item.cantidad,
        precioUnitario: item.precioUnit,
        subtotal: item.subtotal,
      })),
      montos: {
        subtotal: order.subtotal,
        descuento: order.descuento,
        costoEnvio: order.costoEnvio,
        total: order.total,
      },
      direccionEnvio: order.direccionEnvio,
      pago: {
        metodo: order.metodoPago,
        estado: order.estadoPago,
        fechaPago: order.fechaPago,
      },
      envio: {
        transportadora: order.transportadora,
        numeroGuia: order.numeroGuia,
        fechaEstimada: order.fechaEstimadaEntrega,
        fechaEnvio: order.fechaEnvio,
        fechaEntrega: order.fechaEntregaReal,
      },
      estados: {
        actual: order.estadoPedido,
        historial: order.historialEstados || [],
      },
      notas: {
        cliente: order.notasCliente,
        internas: order.notasInternas,
      },
      cancelacion: order.motivoCancelacion
        ? {
            motivo: order.motivoCancelacion,
            canceladoPor: order.canceladoPor,
          }
        : null,
      timestamps: {
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    };

    res.json({
      success: true,
      data: formattedOrder,
    });
  } catch (error) {
    console.error('Error al obtener pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener pedido',
    });
  }
};

// PUT /api/admin/orders/:id/estado - Actualizar estado del pedido
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { nuevoEstado, notificarCliente, notasInternas, transportadora, numeroGuia, fechaEstimadaEntrega } = req.body;
    const adminId = (req as any).user?.id;
    const adminEmail = (req as any).user?.email;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    // Validar transición de estado
    if (!validarTransicion(order.estadoPedido, nuevoEstado)) {
      return res.status(400).json({
        success: false,
        error: `No se puede cambiar de ${order.estadoPedido} a ${nuevoEstado}`,
      });
    }

    // Preparar datos de actualización
    const updateData: any = {
      estadoPedido: nuevoEstado,
      updatedAt: new Date(),
    };

    // Agregar al historial
    const nuevoHistorial = {
      estado: nuevoEstado,
      fecha: new Date().toISOString(),
      usuario: adminEmail || 'Admin',
      notas: notasInternas || '',
    };

    const historialActual = (order.historialEstados as any[]) || [];
    updateData.historialEstados = [...historialActual, nuevoHistorial];

    // Actualizar fechas y datos según estado
    if (nuevoEstado === 'PAGADO') {
      updateData.estadoPago = 'APROBADO';
      updateData.fechaPago = new Date();
    }

    if (nuevoEstado === 'ENVIADO') {
      updateData.fechaEnvio = new Date();
      if (transportadora) updateData.transportadora = transportadora;
      if (numeroGuia) updateData.numeroGuia = numeroGuia;
      if (fechaEstimadaEntrega) updateData.fechaEstimadaEntrega = new Date(fechaEstimadaEntrega);
    }

    if (nuevoEstado === 'ENTREGADO') {
      updateData.fechaEntrega = new Date();
      updateData.fechaEntregaReal = new Date();
    }

    if (notasInternas) {
      updateData.notasInternas = notasInternas;
    }

    updateData.procesadoPor = adminId;

    // Actualizar en BD
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // TODO: Enviar email si notificarCliente es true

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Estado actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar estado del pedido',
    });
  }
};

// POST /api/admin/orders/:id/notas - Agregar notas internas
export const addInternalNotes = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { nota } = req.body;
    const adminEmail = (req as any).user?.email;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    const notasActuales = order.notasInternas || '';
    const nuevaNota = `[${new Date().toLocaleString()}] ${adminEmail}: ${nota}`;
    const notasActualizadas = notasActuales ? `${notasActuales}\n${nuevaNota}` : nuevaNota;

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { notasInternas: notasActualizadas },
    });

    res.json({
      success: true,
      data: updatedOrder,
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

// POST /api/admin/orders/:id/cancelar - Cancelar pedido
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { motivo, reembolsar, notificarCliente } = req.body;
    const adminId = (req as any).user?.id;
    const adminEmail = (req as any).user?.email;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        items: {
          include: { product: true },
        },
      },
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    // Verificar que se puede cancelar
    const estadosNoCancelables = ['ENTREGADO', 'CANCELADO', 'REEMBOLSADO'];
    if (estadosNoCancelables.includes(order.estadoPedido)) {
      return res.status(400).json({
        success: false,
        error: `No se puede cancelar un pedido en estado ${order.estadoPedido}`,
      });
    }

    // Preparar datos de actualización
    const historialActual = (order.historialEstados as any[]) || [];
    const nuevoHistorial = {
      estado: 'CANCELADO',
      fecha: new Date().toISOString(),
      usuario: adminEmail || 'Admin',
      notas: `Cancelado: ${motivo}`,
    };

    const updateData: any = {
      estadoPedido: 'CANCELADO',
      motivoCancelacion: motivo,
      canceladoPor: adminId,
      historialEstados: [...historialActual, nuevoHistorial],
      updatedAt: new Date(),
    };

    if (reembolsar && order.estadoPago === 'APROBADO') {
      updateData.estadoPago = 'REEMBOLSADO';
    }

    // Devolver stock
    for (const item of order.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: { increment: item.cantidad },
        },
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // TODO: Enviar email si notificarCliente es true

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Pedido cancelado exitosamente',
    });
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
    res.status(500).json({
      success: false,
      error: 'Error al cancelar pedido',
    });
  }
};

// PUT /api/admin/orders/:id/envio - Actualizar información de envío
export const updateShippingInfo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { transportadora, numeroGuia, fechaEstimadaEntrega, notificarCliente } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado',
      });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (transportadora) updateData.transportadora = transportadora;
    if (numeroGuia) updateData.numeroGuia = numeroGuia;
    if (fechaEstimadaEntrega) updateData.fechaEstimadaEntrega = new Date(fechaEstimadaEntrega);

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: updateData,
    });

    // TODO: Enviar email si notificarCliente es true

    res.json({
      success: true,
      data: updatedOrder,
      message: 'Información de envío actualizada',
    });
  } catch (error) {
    console.error('Error al actualizar envío:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar información de envío',
    });
  }
};

// GET /api/admin/orders/stats - Estadísticas de pedidos
export const getOrderStats = async (req: Request, res: Response) => {
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

    const where = {
      createdAt: {
        gte: fechaInicio,
        lte: fechaFin,
      },
    };

    // Total pedidos y ingresos
    const [totalPedidos, totalIngresos, porEstado, porMetodoPago] = await Promise.all([
      prisma.order.count({ where }),
      prisma.order.aggregate({
        where: { ...where, estadoPago: 'APROBADO' },
        _sum: { total: true },
      }),
      prisma.order.groupBy({
        by: ['estadoPedido'],
        where,
        _count: { id: true },
      }),
      prisma.order.groupBy({
        by: ['metodoPago'],
        where,
        _count: { id: true },
      }),
    ]);

    const estadosMap = porEstado.reduce((acc, item) => {
      acc[item.estadoPedido] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    const metodosMap = porMetodoPago.reduce((acc, item) => {
      acc[item.metodoPago] = item._count.id;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      data: {
        periodo,
        totalPedidos,
        totalIngresos: totalIngresos._sum.total || 0,
        pedidoPromedio: totalPedidos > 0 ? (totalIngresos._sum.total || 0) / totalPedidos : 0,
        porEstado: estadosMap,
        porMetodoPago: metodosMap,
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
