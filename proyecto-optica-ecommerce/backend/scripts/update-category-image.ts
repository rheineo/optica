/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Actualizar la categoría MONTURAS_SOL con la imagen de Cloudinary
  const updated = await prisma.category.updateMany({
    where: {
      nombre: 'MONTURAS_SOL',
    },
    data: {
      imagen: 'https://res.cloudinary.com/dadryt5w7/image/upload/v1769738440/categoria_gafas_sol_drxdbh.png',
      slug: 'MONTURAS_SOL',
    },
  });

  console.log(`Categorías actualizadas: ${updated.count}`);

  // Mostrar todas las categorías
  const categories = await prisma.category.findMany();
  console.log('Categorías:', categories);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
