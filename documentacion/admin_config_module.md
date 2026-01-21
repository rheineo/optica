# ⚙️ MÓDULO DE CONFIGURACIÓN - PANEL ADMIN

## 🎯 ANÁLISIS DE FUNCIONALIDADES

### ✅ Funciones Esenciales (MUST HAVE)

```typescript
// Configuraciones críticas para operación del e-commerce

1. INFORMACIÓN DE LA EMPRESA
   ✓ Nombre comercial de la tienda
   ✓ Logo (principal y favicon)
   ✓ Dirección física
   ✓ Teléfonos de contacto (principal, WhatsApp)
   ✓ Emails de contacto (ventas, soporte, admin)
   ✓ Redes sociales (Facebook, Instagram, Twitter, TikTok)
   ✓ Horarios de atención
   ✓ Información legal (NIT, razón social)

2. MÉTODOS DE PAGO
   ✓ Activar/desactivar tarjeta de crédito
   ✓ Activar/desactivar tarjeta de débito
   ✓ Activar/desactivar PSE
   ✓ Activar/desactivar efectivo contra entrega
   ✓ Configurar pasarelas (Wompi, PayU, Mercado Pago)
   ✓ Credenciales de API de pago
   ✓ Modo prueba/producción

3. ENVÍOS Y LOGÍSTICA
   ✓ Zonas de envío (ciudades/departamentos disponibles)
   ✓ Costo de envío por zona
   ✓ Envío gratis desde X monto
   ✓ Tiempo estimado de entrega por zona
   ✓ Transportadoras activas (Servientrega, Coordinadora, etc.)
   ✓ Peso máximo de paquete
   ✓ Dimensiones de empaque

4. IMPUESTOS Y MONEDA
   ✓ Moneda principal (COP)
   ✓ IVA (19% en Colombia)
   ✓ Impuestos adicionales
   ✓ Redondeo de precios
   ✓ Formato de números (1.000 vs 1,000)

5. EMAILS TRANSACCIONALES
   ✓ Configuración SMTP (host, port, user, password)
   ✓ Email remitente
   ✓ Nombre del remitente
   ✓ Templates de emails:
     - Confirmación de registro
     - Confirmación de pedido
     - Pedido enviado
     - Pedido entregado
     - Pedido cancelado
     - Reset de contraseña
   ✓ Firma de email

6. CONFIGURACIÓN DEL SITIO
   ✓ Modo mantenimiento (activar/desactivar)
   ✓ Permitir registro de usuarios
   ✓ Verificación de email obligatoria
   ✓ Comentarios de productos
   ✓ Valoraciones de productos
   ✓ Productos por página (catálogo)
   ✓ Productos relacionados a mostrar
   ✓ Habilitar lista de deseos
   ✓ Habilitar comparador de productos

7. SEO Y MARKETING
   ✓ Meta título del sitio
   ✓ Meta descripción
   ✓ Keywords
   ✓ Google Analytics ID
   ✓ Facebook Pixel ID
   ✓ Google Tag Manager
   ✓ Código de verificación de Search Console

8. POLÍTICAS Y LEGALES
   ✓ Términos y condiciones
   ✓ Política de privacidad
   ✓ Política de devoluciones
   ✓ Política de envíos
   ✓ Preguntas frecuentes (FAQ)
   ✓ Aviso de cookies
```

### 🚀 Funciones Avanzadas (NICE TO HAVE)

```typescript
// Configuraciones que mejoran la operación

1. PERSONALIZACIÓN VISUAL
   ✓ Colores primarios y secundarios
   ✓ Tipografía
   ✓ Banner principal (home page)
   ✓ Slider de imágenes
   ✓ Widgets personalizados
   ✓ Footer personalizado

2. INVENTARIO
   ✓ Alertas de stock bajo (notificar cuando < X unidades)
   ✓ Permitir ventas con stock 0 (backorder)
   ✓ Reserva de stock en carrito (tiempo)
   ✓ Actualización automática de stock

3. NOTIFICACIONES
   ✓ Notificaciones push web
   ✓ SMS para pedidos importantes
   ✓ WhatsApp Business API
   ✓ Notificaciones de admin (nuevos pedidos, stock bajo)

4. PROGRAMAS DE FIDELIZACIÓN
   ✓ Sistema de puntos
   ✓ Cupones de descuento
   ✓ Programa de referidos
   ✓ Descuentos por volumen

5. SEGURIDAD
   ✓ Bloqueo de IP
   ✓ Límite de intentos de login
   ✓ Autenticación de dos factores (2FA)
   ✓ Lista negra de emails
   ✓ Captcha en formularios

6. INTEGRACIÓN CON TERCEROS
   ✓ CRM (HubSpot, Salesforce)
   ✓ Email marketing (Mailchimp)
   ✓ Chat en vivo (Zendesk, Intercom)
   ✓ ERP externo
```

### ⚡ Funciones Específicas para Óptica

```typescript
// Configuraciones del sector óptico

1. SERVICIOS POSTVENTA
   ✓ Período de garantía estándar (meses)
   ✓ Servicios incluidos (ajustes, limpieza)
   ✓ Costo de ajustes adicionales
   ✓ Costo de reparaciones

2. PRESCRIPCIONES
   ✓ Validez de prescripción médica (meses)
   ✓ Requerir prescripción para lentes graduados
   ✓ Formatos aceptados de prescripción
   ✓ Email para envío de prescripciones

3. PERSONALIZACIÓN DE PRODUCTOS
   ✓ Tipos de lentes disponibles (monofocales, bifocales, etc.)
   ✓ Tratamientos disponibles (antireflejante, transitions, etc.)
   ✓ Tiempo de fabricación de lentes personalizados
   ✓ Costo adicional por personalización
```

---

## 📋 ESTRUCTURA DE CONFIGURACIÓN

### Modelo de Datos

```prisma
model Config {
  id        String   @id @default(cuid())
  key       String   @unique  // Clave única: "empresa_nombre", "smtp_host"
  value     String   @db.Text // Valor en JSON o texto
  tipo      TipoConfig
  categoria CategoriaConfig
  descripcion String?
  
  updatedAt DateTime @updatedAt
  updatedBy String?  // ID del admin que modificó
  
  @@index([categoria])
}

enum TipoConfig {
  TEXT
  NUMBER
  BOOLEAN
  JSON
  IMAGE
  EMAIL
  URL
}

enum CategoriaConfig {
  EMPRESA
  PAGOS
  ENVIOS
  IMPUESTOS
  EMAILS
  SITIO
  SEO
  SEGURIDAD
  OPTICA
}
```

### Ejemplo de Configuraciones Guardadas

```typescript
// En la BD se guarda como registros individuales:

{
  key: "empresa_nombre",
  value: "OptiVisión Colombia",
  tipo: "TEXT",
  categoria: "EMPRESA"
}

{
  key: "envio_gratis_desde",
  value: "150000",
  tipo: "NUMBER",
  categoria: "ENVIOS"
}

{
  key: "metodos_pago",
  value: JSON.stringify({
    tarjeta_credito: true,
    tarjeta_debito: true,
    pse: true,
    efectivo: false
  }),
  tipo: "JSON",
  categoria: "PAGOS"
}

{
  key: "smtp_config",
  value: JSON.stringify({
    host: "smtp.gmail.com",
    port: 587,
    user: "ventas@optivision.com",
    password: "encrypted_password",
    secure: false
  }),
  tipo: "JSON",
  categoria: "EMAILS"
}
```

---

## 💻 PROMPT PARA BACKEND - MÓDULO DE CONFIGURACIÓN

```
Actúa como arquitecto backend senior especializado en sistemas de configuración para plataformas e-commerce.

CONTEXTO:
Desarrollar el módulo completo de configuración para el panel administrativo de un e-commerce de óptica. Este módulo permite a los administradores gestionar todos los parámetros globales que afectan el funcionamiento de la tienda.

ARQUITECTURA BACKEND:
- Node.js + Express + TypeScript
- PostgreSQL con Prisma ORM
- Sistema de caché para configuraciones (Redis opcional)

MODELO DE DOMINIO:

```prisma
model Config {
  id          String         @id @default(cuid())
  key         String         @unique
  value       String         @db.Text
  tipo        TipoConfig
  categoria   CategoriaConfig
  descripcion String?
  isPublic    Boolean        @default(false) // Si se puede exponer al frontend
  
  createdAt   DateTime       @default(now())
  updatedAt   DateTime       @updatedAt
  updatedBy   String?
  
  @@index([categoria])
  @@index([key])
}

enum TipoConfig {
  TEXT
  NUMBER
  BOOLEAN
  JSON
  IMAGE
  EMAIL
  URL
  PASSWORD
}

enum CategoriaConfig {
  EMPRESA
  PAGOS
  ENVIOS
  IMPUESTOS
  EMAILS
  SITIO
  SEO
  SEGURIDAD
  OPTICA
  LEGAL
}
```

ENDPOINTS REQUERIDOS:

1. OBTENER TODAS LAS CONFIGURACIONES (solo admin):

GET /api/admin/config

Response:
{
  success: true,
  data: {
    empresa: {
      nombre: "OptiVisión Colombia",
      logo: "https://...",
      direccion: "Calle 123 #45-67, Bogotá",
      telefono: "601-2345678",
      whatsapp: "3001234567",
      email: "ventas@optivision.com",
      redesSociales: {
        facebook: "https://facebook.com/optivision",
        instagram: "@optivision",
        twitter: "@optivision"
      },
      horario: "Lunes a Viernes: 9am - 6pm, Sábados: 9am - 2pm"
    },
    
    pagos: {
      metodosActivos: {
        tarjetaCredito: true,
        tarjetaDebito: true,
        pse: true,
        efectivo: false
      },
      pasarela: "wompi",
      pasarelaConfig: {
        publicKey: "pub_test_xxxxx",
        privateKey: "encrypted",
        testMode: true
      }
    },
    
    envios: {
      zonasDisponibles: [
        {
          nombre: "Bogotá",
          costo: 8000,
          diasEntrega: "2-3"
        },
        {
          nombre: "Otras ciudades principales",
          costo: 12000,
          diasEntrega: "3-5"
        }
      ],
      envioGratisDesde: 150000,
      transportadoras: ["Servientrega", "Coordinadora"]
    },
    
    impuestos: {
      iva: 19,
      moneda: "COP",
      simboloMoneda: "$",
      formatoNumero: "1.000,00"
    },
    
    emails: {
      smtp: {
        host: "smtp.gmail.com",
        port: 587,
        user: "ventas@optivision.com",
        secure: false
      },
      remitente: {
        email: "ventas@optivision.com",
        nombre: "OptiVisión Colombia"
      }
    },
    
    sitio: {
      modoMantenimiento: false,
      permitirRegistro: true,
      verificacionEmail: true,
      productosPerPage: 20,
      habilitarComentarios: true,
      habilitarWishlist: true
    },
    
    seo: {
      metaTitulo: "OptiVisión - Gafas y Lentes de Contacto en Colombia",
      metaDescripcion: "Encuentra las mejores marcas...",
      keywords: "gafas, lentes, ray-ban, oakley",
      googleAnalytics: "G-XXXXXXXXXX",
      facebookPixel: "123456789"
    },
    
    optica: {
      garantiaMeses: 12,
      serviciosIncluidos: ["Ajustes", "Limpieza", "Revisión anual"],
      validezPrescripcion: 24,
      requerirPrescripcion: true
    }
  }
}

2. OBTENER CONFIGURACIÓN POR CATEGORÍA:

GET /api/admin/config/categoria/:categoria

Ejemplo: GET /api/admin/config/categoria/EMPRESA

Response:
{
  success: true,
  data: {
    nombre: "OptiVisión Colombia",
    logo: "https://...",
    direccion: "Calle 123 #45-67, Bogotá",
    ...
  }
}

3. OBTENER CONFIGURACIÓN ESPECÍFICA:

GET /api/admin/config/:key

Ejemplo: GET /api/admin/config/envio_gratis_desde

Response:
{
  success: true,
  data: {
    key: "envio_gratis_desde",
    value: 150000,
    tipo: "NUMBER",
    categoria: "ENVIOS"
  }
}

4. ACTUALIZAR CONFIGURACIÓN:

PUT /api/admin/config/:key

Body:
{
  value: 180000
}

Validaciones:
- Validar tipo de dato según config.tipo
- Solo admin puede actualizar
- Registrar quién modificó (updatedBy)
- Invalidar caché si existe
- Algunas configs requieren reinicio del servidor

Response:
{
  success: true,
  data: {
    key: "envio_gratis_desde",
    value: 180000,
    updatedAt: "2024-01-20T10:30:00Z"
  },
  message: "Configuración actualizada exitosamente"
}

5. ACTUALIZAR MÚLTIPLES CONFIGURACIONES:

PUT /api/admin/config/bulk

Body:
{
  configs: [
    { key: "empresa_nombre", value: "Nuevo Nombre" },
    { key: "envio_gratis_desde", value: 200000 },
    { key: "iva", value: 19 }
  ]
}

Lógica:
- Validar todas antes de actualizar
- Actualizar en transacción (todo o nada)
- Invalidar caché
- Registrar auditoría

6. SUBIR LOGO/IMÁGENES:

POST /api/admin/config/upload-logo

Body: FormData con archivo

Lógica:
- Validar que sea imagen (JPG, PNG, SVG)
- Subir a Cloudinary
- Actualizar config "empresa_logo"
- Retornar URL

7. RESETEAR A VALORES POR DEFECTO:

POST /api/admin/config/reset/:key

Lógica:
- Restaurar valor por defecto predefinido
- Solo SUPER_ADMIN puede hacerlo
- Confirmar acción (require confirmación)

8. OBTENER CONFIGURACIÓN PÚBLICA (para frontend):

GET /api/config/public

Response:
{
  success: true,
  data: {
    empresa: {
      nombre: "OptiVisión",
      logo: "https://...",
      telefono: "601-2345678",
      redesSociales: { ... }
    },
    envioGratisDesde: 150000,
    moneda: "COP",
    // Solo configs marcadas como isPublic: true
  }
}

Nota: Este endpoint NO requiere autenticación

9. VALIDAR CONEXIÓN SMTP:

POST /api/admin/config/test-smtp

Body:
{
  smtp: {
    host: "smtp.gmail.com",
    port: 587,
    user: "test@example.com",
    password: "password"
  },
  emailPrueba: "admin@optivision.com"
}

Lógica:
- Intentar enviar email de prueba
- Retornar éxito o error

10. VALIDAR CREDENCIALES DE PAGO:

POST /api/admin/config/test-payment-gateway

Body:
{
  gateway: "wompi",
  credentials: {
    publicKey: "pub_test_xxx",
    privateKey: "prv_test_xxx"
  }
}

Lógica:
- Hacer llamada de prueba a la API de la pasarela
- Verificar que las credenciales sean válidas

11. EXPORTAR CONFIGURACIÓN:

GET /api/admin/config/export

Response: Archivo JSON con toda la configuración

12. IMPORTAR CONFIGURACIÓN:

POST /api/admin/config/import

Body: FormData con archivo JSON

Validaciones:
- Solo SUPER_ADMIN
- Validar estructura del JSON
- Confirmar antes de aplicar
- Crear backup automático antes de importar

13. HISTORIAL DE CAMBIOS:

GET /api/admin/config/:key/history

Response:
{
  success: true,
  data: [
    {
      value: 150000,
      updatedBy: "admin@optivision.com",
      updatedAt: "2024-01-15T10:00:00Z"
    },
    {
      value: 180000,
      updatedBy: "admin@optivision.com",
      updatedAt: "2024-01-20T10:30:00Z"
    }
  ]
}

VALORES POR DEFECTO (seed inicial):

```typescript
const defaultConfigs = [
  // EMPRESA
  { key: "empresa_nombre", value: "Mi Tienda", categoria: "EMPRESA", tipo: "TEXT", isPublic: true },
  { key: "empresa_logo", value: "", categoria: "EMPRESA", tipo: "IMAGE", isPublic: true },
  { key: "empresa_direccion", value: "", categoria: "EMPRESA", tipo: "TEXT", isPublic: true },
  { key: "empresa_telefono", value: "", categoria: "EMPRESA", tipo: "TEXT", isPublic: true },
  { key: "empresa_email", value: "", categoria: "EMPRESA", tipo: "EMAIL", isPublic: true },
  
  // PAGOS
  { key: "metodos_pago_activos", value: JSON.stringify({
    tarjetaCredito: true,
    tarjetaDebito: true,
    pse: true,
    efectivo: true
  }), categoria: "PAGOS", tipo: "JSON" },
  
  // ENVÍOS
  { key: "envio_gratis_desde", value: "150000", categoria: "ENVIOS", tipo: "NUMBER", isPublic: true },
  { key: "zonas_envio", value: JSON.stringify([
    { nombre: "Bogotá", costo: 8000, dias: "2-3" }
  ]), categoria: "ENVIOS", tipo: "JSON", isPublic: true },
  
  // IMPUESTOS
  { key: "iva", value: "19", categoria: "IMPUESTOS", tipo: "NUMBER", isPublic: true },
  { key: "moneda", value: "COP", categoria: "IMPUESTOS", tipo: "TEXT", isPublic: true },
  
  // SITIO
  { key: "modo_mantenimiento", value: "false", categoria: "SITIO", tipo: "BOOLEAN" },
  { key: "permitir_registro", value: "true", categoria: "SITIO", tipo: "BOOLEAN" },
  { key: "productos_per_page", value: "20", categoria: "SITIO", tipo: "NUMBER", isPublic: true },
  
  // ÓPTICA
  { key: "garantia_meses", value: "12", categoria: "OPTICA", tipo: "NUMBER", isPublic: true },
  { key: "validez_prescripcion_meses", value: "24", categoria: "OPTICA", tipo: "NUMBER" },
];
```

CARACTERÍSTICAS TÉCNICAS:

1. CACHÉ:
   - Cachear configuraciones en Redis (opcional)
   - TTL: 1 hora
   - Invalidar al actualizar
   - Endpoint para forzar refresh del caché

2. SEGURIDAD:
   - Encriptar passwords y API keys en BD
   - Solo admin puede modificar
   - Solo SUPER_ADMIN para configs críticas
   - Validar inputs según tipo de dato
   - Rate limiting

3. VALIDACIONES:
   - Email: formato válido
   - URL: formato válido con protocolo
   - Number: solo números
   - Boolean: solo true/false
   - JSON: estructura válida

4. AUDITORÍA:
   - Registrar todos los cambios
   - Guardar valor anterior y nuevo
   - Usuario que modificó
   - Timestamp

5. BACKUP:
   - Backup automático antes de cambios masivos
   - Exportar/Importar configuración completa
   - Restaurar a punto anterior

EJEMPLO DE SERVICIO HELPER:

```typescript
// services/configService.ts

import { prisma } from '../config/database';
import { cache } from '../config/redis'; // opcional

class ConfigService {
  private static CACHE_PREFIX = 'config:';
  private static CACHE_TTL = 3600; // 1 hora

  // Obtener configuración con caché
  async get(key: string): Promise<any> {
    // Intentar desde caché
    const cached = await cache.get(`${this.CACHE_PREFIX}${key}`);
    if (cached) return JSON.parse(cached);

    // Buscar en BD
    const config = await prisma.config.findUnique({
      where: { key }
    });

    if (!config) return null;

    const value = this.parseValue(config.value, config.tipo);

    // Guardar en caché
    await cache.set(
      `${this.CACHE_PREFIX}${key}`,
      JSON.stringify(value),
      'EX',
      this.CACHE_TTL
    );

    return value;
  }

  // Obtener todas por categoría
  async getByCategory(categoria: string): Promise<Record<string, any>> {
    const configs = await prisma.config.findMany({
      where: { categoria }
    });

    const result: Record<string, any> = {};
    configs.forEach(config => {
      const key = config.key.replace(`${categoria.toLowerCase()}_`, '');
      result[key] = this.parseValue(config.value, config.tipo);
    });

    return result;
  }

  // Actualizar configuración
  async update(key: string, value: any, userId: string): Promise<void> {
    const config = await prisma.config.findUnique({ where: { key } });
    if (!config) throw new Error('Configuración no encontrada');

    // Validar tipo
    this.validateValue(value, config.tipo);

    // Guardar valor como string
    const stringValue = this.stringifyValue(value, config.tipo);

    await prisma.config.update({
      where: { key },
      data: {
        value: stringValue,
        updatedBy: userId,
        updatedAt: new Date()
      }
    });

    // Invalidar caché
    await cache.del(`${this.CACHE_PREFIX}${key}`);
  }

  // Parsear valor según tipo
  private parseValue(value: string, tipo: string): any {
    switch (tipo) {
      case 'NUMBER':
        return parseFloat(value);
      case 'BOOLEAN':
        return value === 'true';
      case 'JSON':
        return JSON.parse(value);
      default:
        return value;
    }
  }

  // Convertir valor a string
  private stringifyValue(value: any, tipo: string): string {
    switch (tipo) {
      case 'JSON':
        return JSON.stringify(value);
      case 'BOOLEAN':
        return value ? 'true' : 'false';
      default:
        return String(value);
    }
  }

  // Validar valor
  private validateValue(value: any, tipo: string): void {
    // Implementar validaciones según tipo
    switch (tipo) {
      case 'EMAIL':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          throw new Error('Email inválido');
        }
        break;
      case 'URL':
        if (!/^https?:\/\/.+/.test(value)) {
          throw new Error('URL inválida');
        }
        break;
      case 'NUMBER':
        if (isNaN(value)) {
          throw new Error('Debe ser un número');
        }
        break;
    }
  }
}

export default new ConfigService();
```

ENTREGABLES:
1. Modelo de datos completo con seed inicial
2. Todos los endpoints funcionando
3. Sistema de caché implementado
4. Validaciones por tipo de dato
5. Encriptación de datos sensibles
6. Exportar/Importar configuración
7. Historial de cambios
8. Endpoint público para frontend
9. Tests de validación de SMTP y pasarelas de pago

```

---

## 🎨 PROMPT PARA FRONTEND - PANEL DE CONFIGURACIÓN

```
Actúa como desarrollador frontend senior especializado en paneles de administración.

CONTEXTO:
Desarrollar la interfaz completa del módulo de configuración para el panel admin. Este módulo permite gestionar todos los parámetros globales del e-commerce de óptica.

ARQUITECTURA FRONTEND:
- React 18 + TypeScript
- React Hook Form (formularios)
- Tailwind CSS
- React Hot Toast
- Lucide React (iconos)

PÁGINAS Y COMPONENTES:

1. PÁGINA PRINCIPAL: Configuración General
   Ruta: /admin/config

Estructura con tabs laterales:

```tsx
<div className="p-6 flex gap-6">
  {/* Sidebar de navegación */}
  <aside className="w-64 bg-white rounded-lg shadow p-4">
    <nav className="space-y-1">
      <NavItem 
        icon={<Building />}
        label="Empresa"
        active={activeTab === 'empresa'}
        onClick={() => setActiveTab('empresa')}
      />
      <NavItem 
        icon={<CreditCard />}
        label="Métodos de Pago"
        onClick={() => setActiveTab('pagos')}
      />
      <NavItem 
        icon={<Truck />}
        label="Envíos"
        onClick={() => setActiveTab('envios')}
      />
      <NavItem 
        icon={<Receipt />}
        label="Impuestos"
        onClick={() => setActiveTab('impuestos')}
      />
      <NavItem 
        icon={<Mail />}
        label="Emails"
        onClick={() => setActiveTab('emails')}
      />
      <NavItem 
        icon={<Globe />}
        label="Sitio Web"
        onClick={() => setActiveTab('sitio')}
      />
      <NavItem 
        icon={<Search />}
        label="SEO"
        onClick={() => setActiveTab('seo')}
      />
      <NavItem 
        icon={<Glasses />}
        label="Configuración Óptica"
        onClick={() => setActiveTab('optica')}
      />
      <NavItem 
        icon={<FileText />}
        label="Políticas Legales"
        onClick={() => setActiveTab('legal')}
      />
    </nav>
  </aside>

  {/* Contenido principal */}
  <main className="flex-1">
    {activeTab === 'empresa' && <EmpresaConfig />}
    {activeTab === 'pagos' && <PagosConfig />}
    {activeTab === 'envios' && <EnviosConfig />}
    {/* ... resto de tabs */}
  </main>
</div>
```

2. TAB: INFORMACIÓN DE LA EMPRESA

```tsx
const EmpresaConfig = () => {
  const { register, handleSubmit, setValue } = useForm();
  const [logo, setLogo] = useState('');

  const onSubmit = async (data) => {
    try {
      await updateConfig('empresa', data);
      toast.success('Configuración guardada');
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold">Información de la Empresa</h2>

      {/* Logo */}
      <div>
        <label className="block font-medium mb-2">Logo de la Tienda</label>
        <div className="flex items-center gap-4">
          {logo && (
            <img src={logo} alt="Logo" className="h-20 w-auto" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
          />
          <label
            htmlFor="logo-upload"
            className="cursor-pointer px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Subir Logo
          </label>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Recomendado: PNG transparente, 200x80px
        </p>
      </div>

      {/* Nombre */}
      <div>
        <label className="block font-medium mb-2">