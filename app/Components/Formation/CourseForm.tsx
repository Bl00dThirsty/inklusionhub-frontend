"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateCourseMutation, useUpdateCourseMutation } from '@/state/learningApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const CourseForm = ({ course = null, onSuccess }: { course: any; onSuccess?: (response: any) => void }) => {
  const router = useRouter();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: course ? {
      title: course.title,
      subtitle: course.subtitle || '',
      description: course.description,
      short_description: course.short_description,
      difficulty: course.difficulty,
      language: course.language,
      category_id: course.category?.id || '',
      estimated_total_hours: course.estimated_total_hours,
      is_free: course.is_free,
      is_featured: course.is_featured || false,
      promo_video_url: course.promo_video_url || '',
      prerequisites: course.prerequisites || '',
      learning_outcomes: course.learning_outcomes?.join('\n') || '',
      tags: course.tags?.join(', ') || '',
    } : {
      difficulty: 'debutant',
      language: 'lsf',
      is_free: true,
      is_featured: false,
      estimated_total_hours: 10,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(data).forEach(key => {
        if (key === 'learning_outcomes') {
          // Convertir en tableau
          const outcomes = data[key].split('\n').filter((line: string) => line.trim());
          formData.append(key, JSON.stringify(outcomes));
        } else if (key === 'tags') {
          // Convertir en tableau
          const tags = data[key].split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
          formData.append(key, JSON.stringify(tags));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      // Ajouter les fichiers
      if (thumbnailFile) {
        formData.append('thumbnail', thumbnailFile);
      }
      if (coverImageFile) {
        formData.append('cover_image', coverImageFile);
      }
      
      let response;
      if (course) {
        response = await updateCourse({ id: course.id, data: formData }).unwrap();
        toast.success('Cours mis à jour avec succès');
      } else {
        response = await createCourse(formData).unwrap();
        toast.success('Cours créé avec succès');
      }
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        // Rediriger vers la page du cours
        router.push(`/learning/courses/${response.id}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      const errorMessage = error && typeof error === 'object' && 'data' in error && typeof (error as any).data === 'object' && 'message' in (error as any).data
        ? (error as any).data.message
        : 'Une erreur est survenue';
      toast.error(errorMessage);
    }
  };

  const handleThumbnailChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      setThumbnailFile(file);
    }
  };

  const handleCoverImageChange = (e:any) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB
        toast.error('L\'image ne doit pas dépasser 10MB');
        return;
      }
      setCoverImageFile(file);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {course ? 'Modifier le cours' : 'Créer un nouveau cours'}
        </h2>

        {/* Titre et Sous-titre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du cours *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Le titre est requis' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Cours de base de la LSF"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{typeof errors.title?.message === 'string' ? errors.title.message : 'Une erreur est survenue'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sous-titre
            </label>
            <input
              type="text"
              {...register('subtitle')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Un parcours 100% en ligne"
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description courte *
          </label>
          <textarea
            {...register('short_description', { 
              required: 'La description courte est requise',
              maxLength: {
                value: 500,
                message: 'Maximum 500 caractères'
              }
            })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description concise (max 500 caractères)"
          />
          <div className="text-xs text-gray-500 mt-1">
            {watch('short_description')?.length || 0}/500 caractères
          </div>
          {errors.short_description && (
            <p className="mt-1 text-sm text-red-600">{typeof errors.short_description?.message === 'string' ? errors.short_description.message : 'Une erreur est survenue'}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description complète *
          </label>
          <textarea
            {...register('description', { required: 'La description est requise' })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description détaillée du cours"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{typeof errors.description?.message === 'string' ? errors.description.message : 'Une erreur est survenue'}</p>
          )}
        </div>

        {/* Métadonnées */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau de difficulté *
            </label>
            <select
              {...register('difficulty', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Langue *
            </label>
            <select
              {...register('language', { required: true })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="lsf">Langue des Signes Française</option>
              <option value="bilingue">Bilingue FR/LSF</option>
              <option value="multilingue">Multilingue</option>
            </select>
          </div>
        </div>

        {/* Durée et Prix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Durée estimée (heures) *
            </label>
            <input
              type="number"
              {...register('estimated_total_hours', { 
                required: 'La durée est requise',
                min: { value: 1, message: 'Minimum 1 heure' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            {errors.estimated_total_hours && (
              <p className="mt-1 text-sm text-red-600">{typeof errors.estimated_total_hours?.message === 'string' ? errors.estimated_total_hours.message : 'Une erreur est survenue'}</p>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_free"
                {...register('is_free')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="is_free" className="ml-2 text-sm text-gray-700">
                Cours gratuit
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_featured"
                {...register('is_featured')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700">
                Mettre en vedette
              </label>
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miniature
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            {thumbnailFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Fichier sélectionné: {thumbnailFile.name}</p>
              </div>
            )}
            {course?.thumbnail && !thumbnailFile && (
              <div className="mt-2">
                <img 
                  src={course.thumbnail} 
                  alt="Miniature actuelle" 
                  className="h-20 w-20 object-cover rounded"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture
            </label>
            <div className="mt-1 flex items-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />
            </div>
            {coverImageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Fichier sélectionné: {coverImageFile.name}</p>
              </div>
            )}
            {course?.cover_image && !coverImageFile && (
              <div className="mt-2">
                <img 
                  src={course.cover_image} 
                  alt="Couverture actuelle" 
                  className="h-20 w-32 object-cover rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Vidéo promotionnelle */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL vidéo promotionnelle (optionnel)
          </label>
          <input
            type="url"
            {...register('promo_video_url')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://youtube.com/watch?v=..."
          />
        </div>

        {/* Prérequis */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prérequis
          </label>
          <textarea
            {...register('prerequisites')}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Compétences nécessaires avant de commencer ce cours"
          />
        </div>

        {/* Objectifs d'apprentissage */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Objectifs d'apprentissage (un par ligne)
          </label>
          <textarea
            {...register('learning_outcomes')}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Maîtriser 100 signes de base&#10;Savoir se présenter en LSF&#10;..."
          />
        </div>

        {/* Tags */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (séparés par des virgules)
          </label>
          <input
            type="text"
            {...register('tags')}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="lsf, débutant, communication, ..."
          />
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
            {isCreating || isUpdating ? 'Enregistrement...' : course ? 'Mettre à jour' : 'Créer le cours'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default CourseForm;