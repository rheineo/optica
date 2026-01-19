import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Eye, Package } from 'lucide-react';
import { adminApi } from '../../api/admin';
import type { Product } from '../../types';
import { formatPrice, getCategoryLabel } from '../../utils/formatters';
import { ConfirmModal } from '../../components/ui';
import toast from 'react-hot-toast';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; product: Product | null; isDeleting: boolean }>({
    isOpen: false,
    product: null,
    isDeleting: false,
  });

  const fetchProducts = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await adminApi.getProducts({
        page,
        limit: pagination.limit,
        search: search || undefined,
      });
      if (response.success) {
        setProducts(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts(1);
  };

  const openDeleteModal = (product: Product) => {
    setDeleteModal({ isOpen: true, product, isDeleting: false });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, product: null, isDeleting: false });
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.product) return;

    setDeleteModal((prev) => ({ ...prev, isDeleting: true }));
    try {
      const response = await adminApi.deleteProduct(deleteModal.product.id);
      if (response.success) {
        toast.success('Producto eliminado');
        fetchProducts(pagination.page);
        closeDeleteModal();
      }
    } catch (error) {
      toast.error('Error al eliminar producto');
      setDeleteModal((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const goToPage = (page: number) => {
    fetchProducts(page);
  };

  return (
    <div className="p-3 md:p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Productos</h1>
        <p className="text-gray-600 text-sm">Gestiona el catálogo de productos</p>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 md:p-4 mb-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:w-1/2 lg:w-2/5">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nombre, marca o SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input input-with-icon"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
          >
            <Search className="w-4 h-4" />
            Buscar
          </button>
          <Link
            to="/admin/productos/nuevo"
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            <span>Agregar</span>
          </Link>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Producto
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">
                  SKU
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase hidden lg:table-cell">
                  Categoría
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">
                  Precio
                </th>
                <th className="px-3 md:px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">
                  Stock
                </th>
                <th className="px-3 md:px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 md:px-4 py-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded" />
                        <div className="space-y-1">
                          <div className="h-3 bg-gray-200 rounded w-24" />
                          <div className="h-2 bg-gray-200 rounded w-16" />
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden md:table-cell"><div className="h-3 bg-gray-200 rounded w-20" /></td>
                    <td className="px-3 md:px-4 py-2 hidden lg:table-cell"><div className="h-3 bg-gray-200 rounded w-20" /></td>
                    <td className="px-3 md:px-4 py-2"><div className="h-3 bg-gray-200 rounded w-16" /></td>
                    <td className="px-3 md:px-4 py-2 hidden sm:table-cell"><div className="h-3 bg-gray-200 rounded w-10" /></td>
                    <td className="px-3 md:px-4 py-2"><div className="h-3 bg-gray-200 rounded w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium text-sm">No se encontraron productos</p>
                        <p className="text-gray-400 text-xs mt-1">Agrega tu primer producto para comenzar</p>
                      </div>
                      <Link
                        to="/admin/productos/nuevo"
                        className="btn btn-primary text-sm"
                      >
                        <Plus className="w-4 h-4" />
                        Agregar
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 md:px-4 py-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={product.imagenes?.[0] || `https://placehold.co/32x32/e2e8f0/64748b?text=${product.marca.charAt(0)}`}
                          alt={product.nombre}
                          className="w-8 h-8 object-cover rounded border border-gray-100"
                        />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.nombre}</p>
                          <p className="text-xs text-gray-500">{product.marca}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-4 py-2 text-gray-600 hidden md:table-cell">
                      <code className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">{product.sku}</code>
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden lg:table-cell">
                      <span className="inline-flex px-2 py-0.5 text-xs font-medium rounded-full bg-violet-100 text-violet-700">
                        {getCategoryLabel(product.categoria)}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <p className="font-semibold text-gray-900">{formatPrice(product.precio)}</p>
                      {product.descuento && product.descuento > 0 && (
                        <span className="text-xs text-red-500">-{product.descuento}%</span>
                      )}
                    </td>
                    <td className="px-3 md:px-4 py-2 hidden sm:table-cell">
                      <span className={`inline-flex px-1.5 py-0.5 text-xs font-medium rounded ${
                        product.stock <= 5 
                          ? 'bg-red-100 text-red-700' 
                          : product.stock <= 20 
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-green-100 text-green-700'
                      }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-3 md:px-4 py-2">
                      <div className="flex items-center justify-end gap-0.5">
                        <Link
                          to={`/producto/${product.id}`}
                          target="_blank"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                          title="Ver"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/productos/${product.id}/editar`}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openDeleteModal(product)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-4 md:px-8 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500 order-2 sm:order-1">
              Mostrando <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> - <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> de <span className="font-medium">{pagination.total}</span> productos
            </p>
            <div className="flex gap-2 order-1 sm:order-2">
              <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="btn btn-neutral disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <div className="hidden sm:flex gap-1">
                {[...Array(pagination.totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToPage(i + 1)}
                    className={`btn ${
                      pagination.page === i + 1
                        ? 'btn-primary'
                        : 'btn-neutral'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <span className="sm:hidden flex items-center px-3 text-sm text-gray-600">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="btn btn-neutral disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Eliminar Producto"
        message={`¿Estás seguro de eliminar "${deleteModal.product?.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={deleteModal.isDeleting}
        variant="danger"
      />
    </div>
  );
}
