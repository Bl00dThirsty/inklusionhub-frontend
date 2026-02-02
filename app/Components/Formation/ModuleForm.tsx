// src/components/learning/ModuleForm.jsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateModuleMutation, useUpdateModuleMutation } from '@/state/learningApi';
import { useRouter } from 'next/router';
import { toast } from 'sonner';

const ModuleForm = ({ courseId, module = null, onSuccess }) => {
  const router = useRouter();
  const [createModule, { isLoading: isCreating }] = useCreateModuleMutation();
  const [updateModule, { isLoading: isUpdating }] = useUpdateModuleMutation();
  
  const [imageFile, setImageFile] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: module ? {
      title: module.title,
      subtitle: module.subtitle || '',
      description: module.description,
      order: module.order,
      total_points: module.total_points,
      estimated_hours: module.estimated_hours,
    } : {
      order: 1,
      total_points: 100,
      estimated_hours: 2,
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Ajouter le course_id
      formData.append('course_id', courseId);
      
      // Ajouter les autres champs
      Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
      });
      
      // Ajouter l'image si elle existe
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      let response;
      if (module) {
        response = await updateModule({ id: module.id, data: formData }).unwrap();
        toast.success('Module mis à jour avec succès');
      } else {
        response = await createModule(formData).unwrap();
        toast.success('Module créé avec succès');
      }
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        // Rediriger vers la page du cours
        router.push(`/learning/courses/${courseId}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.data?.message || 'Une erreur est survenue');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      setImageFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {module ? 'Modifier le module' : 'Ajouter un module'}
        </h2>

        {/* Titre et Sous-titre */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Titre du module *
          </label>
          <input
            type="text"
            {...register('title', { required: 'Le titre est requis' })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Environnement personnel et familial"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sous-titre
          </label>
          <input
            type="text"
            {...register('subtitle')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Apprenez à communiquer avec votre entourage"
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'La description est requise' })}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description du contenu de ce module"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Ordre et Points */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ordre dans le cours *
            </label>
            <input
              type="number"
              {...register('order', { 
                required: 'L\'ordre est requis',
                min: { value: 1, message: 'Minimum 1' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            {errors.order && (
              <p className="mt-1 text-sm text-red-600">{errors.order.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points disponibles *
            </label>
            <input
              type="number"
              {...register('total_points', { 
                required: 'Les points sont requis',
                min: { value: 10, message: 'Minimum 10 points' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="10"
            />
            {errors.total_points && (
              <p className="mt-1 text-sm text-red-600">{errors.total_points.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée estimée (heures) *
            </label>
            <input
              type="number"
              step="0.5"
              {...register('estimated_hours', { 
                required: 'La durée est requise',
                min: { value: 0.5, message: 'Minimum 0.5 heure' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0.5"
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
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          {imageFile && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Fichier sélectionné: {imageFile.name}</p>
            </div>
          )}
          {module?.image && !imageFile && (
            <div className="mt-2">
              <img 
                src={module.image} 
                alt="Image actuelle" 
                className="h-32 w-48 object-cover rounded"
              />
            </div>
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating || isUpdating ? 'Enregistrement...' : module ? 'Mettre à jour' : 'Créer le module'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ModuleForm;