import { PrismaClient, Role, Categoria, TipoConfig, CategoriaConfig } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare const process: { exit: (code: number) => never; env: Record<string, string | undefined> };

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  await prisma.domain.deleteMany();
  await prisma.configHistory.deleteMany();
  await prisma.config.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.inventory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios
  const hashedPassword = await bcrypt.hash('Admin123!', 10);
  const hashedClientPassword = await bcrypt.hash('Cliente123!', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@optivision.com',
      name: 'Administrador OptiVision',
      password: hashedPassword,
      phone: '3001234567',
      role: Role.ADMIN,
    },
  });

  const cliente1 = await prisma.user.create({
    data: {
      email: 'juan.perez@email.com',
      name: 'Juan Pérez',
      password: hashedClientPassword,
      phone: '3009876543',
      role: Role.CLIENTE,
    },
  });

  const cliente2 = await prisma.user.create({
    data: {
      email: 'maria.garcia@email.com',
      name: 'María García',
      password: hashedClientPassword,
      phone: '3005551234',
      role: Role.CLIENTE,
    },
  });

  console.log('✅ Usuarios creados');

  // Crear categorías
  const categoriaMonturasSol = await prisma.category.create({
    data: {
      nombre: Categoria.MONTURAS_SOL,
      descripcion: 'Gafas de sol de las mejores marcas',
    },
  });

  const categoriaMonturaOftalmica = await prisma.category.create({
    data: {
      nombre: Categoria.MONTURAS_OFTALMICA,
      descripcion: 'Monturas para lentes formulados',
    },
  });

  const categoriaLentesContacto = await prisma.category.create({
    data: {
      nombre: Categoria.LENTES_CONTACTO,
      descripcion: 'Lentes de contacto de uso diario y mensual',
    },
  });

  const categoriaAccesorios = await prisma.category.create({
    data: {
      nombre: Categoria.ACCESORIOS,
      descripcion: 'Estuches, paños y accesorios para tus gafas',
    },
  });

  console.log('✅ Categorías creadas');

  // Crear productos - Monturas de Sol
  const productos = [
    {
      sku: 'RB-AVI-001',
      nombre: 'Ray-Ban Aviator Clásico RB3025',
      marca: 'Ray-Ban',
      categoria: Categoria.MONTURAS_SOL,
      categoryId: categoriaMonturasSol.id,
      precio: 89990,
      descuento: 10,
      imagenes: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500'],
      descripcion: 'El icónico diseño Aviator que ha definido generaciones. Lentes de cristal con protección UV400.',
      caracteristicas: {
        material: 'metal',
        color: 'dorado',
        forma: 'aviador',
        genero: 'unisex',
        proteccionUV: true,
      },
      stock: 15,
    },
    {
      sku: 'OAK-FLK-001',
      nombre: 'Oakley Flak 2.0 XL Polarizado',
      marca: 'Oakley',
      categoria: Categoria.MONTURAS_SOL,
      categoryId: categoriaMonturasSol.id,
      precio: 124990,
      imagenes: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500'],
      descripcion: 'Gafas deportivas de alto rendimiento con lentes Prizm polarizados.',
      caracteristicas: {
        material: 'plastico_resistente',
        color: 'negro_mate',
        forma: 'deportivo',
        genero: 'unisex',
        polarizado: true,
      },
      stock: 8,
    },
    {
      sku: 'RB-WAY-001',
      nombre: 'Ray-Ban Wayfarer Original',
      marca: 'Ray-Ban',
      categoria: Categoria.MONTURAS_SOL,
      categoryId: categoriaMonturasSol.id,
      precio: 79990,
      imagenes: ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=500'],
      descripcion: 'El diseño más reconocido del mundo. Estilo atemporal con máxima protección.',
      caracteristicas: {
        material: 'acetato',
        color: 'negro',
        forma: 'rectangular',
        genero: 'unisex',
        proteccionUV: true,
      },
      stock: 20,
    },
    {
      sku: 'GUC-CAT-001',
      nombre: 'Gucci Cat Eye GG0327S',
      marca: 'Gucci',
      categoria: Categoria.MONTURAS_SOL,
      categoryId: categoriaMonturasSol.id,
      precio: 189990,
      descuento: 15,
      imagenes: ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=500'],
      descripcion: 'Elegantes gafas cat-eye con el distintivo logo de Gucci.',
      caracteristicas: {
        material: 'acetato',
        color: 'carey',
        forma: 'cat-eye',
        genero: 'mujer',
        proteccionUV: true,
      },
      stock: 5,
    },
    {
      sku: 'PRS-RND-001',
      nombre: 'Persol Round PO3092SM',
      marca: 'Persol',
      categoria: Categoria.MONTURAS_SOL,
      categoryId: categoriaMonturasSol.id,
      precio: 159990,
      imagenes: ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=500'],
      descripcion: 'Diseño italiano clásico con el sistema de bisagra Meflecto.',
      caracteristicas: {
        material: 'acetato',
        color: 'havana',
        forma: 'redonda',
        genero: 'unisex',
        proteccionUV: true,
      },
      stock: 7,
    },
    // Monturas Oftálmicas
    {
      sku: 'RB-OPT-001',
      nombre: 'Ray-Ban RX5154 Clubmaster Optics',
      marca: 'Ray-Ban',
      categoria: Categoria.MONTURAS_OFTALMICA,
      categoryId: categoriaMonturaOftalmica.id,
      precio: 119990,
      imagenes: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500'],
      descripcion: 'El icónico diseño Clubmaster adaptado para lentes formulados.',
      caracteristicas: {
        material: 'acetato_metal',
        color: 'negro_dorado',
        forma: 'browline',
        genero: 'unisex',
      },
      stock: 12,
    },
    {
      sku: 'TF-OPT-001',
      nombre: 'Tom Ford FT5401',
      marca: 'Tom Ford',
      categoria: Categoria.MONTURAS_OFTALMICA,
      categoryId: categoriaMonturaOftalmica.id,
      precio: 249990,
      descuento: 20,
      imagenes: ['https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=500'],
      descripcion: 'Montura de lujo con diseño sofisticado y elegante.',
      caracteristicas: {
        material: 'acetato',
        color: 'negro_brillante',
        forma: 'rectangular',
        genero: 'hombre',
      },
      stock: 4,
    },
    {
      sku: 'OAK-OPT-001',
      nombre: 'Oakley Pitchman R OX8105',
      marca: 'Oakley',
      categoria: Categoria.MONTURAS_OFTALMICA,
      categoryId: categoriaMonturaOftalmica.id,
      precio: 139990,
      imagenes: ['https://images.unsplash.com/photo-1614715838608-dd527c46231d?w=500'],
      descripcion: 'Montura deportiva ligera con tecnología O Matter.',
      caracteristicas: {
        material: 'o_matter',
        color: 'gris_humo',
        forma: 'rectangular',
        genero: 'hombre',
      },
      stock: 9,
    },
    {
      sku: 'VRS-OPT-001',
      nombre: 'Versace VE3186',
      marca: 'Versace',
      categoria: Categoria.MONTURAS_OFTALMICA,
      categoryId: categoriaMonturaOftalmica.id,
      precio: 179990,
      imagenes: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500'],
      descripcion: 'Elegante montura con el icónico logo de Medusa.',
      caracteristicas: {
        material: 'acetato',
        color: 'burdeos',
        forma: 'cat-eye',
        genero: 'mujer',
      },
      stock: 6,
    },
    {
      sku: 'ARM-OPT-001',
      nombre: 'Armani Exchange AX3016',
      marca: 'Armani Exchange',
      categoria: Categoria.MONTURAS_OFTALMICA,
      categoryId: categoriaMonturaOftalmica.id,
      precio: 89990,
      imagenes: ['https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=500'],
      descripcion: 'Diseño moderno y minimalista para uso diario.',
      caracteristicas: {
        material: 'metal',
        color: 'plata_mate',
        forma: 'rectangular',
        genero: 'unisex',
      },
      stock: 18,
    },
    // Lentes de Contacto
    {
      sku: 'ACV-OAS-001',
      nombre: 'Acuvue Oasys (6 unidades)',
      marca: 'Acuvue',
      categoria: Categoria.LENTES_CONTACTO,
      categoryId: categoriaLentesContacto.id,
      precio: 42990,
      imagenes: ['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500'],
      descripcion: 'Lentes de contacto de reemplazo quincenal con tecnología Hydraclear Plus.',
      caracteristicas: {
        tipoLente: 'blandos',
        duracion: 'quincenal',
        hidratacion: 'alta',
        proteccionUV: true,
      },
      stock: 50,
    },
    {
      sku: 'ACV-1DY-001',
      nombre: 'Acuvue 1-Day Moist (30 unidades)',
      marca: 'Acuvue',
      categoria: Categoria.LENTES_CONTACTO,
      categoryId: categoriaLentesContacto.id,
      precio: 54990,
      imagenes: ['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500'],
      descripcion: 'Lentes de contacto desechables diarios ultra cómodos.',
      caracteristicas: {
        tipoLente: 'blandos',
        duracion: 'diario',
        hidratacion: 'alta',
        proteccionUV: true,
      },
      stock: 40,
    },
    {
      sku: 'AIR-OPT-001',
      nombre: 'Air Optix Aqua (6 unidades)',
      marca: 'Alcon',
      categoria: Categoria.LENTES_CONTACTO,
      categoryId: categoriaLentesContacto.id,
      precio: 49990,
      descuento: 10,
      imagenes: ['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500'],
      descripcion: 'Lentes de contacto mensuales con tecnología SmartShield.',
      caracteristicas: {
        tipoLente: 'blandos',
        duracion: 'mensual',
        hidratacion: 'alta',
        oxigeno: 'alto',
      },
      stock: 35,
    },
    {
      sku: 'BIO-TRU-001',
      nombre: 'Biotrue ONEday (30 unidades)',
      marca: 'Bausch + Lomb',
      categoria: Categoria.LENTES_CONTACTO,
      categoryId: categoriaLentesContacto.id,
      precio: 59990,
      imagenes: ['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500'],
      descripcion: 'Lentes inspirados en la biología del ojo para máxima comodidad.',
      caracteristicas: {
        tipoLente: 'blandos',
        duracion: 'diario',
        hidratacion: 'muy_alta',
        biocompatible: true,
      },
      stock: 25,
    },
    // Accesorios
    {
      sku: 'EST-PRE-001',
      nombre: 'Estuche Rígido Premium',
      marca: 'OptiVision',
      categoria: Categoria.ACCESORIOS,
      categoryId: categoriaAccesorios.id,
      precio: 12990,
      imagenes: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500'],
      descripcion: 'Estuche rígido con interior de terciopelo para máxima protección.',
      caracteristicas: {
        material: 'cuero_sintetico',
        color: 'negro',
        tipo: 'rigido',
      },
      stock: 100,
    },
    {
      sku: 'PAÑ-MIC-001',
      nombre: 'Paño Microfibra Premium (Pack x3)',
      marca: 'OptiVision',
      categoria: Categoria.ACCESORIOS,
      categoryId: categoriaAccesorios.id,
      precio: 9990,
      imagenes: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500'],
      descripcion: 'Paños de microfibra ultra suaves para limpieza sin rayones.',
      caracteristicas: {
        material: 'microfibra',
        cantidad: 3,
        lavable: true,
      },
      stock: 200,
    },
    {
      sku: 'COR-DEP-001',
      nombre: 'Cordón Deportivo Ajustable',
      marca: 'OptiVision',
      categoria: Categoria.ACCESORIOS,
      categoryId: categoriaAccesorios.id,
      precio: 7990,
      imagenes: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500'],
      descripcion: 'Cordón ajustable para actividades deportivas.',
      caracteristicas: {
        material: 'neopreno',
        color: 'negro',
        ajustable: true,
        flotante: true,
      },
      stock: 80,
    },
    {
      sku: 'LIM-SPR-001',
      nombre: 'Spray Limpiador Antivaho 60ml',
      marca: 'OptiVision',
      categoria: Categoria.ACCESORIOS,
      categoryId: categoriaAccesorios.id,
      precio: 14990,
      imagenes: ['https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=500'],
      descripcion: 'Limpiador con efecto antivaho de larga duración.',
      caracteristicas: {
        volumen: '60ml',
        antivaho: true,
        antibacterial: true,
      },
      stock: 150,
    },
    {
      sku: 'SOL-LEN-001',
      nombre: 'Solución Multiuso Lentes de Contacto 360ml',
      marca: 'Renu',
      categoria: Categoria.ACCESORIOS,
      categoryId: categoriaAccesorios.id,
      precio: 24990,
      imagenes: ['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500'],
      descripcion: 'Solución todo en uno para limpieza, desinfección y almacenamiento.',
      caracteristicas: {
        volumen: '360ml',
        multiuso: true,
        hipoalergenico: true,
      },
      stock: 60,
    },
    {
      sku: 'EST-LEN-001',
      nombre: 'Estuche para Lentes de Contacto',
      marca: 'OptiVision',
      categoria: Categoria.ACCESORIOS,
      categoryId: categoriaAccesorios.id,
      precio: 4990,
      imagenes: ['https://images.unsplash.com/photo-1587614382346-4ec70e388b28?w=500'],
      descripcion: 'Estuche compacto con indicador L/R para lentes de contacto.',
      caracteristicas: {
        material: 'plastico',
        color: 'azul',
        antibacterial: true,
      },
      stock: 300,
    },
  ];

  for (const producto of productos) {
    await prisma.product.create({
      data: producto,
    });
  }

  console.log('✅ Productos creados');

  // Crear direcciones para clientes
  await prisma.address.create({
    data: {
      userId: cliente1.id,
      nombre: 'Casa',
      direccion: 'Calle 123 #45-67, Apto 801',
      ciudad: 'Bogotá',
      telefono: '3009876543',
      esDefault: true,
    },
  });

  await prisma.address.create({
    data: {
      userId: cliente2.id,
      nombre: 'Oficina',
      direccion: 'Carrera 7 #72-41, Oficina 502',
      ciudad: 'Bogotá',
      telefono: '3005551234',
      esDefault: true,
    },
  });

  console.log('✅ Direcciones creadas');

  // Crear configuraciones por defecto
  const defaultConfigs = [
    // EMPRESA
    { key: 'empresa_nombre', value: 'Liney Visión', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMPRESA, descripcion: 'Nombre comercial de la tienda', isPublic: true },
    { key: 'empresa_logo', value: '', tipo: TipoConfig.IMAGE, categoria: CategoriaConfig.EMPRESA, descripcion: 'Logo principal', isPublic: true },
    { key: 'empresa_favicon', value: '', tipo: TipoConfig.IMAGE, categoria: CategoriaConfig.EMPRESA, descripcion: 'Favicon del sitio', isPublic: true },
    { key: 'empresa_direccion', value: 'Calle 123 #45-67, Bogotá', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMPRESA, descripcion: 'Dirección física', isPublic: true },
    { key: 'empresa_telefono', value: '601-2345678', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMPRESA, descripcion: 'Teléfono principal', isPublic: true },
    { key: 'empresa_whatsapp', value: '3001234567', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMPRESA, descripcion: 'Número de WhatsApp', isPublic: true },
    { key: 'empresa_email', value: 'ventas@lineyvision.com', tipo: TipoConfig.EMAIL, categoria: CategoriaConfig.EMPRESA, descripcion: 'Email de contacto', isPublic: true },
    { key: 'empresa_email_soporte', value: 'soporte@lineyvision.com', tipo: TipoConfig.EMAIL, categoria: CategoriaConfig.EMPRESA, descripcion: 'Email de soporte', isPublic: true },
    { key: 'empresa_horario', value: 'Lunes a Viernes: 9am - 6pm, Sábados: 9am - 2pm', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMPRESA, descripcion: 'Horario de atención', isPublic: true },
    { key: 'empresa_nit', value: '900.123.456-7', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMPRESA, descripcion: 'NIT de la empresa', isPublic: true },
    { key: 'empresa_razon_social', value: 'Liney Visión S.A.S.', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMPRESA, descripcion: 'Razón social', isPublic: true },
    { key: 'empresa_redes_sociales', value: JSON.stringify({ facebook: '', instagram: '', twitter: '', tiktok: '' }), tipo: TipoConfig.JSON, categoria: CategoriaConfig.EMPRESA, descripcion: 'Redes sociales', isPublic: true },
    
    // PAGOS
    { key: 'pagos_metodos_activos', value: JSON.stringify({ tarjetaCredito: true, tarjetaDebito: true, pse: true, efectivo: true, transferencia: false }), tipo: TipoConfig.JSON, categoria: CategoriaConfig.PAGOS, descripcion: 'Métodos de pago activos', isPublic: true },
    { key: 'pagos_pasarela', value: 'wompi', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.PAGOS, descripcion: 'Pasarela de pago activa', isPublic: false },
    { key: 'pagos_pasarela_public_key', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.PAGOS, descripcion: 'Llave pública de pasarela', isPublic: false },
    { key: 'pagos_pasarela_private_key', value: '', tipo: TipoConfig.PASSWORD, categoria: CategoriaConfig.PAGOS, descripcion: 'Llave privada de pasarela', isPublic: false },
    { key: 'pagos_modo_prueba', value: 'true', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.PAGOS, descripcion: 'Modo de prueba activo', isPublic: false },
    
    // ENVÍOS
    { key: 'envios_gratis_desde', value: '150000', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.ENVIOS, descripcion: 'Monto mínimo para envío gratis', isPublic: true },
    { key: 'envios_costo_default', value: '10000', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.ENVIOS, descripcion: 'Costo de envío por defecto', isPublic: true },
    { key: 'envios_zonas', value: JSON.stringify([
      { nombre: 'Bogotá', costo: 8000, diasEntrega: '2-3', activo: true },
      { nombre: 'Medellín', costo: 10000, diasEntrega: '3-4', activo: true },
      { nombre: 'Cali', costo: 10000, diasEntrega: '3-4', activo: true },
      { nombre: 'Otras ciudades', costo: 15000, diasEntrega: '4-6', activo: true },
    ]), tipo: TipoConfig.JSON, categoria: CategoriaConfig.ENVIOS, descripcion: 'Zonas de envío', isPublic: true },
    { key: 'envios_transportadoras', value: JSON.stringify(['Servientrega', 'Coordinadora', 'Interrapidísimo']), tipo: TipoConfig.JSON, categoria: CategoriaConfig.ENVIOS, descripcion: 'Transportadoras disponibles', isPublic: false },
    { key: 'envios_peso_maximo', value: '5', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.ENVIOS, descripcion: 'Peso máximo por paquete (kg)', isPublic: false },
    
    // IMPUESTOS
    { key: 'impuestos_iva', value: '19', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.IMPUESTOS, descripcion: 'Porcentaje de IVA', isPublic: true },
    { key: 'impuestos_moneda', value: 'COP', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.IMPUESTOS, descripcion: 'Código de moneda', isPublic: true },
    { key: 'impuestos_simbolo_moneda', value: '$', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.IMPUESTOS, descripcion: 'Símbolo de moneda', isPublic: true },
    { key: 'impuestos_formato_numero', value: '1.000,00', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.IMPUESTOS, descripcion: 'Formato de números', isPublic: true },
    { key: 'impuestos_incluir_en_precio', value: 'true', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.IMPUESTOS, descripcion: 'IVA incluido en precios mostrados', isPublic: true },
    
    // EMAILS
    { key: 'emails_smtp_host', value: 'smtp.ethereal.email', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMAILS, descripcion: 'Host SMTP', isPublic: false },
    { key: 'emails_smtp_port', value: '587', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.EMAILS, descripcion: 'Puerto SMTP', isPublic: false },
    { key: 'emails_smtp_user', value: '', tipo: TipoConfig.EMAIL, categoria: CategoriaConfig.EMAILS, descripcion: 'Usuario SMTP', isPublic: false },
    { key: 'emails_smtp_password', value: '', tipo: TipoConfig.PASSWORD, categoria: CategoriaConfig.EMAILS, descripcion: 'Contraseña SMTP', isPublic: false },
    { key: 'emails_remitente_nombre', value: 'Liney Visión', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.EMAILS, descripcion: 'Nombre del remitente', isPublic: false },
    { key: 'emails_remitente_email', value: 'noreply@lineyvision.com', tipo: TipoConfig.EMAIL, categoria: CategoriaConfig.EMAILS, descripcion: 'Email del remitente', isPublic: false },
    
    // SITIO
    { key: 'sitio_modo_mantenimiento', value: 'false', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.SITIO, descripcion: 'Modo mantenimiento activo', isPublic: true },
    { key: 'sitio_permitir_registro', value: 'true', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.SITIO, descripcion: 'Permitir registro de usuarios', isPublic: true },
    { key: 'sitio_verificacion_email', value: 'false', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.SITIO, descripcion: 'Requerir verificación de email', isPublic: false },
    { key: 'sitio_productos_por_pagina', value: '20', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.SITIO, descripcion: 'Productos por página', isPublic: true },
    { key: 'sitio_habilitar_comentarios', value: 'true', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.SITIO, descripcion: 'Habilitar comentarios en productos', isPublic: true },
    { key: 'sitio_habilitar_valoraciones', value: 'true', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.SITIO, descripcion: 'Habilitar valoraciones de productos', isPublic: true },
    { key: 'sitio_habilitar_wishlist', value: 'true', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.SITIO, descripcion: 'Habilitar lista de deseos', isPublic: true },
    
    // SEO
    { key: 'seo_meta_titulo', value: 'Liney Visión - Gafas y Lentes de Contacto en Colombia', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.SEO, descripcion: 'Meta título del sitio', isPublic: true },
    { key: 'seo_meta_descripcion', value: 'Encuentra las mejores marcas de gafas, monturas y lentes de contacto. Envío gratis a todo Colombia.', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.SEO, descripcion: 'Meta descripción', isPublic: true },
    { key: 'seo_keywords', value: 'gafas, lentes, ray-ban, oakley, monturas, lentes de contacto, óptica', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.SEO, descripcion: 'Palabras clave', isPublic: true },
    { key: 'seo_google_analytics', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.SEO, descripcion: 'ID de Google Analytics', isPublic: false },
    { key: 'seo_facebook_pixel', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.SEO, descripcion: 'ID de Facebook Pixel', isPublic: false },
    { key: 'seo_google_tag_manager', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.SEO, descripcion: 'ID de Google Tag Manager', isPublic: false },
    
    // ÓPTICA
    { key: 'optica_garantia_meses', value: '12', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.OPTICA, descripcion: 'Meses de garantía estándar', isPublic: true },
    { key: 'optica_servicios_incluidos', value: JSON.stringify(['Ajustes gratuitos', 'Limpieza', 'Revisión anual']), tipo: TipoConfig.JSON, categoria: CategoriaConfig.OPTICA, descripcion: 'Servicios incluidos', isPublic: true },
    { key: 'optica_validez_prescripcion', value: '24', tipo: TipoConfig.NUMBER, categoria: CategoriaConfig.OPTICA, descripcion: 'Validez de prescripción (meses)', isPublic: true },
    { key: 'optica_requerir_prescripcion', value: 'false', tipo: TipoConfig.BOOLEAN, categoria: CategoriaConfig.OPTICA, descripcion: 'Requerir prescripción para lentes graduados', isPublic: true },
    { key: 'optica_tipos_lentes', value: JSON.stringify(['Monofocales', 'Bifocales', 'Progresivos']), tipo: TipoConfig.JSON, categoria: CategoriaConfig.OPTICA, descripcion: 'Tipos de lentes disponibles', isPublic: true },
    { key: 'optica_tratamientos', value: JSON.stringify(['Antireflejante', 'Transitions', 'Blue Filter', 'Fotocromático']), tipo: TipoConfig.JSON, categoria: CategoriaConfig.OPTICA, descripcion: 'Tratamientos disponibles', isPublic: true },
    
    // LEGAL
    { key: 'legal_terminos_condiciones', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.LEGAL, descripcion: 'Términos y condiciones', isPublic: true },
    { key: 'legal_politica_privacidad', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.LEGAL, descripcion: 'Política de privacidad', isPublic: true },
    { key: 'legal_politica_devoluciones', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.LEGAL, descripcion: 'Política de devoluciones', isPublic: true },
    { key: 'legal_politica_envios', value: '', tipo: TipoConfig.TEXT, categoria: CategoriaConfig.LEGAL, descripcion: 'Política de envíos', isPublic: true },
  ];

  for (const config of defaultConfigs) {
    await prisma.config.create({ data: config });
  }
  console.log('✅ Configuraciones creadas');

  // Crear dominios para selects dinámicos
  const dominios = [
    // Colores
    { tipo: 'color', codigo: 'negro', nombre: 'Negro', orden: 1 },
    { tipo: 'color', codigo: 'negro_mate', nombre: 'Negro Mate', orden: 2 },
    { tipo: 'color', codigo: 'dorado', nombre: 'Dorado', orden: 3 },
    { tipo: 'color', codigo: 'plateado', nombre: 'Plateado', orden: 4 },
    { tipo: 'color', codigo: 'azul', nombre: 'Azul', orden: 5 },
    { tipo: 'color', codigo: 'marron', nombre: 'Marrón', orden: 6 },
    { tipo: 'color', codigo: 'carey', nombre: 'Carey', orden: 7 },
    { tipo: 'color', codigo: 'transparente', nombre: 'Transparente', orden: 8 },
    { tipo: 'color', codigo: 'rojo', nombre: 'Rojo', orden: 9 },
    { tipo: 'color', codigo: 'verde', nombre: 'Verde', orden: 10 },
    { tipo: 'color', codigo: 'rosa', nombre: 'Rosa', orden: 11 },
    { tipo: 'color', codigo: 'blanco', nombre: 'Blanco', orden: 12 },
    
    // Formas
    { tipo: 'forma', codigo: 'aviador', nombre: 'Aviador', orden: 1 },
    { tipo: 'forma', codigo: 'cuadrado', nombre: 'Cuadrado', orden: 2 },
    { tipo: 'forma', codigo: 'redondo', nombre: 'Redondo', orden: 3 },
    { tipo: 'forma', codigo: 'rectangular', nombre: 'Rectangular', orden: 4 },
    { tipo: 'forma', codigo: 'cat_eye', nombre: 'Cat Eye', orden: 5 },
    { tipo: 'forma', codigo: 'deportivo', nombre: 'Deportivo', orden: 6 },
    { tipo: 'forma', codigo: 'wayfarer', nombre: 'Wayfarer', orden: 7 },
    { tipo: 'forma', codigo: 'ovalado', nombre: 'Ovalado', orden: 8 },
    { tipo: 'forma', codigo: 'hexagonal', nombre: 'Hexagonal', orden: 9 },
    
    // Géneros
    { tipo: 'genero', codigo: 'hombre', nombre: 'Hombre', orden: 1 },
    { tipo: 'genero', codigo: 'mujer', nombre: 'Mujer', orden: 2 },
    { tipo: 'genero', codigo: 'unisex', nombre: 'Unisex', orden: 3 },
    { tipo: 'genero', codigo: 'nino', nombre: 'Niño', orden: 4 },
    { tipo: 'genero', codigo: 'nina', nombre: 'Niña', orden: 5 },
    
    // Materiales
    { tipo: 'material', codigo: 'metal', nombre: 'Metal', orden: 1 },
    { tipo: 'material', codigo: 'acetato', nombre: 'Acetato', orden: 2 },
    { tipo: 'material', codigo: 'titanio', nombre: 'Titanio', orden: 3 },
    { tipo: 'material', codigo: 'plastico', nombre: 'Plástico', orden: 4 },
    { tipo: 'material', codigo: 'plastico_resistente', nombre: 'Plástico Resistente', orden: 5 },
    { tipo: 'material', codigo: 'acero_inoxidable', nombre: 'Acero Inoxidable', orden: 6 },
    { tipo: 'material', codigo: 'aluminio', nombre: 'Aluminio', orden: 7 },
    { tipo: 'material', codigo: 'madera', nombre: 'Madera', orden: 8 },
    { tipo: 'material', codigo: 'mixto', nombre: 'Mixto', orden: 9 },
    
    // Polarizado
    { tipo: 'polarizado', codigo: 'si', nombre: 'Sí', orden: 1 },
    { tipo: 'polarizado', codigo: 'no', nombre: 'No', orden: 2 },
    
    // Protección UV
    { tipo: 'proteccion_uv', codigo: 'uv400', nombre: 'UV400', orden: 1 },
    { tipo: 'proteccion_uv', codigo: 'uv100', nombre: 'UV100', orden: 2 },
    { tipo: 'proteccion_uv', codigo: 'ninguna', nombre: 'Ninguna', orden: 3 },
    
    // Marcas
    { tipo: 'marca', codigo: 'ray_ban', nombre: 'Ray-Ban', orden: 1 },
    { tipo: 'marca', codigo: 'oakley', nombre: 'Oakley', orden: 2 },
    { tipo: 'marca', codigo: 'gucci', nombre: 'Gucci', orden: 3 },
    { tipo: 'marca', codigo: 'prada', nombre: 'Prada', orden: 4 },
    { tipo: 'marca', codigo: 'versace', nombre: 'Versace', orden: 5 },
    { tipo: 'marca', codigo: 'dior', nombre: 'Dior', orden: 6 },
    { tipo: 'marca', codigo: 'tom_ford', nombre: 'Tom Ford', orden: 7 },
    { tipo: 'marca', codigo: 'carrera', nombre: 'Carrera', orden: 8 },
    { tipo: 'marca', codigo: 'persol', nombre: 'Persol', orden: 9 },
    { tipo: 'marca', codigo: 'armani', nombre: 'Armani', orden: 10 },
  ];

  for (const dominio of dominios) {
    await prisma.domain.create({ data: dominio });
  }
  console.log('✅ Dominios creados');

  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('📧 Credenciales de prueba:');
  console.log('   Admin: admin@optivision.com / Admin123!');
  console.log('   Cliente: juan.perez@email.com / Cliente123!');
  console.log('   Cliente: maria.garcia@email.com / Cliente123!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
