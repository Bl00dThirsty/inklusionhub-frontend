// app/formation/[courseId]/modules/[moduleId]/lessons/[lessonId]/quiz/[quizId]/questions/[questionId]/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useCreateChoiceMutation,
  useUpdateChoiceMutation,
  useDeleteChoiceMutation
} from '@/state/learningApi';
import { FiArrowLeft, FiSave, FiPlus, FiTrash2, FiLoader } from 'react-icons/fi';
import { toast } from 'sonner';

const QuestionFormPage = () => {
  const { courseId, moduleId, lessonId, quizId, questionId } = useParams();
  const router = useRouter();
  const isEditing = questionId !== 'create';

  // Récupérer la question si en édition
  const { data: existingQuestion, isLoading: isLoadingQuestion } = useGetQuestionByIdQuery(
    questionId as string,
    { skip: !isEditing }
  );

  // Mutations
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [createChoice] = useCreateChoiceMutation();
  const [updateChoice] = useUpdateChoiceMutation();
  const [deleteChoice] = useDeleteChoiceMutation();

  const [isSaving, setIsSaving] = useState(false);
  const [deletedChoiceIds, setDeletedChoiceIds] = useState<string[]>([]);
  const [correctChoiceIndex, setCorrectChoiceIndex] = useState<number>(0);

  const { register, control, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({
    defaultValues: {
      text: '',
      media_url: '',
      media_type: 'gif',
      points: 2,
      explanation: '',
      demonstration_video_url: '',
      choices: [
        { text: '', sign_video_url: '', is_correct: true },
        { text: '', sign_video_url: '', is_correct: false },
        { text: '', sign_video_url: '', is_correct: false },
        { text: '', sign_video_url: '', is_correct: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'choices',
  });

  // Charger les données existantes
 useEffect(() => {
  if (existingQuestion) {
    setValue('text', existingQuestion.text);
    setValue('media_url', existingQuestion.media_url);
    setValue('media_type', existingQuestion.media_type);
    setValue('points', existingQuestion.points);
    setValue('explanation', existingQuestion.explanation || '');
    setValue('demonstration_video_url', existingQuestion.demonstration_video_url || '');
    
    if (existingQuestion.choices && existingQuestion.choices.length > 0) {
      // Transformer les choix pour s'assurer que sign_video_url est toujours une string
      const formattedChoices = existingQuestion.choices.map((choice: any) => ({
        text: choice.text || '',
        sign_video_url: choice.sign_video_url || '', // Convertir undefined en chaîne vide
        is_correct: choice.is_correct || false
      }));
      
      setValue('choices', formattedChoices);
      
      const correctIndex = existingQuestion.choices.findIndex((c: any) => c.is_correct);
      if (correctIndex !== -1) {
        setCorrectChoiceIndex(correctIndex);
      }
    }
  }
}, [existingQuestion, setValue]);

 // Mettre à jour is_correct quand correctChoiceIndex change
  useEffect(() => {
    const currentChoices = getValues('choices');
    if (currentChoices) {
      currentChoices.forEach((_: any, index: number) => {
        setValue(`choices.${index}.is_correct`, index === correctChoiceIndex);
      });
    }
  }, [correctChoiceIndex, setValue, getValues]);

//   // Observer les changements pour maintenir un seul choix correct
//   useEffect(() => {
//     const subscription = watch((value) => {
//       const choices = value.choices;
//       if (choices) {
//         choices.forEach((_: any, index: number) => {
//           setValue(`choices.${index}.is_correct`, index === correctChoiceIndex);
//         });
//       }
//     });
//     return () => subscription.unsubscribe();
//   }, [watch, correctChoiceIndex, setValue]);

 // Observer les changements pour d'autres champs (optionnel)
  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      // Ne pas réagir aux changements de is_correct pour éviter les boucles
      if (name && name.includes('is_correct')) {
        return;
      }
      // Autres logiques si nécessaire
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const handleSetCorrectChoice = (index: number) => {
    setCorrectChoiceIndex(index);
  };

  const onSubmit = async (data: any) => {
    setIsSaving(true);
    
    try {
      // 1. Sauvegarder la question
      let questionResponse;
      const questionData = {
        quiz: quizId as string,
        text: data.text,
        media_url: data.media_url,
        media_type: data.media_type,
        points: Number(data.points),
        explanation: data.explanation || '',
        demonstration_video_url: data.demonstration_video_url || '',
      };

      if (isEditing) {
        questionResponse = await updateQuestion({ 
          id: questionId as string, 
          data: questionData 
        }).unwrap();
      } else {
        questionResponse = await createQuestion(questionData).unwrap();
      }

      // 2. Supprimer les choix marqués
      for (const choiceId of deletedChoiceIds) {
        await deleteChoice(choiceId).unwrap();
      }

      // 3. Sauvegarder les choix
      const choices = data.choices || [];
      for (let j = 0; j < choices.length; j++) {
        const choice = choices[j];
        
        if (!choice.text?.trim()) {
          toast.error(`Le choix ${j + 1} n'a pas de texte`);
          continue;
        }

        const choiceData = {
          question: questionResponse.id,
          text: choice.text,
          sign_video_url: choice.sign_video_url || '',
          is_correct: j === correctChoiceIndex,
        };

        if (choice.id && !deletedChoiceIds.includes(choice.id)) {
          await updateChoice({ id: choice.id, data: choiceData }).unwrap();
        } else if (!choice.id) {
          await createChoice(choiceData).unwrap();
        }
      }

      toast.success(isEditing ? 'Question mise à jour avec succès' : 'Question créée avec succès');
      router.push(`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question`);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  if (isEditing && isLoadingQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft />
            Retour aux questions
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Modifier la question' : 'Nouvelle question'}
          </h1>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow rounded-lg p-6">
          <div className="space-y-6">
            {/* Texte de la question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intitulé de la question *
              </label>
              <input
                type="text"
                {...register('text', { required: 'Le texte est requis' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Ex: Que signifie ce signe ?"
              />
              {errors.text && (
                <p className="mt-1 text-sm text-red-600">{errors.text.message as string}</p>
              )}
            </div>

            {/* Média */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de média
                </label>
                <select
                  {...register('media_type')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="gif">GIF animé</option>
                  <option value="video">Vidéo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL du média *
                </label>
                <input
                  type="url"
                  {...register('media_url', { required: 'L\'URL est requise' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="https://exemple.com/signe.gif"
                />
                {errors.media_url && (
                  <p className="mt-1 text-sm text-red-600">{errors.media_url.message as string}</p>
                )}
              </div>
            </div>

            {/* Points */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Points *
              </label>
              <input
                type="number"
                {...register('points', { min: 1, max: 10 })}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md"
                min="1"
                max="10"
              />
            </div>

            {/* Vidéo d'explication */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vidéo d'explication (optionnel)
              </label>
              <input
                type="url"
                {...register('demonstration_video_url')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="https://exemple.com/explication.mp4"
              />
            </div>

            {/* Explication textuelle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Explication détaillée (optionnel)
              </label>
              <textarea
                {...register('explanation')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Expliquez pourquoi cette réponse est correcte..."
              />
            </div>

            {/* Choix de réponses */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Choix de réponses</h3>
                <button
                  type="button"
                  onClick={() => append({ 
                    text: '', 
                    sign_video_url: '', 
                    is_correct: false 
                  })}
                  className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                >
                  <FiPlus size={16} />
                  Ajouter un choix
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`p-4 border rounded-lg ${
                      index === correctChoiceIndex ? 'border-green-500 bg-green-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Bouton bonne réponse */}
                      <button
                        type="button"
                        onClick={() => handleSetCorrectChoice(index)}
                        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          index === correctChoiceIndex
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {index === correctChoiceIndex && '✓'}
                      </button>

                      {/* Champs du choix */}
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          {...register(`choices.${index}.text` as const, {
                            required: 'Le texte est requis'
                          })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder={`Choix ${index + 1}`}
                        />
                        
                        <input
                          type="url"
                          {...register(`choices.${index}.sign_video_url` as const)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="URL de la vidéo (optionnel)"
                        />
                      </div>

                      {/* Bouton suppression */}
                      {fields.length > 2 && (
                        <button
                          type="button"
                          onClick={() => {
                            if (field.id) {
                              setDeletedChoiceIds(prev => [...prev, field.id as string]);
                            }
                            remove(index);
                            if (index === correctChoiceIndex) {
                              setCorrectChoiceIndex(0);
                            }
                          }}
                          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {fields.length < 2 && (
                  <p className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded">
                    Ajoutez au moins 2 choix de réponse
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 mt-8 pt-6 border-t">
            <Link
              href={`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question`}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </Link>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {isSaving ? <FiLoader className="animate-spin" size={18} /> : <FiSave size={18} />}
              {isSaving ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormPage;