'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useCreateCourseMutation, useUpdateCourseMutation } from '@/state/learningApi';
import { toast } from 'sonner'; // ou votre système de notification
import { FiAlertCircle, FiCheck } from 'react-icons/fi';

interface CourseFormProps {
  course?: any;
  onSuccess?: (response: any) => void;
  redirectAfterSuccess?: boolean;
}

const CourseFormUpdate = ({ 
  course = null, 
  onSuccess, 
  redirectAfterSuccess = true 
}: CourseFormProps) => {
  const router = useRouter();
  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    course?.thumbnail || null
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    course?.cover_image || null
  );

  // Formater les données initiales
  const formatInitialData = () => {
    if (!course) {
      return {
        difficulty: 'debutant',
        language: 'lsf',
        is_free: true,
        is_featured: false,
        estimated_total_hours: 10,
      };
    }

    return {
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
      learning_outcomes: Array.isArray(course.learning_outcomes) 
        ? course.learning_outcomes.join('\n') 
        : course.learning_outcomes || '',
      tags: Array.isArray(course.tags) 
        ? course.tags.join(', ') 
        : course.tags || '',
    };
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: formatInitialData(),
  });

  // Réinitialiser le formulaire quand le cours change
  useEffect(() => {
    reset(formatInitialData());
  }, [course]);

  const prepareFormData = (data: any) => {
    const formData = new FormData();
    
    // Liste des champs à inclure
    const fields = [
      'title', 'subtitle', 'description', 'short_description',
      'difficulty', 'language', 'category_id', 'estimated_total_hours',
      'is_free', 'is_featured', 'promo_video_url', 'prerequisites'
    ];

    // Ajouter les champs simples
    fields.forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        if (typeof data[key] === 'boolean') {
          formData.append(key, data[key] ? 'true' : 'false');
        } else {
          formData.append(key, data[key].toString());
        }
      }
    });

    // Traiter les champs spéciaux
    if (data.learning_outcomes) {
      const outcomes = data.learning_outcomes
        .split('\n')
        .filter((line: string) => line.trim())
        .map((line: string) => line.trim());
      formData.append('learning_outcomes', JSON.stringify(outcomes));
    }

    if (data.tags) {
      const tags = data.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag);
      formData.append('tags', JSON.stringify(tags));
    }

    // Gestion des fichiers
    if (thumbnailFile) {
      formData.append('thumbnail', thumbnailFile);
    } else if (course?.thumbnail && thumbnailPreview === null) {
      // Si on supprime l'image existante
      formData.append('thumbnail', '');
    }

    if (coverImageFile) {
      formData.append('cover_image', coverImageFile);
    } else if (course?.cover_image && coverImagePreview === null) {
      formData.append('cover_image', '');
    }

    return formData;
  };

  const onSubmit = async (data: any) => {
    try {
      const formData = prepareFormData(data);
      
      let response;
      
      if (course) {
        // Mise à jour
        response = await updateCourse({ 
          id: course.id, 
          data: formData 
        }).unwrap();
        
        toast.success('✅ Cours mis à jour avec succès', {
          icon: <FiCheck className="text-green-500" />,
        });
      } else {
        // Création
        response = await createCourse(formData).unwrap();
        
        toast.success('✅ Cours créé avec succès', {
          icon: <FiCheck className="text-green-500" />,
        });
      }
      
      if (onSuccess) {
        onSuccess(response);
      } else if (redirectAfterSuccess) {
        // Redirection intelligente
        if (course) {
          router.push(`/formation/${course.id}`);
        } else {
          router.push(`/formation/${response.id}`);
        }
      }
      
    } catch (error: any) {
      console.error('Erreur:', error);
      
      let errorMessage = 'Une erreur est survenue';
      
      if (error?.data) {
        if (typeof error.data === 'string') {
          errorMessage = error.data;
        } else if (error.data.detail) {
          errorMessage = error.data.detail;
        } else if (error.data.message) {
          errorMessage = error.data.message;
        } else if (typeof error.data === 'object') {
          // Gestion des erreurs de validation Django
          const firstError = Object.values(error.data)[0];
          if (Array.isArray(firstError)) {
            errorMessage = firstError[0];
          }
        }
      }
      
      toast.error(`❌ ${errorMessage}`, {
        icon: <FiAlertCircle className="text-red-500" />,
      });
    }
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validation
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB');
        return;
      }
      
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Veuillez sélectionner une image valide');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 10MB');
        return;
      }
      
      setCoverImageFile(file);
      setCoverImagePreview(URL.createObjectURL(file));
    }
  };

  const removeThumbnail = () => {
    setThumbnailFile(null);
    setThumbnailPreview(null);
    if (course?.thumbnail) {
      toast.info('L\'ancienne miniature sera supprimée lors de l\'enregistrement');
    }
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview(null);
    if (course?.cover_image) {
      toast.info('L\'ancienne image de couverture sera supprimée lors de l\'enregistrement');
    }
  };

  const isLoading = isCreating || isUpdating;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {course ? 'Modifier le cours' : 'Créer un nouveau cours'}
          </h2>
          {course && (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                course.is_published 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.is_published ? 'Publié' : 'Brouillon'}
              </span>
              <span className="text-sm text-gray-500">
                ID: {course.id.substring(0, 8)}...
              </span>
            </div>
          )}
        </div>

        {/* ... votre formulaire existant ... */}

        {/* Section Images améliorée */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Miniature {course?.thumbnail && !thumbnailFile && '(actuelle)'}
            </label>
            <div className="space-y-2">
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
              
              {/* Aperçu */}
              {(thumbnailPreview || course?.thumbnail) && (
                <div className="relative">
                  <img 
                    src={thumbnailPreview || course.thumbnail} 
                    alt="Miniature" 
                    className="h-32 w-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeThumbnail}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    title="Supprimer l'image"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {thumbnailFile && (
                <p className="text-sm text-green-600">
                  ✓ Nouvelle image sélectionnée: {thumbnailFile.name}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de couverture {course?.cover_image && !coverImageFile && '(actuelle)'}
            </label>
            <div className="space-y-2">
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
              
              {/* Aperçu */}
              {(coverImagePreview || course?.cover_image) && (
                <div className="relative">
                  <img 
                    src={coverImagePreview || course.cover_image} 
                    alt="Couverture" 
                    className="h-32 w-48 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    title="Supprimer l'image"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {coverImageFile && (
                <p className="text-sm text-green-600">
                  ✓ Nouvelle image sélectionnée: {coverImageFile.name}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ... reste du formulaire ... */}
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


        {/* Boutons améliorés */}
        <div className="flex justify-between items-center pt-6 border-t">
          <div>
            {isDirty && !isLoading && (
              <div className="flex items-center text-amber-600 text-sm">
                <FiAlertCircle className="mr-2" />
                Vous avez des modifications non enregistrées
              </div>
            )}
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading || (!isDirty && course)}
              className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {course ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                <>
                  {course ? 'Mettre à jour' : 'Créer le cours'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CourseFormUpdate;