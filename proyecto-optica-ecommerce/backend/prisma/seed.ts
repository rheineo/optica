import { PrismaClient, Role, Categoria } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import process from 'process';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
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
