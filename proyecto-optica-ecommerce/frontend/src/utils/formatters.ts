export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
};

// Formatea el nombre de la categoría reemplazando _ por espacios
export const formatCategoryName = (nombre: string): string => {
  return nombre.replace(/_/g, ' ');
};

export const getCategoryLabel = (category: string): string => {
  const labels: Record<string, string> = {
    MONTURAS_SOL: 'Monturas de Sol',
    MONTURAS_OFTALMICA: 'Monturas Oftálmicas',
    LENTES_CONTACTO: 'Lentes de Contacto',
    ACCESORIOS: 'Accesorios',
    MONTURAS_NINOS: 'Monturas Niños',
  };
  return labels[category] || formatCategoryName(category);
};
