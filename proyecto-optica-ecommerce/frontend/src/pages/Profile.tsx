import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, Plus, Edit2, Trash2, Star, Save, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { profileApi } from '../api/profile';
import type { Address, UserProfile, CreateAddressData } from '../api/profile';
import { getDepartamentos, getMunicipiosByDepartamento } from '../data/colombiaData';
import toast from 'react-hot-toast';

const TIPOS_DOCUMENTO = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PASAPORTE', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' },
];

export function Profile() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Estados del perfil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: '',
    apellidos: '',
    phone: '',
    tipoDocumento: '',
    numeroDocumento: '',
  });
  
  // Estados de direcciones
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<CreateAddressData>({
    nombre: '',
    destinatario: '',
    telefono: '',
    departamento: '',
    municipio: '',
    direccion: '',
    infoAdicional: '',
    barrio: '',
    codigoPostal: '',
    esDefault: false,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadData();
  }, [isAuthenticated, navigate]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      console.log('Cargando datos del perfil...');
      
      const [profileRes, addressesRes] = await Promise.all([
        profileApi.getProfile(),
        profileApi.getAddresses(),
      ]);
      
      console.log('Respuesta perfil:', profileRes);
      console.log('Respuesta direcciones:', addressesRes);
      
      if (profileRes.success && profileRes.data) {
        console.log('Datos del perfil:', profileRes.data);
        setProfile(profileRes.data);
        setProfileForm({
          name: profileRes.data.name || '',
          apellidos: profileRes.data.apellidos || '',
          phone: profileRes.data.phone || '',
          tipoDocumento: profileRes.data.tipoDocumento || '',
          numeroDocumento: profileRes.data.numeroDocumento || '',
        });
      } else {
        console.error('No se recibieron datos del perfil');
      }
      
      if (addressesRes.success && addressesRes.data) {
        console.log('Direcciones:', addressesRes.data);
        setAddresses(addressesRes.data);
      }
    } catch (error) {
      console.error('Error cargando datos:', error);
      toast.error('Error al cargar los datos del perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      const response = await profileApi.updateProfile(profileForm);
      if (response.success) {
        setProfile(response.data);
        setIsEditingProfile(false);
        toast.success('Perfil actualizado correctamente');
      }
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      toast.error('Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAddress = async () => {
    if (!addressForm.nombre || !addressForm.destinatario || !addressForm.telefono || 
        !addressForm.departamento || !addressForm.municipio || !addressForm.direccion) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    try {
      setIsSaving(true);
      if (editingAddressId) {
        const response = await profileApi.updateAddress(editingAddressId, addressForm);
        if (response.success) {
          setAddresses(prev => prev.map(a => a.id === editingAddressId ? response.data : a));
          toast.success('Dirección actualizada');
        }
      } else {
        const response = await profileApi.createAddress(addressForm);
        if (response.success) {
          setAddresses(prev => [...prev, response.data]);
          toast.success('Dirección creada');
        }
      }
      resetAddressForm();
    } catch (error) {
      console.error('Error guardando dirección:', error);
      toast.error('Error al guardar la dirección');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta dirección?')) return;
    
    try {
      const response = await profileApi.deleteAddress(id);
      if (response.success) {
        setAddresses(prev => prev.filter(a => a.id !== id));
        toast.success('Dirección eliminada');
      }
    } catch (error) {
      console.error('Error eliminando dirección:', error);
      toast.error('Error al eliminar la dirección');
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await profileApi.setDefaultAddress(id);
      if (response.success) {
        setAddresses(prev => prev.map(a => ({
          ...a,
          esDefault: a.id === id,
        })));
        toast.success('Dirección predeterminada actualizada');
      }
    } catch (error) {
      console.error('Error estableciendo dirección predeterminada:', error);
      toast.error('Error al establecer dirección predeterminada');
    }
  };

  const startEditAddress = (address: Address) => {
    setEditingAddressId(address.id);
    setAddressForm({
      nombre: address.nombre,
      destinatario: address.destinatario,
      telefono: address.telefono,
      departamento: address.departamento,
      municipio: address.municipio,
      direccion: address.direccion,
      infoAdicional: address.infoAdicional || '',
      barrio: address.barrio || '',
      codigoPostal: address.codigoPostal || '',
      esDefault: address.esDefault,
    });
    setIsAddingAddress(true);
  };

  const resetAddressForm = () => {
    setIsAddingAddress(false);
    setEditingAddressId(null);
    setAddressForm({
      nombre: '',
      destinatario: '',
      telefono: '',
      departamento: '',
      municipio: '',
      direccion: '',
      infoAdicional: '',
      barrio: '',
      codigoPostal: '',
      esDefault: false,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-48" />
            <div className="h-64 bg-gray-300 rounded-2xl" />
            <div className="h-64 bg-gray-300 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-gray-100 to-gray-200 py-6">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-[#0a0c10] mb-6">Mi Perfil</h1>

        {/* Sección de Identificación */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0a0c10] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a0c10]">Identificación</h2>
                <p className="text-xs text-gray-500">Información personal para tus compras</p>
              </div>
            </div>
            {!isEditingProfile && (
              <button
                onClick={() => setIsEditingProfile(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#996600] hover:bg-[#FFD700]/10 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Editar
              </button>
            )}
          </div>

          {isEditingProfile ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Apellidos</label>
                  <input
                    type="text"
                    value={profileForm.apellidos}
                    onChange={(e) => setProfileForm({ ...profileForm, apellidos: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono / Móvil</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Documento</label>
                  <select
                    value={profileForm.tipoDocumento}
                    onChange={(e) => setProfileForm({ ...profileForm, tipoDocumento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  >
                    <option value="">Seleccionar...</option>
                    {TIPOS_DOCUMENTO.map((tipo) => (
                      <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Número de Documento</label>
                  <input
                    type="text"
                    value={profileForm.numeroDocumento}
                    onChange={(e) => setProfileForm({ ...profileForm, numeroDocumento: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0a0c10] text-[#FFD700] text-sm font-semibold rounded-lg hover:bg-[#1a1c20] transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-[#0a0c10]">{profile?.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Nombre</p>
                <p className="text-sm font-medium text-[#0a0c10]">{profile?.name || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Apellidos</p>
                <p className="text-sm font-medium text-[#0a0c10]">{profile?.apellidos || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Teléfono</p>
                <p className="text-sm font-medium text-[#0a0c10]">{profile?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Tipo de Documento</p>
                <p className="text-sm font-medium text-[#0a0c10]">
                  {TIPOS_DOCUMENTO.find(t => t.value === profile?.tipoDocumento)?.label || '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Número de Documento</p>
                <p className="text-sm font-medium text-[#0a0c10]">{profile?.numeroDocumento || '-'}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sección de Direcciones */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0a0c10] rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0a0c10]">Mis Direcciones</h2>
                <p className="text-xs text-gray-500">Direcciones de envío guardadas</p>
              </div>
            </div>
            {!isAddingAddress && (
              <button
                onClick={() => setIsAddingAddress(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-[#FFD700] text-[#0a0c10] text-sm font-semibold rounded-lg hover:bg-[#e6c200] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            )}
          </div>

          {/* Formulario de dirección */}
          {isAddingAddress && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#0a0c10]">
                  {editingAddressId ? 'Editar Dirección' : 'Nueva Dirección'}
                </h3>
                <button onClick={resetAddressForm} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Alias (Casa, Oficina, etc.) *</label>
                  <input
                    type="text"
                    value={addressForm.nombre}
                    onChange={(e) => setAddressForm({ ...addressForm, nombre: e.target.value })}
                    placeholder="Ej: Casa, Oficina"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Destinatario *</label>
                  <input
                    type="text"
                    value={addressForm.destinatario}
                    onChange={(e) => setAddressForm({ ...addressForm, destinatario: e.target.value })}
                    placeholder="Nombre de quien recibe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Teléfono *</label>
                  <input
                    type="tel"
                    value={addressForm.telefono}
                    onChange={(e) => setAddressForm({ ...addressForm, telefono: e.target.value })}
                    placeholder="Teléfono de contacto"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Departamento *</label>
                  <select
                    value={addressForm.departamento}
                    onChange={(e) => setAddressForm({ ...addressForm, departamento: e.target.value, municipio: '' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  >
                    <option value="">Seleccionar...</option>
                    {getDepartamentos().map((dep) => (
                      <option key={dep} value={dep}>{dep}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Municipio/Ciudad *</label>
                  <select
                    value={addressForm.municipio}
                    onChange={(e) => setAddressForm({ ...addressForm, municipio: e.target.value })}
                    disabled={!addressForm.departamento}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{addressForm.departamento ? 'Seleccionar...' : 'Primero seleccione departamento'}</option>
                    {getMunicipiosByDepartamento(addressForm.departamento).map((mun) => (
                      <option key={mun} value={mun}>{mun}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Barrio</label>
                  <input
                    type="text"
                    value={addressForm.barrio}
                    onChange={(e) => setAddressForm({ ...addressForm, barrio: e.target.value })}
                    placeholder="Barrio"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Dirección (Calle, Carrera, Número) *</label>
                  <input
                    type="text"
                    value={addressForm.direccion}
                    onChange={(e) => setAddressForm({ ...addressForm, direccion: e.target.value })}
                    placeholder="Ej: Calle 123 #45-67"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Info. Adicional (Apto, Piso, etc.)</label>
                  <input
                    type="text"
                    value={addressForm.infoAdicional}
                    onChange={(e) => setAddressForm({ ...addressForm, infoAdicional: e.target.value })}
                    placeholder="Ej: Apto 201, Torre B"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Código Postal</label>
                  <input
                    type="text"
                    value={addressForm.codigoPostal}
                    onChange={(e) => setAddressForm({ ...addressForm, codigoPostal: e.target.value })}
                    placeholder="Código postal"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FFD700] focus:border-transparent text-sm"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  id="esDefault"
                  checked={addressForm.esDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, esDefault: e.target.checked })}
                  className="w-4 h-4 text-[#FFD700] border-gray-300 rounded focus:ring-[#FFD700]"
                />
                <label htmlFor="esDefault" className="text-sm text-gray-700">
                  Establecer como dirección predeterminada
                </label>
              </div>
              
              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={resetAddressForm}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAddress}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-[#0a0c10] text-[#FFD700] text-sm font-semibold rounded-lg hover:bg-[#1a1c20] transition-colors disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          )}

          {/* Lista de direcciones */}
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No tienes direcciones guardadas</p>
              <p className="text-sm">Agrega una dirección para tus envíos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    address.esDefault 
                      ? 'border-[#FFD700] bg-[#FFD700]/5' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-[#0a0c10]">{address.nombre}</span>
                        {address.esDefault && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-[#FFD700] text-[#0a0c10] text-xs font-semibold rounded-full">
                            <Star className="w-3 h-3" />
                            Predeterminada
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{address.destinatario}</p>
                      <p className="text-sm text-gray-600">{address.direccion}</p>
                      {address.infoAdicional && (
                        <p className="text-sm text-gray-500">{address.infoAdicional}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {address.barrio && `${address.barrio}, `}
                        {address.municipio}, {address.departamento}
                      </p>
                      <p className="text-sm text-gray-500">Tel: {address.telefono}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {!address.esDefault && (
                        <button
                          onClick={() => handleSetDefault(address.id)}
                          className="p-2 text-gray-400 hover:text-[#996600] hover:bg-[#FFD700]/10 rounded-lg transition-colors"
                          title="Establecer como predeterminada"
                        >
                          <Star className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => startEditAddress(address)}
                        className="p-2 text-gray-400 hover:text-[#996600] hover:bg-[#FFD700]/10 rounded-lg transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteAddress(address.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
