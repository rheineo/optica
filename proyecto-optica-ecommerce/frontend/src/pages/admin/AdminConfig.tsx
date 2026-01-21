import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  CreditCard, 
  Truck, 
  Receipt, 
  Mail, 
  Globe, 
  Search, 
  Glasses,
  FileText,
  Save,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { configApi, type ConfigData } from '../../api/config';
import toast from 'react-hot-toast';

type TabKey = 'empresa' | 'pagos' | 'envios' | 'impuestos' | 'emails' | 'sitio' | 'seo' | 'optica' | 'legal';

interface TabItem {
  key: TabKey;
  label: string;
  icon: React.ReactNode;
}

const tabs: TabItem[] = [
  { key: 'empresa', label: 'Empresa', icon: <Building2 className="w-4 h-4" /> },
  { key: 'pagos', label: 'Pagos', icon: <CreditCard className="w-4 h-4" /> },
  { key: 'envios', label: 'Envíos', icon: <Truck className="w-4 h-4" /> },
  { key: 'impuestos', label: 'Impuestos', icon: <Receipt className="w-4 h-4" /> },
  { key: 'emails', label: 'Emails', icon: <Mail className="w-4 h-4" /> },
  { key: 'sitio', label: 'Sitio', icon: <Globe className="w-4 h-4" /> },
  { key: 'seo', label: 'SEO', icon: <Search className="w-4 h-4" /> },
  { key: 'optica', label: 'Óptica', icon: <Glasses className="w-4 h-4" /> },
  { key: 'legal', label: 'Legal', icon: <FileText className="w-4 h-4" /> },
];

export function AdminConfig() {
  const [activeTab, setActiveTab] = useState<TabKey>('empresa');
  const queryClient = useQueryClient();

  const { data: configData, isLoading, error } = useQuery({
    queryKey: ['admin-config'],
    queryFn: async () => {
      const response = await configApi.getAll();
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (configs: Array<{ key: string; value: unknown }>) => {
      return configApi.updateBulk(configs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-config'] });
      toast.success('Configuración guardada exitosamente');
    },
    onError: () => {
      toast.error('Error al guardar la configuración');
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <span className="text-red-700">Error al cargar la configuración</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Configuración</h1>
      
      {/* Tabs horizontales con colores pasteles */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                ${activeTab === tab.key
                  ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400'
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                }
              `}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div>
        {activeTab === 'empresa' && (
          <EmpresaConfig 
            data={configData?.empresa} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'pagos' && (
          <PagosConfig 
            data={configData?.pagos} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'envios' && (
          <EnviosConfig 
            data={configData?.envios} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'impuestos' && (
          <ImpuestosConfig 
            data={configData?.impuestos} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'emails' && (
          <EmailsConfig 
            data={configData?.emails} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'sitio' && (
          <SitioConfig 
            data={configData?.sitio} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'seo' && (
          <SeoConfig 
            data={configData?.seo} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'optica' && (
          <OpticaConfig 
            data={configData?.optica} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
        {activeTab === 'legal' && (
          <LegalConfig 
            data={configData?.legal} 
            onSave={(configs) => updateMutation.mutate(configs)}
            isSaving={updateMutation.isPending}
          />
        )}
      </div>
    </div>
  );
}

// Componentes reutilizables
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  description?: string;
}

function InputField({ label, value, onChange, type = 'text', placeholder, description }: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
      {description && <p className="text-xs text-gray-500 mt-1">{description}</p>}
    </div>
  );
}

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

function ToggleField({ label, checked, onChange, description }: ToggleFieldProps) {
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <span className="text-sm font-medium text-gray-700">{label}</span>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex h-6 w-11 items-center rounded-full transition-colors
          ${checked ? 'bg-primary-600' : 'bg-gray-300'}
        `}
      >
        <span
          className={`
            inline-block h-4 w-4 transform rounded-full bg-white transition-transform
            ${checked ? 'translate-x-6' : 'translate-x-1'}
          `}
        />
      </button>
    </div>
  );
}

interface SaveButtonProps {
  onClick: () => void;
  isSaving: boolean;
}

function SaveButton({ onClick, isSaving }: SaveButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isSaving}
      className="btn btn-primary flex items-center gap-2 text-sm"
    >
      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
      {isSaving ? 'Guardando...' : 'Guardar'}
    </button>
  );
}

// Props comunes para tabs
interface ConfigTabProps {
  data: ConfigData[keyof ConfigData] | undefined;
  onSave: (configs: Array<{ key: string; value: unknown }>) => void;
  isSaving: boolean;
}

// Tab: Empresa
function EmpresaConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const empresaData = data as ConfigData['empresa'];
  const [form, setForm] = useState({
    nombre: empresaData?.nombre || '',
    direccion: empresaData?.direccion || '',
    telefono: empresaData?.telefono || '',
    whatsapp: empresaData?.whatsapp || '',
    email: empresaData?.email || '',
    email_soporte: empresaData?.email_soporte || '',
    horario: empresaData?.horario || '',
    nit: empresaData?.nit || '',
    razon_social: empresaData?.razon_social || '',
  });

  const [redes, setRedes] = useState({
    facebook: empresaData?.redes_sociales?.facebook || '',
    instagram: empresaData?.redes_sociales?.instagram || '',
    twitter: empresaData?.redes_sociales?.twitter || '',
    tiktok: empresaData?.redes_sociales?.tiktok || '',
  });

  const handleSave = () => {
    const configs = [
      { key: 'empresa_nombre', value: form.nombre },
      { key: 'empresa_direccion', value: form.direccion },
      { key: 'empresa_telefono', value: form.telefono },
      { key: 'empresa_whatsapp', value: form.whatsapp },
      { key: 'empresa_email', value: form.email },
      { key: 'empresa_email_soporte', value: form.email_soporte },
      { key: 'empresa_horario', value: form.horario },
      { key: 'empresa_nit', value: form.nit },
      { key: 'empresa_razon_social', value: form.razon_social },
      { key: 'empresa_redes_sociales', value: redes },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Información de la Empresa</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Nombre Comercial" value={form.nombre} onChange={(v) => setForm({ ...form, nombre: v })} placeholder="Liney Visión" />
          <InputField label="Razón Social" value={form.razon_social} onChange={(v) => setForm({ ...form, razon_social: v })} placeholder="Liney Visión S.A.S." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="NIT" value={form.nit} onChange={(v) => setForm({ ...form, nit: v })} placeholder="900.123.456-7" />
          <InputField label="Dirección" value={form.direccion} onChange={(v) => setForm({ ...form, direccion: v })} placeholder="Calle 123 #45-67" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Teléfono" value={form.telefono} onChange={(v) => setForm({ ...form, telefono: v })} placeholder="601-2345678" />
          <InputField label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} placeholder="3001234567" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Email Ventas" value={form.email} onChange={(v) => setForm({ ...form, email: v })} type="email" />
          <InputField label="Email Soporte" value={form.email_soporte} onChange={(v) => setForm({ ...form, email_soporte: v })} type="email" />
        </div>
        <InputField label="Horario de Atención" value={form.horario} onChange={(v) => setForm({ ...form, horario: v })} placeholder="Lunes a Viernes: 9am - 6pm" />
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <h3 className="text-md font-medium text-gray-900 mb-3">Redes Sociales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Facebook" value={redes.facebook} onChange={(v) => setRedes({ ...redes, facebook: v })} />
            <InputField label="Instagram" value={redes.instagram} onChange={(v) => setRedes({ ...redes, instagram: v })} />
            <InputField label="Twitter" value={redes.twitter} onChange={(v) => setRedes({ ...redes, twitter: v })} />
            <InputField label="TikTok" value={redes.tiktok} onChange={(v) => setRedes({ ...redes, tiktok: v })} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab: Pagos
function PagosConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const pagosData = data as ConfigData['pagos'];
  const [metodos, setMetodos] = useState({
    tarjetaCredito: pagosData?.metodos_activos?.tarjetaCredito ?? true,
    pse: pagosData?.metodos_activos?.pse ?? true,
    efectivo: pagosData?.metodos_activos?.efectivo ?? true,
    contraentrega: pagosData?.metodos_activos?.contraentrega ?? false,
  });

  const [pasarela, setPasarela] = useState({
    nombre: pagosData?.pasarela || 'wompi',
    publicKey: pagosData?.pasarela_public_key || '',
    privateKey: pagosData?.pasarela_private_key || '',
    modoPrueba: pagosData?.modo_prueba ?? true,
  });

  const handleSave = () => {
    const configs = [
      { key: 'pagos_metodos_activos', value: metodos },
      { key: 'pagos_pasarela', value: pasarela.nombre },
      { key: 'pagos_pasarela_public_key', value: pasarela.publicKey },
      { key: 'pagos_pasarela_private_key', value: pasarela.privateKey },
      { key: 'pagos_modo_prueba', value: pasarela.modoPrueba },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Métodos de Pago</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-md font-medium text-gray-900 mb-2">Métodos Activos</h3>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <ToggleField label="Tarjeta de Crédito" checked={metodos.tarjetaCredito} onChange={(v) => setMetodos({ ...metodos, tarjetaCredito: v })} />
            <ToggleField label="PSE" checked={metodos.pse} onChange={(v) => setMetodos({ ...metodos, pse: v })} />
            <ToggleField label="Efectivo" checked={metodos.efectivo} onChange={(v) => setMetodos({ ...metodos, efectivo: v })} />
            <ToggleField label="Contraentrega" checked={metodos.contraentrega} onChange={(v) => setMetodos({ ...metodos, contraentrega: v })} />
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-md font-medium text-gray-900 mb-3">Pasarela de Pago</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pasarela</label>
              <select value={pasarela.nombre} onChange={(e) => setPasarela({ ...pasarela, nombre: e.target.value })} className="input-field">
                <option value="wompi">Wompi</option>
                <option value="payu">PayU</option>
                <option value="mercadopago">Mercado Pago</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="Llave Pública" value={pasarela.publicKey} onChange={(v) => setPasarela({ ...pasarela, publicKey: v })} />
              <InputField label="Llave Privada" value={pasarela.privateKey} onChange={(v) => setPasarela({ ...pasarela, privateKey: v })} type="password" />
            </div>
            <ToggleField label="Modo Prueba" checked={pasarela.modoPrueba} onChange={(v) => setPasarela({ ...pasarela, modoPrueba: v })} description="Activar para usar el entorno de pruebas" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab: Envíos
function EnviosConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const enviosData = data as ConfigData['envios'];
  const [form, setForm] = useState({
    gratisDesde: String(enviosData?.gratis_desde || '100000'),
    costoDefault: String(enviosData?.costo_default || '10000'),
    diasEntrega: String(enviosData?.dias_entrega || '3-5'),
  });

  const handleSave = () => {
    const configs = [
      { key: 'envios_gratis_desde', value: Number(form.gratisDesde) },
      { key: 'envios_costo_default', value: Number(form.costoDefault) },
      { key: 'envios_dias_entrega', value: form.diasEntrega },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Configuración de Envíos</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputField label="Envío Gratis Desde ($)" value={form.gratisDesde} onChange={(v) => setForm({ ...form, gratisDesde: v })} type="number" description="Monto mínimo para envío gratis" />
          <InputField label="Costo Default ($)" value={form.costoDefault} onChange={(v) => setForm({ ...form, costoDefault: v })} type="number" />
          <InputField label="Días de Entrega" value={form.diasEntrega} onChange={(v) => setForm({ ...form, diasEntrega: v })} placeholder="3-5" />
        </div>
      </div>
    </div>
  );
}

// Tab: Impuestos
function ImpuestosConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const impuestosData = data as ConfigData['impuestos'];
  const [form, setForm] = useState({
    iva: String(impuestosData?.iva || '19'),
    moneda: impuestosData?.moneda || 'COP',
    simbolo: impuestosData?.simbolo_moneda || '$',
    formato: impuestosData?.formato_numero || 'es-CO',
    preciosConIva: impuestosData?.precios_con_iva ?? true,
  });

  const handleSave = () => {
    const configs = [
      { key: 'impuestos_iva', value: Number(form.iva) },
      { key: 'impuestos_moneda', value: form.moneda },
      { key: 'impuestos_simbolo_moneda', value: form.simbolo },
      { key: 'impuestos_formato_numero', value: form.formato },
      { key: 'impuestos_precios_con_iva', value: form.preciosConIva },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Impuestos y Moneda</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="IVA (%)" value={form.iva} onChange={(v) => setForm({ ...form, iva: v })} type="number" />
          <InputField label="Código Moneda" value={form.moneda} onChange={(v) => setForm({ ...form, moneda: v })} placeholder="COP" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Símbolo" value={form.simbolo} onChange={(v) => setForm({ ...form, simbolo: v })} placeholder="$" />
          <InputField label="Formato" value={form.formato} onChange={(v) => setForm({ ...form, formato: v })} placeholder="es-CO" />
        </div>
        <ToggleField label="Precios incluyen IVA" checked={form.preciosConIva} onChange={(v) => setForm({ ...form, preciosConIva: v })} />
      </div>
    </div>
  );
}

// Tab: Emails
function EmailsConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const emailsData = data as ConfigData['emails'];
  const [form, setForm] = useState({
    host: emailsData?.smtp_host || '',
    port: String(emailsData?.smtp_port || '587'),
    user: emailsData?.smtp_user || '',
    password: emailsData?.smtp_password || '',
    remitenteNombre: emailsData?.remitente_nombre || '',
    remitenteEmail: emailsData?.remitente_email || '',
  });
  const [testing, setTesting] = useState(false);

  const handleSave = () => {
    const configs = [
      { key: 'emails_smtp_host', value: form.host },
      { key: 'emails_smtp_port', value: Number(form.port) },
      { key: 'emails_smtp_user', value: form.user },
      { key: 'emails_smtp_password', value: form.password },
      { key: 'emails_remitente_nombre', value: form.remitenteNombre },
      { key: 'emails_remitente_email', value: form.remitenteEmail },
    ];
    onSave(configs);
  };

  const handleTestSmtp = async () => {
    setTesting(true);
    try {
      await configApi.testSmtp({ host: form.host, port: Number(form.port), user: form.user, password: form.password });
      toast.success('Conexión SMTP exitosa');
    } catch {
      toast.error('Error en la conexión SMTP');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Configuración de Emails</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <h3 className="text-md font-medium text-gray-900">Servidor SMTP</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Host SMTP" value={form.host} onChange={(v) => setForm({ ...form, host: v })} placeholder="smtp.gmail.com" />
          <InputField label="Puerto" value={form.port} onChange={(v) => setForm({ ...form, port: v })} placeholder="587" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Usuario" value={form.user} onChange={(v) => setForm({ ...form, user: v })} type="email" />
          <InputField label="Contraseña" value={form.password} onChange={(v) => setForm({ ...form, password: v })} type="password" />
        </div>
        <button onClick={handleTestSmtp} disabled={testing || !form.host || !form.user} className="btn btn-secondary text-sm">
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
          <span className="ml-2">Probar conexión</span>
        </button>
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-md font-medium text-gray-900 mb-3">Remitente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Nombre" value={form.remitenteNombre} onChange={(v) => setForm({ ...form, remitenteNombre: v })} />
            <InputField label="Email" value={form.remitenteEmail} onChange={(v) => setForm({ ...form, remitenteEmail: v })} type="email" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab: Sitio
function SitioConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const sitioData = data as ConfigData['sitio'];
  const [form, setForm] = useState({
    modoMantenimiento: sitioData?.modo_mantenimiento ?? false,
    registroHabilitado: sitioData?.registro_habilitado ?? true,
    resenas: sitioData?.resenas_habilitadas ?? true,
    wishlist: sitioData?.wishlist_habilitada ?? true,
    comparador: sitioData?.comparador_habilitado ?? false,
    chatEnVivo: sitioData?.chat_en_vivo ?? false,
    productosRelacionados: sitioData?.productos_relacionados ?? true,
  });

  const handleSave = () => {
    const configs = [
      { key: 'sitio_modo_mantenimiento', value: form.modoMantenimiento },
      { key: 'sitio_registro_habilitado', value: form.registroHabilitado },
      { key: 'sitio_resenas_habilitadas', value: form.resenas },
      { key: 'sitio_wishlist_habilitada', value: form.wishlist },
      { key: 'sitio_comparador_habilitado', value: form.comparador },
      { key: 'sitio_chat_en_vivo', value: form.chatEnVivo },
      { key: 'sitio_productos_relacionados', value: form.productosRelacionados },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Configuración del Sitio</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-2">
        <ToggleField label="Modo Mantenimiento" checked={form.modoMantenimiento} onChange={(v) => setForm({ ...form, modoMantenimiento: v })} description="Mostrar página de mantenimiento" />
        <ToggleField label="Registro de Usuarios" checked={form.registroHabilitado} onChange={(v) => setForm({ ...form, registroHabilitado: v })} />
        <ToggleField label="Reseñas de Productos" checked={form.resenas} onChange={(v) => setForm({ ...form, resenas: v })} />
        <ToggleField label="Lista de Deseos" checked={form.wishlist} onChange={(v) => setForm({ ...form, wishlist: v })} />
        <ToggleField label="Comparador de Productos" checked={form.comparador} onChange={(v) => setForm({ ...form, comparador: v })} />
        <ToggleField label="Chat en Vivo" checked={form.chatEnVivo} onChange={(v) => setForm({ ...form, chatEnVivo: v })} />
        <ToggleField label="Productos Relacionados" checked={form.productosRelacionados} onChange={(v) => setForm({ ...form, productosRelacionados: v })} />
      </div>
    </div>
  );
}

// Tab: SEO
function SeoConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const seoData = data as ConfigData['seo'];
  const [form, setForm] = useState({
    metaTitulo: seoData?.meta_titulo || '',
    metaDescripcion: seoData?.meta_descripcion || '',
    keywords: seoData?.keywords || '',
    googleAnalytics: seoData?.google_analytics || '',
    facebookPixel: seoData?.facebook_pixel || '',
    googleTagManager: seoData?.google_tag_manager || '',
  });

  const handleSave = () => {
    const configs = [
      { key: 'seo_meta_titulo', value: form.metaTitulo },
      { key: 'seo_meta_descripcion', value: form.metaDescripcion },
      { key: 'seo_keywords', value: form.keywords },
      { key: 'seo_google_analytics', value: form.googleAnalytics },
      { key: 'seo_facebook_pixel', value: form.facebookPixel },
      { key: 'seo_google_tag_manager', value: form.googleTagManager },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">SEO y Marketing</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <InputField label="Meta Título" value={form.metaTitulo} onChange={(v) => setForm({ ...form, metaTitulo: v })} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta Descripción</label>
          <textarea value={form.metaDescripcion} onChange={(e) => setForm({ ...form, metaDescripcion: e.target.value })} className="input-field" rows={3} />
        </div>
        <InputField label="Keywords" value={form.keywords} onChange={(v) => setForm({ ...form, keywords: v })} description="Separadas por coma" />
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-md font-medium text-gray-900 mb-3">Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField label="Google Analytics ID" value={form.googleAnalytics} onChange={(v) => setForm({ ...form, googleAnalytics: v })} placeholder="G-XXXXXXXXXX" />
            <InputField label="Facebook Pixel ID" value={form.facebookPixel} onChange={(v) => setForm({ ...form, facebookPixel: v })} />
          </div>
          <div className="mt-4">
            <InputField label="Google Tag Manager ID" value={form.googleTagManager} onChange={(v) => setForm({ ...form, googleTagManager: v })} placeholder="GTM-XXXXXXX" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab: Óptica
function OpticaConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const opticaData = data as ConfigData['optica'];
  const [form, setForm] = useState({
    garantiaMeses: String(opticaData?.garantia_meses || '12'),
    validezPrescripcion: String(opticaData?.validez_prescripcion || '12'),
    requierePrescripcion: opticaData?.requiere_prescripcion ?? true,
  });

  const handleSave = () => {
    const configs = [
      { key: 'optica_garantia_meses', value: Number(form.garantiaMeses) },
      { key: 'optica_validez_prescripcion', value: Number(form.validezPrescripcion) },
      { key: 'optica_requiere_prescripcion', value: form.requierePrescripcion },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Configuración Óptica</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Garantía (meses)" value={form.garantiaMeses} onChange={(v) => setForm({ ...form, garantiaMeses: v })} type="number" />
          <InputField label="Validez Prescripción (meses)" value={form.validezPrescripcion} onChange={(v) => setForm({ ...form, validezPrescripcion: v })} type="number" />
        </div>
        <ToggleField label="Requiere Prescripción" checked={form.requierePrescripcion} onChange={(v) => setForm({ ...form, requierePrescripcion: v })} description="Para lentes con fórmula" />
      </div>
    </div>
  );
}

// Tab: Legal
function LegalConfig({ data, onSave, isSaving }: ConfigTabProps) {
  const legalData = data as ConfigData['legal'];
  const [form, setForm] = useState({
    terminos: legalData?.terminos_condiciones || '',
    privacidad: legalData?.politica_privacidad || '',
    devoluciones: legalData?.politica_devoluciones || '',
    cookies: legalData?.politica_cookies || '',
  });

  const handleSave = () => {
    const configs = [
      { key: 'legal_terminos_condiciones', value: form.terminos },
      { key: 'legal_politica_privacidad', value: form.privacidad },
      { key: 'legal_politica_devoluciones', value: form.devoluciones },
      { key: 'legal_politica_cookies', value: form.cookies },
    ];
    onSave(configs);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Políticas Legales</h2>
        <SaveButton onClick={handleSave} isSaving={isSaving} />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Términos y Condiciones</label>
          <textarea value={form.terminos} onChange={(e) => setForm({ ...form, terminos: e.target.value })} className="input-field" rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Política de Privacidad</label>
          <textarea value={form.privacidad} onChange={(e) => setForm({ ...form, privacidad: e.target.value })} className="input-field" rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Política de Devoluciones</label>
          <textarea value={form.devoluciones} onChange={(e) => setForm({ ...form, devoluciones: e.target.value })} className="input-field" rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Política de Cookies</label>
          <textarea value={form.cookies} onChange={(e) => setForm({ ...form, cookies: e.target.value })} className="input-field" rows={4} />
        </div>
      </div>
    </div>
  );
}
