import { useState, useCallback } from 'react';
import { Upload, X, Loader2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { uploadApi } from '../../api/upload';
import { toast } from 'react-hot-toast';

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 10 }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxImages - images.length;
    if (remainingSlots <= 0) {
      toast.error(`Máximo ${maxImages} imágenes permitidas`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    // Validar tipos de archivo
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = filesToUpload.filter(f => !validTypes.includes(f.type));
    if (invalidFiles.length > 0) {
      toast.error('Solo se permiten imágenes JPG, PNG o WebP');
      return;
    }

    // Validar tamaño (5MB max)
    const oversizedFiles = filesToUpload.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Las imágenes no deben superar 5MB');
      return;
    }

    setUploading(true);
    try {
      const newUrls: string[] = [];
      
      for (const file of filesToUpload) {
        const response = await uploadApi.uploadProductImage(file);
        if (response.success && response.data) {
          newUrls.push(response.data.url);
        }
      }

      if (newUrls.length > 0) {
        onChange([...images, ...newUrls]);
        toast.success(`${newUrls.length} imagen(es) subida(s)`);
      }
    } catch (error) {
      console.error('Error al subir imágenes:', error);
      toast.error('Error al subir las imágenes');
    } finally {
      setUploading(false);
    }
  }, [images, maxImages, onChange]);

  const handleRemoveImage = useCallback(async (index: number) => {
    const imageUrl = images[index];
    
    try {
      await uploadApi.deleteImage(imageUrl);
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
      toast.success('Imagen eliminada');
    } catch (error) {
      console.error('Error al eliminar imagen:', error);
      // Aún así eliminar del estado local
      const newImages = images.filter((_, i) => i !== index);
      onChange(newImages);
    }
  }, [images, onChange]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newImages = [...images];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(index, 0, draggedImage);
    
    setDraggedIndex(index);
    onChange(newImages);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleDropZone = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Imágenes del producto ({images.length}/{maxImages})
      </label>

      {/* Grid de imágenes */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {images.map((url, index) => (
            <div
              key={url}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative group aspect-square rounded-lg overflow-hidden border-2 cursor-move
                ${index === 0 ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}
                ${draggedIndex === index ? 'opacity-50' : ''}
              `}
            >
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />
              
              {/* Badge de imagen principal */}
              {index === 0 && (
                <span className="absolute top-1 left-1 bg-primary-500 text-white text-xs px-2 py-0.5 rounded">
                  Principal
                </span>
              )}

              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  className="p-1.5 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                  title="Arrastrar para reordenar"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                  title="Eliminar imagen"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Zona de drop / botón de subida */}
      {images.length < maxImages && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDropZone}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center transition-colors
            ${dragOver ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
            ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          `}
        >
          <input
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
            id="image-upload"
            disabled={uploading}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
                <span className="text-sm text-gray-600">Subiendo imágenes...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                {images.length === 0 ? (
                  <ImageIcon className="w-10 h-10 text-gray-400" />
                ) : (
                  <Upload className="w-8 h-8 text-gray-400" />
                )}
                <div>
                  <span className="text-sm font-medium text-primary-600">
                    Haz clic para subir
                  </span>
                  <span className="text-sm text-gray-500"> o arrastra aquí</span>
                </div>
                <span className="text-xs text-gray-400">
                  JPG, PNG o WebP (máx. 5MB)
                </span>
              </div>
            )}
          </label>
        </div>
      )}

      {/* Ayuda */}
      <p className="text-xs text-gray-500">
        La primera imagen será la imagen principal del producto. Arrastra para reordenar.
      </p>
    </div>
  );
}
