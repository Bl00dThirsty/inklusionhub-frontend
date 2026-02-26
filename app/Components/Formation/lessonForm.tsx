"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateLessonMutation, useUpdateLessonMutation } from '@/state/learningApi';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface LessonFormProps {
  moduleId: string;
  lesson?: any;
  onSuccess?: (response: any) => void;
}

interface LessonFormData {
  title: string;
  description: string;
  lesson_number: number;
  content_type: 'video' | 'text' | 'interactive' | 'mixed';
  video_url?: string;
  video_duration?: number;
  text_content?: string;
  has_subtitles: boolean;
  has_lsf_translation: boolean;
  lsf_video_url?: string;
  has_quiz: boolean;
  quiz_points?: number;
  quiz_pass_percentage?: number;
  is_free_preview: boolean;
  attachments?: any[];
  difficulty: 'debutant' | 'intermediaire' | 'avance';
}

const LessonForm = ({ moduleId, lesson = null, onSuccess }: LessonFormProps) => {
  const router = useRouter();
  const [createLesson, { isLoading: isCreating }] = useCreateLessonMutation();
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<LessonFormData>({
    defaultValues: lesson ? {
      title: lesson.title,
      description: lesson.description,
      lesson_number: lesson.lesson_number,
      content_type: lesson.content_type,
      video_url: lesson.video_url || '',
      video_duration: lesson.video_duration || 0,
      text_content: lesson.text_content || '',
      has_subtitles: lesson.has_subtitles,
      has_lsf_translation: lesson.has_lsf_translation,
      lsf_video_url: lesson.lsf_video_url || '',
      has_quiz: lesson.has_quiz,
      quiz_points: lesson.quiz_points,
      quiz_pass_percentage: lesson.quiz_pass_percentage,
      is_free_preview: lesson.is_free_preview,
      difficulty: lesson.difficulty,
      attachments: lesson.attachments || [], 
    } : {
      lesson_number: 1,
      content_type: 'mixed',
      has_subtitles: true,
      has_lsf_translation: true,
      has_quiz: true,
      quiz_points: 10,
      quiz_pass_percentage: 70,
      is_free_preview: false,
      difficulty: 'debutant',
    },
  });

  const contentType = watch('content_type');
  const hasQuiz = watch('has_quiz');

  const onSubmit = async (data: LessonFormData) => {
    try {
      const formData = new FormData();
      
      // Ajouter le module_id
      formData.append('module', moduleId);
      
      // Ajouter les autres champs
      Object.keys(data).forEach(key => {
        if (key === 'attachments') {
          // Gérer les pièces jointes séparément si nécessaire
        } else {
          formData.append(key, String(data[key as keyof LessonFormData]));
        }
      });
      
      let response;
      if (lesson) {
        response = await updateLesson({ id: lesson.id, data: formData }).unwrap();
        toast.success('Leçon mise à jour avec succès');
      } else {
        response = await createLesson(formData).unwrap();
        toast.success('Leçon créée avec succès');
      }
      
      if (onSuccess) {
        onSuccess(response);
      } else {
        // Rediriger vers la page du module
        router.push(`/learning/modules/${moduleId}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (typeof error === 'object' && error !== null && 'data' in error && typeof (error as any).data?.message === 'string') {
        toast.error((error as any).data.message);
      } else {
        toast.error('Une erreur est survenue');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          {lesson ? 'Modifier la leçon' : 'Ajouter une leçon'}
        </h2>

        {/* Numéro et Titre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de leçon *
            </label>
            <input
              type="number"
              {...register('lesson_number', { 
                required: 'Le numéro est requis',
                min: { value: 1, message: 'Minimum 1' }
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
            />
            {errors.lesson_number && (
              <p className="mt-1 text-sm text-red-600">{errors.lesson_number.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de la leçon *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Le titre est requis' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Premier contact"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            {...register('description', { required: 'La description est requise' })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Description de la leçon"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Type de contenu */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de contenu *
          </label>
          <select
            {...register('content_type', { required: true })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="video">Vidéo</option>
            <option value="text">Texte</option>
            <option value="interactive">Interactive</option>
            <option value="mixed">Mixte</option>
          </select>
        </div>

        {/* Contenu selon le type */}
        {contentType === 'video' || contentType === 'mixed' ? (
          <div className="mb-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL vidéo principale *
              </label>
              <input
                type="url"
                {...register('video_url', { 
                  required: contentType === 'video' ? 'L\'URL vidéo est requise' : false 
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://votre-hébergement.com/video.mp4"
              />
              {errors.video_url && (
                <p className="mt-1 text-sm text-red-600">{errors.video_url.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Durée de la vidéo (secondes)
              </label>
              <input
                type="number"
                {...register('video_duration', { min: 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="300"
              />
            </div>
          </div>
        ) : null}

        {contentType === 'text' || contentType === 'mixed' ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contenu texte
            </label>
            <textarea
              {...register('text_content')}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contenu texte de la leçon..."
            />
          </div>
        ) : null}

        {/* Accessibilité */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Accessibilité</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_subtitles"
                {...register('has_subtitles')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="has_subtitles" className="ml-2 text-sm text-gray-700">
                Inclure des sous-titres
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="has_lsf_translation"
                {...register('has_lsf_translation')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="has_lsf_translation" className="ml-2 text-sm text-gray-700">
                Inclure une traduction LSF
              </label>
            </div>

            {watch('has_lsf_translation') && (
              <div className="ml-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL vidéo LSF
                </label>
                <input
                  type="url"
                  {...register('lsf_video_url')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://votre-hébergement.com/video-lsf.mp4"
                />
              </div>
            )}
          </div>
        </div>

        {/* Quiz */}
        <div className="mb-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="has_quiz"
              {...register('has_quiz')}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="has_quiz" className="ml-2 text-lg font-medium text-gray-900">
              Inclure un quiz de validation
            </label>
          </div>

          {hasQuiz && (
            <div className="ml-6 space-y-4 bg-gray-50 p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points du quiz *
                  </label>
                  <input
                    type="number"
                    {...register('quiz_points', { 
                      required: hasQuiz ? 'Les points sont requis' : false,
                      min: { value: 1, message: 'Minimum 1 point' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                  {errors.quiz_points && (
                    <p className="mt-1 text-sm text-red-600">{errors.quiz_points.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pourcentage de réussite requis *
                  </label>
                  <input
                    type="number"
                    {...register('quiz_pass_percentage', { 
                      required: hasQuiz ? 'Le pourcentage est requis' : false,
                      min: { value: 0, message: 'Minimum 0%' },
                      max: { value: 100, message: 'Maximum 100%' }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                    max="100"
                  />
                  {errors.quiz_pass_percentage && (
                    <p className="mt-1 text-sm text-red-600">{errors.quiz_pass_percentage.message}</p>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                Le quiz sera accessible après la leçon. L'apprenant devra obtenir {watch('quiz_pass_percentage') || 70}% de bonnes réponses pour valider la leçon.
              </p>
            </div>
          )}
        </div>

        {/* Configuration avancée */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau de difficulté
              </label>
              <select
                {...register('difficulty')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_free_preview"
                {...register('is_free_preview')}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label htmlFor="is_free_preview" className="ml-2 text-sm text-gray-700">
                Accès libre (prévisualisation)
              </label>
            </div>
          </div>
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
            {isCreating || isUpdating ? 'Enregistrement...' : lesson ? 'Mettre à jour' : 'Créer la leçon'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default LessonForm;