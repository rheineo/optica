import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { ProductFormData } from '../../api/admin';
import type { Category } from '../../types';
import { productsApi } from '../../api/products';
import toast from 'react-hot-toast';

const CATEGORIAS = [
  { value: 'MONTURAS_SOL', label: 'Monturas de Sol' },
  { value: 'MONTURAS_OFTALMICA', label: 'Monturas Oftálmicas' },
  { value: 'LENTES_CONTACTO', label: 'Lentes de Contacto' },
  { value: 'ACCESORIOS', label: 'Accesorios' },
];

const initialFormData: ProductFormData = {
  sku: '',
  nombre: '',
  marca: '',
  categoria: 'MONTURAS_SOL',
  categoryId: '',
  precio: 0,
  descuento: 0,
  imagenes: [],
  descripcion: '',
  caracteristicas: {},
  stock: 0,
};

export function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    fetchCategories();
    if (isEditing && id) {
      fetchProduct(id);
    }
  }, [id]);

  const fetchCategories = async () => {
    try {
      const response = await productsApi.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const response = await adminApi.getProduct(productId);
      if (response.success && response.data) {
        const product = response.data;
        setFormData({
          sku: product.sku,
          nombre: product.nombre,
          marca: product.marca,
          categoria: product.categoria,
          categoryId: product.category?.id || '',
          precio: product.precio,
          descuento: product.descuento || 0,
          imagenes: product.imagenes || [],
          descripcion: product.descripcion,
          caracteristicas: product.caracteristicas as Record<string, unknown> || {},
          stock: product.stock,
        });
      }
    } catch (error) {
      toast.error('Error al cargar el producto');
      navigate('/admin/productos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        imagenes: [...prev.imagenes, newImageUrl.trim()],
      }));
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: prev.imagenes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.sku || !formData.nombre || !formData.marca || !formData.precio) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    setIsSaving(true);
    try {
      const dataToSend = {
        ...formData,
        categoryId: formData.categoryId || undefined,
      };

      if (isEditing && id) {
        const response = await adminApi.updateProduct(id, dataToSend);
        if (response.success) {
          toast.success('Producto actualizado exitosamente');
          navigate('/admin/productos');
        }
      } else {
        const response = await adminApi.createProduct(dataToSend);
        if (response.success) {
          toast.success('Producto creado exitosamente');
          navigate('/admin/productos');
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      toast.error(err.response?.data?.error || 'Error al guardar el producto');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="bg-white rounded-xl p-6 space-y-4">
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
            <div className="h-10 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4">
        <button
          onClick={() => navigate('/admin/productos')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Información Básica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SKU <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                className="input"
                placeholder="Ej: RB-AVI-001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="input"
                placeholder="Nombre del producto"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                required
                className="input"
                placeholder="Ej: Ray-Ban"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría <span className="text-red-500">*</span>
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                required
                className="input"
              >
                {CATEGORIAS.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría (Relación)
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="input"
              >
                <option value="">Seleccionar categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="input"
              placeholder="Descripción del producto..."
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Precio e Inventario</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                required
                min="0"
                step="1000"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descuento (%)
              </label>
              <input
                type="number"
                name="descuento"
                value={formData.descuento}
                onChange={handleChange}
                min="0"
                max="100"
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
          <h2 className="text-base font-semibold text-gray-900 mb-3">Imágenes</h2>
          
          <div className="flex gap-3 mb-3">
            <input
              type="url"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              placeholder="URL de la imagen"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="btn btn-secondary"
            >
              <Plus className="w-4 h-4" />
              Agregar
            </button>
          </div>

          {formData.imagenes.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {formData.imagenes.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/200x200/e2e8f0/64748b?text=Error';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.imagenes.length === 0 && (
            <p className="text-gray-500 text-sm">No hay imágenes agregadas</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/productos')}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="btn btn-primary disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Producto'}
          </button>
        </div>
      </form>
    </div>
  );
}
