import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Insertando dominios...');

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

  for (const d of dominios) {
    await prisma.domain.upsert({
      where: { 
        tipo_codigo: { tipo: d.tipo, codigo: d.codigo } 
      },
      update: { nombre: d.nombre, orden: d.orden },
      create: d,
    });
  }

  console.log(`✅ ${dominios.length} dominios insertados/actualizados`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
