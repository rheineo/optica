import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Check, X, Loader2, Search } from 'lucide-react';
import { domainsApi, type Domain, type CreateDomainData } from '../../api/domains';
import toast from 'react-hot-toast';

const TIPOS_DOMINIO = [
  { value: 'color', label: 'Colores' },
  { value: 'forma', label: 'Formas' },
  { value: 'genero', label: 'Géneros' },
  { value: 'material', label: 'Materiales' },
  { value: 'polarizado', label: 'Polarizado' },
  { value: 'proteccion_uv', label: 'Protección UV' },
  { value: 'marca', label: 'Marcas' },
];

export function AdminDomains() {
  const queryClient = useQueryClient();
  const [selectedTipo, setSelectedTipo] = useState<string>('color');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ nombre: '', orden: 0 });
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDomain, setNewDomain] = useState<CreateDomainData>({
    tipo: 'color',
    codigo: '',
    nombre: '',
    orden: 0,
  });

  const { data: domains, isLoading } = useQuery({
    queryKey: ['admin-domains'],
    queryFn: async () => {
      const response = await domainsApi.getAllAdmin();
      return response.data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: domainsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast.success('Dominio creado exitosamente');
      setShowAddForm(false);
      setNewDomain({ tipo: selectedTipo, codigo: '', nombre: '', orden: 0 });
    },
    onError: () => {
      toast.error('Error al crear el dominio');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { nombre?: string; orden?: number; activo?: boolean } }) =>
      domainsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast.success('Dominio actualizado');
      setEditingId(null);
    },
    onError: () => {
      toast.error('Error al actualizar el dominio');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: domainsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-domains'] });
      toast.success('Dominio eliminado');
    },
    onError: () => {
      toast.error('Error al eliminar el dominio');
    },
  });

  const filteredDomains = domains
    ?.filter((d) => d.tipo === selectedTipo)
    .filter((d) =>
      searchTerm
        ? d.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.codigo.toLowerCase().includes(searchTerm.toLowerCase())
        : true
    )
    .sort((a, b) => a.orden - b.orden);

  const handleStartEdit = (domain: Domain) => {
    setEditingId(domain.id);
    setEditForm({ nombre: domain.nombre, orden: domain.orden });
  };

  const handleSaveEdit = (id: string) => {
    updateMutation.mutate({ id, data: editForm });
  };

  const handleToggleActive = (domain: Domain) => {
    updateMutation.mutate({ id: domain.id, data: { activo: !domain.activo } });
  };

  const handleCreate = () => {
    if (!newDomain.codigo || !newDomain.nombre) {
      toast.error('Código y nombre son requeridos');
      return;
    }
    createMutation.mutate({ ...newDomain, tipo: selectedTipo });
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este dominio?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Dominios</h1>
      </div>

      {/* Tabs de tipos */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex flex-wrap gap-2">
          {TIPOS_DOMINIO.map((tipo) => (
            <button
              key={tipo.value}
              onClick={() => {
                setSelectedTipo(tipo.value);
                setNewDomain((prev) => ({ ...prev, tipo: tipo.value }));
              }}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedTipo === tipo.value
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-500'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                }
              `}
            >
              {tipo.label}
              <span className="ml-1 text-xs opacity-70">
                ({domains?.filter((d) => d.tipo === tipo.value).length || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Barra de búsqueda y botón agregar */}
      <div className="flex gap-3 mb-4 flex-shrink-0">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input pl-10 w-full"
          />
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          Agregar
        </button>
      </div>

      {/* Formulario de agregar */}
      {showAddForm && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4 flex-shrink-0">
          <h3 className="font-medium text-emerald-800 mb-3">Nuevo Dominio</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Código (ej: negro_mate)"
              value={newDomain.codigo}
              onChange={(e) => setNewDomain((prev) => ({ ...prev, codigo: e.target.value }))}
              className="input"
            />
            <input
              type="text"
              placeholder="Nombre (ej: Negro Mate)"
              value={newDomain.nombre}
              onChange={(e) => setNewDomain((prev) => ({ ...prev, nombre: e.target.value }))}
              className="input"
            />
            <input
              type="number"
              placeholder="Orden"
              value={newDomain.orden}
              onChange={(e) => setNewDomain((prev) => ({ ...prev, orden: parseInt(e.target.value) || 0 }))}
              className="input"
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="btn btn-primary flex-1"
              >
                {createMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Guardar
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="btn btn-secondary"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tabla de dominios */}
      <div className="flex-1 overflow-auto bg-white rounded-lg shadow-sm border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orden</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredDomains?.map((domain) => (
              <tr key={domain.id} className={!domain.activo ? 'bg-gray-50 opacity-60' : ''}>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {editingId === domain.id ? (
                    <input
                      type="number"
                      value={editForm.orden}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, orden: parseInt(e.target.value) || 0 }))}
                      className="input w-16 text-center"
                    />
                  ) : (
                    domain.orden
                  )}
                </td>
                <td className="px-4 py-3 text-sm font-mono text-gray-600">{domain.codigo}</td>
                <td className="px-4 py-3 text-sm text-gray-900">
                  {editingId === domain.id ? (
                    <input
                      type="text"
                      value={editForm.nombre}
                      onChange={(e) => setEditForm((prev) => ({ ...prev, nombre: e.target.value }))}
                      className="input"
                    />
                  ) : (
                    domain.nombre
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleToggleActive(domain)}
                    className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${domain.activo
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}
                  >
                    {domain.activo ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  {editingId === domain.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleSaveEdit(domain.id)}
                        disabled={updateMutation.isPending}
                        className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleStartEdit(domain)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(domain.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filteredDomains?.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No hay dominios para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
