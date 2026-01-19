# 📦 MÓDULO DE GESTIÓN DE PEDIDOS - PANEL ADMIN

## 🎯 ANÁLISIS DE FUNCIONALIDADES

### ✅ Funciones Esenciales (MUST HAVE)

```typescript
// Funcionalidades críticas para operación del negocio

1. VISUALIZACIÓN Y FILTRADO
   ✓ Listado completo de pedidos
   ✓ Filtrar por rango de fechas
   ✓ Filtrar por cliente
   ✓ Filtrar por estado del pedido
   ✓ Filtrar por estado de pago
   ✓ Filtrar por método de pago
   ✓ Búsqueda por número de orden
   ✓ Búsqueda por email del cliente

2. GESTIÓN DE ESTADOS
   ✓ Cambiar estado del pedido (Procesando → Enviado → Entregado)
   ✓ Cambiar estado de pago (Pendiente → Pagado → Fallido)
   ✓ Marcar pedido como completado
   ✓ Cancelar pedido (con razón)

3. DETALLES DEL PEDIDO
   ✓ Ver información completa del cliente
   ✓ Ver productos ordenados (con imágenes, cantidades, precios)
   ✓ Ver dirección de envío
   ✓ Ver método de pago
   ✓ Ver historial de cambios de estado
   ✓ Ver notas del cliente

4. COMUNICACIÓN
   ✓ Agregar notas internas (no visibles para cliente)
   ✓ Enviar email de actualización al cliente
   ✓ Notificar cambio de estado automáticamente

5. DOCUMENTACIÓN
   ✓ Imprimir/Descargar orden de compra
   ✓ Imprimir/Descargar guía de envío
   ✓ Imprimir/Descargar factura
   ✓ Exportar pedidos a Excel/CSV

6. MÉTRICAS Y REPORTES
   ✓ Dashboard con estadísticas
   ✓ Pedidos del día/semana/mes
   ✓ Ingresos totales por período
   ✓ Productos más vendidos
   ✓ Clientes frecuentes
```

### 🚀 Funciones Avanzadas (NICE TO HAVE)

```typescript
// Funcionalidades que mejoran la operación

1. AUTOMATIZACIÓN
   ✓ Envío automático de emails según estado
   ✓ Actualización automática de inventario
   ✓ Generación automática de número de tracking
   ✓ Alertas de pedidos pendientes > 24h

2. LOGÍSTICA
   ✓ Asignar pedido a transportadora
   ✓ Generar número de guía/tracking
   ✓ Integración con API de transportadora
   ✓ Calcular peso/dimensiones del paquete

3. GESTIÓN AVANZADA
   ✓ Editar pedido (agregar/quitar productos)
   ✓ Aplicar descuentos adicionales
   ✓ Dividir pedido en múltiples envíos
   ✓ Reembolsos parciales/totales

4. ANÁLISIS
   ✓ Tiempo promedio de procesamiento
   ✓ Tasa de cancelación
   ✓ Mapa de calor de ventas por región
   ✓ Predicción de ventas

5. ATENCIÓN AL CLIENTE
   ✓ Chat integrado con cliente
   ✓ Historial de comunicaciones
   ✓ Sistema de tickets de soporte
   ✓ Valoración del servicio
```

### ⚡ Funciones Específicas para Óptica

```typescript
// Funcionalidades del sector óptico

1. PRESCRIPCIONES MÉDICAS
   ✓ Ver fórmula médica adjunta
   ✓ Validar prescripción antes de enviar
   ✓ Marcar si requiere verificación médica
   ✓ Historial de prescripciones del cliente

2. PERSONALIZACIÓN
   ✓ Ver especificaciones de lentes (graduación, tipo)
   ✓ Notas de personalización de monturas
   ✓ Tiempo de fabricación estimado
   ✓ Estado de fabricación personalizada

3. GARANTÍAS
   ✓ Registrar garantía del producto
   ✓ Gestionar cambios por garantía
   ✓ Seguimiento de reparaciones
```

---

## 📋 ESTADOS DEL PEDIDO

### Estados Principales

```typescript
enum EstadoPedido {
  PENDIENTE_PAGO = 'pendiente_pago',        // Orden creada, esperando pago
  PAGADO = 'pagado',                        // Pago confirmado
  PROCESANDO = 'procesando',                // Preparando el pedido
  LISTO_PARA_ENVIO = 'listo_para_envio',   // Empacado, esperando recolección
  ENVIADO = 'enviado',                      // En tránsito
  EN_DISTRIBUCION = 'en_distribucion',      // Último tramo de entrega
  ENTREGADO = 'entregado',                  // Completado exitosamente
  CANCELADO = 'cancelado',                  // Cancelado por admin/cliente
  DEVOLUCION = 'devolucion',                // Cliente solicitó devolución
  REEMBOLSADO = 'reembolsado'              // Dinero devuelto
}

enum EstadoPago {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  REEMBOLSADO = 'reembolsado'
}
```

### Transiciones Permitidas

```typescript
// Flujo normal de un pedido
PENDIENTE_PAGO → PAGADO → PROCESANDO → LISTO_PARA_ENVIO → 
ENVIADO → EN_DISTRIBUCION → ENTREGADO

// Flujos alternativos
PENDIENTE_PAGO → CANCELADO (si no paga en 24h)
PAGADO → CANCELADO (cancelación temprana)
PROCESANDO → CANCELADO (problemas de stock)
ENVIADO → DEVOLUCION → REEMBOLSADO
```

---

## 💻 PROMPT PARA BACKEND - MÓDULO DE PEDIDOS ADMIN

```
Actúa como arquitecto backend senior especializado en sistemas de gestión de pedidos para e-commerce.

CONTEXTO:
Desarrollar el módulo completo de gestión de pedidos para el panel administrativo de un e-commerce de óptica. Los pedidos ya están siendo creados por clientes, ahora necesitamos que los administradores puedan gestionarlos eficientemente.

ARQUITECTURA BACKEND:
- Node.js + Express + TypeScript
- PostgreSQL con Prisma ORM
- Base de datos ya tiene tabla Orders y OrderItems

MODELO DE DOMINIO EXTENDIDO:

```prisma
model Order {
  id                String        @id @default(cuid())
  numeroOrden       String        @unique  // OP-2024-0001
  
  // Relaciones
  userId            String
  user              User          @relation(fields: [userId], references: [id])
  items             OrderItem[]
  
  // Montos
  subtotal          Float
  descuento         Float         @default(0)
  costoEnvio        Float
  total             Float
  
  // Estados
  estadoPedido      EstadoPedido  @default(PENDIENTE_PAGO)
  estadoPago        EstadoPago    @default(PENDIENTE)
  
  // Información de envío
  direccionEnvio    Json          // { nombre, direccion, ciudad, departamento, telefono }
  metodoPago        MetodoPago
  metodoPagoInfo    Json?         // Info adicional del pago
  
  // Logística
  transportadora    String?
  numeroGuia        String?
  fechaEstimadaEntrega DateTime?
  fechaEntregaReal  DateTime?
  
  // Notas y comunicación
  notasCliente      String?       @db.Text
  notasInternas     String?       @db.Text  // Solo visible para admin
  
  // Auditoría
  historialEstados  Json[]        // Array de cambios de estado con timestamp
  procesadoPor      String?       // ID del admin que procesó
  canceladoPor      String?       // ID de quien canceló
  motivoCancelacion String?
  
  // Timestamps
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  fechaPago         DateTime?
  fechaEnvio        DateTime?
  fechaEntrega      DateTime?
  
  @@index([userId])
  @@index([estadoPedido])
  @@index([estadoPago])
  @@index([createdAt])
  @@index([numeroOrden])
}

model OrderItem {
  id              String   @id @default(cuid())
  orderId         String
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  productId       String
  product         Product  @relation(fields: [productId], references: [id])
  
  cantidad        Int
  precioUnitario  Float
  subtotal        Float
  
  // Específico de óptica
  personalizacion Json?    // Graduación, especificaciones de lentes
  
  @@index([orderId])
  @@index([productId])
}

enum EstadoPedido {
  PENDIENTE_PAGO
  PAGADO
  PROCESANDO
  LISTO_PARA_ENVIO
  ENVIADO
  EN_DISTRIBUCION
  ENTREGADO
  CANCELADO
  DEVOLUCION
  REEMBOLSADO
}

enum EstadoPago {
  PENDIENTE
  APROBADO
  RECHAZADO
  REEMBOLSADO
}

enum MetodoPago {
  TARJETA_CREDITO
  TARJETA_DEBITO
  PSE
  EFECTIVO_CONTRAENTREGA
  TRANSFERENCIA
}
```

ENDPOINTS REQUERIDOS:

1. LISTADO Y FILTRADO:

GET /api/admin/orders?page=1&limit=20&sort=desc
Query params:
- page, limit (paginación)
- sort (asc/desc por fecha)
- estadoPedido (filtro múltiple)
- estadoPago (filtro múltiple)
- fechaInicio, fechaFin (rango de fechas)
- clienteId (filtro por cliente)
- search (búsqueda por número orden o email)
- metodoPago (filtro por método)

Response:
{
  success: true,
  data: [
    {
      id: "clx123",
      numeroOrden: "OP-2024-0001",
      cliente: {
        nombre: "Juan Pérez",
        email: "juan@example.com",
        telefono: "3001234567"
      },
      total: 234990,
      estadoPedido: "PROCESANDO",
      estadoPago: "APROBADO",
      createdAt: "2024-01-15T10:30:00Z",
      itemsCount: 2
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8
  },
  stats: {
    pendientes: 12,
    procesando: 8,
    enviados: 25,
    entregados: 105
  }
}

2. DETALLE COMPLETO:

GET /api/admin/orders/:id

Response:
{
  success: true,
  data: {
    id: "clx123",
    numeroOrden: "OP-2024-0001",
    
    cliente: {
      id: "user123",
      nombre: "Juan Pérez",
      email: "juan@example.com",
      telefono: "3001234567",
      totalCompras: 3,
      clienteDesde: "2023-08-15T00:00:00Z"
    },
    
    items: [
      {
        id: "item1",
        producto: {
          id: "prod1",
          nombre: "Ray-Ban Aviator",
          imagen: "https://...",
          sku: "RB-3025-001"
        },
        cantidad: 1,
        precioUnitario: 89990,
        subtotal: 89990,
        personalizacion: {
          graduacion: "OD: -2.00 OS: -1.75",
          tipoLente: "transitions"
        }
      }
    ],
    
    montos: {
      subtotal: 89990,
      descuento: 0,
      costoEnvio: 8000,
      total: 97990
    },
    
    direccionEnvio: {
      nombre: "Juan Pérez",
      direccion: "Calle 123 #45-67, Apto 801",
      ciudad: "Bogotá",
      departamento: "Cundinamarca",
      telefono: "3001234567",
      instrucciones: "Portería recibe paquetes"
    },
    
    pago: {
      metodo: "TARJETA_CREDITO",
      estado: "APROBADO",
      fechaPago: "2024-01-15T10:32:00Z",
      referencia: "PSE-12345678"
    },
    
    envio: {
      transportadora: "Servientrega",
      numeroGuia: "987654321",
      fechaEstimada: "2024-01-18T00:00:00Z",
      fechaEnvio: "2024-01-16T14:20:00Z"
    },
    
    estados: {
      actual: "ENVIADO",
      historial: [
        {
          estado: "PENDIENTE_PAGO",
          fecha: "2024-01-15T10:30:00Z",
          usuario: "Sistema"
        },
        {
          estado: "PAGADO",
          fecha: "2024-01-15T10:32:00Z",
          usuario: "Sistema"
        },
        {
          estado: "PROCESANDO",
          fecha: "2024-01-15T11:00:00Z",
          usuario: "admin@optivision.com",
          notas: "Pedido verificado y empacado"
        },
        {
          estado: "ENVIADO",
          fecha: "2024-01-16T14:20:00Z",
          usuario: "admin@optivision.com",
          notas: "Entregado a transportadora"
        }
      ]
    },
    
    notas: {
      cliente: "Por favor entregar en horario de oficina",
      internas: "Cliente VIP, priorizar entrega"
    },
    
    timestamps: {
      createdAt: "2024-01-15T10:30:00Z",
      updatedAt: "2024-01-16T14:20:00Z"
    }
  }
}

3. ACTUALIZAR ESTADO:

PUT /api/admin/orders/:id/estado

Body:
{
  nuevoEstado: "ENVIADO",
  notificarCliente: true,
  notasInternas: "Entregado a Servientrega",
  transportadora?: "Servientrega",
  numeroGuia?: "987654321",
  fechaEstimadaEntrega?: "2024-01-18"
}

Response:
{
  success: true,
  data: { ...orden actualizada... },
  message: "Estado actualizado exitosamente"
}

Validaciones:
- Verificar transición de estado válida
- Solo admin puede cambiar estado
- Registrar en historial con timestamp y usuario
- Enviar email al cliente si notificarCliente=true
- Actualizar fechas relevantes (fechaEnvio, fechaEntrega)

4. AGREGAR NOTAS INTERNAS:

POST /api/admin/orders/:id/notas

Body:
{
  nota: "Cliente llamó para confirmar dirección"
}

5. CANCELAR PEDIDO:

POST /api/admin/orders/:id/cancelar

Body:
{
  motivo: "Producto sin stock",
  reembolsar: true,
  notificarCliente: true
}

Lógica:
- Cambiar estado a CANCELADO
- Si reembolsar=true y ya pagó, cambiar estadoPago a REEMBOLSADO
- Devolver stock de productos al inventario
- Registrar motivo de cancelación
- Enviar email al cliente

6. EXPORTAR PEDIDOS:

GET /api/admin/orders/export?format=csv&fechaInicio=...&fechaFin=...

Response: Archivo CSV con todos los pedidos del período

7. ESTADÍSTICAS:

GET /api/admin/orders/stats?periodo=mes

Response:
{
  success: true,
  data: {
    periodo: "enero 2024",
    totalPedidos: 156,
    totalIngresos: 12450990,
    pedidoPromedio: 79814,
    
    porEstado: {
      PENDIENTE_PAGO: 8,
      PROCESANDO: 12,
      ENVIADO: 15,
      ENTREGADO: 115,
      CANCELADO: 6
    },
    
    porMetodoPago: {
      TARJETA_CREDITO: 89,
      PSE: 45,
      EFECTIVO_CONTRAENTREGA: 22
    },
    
    productosTopVendidos: [
      {
        producto: "Ray-Ban Aviator",
        cantidad: 45,
        ingresos: 4049550
      }
    ],
    
    clientesTopCompradores: [
      {
        cliente: "Juan Pérez",
        pedidos: 5,
        totalGastado: 450000
      }
    ],
    
    metricas: {
      tiempoPromedioEntrega: "3.2 días",
      tasaCancelacion: "3.8%",
      tasaDevolucion: "1.2%"
    }
  }
}

8. BÚSQUEDA AVANZADA:

POST /api/admin/orders/search

Body:
{
  query: "juan@example.com",
  filtros: {
    estadoPedido: ["PROCESANDO", "ENVIADO"],
    rangoTotal: { min: 50000, max: 200000 },
    categoria: "MONTURAS_SOL"
  }
}

9. ACTUALIZAR INFORMACIÓN DE ENVÍO:

PUT /api/admin/orders/:id/envio

Body:
{
  transportadora: "Servientrega",
  numeroGuia: "987654321",
  fechaEstimadaEntrega: "2024-01-18",
  notificarCliente: true
}

10. IMPRIMIR DOCUMENTOS:

GET /api/admin/orders/:id/print/orden        # Orden de compra
GET /api/admin/orders/:id/print/guia         # Guía de envío
GET /api/admin/orders/:id/print/factura      # Factura

Response: PDF generado para imprimir

CARACTERÍSTICAS TÉCNICAS:

1. VALIDACIONES:
   - Solo usuarios con role=ADMIN pueden acceder
   - Validar transiciones de estado permitidas
   - Validar que el pedido existe antes de actualizar
   - Validar formato de fechas y montos

2. SEGURIDAD:
   - Middleware de autenticación (authMiddleware)
   - Middleware de autorización admin (isAdmin)
   - Registrar todas las acciones en logs de auditoría
   - No permitir eliminar pedidos (solo cancelar)

3. PERFORMANCE:
   - Índices en campos de búsqueda frecuente
   - Paginación eficiente con cursor
   - Cache de estadísticas (Redis opcional)
   - Lazy loading de relaciones pesadas

4. NOTIFICACIONES:
   - Email automático cuando cambia estado
   - Templates de email por cada estado
   - Sistema de queue para envío async (opcional)

5. AUDITORÍA:
   - Registrar quién y cuándo cambió cada estado
   - Guardar historial completo de cambios
   - No permitir borrar historial

EJEMPLOS DE CONTROLADORES:

```typescript
// controllers/adminOrdersController.ts

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nuevoEstado, notificarCliente, notasInternas, ...datosEnvio } = req.body;
    const adminId = req.user.id;

    // 1. Obtener orden actual
    const orden = await prisma.order.findUnique({
      where: { id },
      include: { user: true, items: { include: { product: true } } }
    });

    if (!orden) {
      return res.status(404).json({
        success: false,
        error: 'Pedido no encontrado'
      });
    }

    // 2. Validar transición de estado
    const transicionValida = validarTransicion(orden.estadoPedido, nuevoEstado);
    if (!transicionValida) {
      return res.status(400).json({
        success: false,
        error: `No se puede cambiar de ${orden.estadoPedido} a ${nuevoEstado}`
      });
    }

    // 3. Preparar datos de actualización
    const updateData: any = {
      estadoPedido: nuevoEstado,
      updatedAt: new Date(),
    };

    // 4. Agregar al historial
    const nuevoHistorial = {
      estado: nuevoEstado,
      fecha: new Date().toISOString(),
      usuario: req.user.email,
      notas: notasInternas || ''
    };

    updateData.historialEstados = {
      push: nuevoHistorial
    };

    // 5. Actualizar fechas según estado
    if (nuevoEstado === 'ENVIADO') {
      updateData.fechaEnvio = new Date();
      updateData.transportadora = datosEnvio.transportadora;
      updateData.numeroGuia = datosEnvio.numeroGuia;
      updateData.fechaEstimadaEntrega = datosEnvio.fechaEstimadaEntrega;
    }

    if (nuevoEstado === 'ENTREGADO') {
      updateData.fechaEntrega = new Date();
      updateData.fechaEntregaReal = new Date();
    }

    // 6. Actualizar notas internas
    if (notasInternas) {
      updateData.notasInternas = notasInternas;
    }

    // 7. Actualizar en BD
    const ordenActualizada = await prisma.order.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // 8. Enviar email si se solicitó
    if (notificarCliente) {
      await enviarEmailEstado(ordenActualizada, nuevoEstado);
    }

    res.json({
      success: true,
      data: ordenActualizada,
      message: 'Estado actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar estado:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar estado del pedido'
    });
  }
};

// Función auxiliar para validar transiciones
function validarTransicion(estadoActual: string, nuevoEstado: string): boolean {
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

  return transicionesPermitidas[estadoActual]?.includes(nuevoEstado) || false;
}
```

ENTREGABLES:
1. Todos los endpoints funcionando
2. Validaciones completas
3. Sistema de auditoría implementado
4. Emails transaccionales configurados
5. Exportación a CSV/Excel
6. Generación de PDFs para impresión
7. Documentación de API con ejemplos
8. Tests básicos de endpoints críticos

```

---

## 🎨 PROMPT PARA FRONTEND - PANEL ADMIN PEDIDOS

```
Actúa como desarrollador frontend senior especializado en paneles administrativos para e-commerce.

CONTEXTO:
Desarrollar la interfaz completa del módulo de gestión de pedidos para el panel admin. El backend ya está listo con todos los endpoints necesarios.

ARQUITECTURA FRONTEND:
- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- React Hook Form
- React Hot Toast (notificaciones)
- Lucide React (iconos)
- date-fns (manejo de fechas)
- recharts (gráficos)

PÁGINAS Y COMPONENTES REQUERIDOS:

1. PÁGINA PRINCIPAL: Lista de Pedidos
   Ruta: /admin/orders

Componentes:
- Header con:
  * Título "Gestión de Pedidos"
  * Botón "Exportar a Excel"
  * Filtros rápidos (Hoy, Esta semana, Este mes)
  * Búsqueda por número de orden o email

- Sidebar de filtros:
  * Estado del pedido (checkboxes múltiples)
  * Estado de pago (checkboxes)
  * Rango de fechas (date picker)
  * Método de pago (select)
  * Rango de monto (sliders)
  * Botón "Aplicar filtros"
  * Botón "Limpiar filtros"

- Tabla de pedidos (responsive):
  Columnas:
  * Número de orden (link al detalle)
  * Cliente (nombre + email)
  * Fecha
  * Total
  * Estado del pedido (badge con color)
  * Estado de pago (badge)
  * Acciones (ver detalle, cambiar estado)

- Paginación:
  * Anterior / Siguiente
  * Selector de items por página (10, 20, 50)
  * Total de resultados

- Stats Cards (arriba de la tabla):
  * Total pedidos hoy
  * Total ingresos hoy
  * Pedidos pendientes
  * Pedidos en proceso

Diseño:
```tsx
<div className="p-6">
  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <StatsCard 
      title="Pedidos Hoy"
      value={24}
      change="+12%"
      icon={<ShoppingBag />}
      color="blue"
    />
    {/* ...más cards */}
  </div>

  {/* Filtros y búsqueda */}
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="flex flex-col md:flex-row gap-4">
      <SearchBar />
      <QuickFilters />
      <ExportButton />
    </div>
  </div>

  <div className="flex gap-6">
    {/* Sidebar de filtros */}
    <aside className="w-64 bg-white rounded-lg shadow p-4">
      <FiltersSidebar />
    </aside>

    {/* Tabla principal */}
    <main className="flex-1">
      <OrdersTable />
      <Pagination />
    </main>
  </div>
</div>
```

Estados de color para badges:
```typescript
const estadoColors = {
  PENDIENTE_PAGO: 'bg-yellow-100 text-yellow-800',
  PAGADO: 'bg-green-100 text-green-800',
  PROCESANDO: 'bg-blue-100 text-blue-800',
  LISTO_PARA_ENVIO: 'bg-indigo-100 text-indigo-800',
  ENVIADO: 'bg-purple-100 text-purple-800',
  EN_DISTRIBUCION: 'bg-orange-100 text-orange-800',
  ENTREGADO: 'bg-emerald-100 text-emerald-800',
  CANCELADO: 'bg-red-100 text-red-800',
  DEVOLUCION: 'bg-amber-100 text-amber-800',
  REEMBOLSADO: 'bg-gray-100 text-gray-800'
};
```

2. PÁGINA DE DETALLE: Ver Pedido Completo
   Ruta: /admin/orders/:id

Layout en pestañas (tabs):

TAB 1 - INFORMACIÓN GENERAL:
```tsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Columna izquierda - Info del pedido */}
  <div className="lg:col-span-2 space-y-6">
    {/* Card: Información del pedido */}
    <Card title="Pedido #OP-2024-0001">
      - Fecha de creación
      - Estado actual con badge
      - Botón "Cambiar estado"
      - Timeline de estados
    </Card>

    {/* Card: Productos ordenados */}
    <Card title="Productos (2 items)">
      {products.map(item => (
        <OrderItemCard 
          imagen={item.imagen}
          nombre={item.nombre}
          sku={item.sku}
          cantidad={item.cantidad}
          precio={item.precioUnitario}
          subtotal={item.subtotal}
          personalizacion={item.personalizacion}
        />
      ))}
      
      {/* Resumen de montos */}
      <div className="border-t pt-4 mt-4">
        <div>Subtotal: $89,990</div>
        <div>Envío: $8,000</div>
        <div className="font-bold text-lg">Total: $97,990</div>
      </div>
    </Card>

    {/* Card: Dirección de envío */}
    <Card title="Dirección de Envío">
      - Nombre completo
      - Dirección completa
      - Ciudad/Departamento
      - Teléfono
      - Instrucciones especiales
    </Card>
  </div>

  {/* Columna derecha - Info del cliente y acciones */}
  <div className="space-y-6">
    {/* Card: Cliente */}
    <Card title="Cliente">
      