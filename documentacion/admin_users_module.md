# 👥 MÓDULO DE GESTIÓN DE USUARIOS - PANEL ADMIN

## 🎯 ANÁLISIS DE FUNCIONALIDADES

### ✅ Funciones Esenciales (MUST HAVE)

```typescript
// Funcionalidades críticas para gestión de usuarios

1. VISUALIZACIÓN Y FILTRADO
   ✓ Listado completo de usuarios (clientes y admins)
   ✓ Filtrar por rol (Cliente, Admin)
   ✓ Filtrar por estado (Activo, Inactivo, Bloqueado)
   ✓ Filtrar por fecha de registro
   ✓ Búsqueda por nombre, email o teléfono
   ✓ Ordenar por: nombre, fecha registro, total compras

2. GESTIÓN BÁSICA
   ✓ Ver perfil completo del usuario
   ✓ Editar información del usuario
   ✓ Activar/desactivar cuenta
   ✓ Bloquear/desbloquear usuario
   ✓ Cambiar rol (Cliente ↔ Admin)
   ✓ Resetear contraseña
   ✓ Eliminar cuenta (soft delete)

3. INFORMACIÓN DEL USUARIO
   ✓ Datos personales (nombre, email, teléfono)
   ✓ Fecha de registro
   ✓ Última actividad
   ✓ Estado de la cuenta
   ✓ Rol actual
   ✓ Direcciones guardadas
   ✓ Métodos de pago guardados

4. HISTORIAL Y ACTIVIDAD
   ✓ Historial de compras completo
   ✓ Total gastado histórico
   ✓ Productos comprados frecuentemente
   ✓ Carrito actual
   ✓ Lista de deseos
   ✓ Pedidos activos

5. COMUNICACIÓN
   ✓ Enviar email individual al usuario
   ✓ Enviar email masivo a grupo de usuarios
   ✓ Plantillas de email predefinidas
   ✓ Historial de comunicaciones

6. SEGURIDAD Y AUDITORÍA
   ✓ Registro de accesos (login/logout)
   ✓ Intentos fallidos de login
   ✓ Cambios en el perfil (auditoría)
   ✓ Direcciones IP de acceso
   ✓ Dispositivos utilizados

7. REPORTES Y MÉTRICAS
   ✓ Total de usuarios registrados
   ✓ Nuevos usuarios por período
   ✓ Tasa de retención
   ✓ Usuarios activos vs inactivos
   ✓ Clientes VIP (más compras)
   ✓ Exportar lista de usuarios
```

### 🚀 Funciones Avanzadas (NICE TO HAVE)

```typescript
// Funcionalidades que mejoran la gestión

1. SEGMENTACIÓN
   ✓ Crear segmentos de usuarios (VIP, Nuevos, Inactivos)
   ✓ Etiquetar usuarios (Problemático, Preferente, etc.)
   ✓ Grupos personalizados
   ✓ Filtros avanzados combinados

2. ANÁLISIS DE COMPORTAMIENTO
   ✓ Productos más vistos por usuario
   ✓ Tiempo promedio en sitio
   ✓ Tasa de conversión por usuario
   ✓ Carrito abandonado
   ✓ Predicción de churn (abandono)

3. PROGRAMA DE FIDELIZACIÓN
   ✓ Sistema de puntos/recompensas
   ✓ Niveles de membresía (Bronze, Silver, Gold)
   ✓ Descuentos personalizados
   ✓ Cupones exclusivos

4. MARKETING
   ✓ Campañas de email marketing
   ✓ Notificaciones push
   ✓ SMS marketing
   ✓ Seguimiento de conversiones

5. SOPORTE
   ✓ Tickets de soporte por usuario
   ✓ Chat history
   ✓ Calificaciones de servicio
   ✓ Notas de atención al cliente

6. VERIFICACIÓN
   ✓ Verificación de email
   ✓ Verificación de teléfono
   ✓ Verificación de identidad (KYC)
   ✓ Documentos adjuntos
```

### ⚡ Funciones Específicas para Óptica

```typescript
// Funcionalidades del sector óptico

1. PERFIL MÉDICO
   ✓ Historial de prescripciones médicas
   ✓ Fórmulas médicas guardadas
   ✓ Graduación actual (OD/OS)
   ✓ Fecha de último examen visual
   ✓ Recordatorio de examen visual anual

2. PREFERENCIAS DE PRODUCTOS
   ✓ Marcas favoritas
   ✓ Formas de montura preferidas
   ✓ Colores preferidos
   ✓ Historial de estilos comprados

3. GARANTÍAS Y SERVICIOS
   ✓ Productos en garantía
   ✓ Historial de ajustes de monturas
   ✓ Servicios postventa utilizados
   ✓ Reparaciones realizadas
```

---

## 📋 ESTADOS Y ROLES DEL USUARIO

### Roles del Sistema

```typescript
enum Role {
  CLIENTE = 'cliente',           // Usuario regular
  ADMIN = 'admin',               // Administrador completo
  SUPER_ADMIN = 'super_admin'    // Admin con todos los permisos
}
```

### Estados de la Cuenta

```typescript
enum EstadoCuenta {
  ACTIVO = 'activo',             // Cuenta activa y funcional
  INACTIVO = 'inactivo',         // No ha iniciado sesión en 90+ días
  BLOQUEADO = 'bloqueado',       // Bloqueado por admin (fraude, etc.)
  PENDIENTE = 'pendiente',       // Email no verificado
  ELIMINADO = 'eliminado'        // Soft delete
}
```

### Niveles de Cliente (Opcional)

```typescript
enum NivelCliente {
  NUEVO = 'nuevo',               // 0-1 compras
  REGULAR = 'regular',           // 2-5 compras
  FRECUENTE = 'frecuente',       // 6-10 compras
  VIP = 'vip',                   // 10+ compras
  PLATINUM = 'platinum'          // Clientes especiales
}
```

---

## 💻 PROMPT PARA BACKEND - MÓDULO DE USUARIOS ADMIN

```
Actúa como arquitecto backend senior especializado en sistemas de gestión de usuarios para plataformas e-commerce.

CONTEXTO:
Desarrollar el módulo completo de gestión de usuarios para el panel administrativo de un e-commerce de óptica. Los usuarios (clientes y admins) ya existen en la base de datos, ahora necesitamos que los administradores puedan gestionarlos eficientemente.

ARQUITECTURA BACKEND:
- Node.js + Express + TypeScript
- PostgreSQL con Prisma ORM
- Sistema de autenticación con JWT ya implementado

MODELO DE DOMINIO EXTENDIDO:

```prisma
model User {
  id                String         @id @default(cuid())
  email             String         @unique
  password          String         // Hasheado con bcrypt
  name              String
  phone             String?
  
  // Roles y estado
  role              Role           @default(CLIENTE)
  estado            EstadoCuenta   @default(ACTIVO)
  nivelCliente      NivelCliente?  @default(NUEVO)
  
  // Información adicional
  avatar            String?
  fechaNacimiento   DateTime?
  genero            Genero?
  
  // Verificaciones
  emailVerified     Boolean        @default(false)
  emailVerifiedAt   DateTime?
  phoneVerified     Boolean        @default(false)
  
  // Específico de óptica
  prescripciones    Json[]         // Historial de fórmulas médicas
  ultimoExamenVisual DateTime?
  
  // Preferencias
  preferencias      Json?          // Marcas favoritas, estilos, etc.
  
  // Seguridad y auditoría
  lastLogin         DateTime?
  loginAttempts     Int            @default(0)
  blockedAt         DateTime?
  blockedBy         String?        // ID del admin que bloqueó
  motivoBloqueo     String?
  deletedAt         DateTime?      // Soft delete
  deletedBy         String?
  
  // Notas internas (solo admin)
  notasInternas     String?        @db.Text
  etiquetas         String[]       // ["VIP", "Problemático", etc.]
  
  // Relaciones
  orders            Order[]
  addresses         Address[]
  cart              Cart?
  wishlist          Wishlist[]
  
  // Metadatos
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  // Estadísticas calculadas (actualizar periódicamente)
  totalCompras      Int            @default(0)
  totalGastado      Float          @default(0)
  
  @@index([email])
  @@index([role])
  @@index([estado])
  @@index([createdAt])
  @@index([nivelCliente])
}

model Address {
  id              String    @id @default(cuid())
  userId          String
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  nombre          String
  direccion       String
  ciudad          String
  departamento    String
  codigoPostal    String?
  telefono        String
  
  esPrincipal     Boolean   @default(false)
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  
  @@index([userId])
}

model AuditLog {
  id              String    @id @default(cuid())
  userId          String    // Usuario afectado
  adminId         String?   // Admin que realizó la acción
  
  accion          String    // "cambio_rol", "bloqueo", "edicion_perfil"
  detalles        Json      // Datos antes/después
  
  ip              String?
  userAgent       String?
  
  createdAt       DateTime  @default(now())
  
  @@index([userId])
  @@index([adminId])
  @@index([createdAt])
}

enum Role {
  CLIENTE
  ADMIN
  SUPER_ADMIN
}

enum EstadoCuenta {
  ACTIVO
  INACTIVO
  BLOQUEADO
  PENDIENTE
  ELIMINADO
}

enum NivelCliente {
  NUEVO
  REGULAR
  FRECUENTE
  VIP
  PLATINUM
}

enum Genero {
  MASCULINO
  FEMENINO
  OTRO
  PREFIERO_NO_DECIR
}
```

ENDPOINTS REQUERIDOS:

1. LISTADO Y FILTRADO DE USUARIOS:

GET /api/admin/users?page=1&limit=20&sort=desc

Query params:
- page, limit (paginación)
- sort (asc/desc)
- role (CLIENTE, ADMIN)
- estado (ACTIVO, INACTIVO, BLOQUEADO)
- nivelCliente (NUEVO, REGULAR, VIP)
- fechaRegistroInicio, fechaRegistroFin
- search (nombre, email, teléfono)
- etiquetas (filtro por etiquetas)
- minCompras, maxCompras
- minGastado, maxGastado

Response:
{
  success: true,
  data: [
    {
      id: "user123",
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "3001234567",
      role: "CLIENTE",
      estado: "ACTIVO",
      nivelCliente: "REGULAR",
      totalCompras: 3,
      totalGastado: 450000,
      lastLogin: "2024-01-15T10:30:00Z",
      createdAt: "2023-08-15T00:00:00Z",
      emailVerified: true,
      etiquetas: ["VIP"]
    }
  ],
  pagination: {
    page: 1,
    limit: 20,
    total: 1250,
    totalPages: 63
  },
  stats: {
    totalUsuarios: 1250,
    activos: 980,
    bloqueados: 15,
    nuevosEsteMes: 45
  }
}

2. DETALLE COMPLETO DEL USUARIO:

GET /api/admin/users/:id

Response:
{
  success: true,
  data: {
    // Información básica
    perfil: {
      id: "user123",
      name: "Juan Pérez",
      email: "juan@example.com",
      phone: "3001234567",
      avatar: "https://...",
      fechaNacimiento: "1985-05-20",
      genero: "MASCULINO",
      role: "CLIENTE",
      estado: "ACTIVO",
      nivelCliente: "VIP"
    },
    
    // Verificaciones
    verificaciones: {
      emailVerified: true,
      emailVerifiedAt: "2023-08-15T10:00:00Z",
      phoneVerified: false
    },
    
    // Estadísticas
    estadisticas: {
      totalCompras: 12,
      totalGastado: 1250000,
      pedidoPromedio: 104166,
      ultimaCompra: "2024-01-10T15:30:00Z",
      clienteDesde: "2023-08-15",
      diasDesdeUltimaCompra: 9
    },
    
    // Direcciones guardadas
    direcciones: [
      {
        id: "addr1",
        nombre: "Casa",
        direccion: "Calle 123 #45-67",
        ciudad: "Bogotá",
        esPrincipal: true
      }
    ],
    
    // Prescripciones médicas (específico óptica)
    prescripciones: [
      {
        fecha: "2023-12-01",
        OD: "-2.00",
        OS: "-1.75",
        medico: "Dr. García",
        archivo: "https://..."
      }
    ],
    
    // Preferencias
    preferencias: {
      marcasFavoritas: ["Ray-Ban", "Oakley"],
      estilosPreferidos: ["aviador", "rectangular"],
      coloresPreferidos: ["negro", "carey"]
    },
    
    // Seguridad
    seguridad: {
      lastLogin: "2024-01-19T08:45:00Z",
      loginAttempts: 0,
      ipAddresses: ["190.25.123.45", "181.48.67.89"],
      blockedAt: null,
      blockedBy: null,
      motivoBloqueo: null
    },
    
    // Notas y etiquetas (admin)
    admin: {
      notasInternas: "Cliente VIP, atención prioritaria",
      etiquetas: ["VIP", "Frecuente"],
      creadoPor: "Sistema",
      ultimaModificacion: "2024-01-15T10:00:00Z"
    },
    
    // Timestamps
    timestamps: {
      createdAt: "2023-08-15T00:00:00Z",
      updatedAt: "2024-01-19T08:45:00Z",
      deletedAt: null
    }
  }
}

3. HISTORIAL DE COMPRAS DEL USUARIO:

GET /api/admin/users/:id/orders?page=1&limit=10

Response:
{
  success: true,
  data: [
    {
      id: "order123",
      numeroOrden: "OP-2024-0001",
      fecha: "2024-01-10",
      total: 125000,
      estadoPedido: "ENTREGADO",
      itemsCount: 2
    }
  ],
  pagination: { ... },
  stats: {
    totalCompras: 12,
    totalGastado: 1250000,
    pedidoPromedio: 104166
  }
}

4. PRODUCTOS COMPRADOS FRECUENTEMENTE:

GET /api/admin/users/:id/productos-frecuentes

Response:
{
  success: true,
  data: [
    {
      producto: {
        id: "prod1",
        nombre: "Ray-Ban Aviator",
        imagen: "https://..."
      },
      vecesComprado: 3,
      ultimaCompra: "2024-01-10",
      totalGastado: 269970
    }
  ]
}

5. EDITAR USUARIO:

PUT /api/admin/users/:id

Body:
{
  name: "Juan Carlos Pérez",
  phone: "3009876543",
  fechaNacimiento: "1985-05-20",
  genero: "MASCULINO",
  role: "CLIENTE",
  estado: "ACTIVO",
  nivelCliente: "VIP",
  etiquetas: ["VIP", "Preferente"],
  notasInternas: "Cliente importante, dar prioridad"
}

Validaciones:
- Solo SUPER_ADMIN puede cambiar role a ADMIN
- Solo admin puede cambiar estado
- Registrar cambios en AuditLog
- Notificar al usuario si cambian datos importantes

Response:
{
  success: true,
  data: { ...usuario actualizado... },
  message: "Usuario actualizado exitosamente"
}

6. CAMBIAR ROL DEL USUARIO:

PUT /api/admin/users/:id/rol

Body:
{
  nuevoRol: "ADMIN",
  motivo: "Promovido a administrador de tienda"
}

Validaciones:
- Solo SUPER_ADMIN puede ejecutar esta acción
- Registrar en AuditLog
- Enviar email al usuario notificando el cambio

7. BLOQUEAR/DESBLOQUEAR USUARIO:

POST /api/admin/users/:id/bloquear

Body:
{
  motivo: "Múltiples intentos de fraude detectados",
  notificarUsuario: true
}

Lógica:
- Cambiar estado a BLOQUEADO
- Guardar adminId, fecha y motivo
- Invalidar sesiones activas (logout forzado)
- Enviar email si notificarUsuario=true
- Registrar en AuditLog

POST /api/admin/users/:id/desbloquear

Body:
{
  motivo: "Situación aclarada"
}

8. RESETEAR CONTRASEÑA:

POST /api/admin/users/:id/reset-password

Body:
{
  enviarEmail: true,
  passwordTemporal: "generada automáticamente"
}

Lógica:
- Generar password temporal segura
- Hash con bcrypt
- Actualizar en BD
- Enviar email con instrucciones
- Marcar para que cambie password en próximo login
- Registrar en AuditLog

9. ELIMINAR USUARIO (SOFT DELETE):

DELETE /api/admin/users/:id

Body:
{
  motivo: "Solicitud del usuario - GDPR",
  eliminarCompletamente: false  // false = soft delete, true = hard delete
}

Lógica:
- Si soft delete: marcar deletedAt, cambiar email a "deleted_[id]@deleted.com"
- Si hard delete: eliminar de BD (solo SUPER_ADMIN)
- Anonimizar datos personales en pedidos
- Registrar en AuditLog
- Enviar confirmación por email

10. AGREGAR/EDITAR NOTAS INTERNAS:

POST /api/admin/users/:id/notas

Body:
{
  nota: "Cliente contactó por WhatsApp para consulta de garantía"
}

11. AGREGAR/QUITAR ETIQUETAS:

PUT /api/admin/users/:id/etiquetas

Body:
{
  etiquetas: ["VIP", "Frecuente", "Preferente"]
}

12. ENVIAR EMAIL AL USUARIO:

POST /api/admin/users/:id/send-email

Body:
{
  asunto: "Oferta especial para ti",
  mensaje: "Hola {{nombre}}, tenemos una oferta...",
  plantilla: "oferta_especial",  // opcional
  adjuntos: ["https://..."]      // opcional
}

13. ENVIAR EMAIL MASIVO:

POST /api/admin/users/send-bulk-email

Body:
{
  filtros: {
    role: "CLIENTE",
    nivelCliente: ["VIP", "PLATINUM"],
    estado: "ACTIVO"
  },
  asunto: "Nueva colección disponible",
  mensaje: "...",
  plantilla: "newsletter"
}

Response:
{
  success: true,
  data: {
    emailsEnviados: 125,
    emailsFallidos: 3
  }
}

14. ESTADÍSTICAS GENERALES:

GET /api/admin/users/stats?periodo=mes

Response:
{
  success: true,
  data: {
    periodo: "enero 2024",
    
    general: {
      totalUsuarios: 1250,
      nuevosUsuarios: 45,
      usuariosActivos: 780,
      tasaCrecimiento: "+12.5%"
    },
    
    porRol: {
      CLIENTE: 1245,
      ADMIN: 5
    },
    
    porEstado: {
      ACTIVO: 1180,
      INACTIVO: 50,
      BLOQUEADO: 15,
      PENDIENTE: 5
    },
    
    porNivel: {
      NUEVO: 320,
      REGULAR: 580,
      FRECUENTE: 250,
      VIP: 95,
      PLATINUM: 5
    },
    
    metricas: {
      valorPromedioPorCliente: 580000,
      comprasPromedioCliente: 4.2,
      tasaRetencion: "68%",
      clientesRecurrentes: 450
    },
    
    top10Clientes: [
      {
        id: "user1",
        nombre: "Juan Pérez",
        totalGastado: 2500000,
        totalCompras: 15
      }
    ],
    
    registrosPorDia: [
      { fecha: "2024-01-01", count: 12 },
      { fecha: "2024-01-02", count: 8 }
    ]
  }
}

15. EXPORTAR USUARIOS:

GET /api/admin/users/export?format=csv&filtros=...

Response: Archivo CSV/Excel con todos los usuarios según filtros

16. HISTORIAL DE AUDITORÍA DEL USUARIO:

GET /api/admin/users/:id/audit-log

Response:
{
  success: true,
  data: [
    {
      id: "log1",
      accion: "cambio_rol",
      adminEmail: "admin@optivision.com",
      detalles: {
        antes: { role: "CLIENTE" },
        despues: { role: "ADMIN" }
      },
      fecha: "2024-01-15T10:00:00Z",
      ip: "190.25.123.45"
    }
  ]
}

17. VERIFICAR EMAIL DEL USUARIO:

POST /api/admin/users/:id/verify-email

Lógica:
- Marcar emailVerified = true
- Guardar fecha de verificación
- Enviar email de bienvenida

18. ACTUALIZAR NIVEL DE CLIENTE (automático):

POST /api/admin/users/:id/actualizar-nivel

Lógica:
- Calcular basado en totalCompras
- 0-1: NUEVO
- 2-5: REGULAR
- 6-10: FRECUENTE
- 11-20: VIP
- 20+: PLATINUM

19. AGREGAR PRESCRIPCIÓN MÉDICA:

POST /api/admin/users/:id/prescripciones

Body:
{
  fecha: "2024-01-15",
  OD: "-2.00",
  OS: "-1.75",
  medico: "Dr. García",
  archivo: "url_del_archivo"
}

20. BUSCAR USUARIOS DUPLICADOS:

GET /api/admin/users/duplicados?campo=email

Response:
{
  success: true,
  data: [
    {
      email: "juan@example.com",
      usuarios: [
        { id: "user1", nombre: "Juan Pérez" },
        { id: "user2", nombre: "Juan P." }
      ]
    }
  ]
}

CARACTERÍSTICAS TÉCNICAS:

1. SEGURIDAD:
   - Middleware authMiddleware + isAdmin
   - Solo SUPER_ADMIN puede: eliminar usuarios, cambiar roles a ADMIN
   - Validar que admin no pueda editar su propio rol
   - Hash de passwords con bcrypt
   - Rate limiting en endpoints sensibles

2. VALIDACIONES:
   - Email único en la BD
   - Formato de email válido
   - Teléfono formato colombiano (opcional)
   - Fechas válidas
   - Roles y estados válidos

3. AUDITORÍA:
   - Registrar TODAS las acciones de admin sobre usuarios
   - Guardar IP y user agent
   - Datos antes/después de ediciones
   - No permitir borrar logs de auditoría

4. PERFORMANCE:
   - Índices en campos de búsqueda
   - Paginación eficiente
   - Cache de estadísticas (opcional)
   - Lazy loading de relaciones pesadas

5. NOTIFICACIONES:
   - Email cuando admin cambia datos importantes
   - Email cuando se bloquea/desbloquea cuenta
   - Email cuando se resetea password
   - Email de bienvenida al verificar email

EJEMPLOS DE CONTROLADORES:

```typescript
// controllers/adminUsersController.ts

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const adminId = req.user.id;

    // Verificar que el usuario existe
    const usuario = await prisma.user.findUnique({
      where: { id }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
    }

    // Verificar permisos para cambiar rol
    if (updateData.role && updateData.role === 'ADMIN') {
      if (req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({
          success: false,
          error: 'Solo SUPER_ADMIN puede asignar rol de administrador'
        });
      }
    }

    // Guardar estado anterior para auditoría
    const estadoAnterior = {
      name: usuario.name,
      email: usuario.email,
      role: usuario.role,
      estado: usuario.estado
    };

    // Actualizar usuario
    const usuarioActualizado = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date()
      }
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId: id,
        adminId: adminId,
        accion: 'edicion_perfil',
        detalles: {
          antes: estadoAnterior,
          despues: updateData
        },
        ip: req.ip,
        userAgent: req.headers['user-agent']
      }
    });

    // Enviar email si cambió algo importante
    if (updateData.email !== estadoAnterior.email) {
      await enviarEmailCambioImportante(usuarioActualizado, 'email');
    }

    res.json({
      success: true,
      data: usuarioActualizado,
      message: 'Usuario actualizado exitosamente'
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al actualizar usuario'
    });
  }
};

export const blockUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { motivo, notificarUsuario } = req.body;
    const adminId = req.user.id;

    const usuario = await prisma.user.update({
      where: { id },
      data: {
        estado: 'BLOQUEADO',
        blockedAt: new Date(),
        blockedBy: adminId,
        motivoBloqueo: motivo
      }
    });

    // Registrar en auditoría
    await prisma.auditLog.create({
      data: {
        userId: id,
        adminId: adminId,
        accion: 'bloqueo_usuario',
        detalles: { motivo },
        ip: req.ip
      }
    });

    // Invalidar sesiones activas (implementar según tu sistema de auth)
    await invalidarSesionesUsuario(id);

    // Enviar email
    if (notificarUsuario) {
      await enviarEmailBloqueo(usuario, motivo);
    }

    res.json({
      success: true,
      data: usuario,
      message: 'Usuario bloqueado exitosamente'
    });

  } catch (error) {
    console.error('Error al bloquear usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error al bloquear usuario'
    });
  }
};
```

ENTREGABLES:
1. Todos los endpoints funcionando
2. Sistema completo de auditoría
3. Validaciones y seguridad implementadas
4. Soft delete funcional
5. Sistema de notificaciones por email
6. Exportación de datos
7. Búsqueda avanzada con múltiples filtros
8. Estadísticas y métricas
9. Documentación de API
10. Tests de endpoints críticos

```

---

## 🎨 PROMPT PARA FRONTEND - PANEL ADMIN USUARIOS

```
Actúa como desarrollador frontend senior especializado en paneles administrativos de gestión de usuarios.

CONTEXTO:
Desarrollar la interfaz completa del módulo de gestión de usuarios para el panel admin. El backend ya está listo con todos los endpoints necesarios.

ARQUITECTURA FRONTEND:
- React 18 + TypeScript
- React Router v6
- Tailwind CSS
- React Hook Form
- React Hot Toast
- Lucide React (iconos)
- date-fns (fechas)
- recharts (gráficos)

PÁGINAS Y COMPONENTES REQUERIDOS:

1. PÁGINA PRINCIPAL: Lista de Usuarios
   Ruta: /admin/users

Estructura:
```tsx
<div className="p-6">
  {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
    <StatsCard 
      title="Total Usuarios"
      value={1250}
      change="+45 este mes"
      icon={<Users />}
      color="blue"
    />
    <StatsCard 
      title="Usuarios Activos"
      value={980}
      percentage="78.4%"
      icon={<UserCheck />}
      color="green"
    />
    <StatsCard 
      title="Nuevos Hoy"
      value={12}
      change="+3 vs ayer"
      icon={<UserPlus />}
      color="purple"
    />
    <StatsCard 
      title="Clientes VIP"
      value={95}
      percentage="7.6%"
      icon={<Crown />}
      color="yellow"
    />
  </div>

  {/* Barra de herramientas */}
  <div className="bg-white rounded-lg shadow p-4 mb-4">
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      {/* Búsqueda */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-2">
        <Button variant="secondary" icon={<Filter />}>
          Filtros
        </Button>
        <Button variant="secondary" icon={<Download />}>
          Exportar
        </Button>
        <Button variant="secondary" icon={<Mail />}>
          Email Masivo
        </Button>
      </div>
    </div>
  </div>

  <div className="flex gap-6">
    {/* Sidebar de filtros */}
    <aside className="w-64 bg-white rounded-lg shadow p-4 space-y-6">
      <div>
        <h3 className="font-semibold mb-3">Rol</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Clientes</span>
            <span className="ml-auto text-sm text-gray-500">1,245</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Admins</span>
            <span className="ml-auto text-sm text-gray-500">5</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Estado</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Activo</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Inactivo</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Bloqueado</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Nivel</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>VIP</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Platinum</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-2" />
            <span>Frecuente</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Fecha de Registro</h3>
        <input type="date" className="w-full border rounded p-2 mb-2" placeholder="Desde" />
        <input type="date" className="w-full border rounded p-2" placeholder="Hasta" />
      </div>

      <div className="pt-4 border-t space-y-2">
        <Button variant="primary" fullWidth>
          Aplicar Filtros
        </Button>
        <Button variant="ghost" fullWidth>
          Limpiar
        </Button>
      </div>
    </aside>

    {/* Tabla principal */}
    <main className="flex-1">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Email / Teléfono
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Rol / Nivel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Compras / Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img 
                      src={user.avatar || '/default-avatar.png'} 
                      alt={user.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="font-medium text-gray-900">
                        {user.name}
                        {user.etiquetas?.includes('VIP') && (
                          <Crown className="inline ml-1 text-yellow-500" size={16} />
                        )}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {user.id.substring(0, 8)}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="flex items-center">
                      {user.email}
                      {user.emailVerified && (
                        <CheckCircle className="ml-1 text-green-500" size={14} />
                      )}
                    </div>
                    <div className="text-gray-500">{user.phone || '-'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <Badge color={user.role === 'ADMIN' ? 'purple' : 'blue'}>
                      {user.role}
                    </Badge>
                    {user.nivelCliente && (
                      <div className="text-xs text-gray-500 mt-1">
                        {user.nivelCliente}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <Badge color={getEstadoColor(user.estado)}>
                    {user.estado}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm">
                    <div className="font-medium">{user.totalCompras} pedidos</div>
                    <div className="text-gray-500">
                      {formatCurrency(user.totalGastado)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <IconButton 
                      icon={<Eye />} 
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      title="Ver detalle"
                    />
                    <IconButton 
                      icon={<Edit />} 
                      onClick={() => openEditModal(user)}
                      title="Editar"
                    />
                    <IconButton 
                      icon={<MoreVertical />} 
                      onClick={() => openActionsMenu(user)}
                      title="Más acciones"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-500">
          Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, total)} de {total} usuarios
        </div>
        <div className="flex gap-2">
          <Button 
            variant="secondary" 
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <Button 
            variant="secondary"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </main>
  </div>
</div>
```

Estados de color para badges:
```typescript
const estadoColors = {
  ACTIVO: 'bg-green-100 text-green-800',
  INACTIVO: 'bg-gray-100 text-gray-800',
  BLOQUEADO: 'bg-red-100 text-red-800',
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  ELIMINADO: 'bg-black text-white'
};
```

2. PÁGINA DE DETALLE: Perfil Completo del Usuario
   Ruta: /admin/users/:id

Layout con tabs:

```tsx
<div className="p-6">
  {/* Header con info básica */}
  <div className="bg-white rounded-lg shadow p-6 mb-6">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <img 
          src={user.avatar || '/default-avatar.png'}
          alt={user.name}
          className="w-20 h-20 rounded-full"
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            {user.etiquetas?.map(tag => (
              <Badge key={tag} color="yellow">{tag}</Badge>
            ))}
          </div>
          <p className="text-gray-600">{user.email}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-500">
            <span>ID: {user.id}</span>
            <span>•</span>
            <span>Cliente desde {formatDate(user.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="flex gap-2">
        <Button variant="secondary" icon={<Edit />}>
          Editar
        </Button>
        <Button variant="secondary" icon={<Mail />}>
          Enviar Email
        </Button>
        <DropdownMenu>
          <DropdownMenuItem onClick={handleBlock}>
            <Ban className="mr-2" size={16} />
            Bloquear Usuario
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleResetPassword}>
            <Key className="mr-2" size={16} />
            Resetear Contraseña
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-red-600">
            <Trash2 className="mr-2" size={16} />
            Eliminar Usuario
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>

    {/* Métricas rápidas */}
    <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t">
      <div>
        <div className="text-sm text-gray-500">Total Compras</div>
        <div className="text-2xl font-bold">{user.totalCompras}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Total Gastado</div>
        <div className="text-2xl font-bold">
          {formatCurrency(user.totalGastado)}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Pedido Promedio</div>
        <div className="text-2xl font-bold">
          {formatCurrency(user.totalGastado / user.totalCompras)}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Última Compra</div>
        <div className="text-lg font-semibold">
          {getRelativeTime(user.ultimaCompra)}
        </div>
      </div>
    </div>
  </div>

  {/* Tabs */}
  <Tabs defaultValue="general">
    <TabsList>
      <TabsTrigger value="general">General</TabsTrigger>
      <TabsTrigger value="compras">Compras ({user.totalCompras})</TabsTrigger>
      <TabsTrigger value="prescripciones">Prescripciones</TabsTrigger>
      <TabsTrigger value="seguridad">Seguridad</TabsTrigger>
      <TabsTrigger value="auditoria">Auditoría</TabsTrigger>
    </TabsList>

    {/* TAB 1: GENERAL */}
    <TabsContent value="general">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Personal */}
        <Card title="Información Personal" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-4">
            <InfoRow label="Nombre Completo" value={user.name} />
            <InfoRow label="Email" value={user.email} verified={user.emailVerified} />
            <InfoRow label="Teléfono" value={user.phone || '-'} />
            <InfoRow label="Fecha de Nacimiento" value={formatDate(user.fechaNacimiento) || '-'} />
            <InfoRow label="Género" value={user.genero || '-'} />
            <InfoRow label="Rol" value={<Badge>{user.role}</Badge>} />
            <InfoRow label="Estado" value={<Badge color={getEstadoColor(user.estado)}>{user.estado}</Badge>} />
            <InfoRow label="Nivel Cliente" value={user.nivelCliente || '-'} />
          </div>
        </Card>

        {/* Estado de Verificación */}
        <Card title="Verificaciones">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Email</span>
              {user.emailVerified ? (
                <Badge color="green">
                  <CheckCircle size={14} className="mr-1" />
                  Verificado
                </Badge>
              ) : (
                <Button size="sm" onClick={handleVerifyEmail}>
                  Verificar
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span>Teléfono</span>
              {user.phoneVerified ? (
                <Badge color="green">Verificado</Badge>
              ) : (
                <Badge color="gray">No verificado</Badge>
              )}
            </div>
          </div>
        </Card>

        {/* Direcciones */}
        <Card title="Direcciones Guardadas" className="lg:col-span-2">
          {user.direcciones?.length > 0 ? (
            <div className="space-y-3">
              {user.direcciones.map(dir => (
                <div key={dir.id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{dir.nombre}</div>
                      <div className="text-sm text-gray-600">{dir.direccion}</div>
                      <div className="text-sm text-gray-500">
                        {dir.ciudad}, {dir.departamento}
                      </div>
                    </div>
                    {dir.esPrincipal && (
                      <Badge color="blue">Principal</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              Sin direcciones guardadas
            </p>
          )}
        </Card>

        {/* Preferencias (específico óptica) */}
        <Card title="Preferencias">
          <div className="space-y-3">
            <div>
              <div className="text-sm text-gray-500">Marcas Favoritas</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.preferencias?.marcasFavoritas?.map(marca => (
                  <Badge key={marca} color="gray">{marca}</Badge>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Estilos Preferidos</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {user.preferencias?.estilosPreferidos?.map(estilo => (
                  <Badge key={estilo} color="gray">{estilo}</Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Notas Internas */}
      <Card title="Notas Internas (solo admin)" className="mt-6">
        <textarea
          value={notasInternas}
          onChange={(e) => setNotasInternas(e.target.value)}
          className="w-full border rounded-lg p-3 mb-3"
          rows={4}
          placeholder="Agregar notas sobre este usuario..."
        />
        <Button onClick={handleSaveNotas}>
          Guardar Notas
        </Button>
      </Card>
    </TabsContent>

    {/* TAB 2: COMPRAS */}
    <TabsContent value="compras">
      <div className="space-y-6">
        {/* Resumen de compras */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard 
            title="Total Pedidos"
            value={compras.totalPedidos}
            icon={<ShoppingBag />}
          />
          <MetricCard 
            title="Total Gastado"
            value={formatCurrency(compras.totalGastado)}
            icon={<DollarSign />}
          />
          <MetricCard 
            title="Pedido Promedio"
            value={formatCurrency(compras.pedidoPromedio)}
            icon={<TrendingUp />}
          />
        </div>

        {/* Productos frecuentes */}
        <Card title="Productos Comprados Frecuentemente">
          <div className="space-y-3">
            {productosFrecuentes.map(item => (
              <div key={item.producto.id} className="flex items-center gap-4">
                <img 
                  src={item.producto.imagen}
                  alt={item.producto.nombre}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <div className="font-medium">{item.producto.nombre}</div>
                  <div className="text-sm text-gray-500">
                    Comprado {item.vecesComprado} veces
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    {formatCurrency(item.totalGastado)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Última: {formatDate(item.ultimaCompra)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Historial de pedidos */}
        <Card title="Historial de Pedidos">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Pedido</th>
                <th className="text-left py-2">Fecha</th>
                <th className="text-left py-2">Items</th>
                <th className="text-left py-2">Total</th>
                <th className="text-left py-2">Estado</th>
                <th className="text-left py-2">Acción</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr key={pedido.id} className="border-b">
                  <td className="py-3">
                    <Link 
                      to={`/admin/orders/${pedido.id}`}
                      className="text-primary-600 hover:underline"
                    >
                      {pedido.numeroOrden}
                    </Link>
                  </td>
                  <td>{formatDate(pedido.fecha)}</td>
                  <td>{pedido.itemsCount} items</td>
                  <td>{formatCurrency(pedido.total)}</td>
                  <td>
                    <Badge color={getEstadoColor(pedido.estadoPedido)}>
                      {pedido.estadoPedido}
                    </Badge>
                  </td>
                  <td>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => navigate(`/admin/orders/${pedido.id}`)}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </TabsContent>

    {/* TAB 3: PRESCRIPCIONES (específico óptica) */}
    <TabsContent value="prescripciones">
      <Card title="Prescripciones Médicas">
        <div className="mb-4">
          <Button 
            icon={<Plus />}
            onClick={openAddPrescriptionModal}
          >
            Agregar Prescripción
          </Button>
        </div>

        {prescripciones.length > 0 ? (
          <div className="space-y-4">
            {prescripciones.map((presc, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold">
                      Prescripción del {formatDate(presc.fecha)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Dr. {presc.medico}
                    </div>
                  </div>
                  {presc.archivo && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      icon={<Download />}
                      onClick={() => window.open(presc.archivo)}
                    >
                      Descargar
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-500">Ojo Derecho (OD)</div>
                    <div className="font-mono font-semibold">{presc.OD}</div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded">
                    <div className="text-sm text-gray-500">Ojo Izquierdo (OS)</div>
                    <div className="font-mono font-semibold">{presc.OS}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState 
            icon={<FileText />}
            message="Sin prescripciones registradas"
          />
        )}
      </Card>
    </TabsContent>

    {/* TAB 4: SEGURIDAD */}
    <TabsContent value="seguridad">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Información de Sesiones">
          <div className="space-y-3">
            <InfoRow 
              label="Último Acceso" 
              value={formatDate(user.lastLogin)}
            />
            <InfoRow 
              label="Intentos Fallidos" 
              value={user.loginAttempts || 0}
            />
            {user.blockedAt && (
              <>
                <InfoRow 
                  label="Bloqueado" 
                  value={formatDate(user.blockedAt)}
                />
                <InfoRow 
                  label="Motivo" 
                  value={user.motivoBloqueo}
                />
              </>
            )}
          </div>

          <div className="mt-4 space-y-2">
            <Button 
              variant="secondary" 
              fullWidth
              icon={<Key />}
              onClick={handleResetPassword}
            >
              Resetear Contraseña
            </Button>
            {user.estado === 'BLOQUEADO' ? (
              <Button 
                variant="success" 
                fullWidth
                onClick={handleUnblock}
              >
                Desbloquear Usuario
              </Button>
            ) : (
              <Button 
                variant="danger" 
                fullWidth
                icon={<Ban />}
                onClick={handleBlock}
              >
                Bloquear Usuario
              </Button>
            )}
          </div>
        </Card>

        <Card title="Direcciones IP
  