import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, X, ChevronDown } from 'lucide-react';
import { productsApi } from '../api/products';
import type { Product, Category } from '../types';
import { ProductGrid } from '../components/product/ProductGrid';
import { getCategoryLabel, formatCategoryName } from '../utils/formatters';

export function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  const categoria = searchParams.get('categoria') || '';
  const search = searchParams.get('search') || '';
  const marca = searchParams.get('marca') || '';
  const page = parseInt(searchParams.get('page') || '1');

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsApi.getAll({
          categoria: categoria || undefined,
          search: search || undefined,
          marca: marca || undefined,
          page,
          limit: 12,
        });
        if (response.success) {
          setProducts(response.data);
          setPagination(response.pagination);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

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

    fetchProducts();
    fetchCategories();
  }, [categoria, search, marca, page]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.delete('page');
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const goToPage = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage));
    setSearchParams(newParams);
  };

  const hasActiveFilters = categoria || search || marca;

  const marcas = ['Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Versace', 'Acuvue', 'Bausch + Lomb'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {categoria ? getCategoryLabel(categoria) : 'Todos los Productos'}
        </h1>
        {search && (
          <p className="text-gray-600">
            Resultados para: <span className="font-medium">"{search}"</span>
          </p>
        )}
        <p className="text-gray-500 mt-1">{pagination.total} productos encontrados</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Filtros</h2>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Limpiar
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Categoría</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="categoria"
                      checked={categoria === cat.slug}
                      onChange={() => updateFilter('categoria', cat.slug)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">{formatCategoryName(cat.nombre)}</span>
                    <span className="ml-auto text-gray-400 text-sm">
                      ({cat._count?.products || 0})
                    </span>
                  </label>
                ))}
                {categoria && (
                  <button
                    onClick={() => updateFilter('categoria', '')}
                    className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                  >
                    Ver todas
                  </button>
                )}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Marca</h3>
              <div className="space-y-2">
                {marcas.map((m) => (
                  <label key={m} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="marca"
                      checked={marca === m}
                      onChange={() => updateFilter('marca', m)}
                      className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-gray-700">{m}</span>
                  </label>
                ))}
                {marca && (
                  <button
                    onClick={() => updateFilter('marca', '')}
                    className="text-sm text-primary-600 hover:text-primary-700 mt-2"
                  >
                    Ver todas
                  </button>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border"
          >
            <Filter className="w-5 h-5" />
            Filtros
            {hasActiveFilters && (
              <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                Activos
              </span>
            )}
          </button>
        </div>

        {/* Mobile Filters Modal */}
        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowFilters(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Filtros</h2>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Categoría</h3>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="categoria-mobile"
                        checked={categoria === cat.slug}
                        onChange={() => {
                          updateFilter('categoria', cat.slug);
                          setShowFilters(false);
                        }}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="ml-2 text-gray-700">{formatCategoryName(cat.nombre)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Marca</h3>
                <div className="space-y-2">
                  {marcas.map((m) => (
                    <label key={m} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="marca-mobile"
                        checked={marca === m}
                        onChange={() => {
                          updateFilter('marca', m);
                          setShowFilters(false);
                        }}
                        className="w-4 h-4 text-primary-600"
                      />
                      <span className="ml-2 text-gray-700">{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    clearFilters();
                    setShowFilters(false);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Limpiar
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 btn-primary"
                >
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          <ProductGrid products={products} isLoading={isLoading} />

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Anterior
              </button>
              {[...Array(pagination.totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-4 py-2 border rounded-lg ${
                    page === i + 1
                      ? 'bg-primary-600 text-white border-primary-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
