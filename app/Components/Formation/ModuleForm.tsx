import React, { useState, ChangeEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateModuleMutation, useUpdateModuleMutation } from '@/state/learningApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner'; // ou 'react-hot-toast'

interface ModuleFormProps {
  courseId: string;
  module?: any;
  onSuccess?: (response: any) => void;
}

interface FormData {
  title: string;
  subtitle?: string;
  description: string;
  order: number;
  total_points: number;
  estimated_hours: number;
}

const ModuleForm = ({ courseId, module = null, onSuccess }: ModuleFormProps) => {
  const router = useRouter();
  const [createModule, { isLoading: isCreating }] = useCreateModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdateModuleMutation();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: module ? {
      title: module.title || '',
      subtitle: module.subtitle || '',
      description: module.description || '',
      order: module.order || 1,
      total_points: module.total_points || 100,
      estimated_hours: module.estimated_hours || 2,
    } : {
      title: '',
      subtitle: '',
      description: '',
      order: 1,
      total_points: 100,
      estimated_hours: 2,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      
      // Ajouter le course_id pour la création seulement
      if (!module) {
        formData.append('course', courseId);
      }
      
      // Ajouter les autres champs
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Ajouter l'image si elle existe
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      let response;
      if (module) {
        // Pour la mise à jour, utiliser PATCH ou PUT selon votre API
        response = await updateModule({ 
          id: module.id, 
          data: formData 
        }).unwrap();
        toast.success('Module mis à jour avec succès');
      } else {
        response = await createModule(formData).unwrap();
        toast.success('Module créé avec succès');
      }
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        // Rediriger vers la page du cours
        router.push(`/courses/${courseId}`);
      }
      
    } catch (error: any) {
      console.error('Erreur:', error);
      
      // Gestion d'erreur améliorée
      const errorMessage = error?.data?.message 
        || error?.data?.detail 
        || error?.message 
        || 'Une erreur est survenue';
      
      toast.error(errorMessage);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide (JPG, PNG, GIF, etc.)');
        e.target.value = ''; // Réinitialiser l'input
        return;
      }
      
      // Limite de taille (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        e.target.value = '';
        return;
      }
      
      setImageFile(file);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {module ? 'Modifier le module' : 'Ajouter un module'}
        </h2>

        {/* Titre et Sous-titre */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Titre du module *
          </label>
          <input
            id="title"
            type="text"
            {...register('title', { 
              required: 'Le titre est requis',
              minLength: {
                value: 3,
                message: 'Le titre doit contenir au moins 3 caractères'
              },
              maxLength: {
                value: 200,
                message: 'Le titre ne doit pas dépasser 200 caractères'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Environnement personnel et familial"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          <input
            id="subtitle"
            type="text"
            {...register('subtitle', {
              maxLength: {
                value: 300,
                message: 'Le sous-titre ne doit pas dépasser 300 caractères'
              }
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Apprenez à communiquer avec votre entourage"
            disabled={isLoading}
          />
          {errors.subtitle && (
            <p className="mt-1 text-sm text-red-600">{errors.subtitle.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            {...register('description', { 
              required: 'La description est requise',
              minLength: {
                value: 10,
                message: 'La description doit contenir au moins 10 caractères'
              },
              maxLength: {
                value: 1000,
                message: 'La description ne doit pas dépasser 1000 caractères'
              }
            })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description du contenu de ce module"
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Ordre et Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="order" className="block text-sm font-medium text-gray-700 mb-2">
              Ordre dans le cours *
            </label>
            <input
              id="order"
              type="number"
              {...register('order', { 
                required: 'L\'ordre est requis',
                min: { value: 1, message: 'Minimum 1' },
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              disabled={isLoading}
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="total_points" className="block text-sm font-medium text-gray-700 mb-2">
              Points disponibles *
            </label>
            <input
              id="total_points"
              type="number"
              {...register('total_points', { 
                required: 'Les points sont requis',
                min: { value: 10, message: 'Minimum 10 points' },
                max: { value: 10000, message: 'Maximum 10000 points' },
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="10"
              max="10000"
              disabled={isLoading}
            />
            {errors.total_points && (
              <p className="mt-1 text-sm text-red-600">{errors.total_points.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="estimated_hours" className="block text-sm font-medium text-gray-700 mb-2">
              Durée estimée (heures) *
            </label>
            <input
              id="estimated_hours"
              type="number"
              step="0.5"
              {...register('estimated_hours', { 
                required: 'La durée est requise',
                min: { value: 0.5, message: 'Minimum 0.5 heure' },
                max: { value: 100, message: 'Maximum 100 heures' },
                valueAsNumber: true
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.5"
              max="100"
              disabled={isLoading}
            />
            {errors.estimated_hours && (
              <p className="mt-1 text-sm text-red-600">{errors.estimated_hours.message}</p>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image du module
          </label>
          <div className="space-y-2">
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={isLoading}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>
            
            {/* Aperçu de l'image */}
            {imageFile && (
              <div className="mt-2">
                <p className="text-sm text-green-600 mb-2">
                  ✓ Nouvelle image sélectionnée: {imageFile.name}
                </p>
                <div className="relative inline-block">
                  <img 
                    src={URL.createObjectURL(imageFile)} 
                    alt="Aperçu de la nouvelle image" 
                    className="h-32 w-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 text-xs"
                    disabled={isLoading}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            
            {/* Image existante */}
            {module?.image && !imageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Image actuelle:</p>
                <div className="relative inline-block">
                  <img 
                    src={module.image} 
                    alt="Image actuelle du module" 
                    className="h-32 w-48 object-cover rounded-lg border"
                    onError={(e) => {
                      e.currentTarget.src = '/images/default-module.png';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Pour supprimer l'image existante lors de la mise à jour
                      setImageFile(new File([], 'remove')); // Marqueur spécial
                    }}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 text-xs"
                    disabled={isLoading}
                    title="Supprimer l'image"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {module ? 'Mise à jour...' : 'Création...'}
              </>
            ) : (
              <>
                {module ? 'Mettre à jour' : 'Créer le module'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModuleForm;