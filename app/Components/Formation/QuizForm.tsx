// components/forms/QuizForm.tsx
"use client";
import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { 
  useCreateQuizMutation, 
  useUpdateQuizMutation,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useUpdateChoiceMutation,
  useCreateChoiceMutation, 
   useGetLessonByIdQuery
} from '@/state/learningApi';
import { FiPlus, FiSave, FiX, FiHelpCircle } from 'react-icons/fi';
import { toast } from 'sonner';
import QuestionForm from './QuestionForm';

interface QuizFormProps {
  lessonId: string;
  initialQuiz?: any;
  initialQuestions?: any[];
  onSuccess?: () => void;
}

const QuizForm = ({ lessonId, initialQuiz, initialQuestions = [], onSuccess }: QuizFormProps) => {
  const router = useRouter();
  const [createQuiz] = useCreateQuizMutation();
  const [updateQuiz] = useUpdateQuizMutation();
  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [updateChoice] = useUpdateChoiceMutation();
  const [createChoice] = useCreateChoiceMutation();
  const { data: lesson, isLoading: isLoadingLesson } = useGetLessonByIdQuery(lessonId);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: initialQuiz || {
      title: 'Quiz de validation',
      description: '',
      time_limit_minutes: 10,
      max_attempts: 3,
      pass_percentage: 70,
      points_available: 10,
      randomize_questions: true,
    },
  });

  // Gestion des questions avec useFieldArray
  const { fields, append, remove, move } = useFieldArray({
    control,
    name: 'questions',
  });

  // État pour les questions supprimées (pour la mise à jour)
  const [deletedQuestionIds, setDeletedQuestionIds] = useState<string[]>([]);

  const handleAddQuestion = () => {
    append({
      text: 'Nouvelle question',
      media_url: 'https://example.com/default.gif',
      media_type: 'gif',
      points: 2,
      explanation: '',
      demonstration_video_url: '',
      order: fields.length,
      choices: [
        { text: '', sign_video_url: '', is_correct: true, order: 0 },
        { text: '', sign_video_url: '', is_correct: false, order: 1 },
        { text: '', sign_video_url: '', is_correct: false, order: 2 },
        { text: '', sign_video_url: '', is_correct: false, order: 3 },
      ],
    });
  };

  const handleMoveQuestion = (fromIndex: number, toIndex: number) => {
    move(fromIndex, toIndex);
  };

  const handleRemoveQuestion = async (index: number, questionId?: string) => {
    if (questionId) {
      // Si c'est une question existante, marquer pour suppression
      setDeletedQuestionIds(prev => [...prev, questionId]);
    }
    remove(index);
  };

 const onSubmit = async (data: any) => {
  setIsSaving(true);
  
  try {
    // 1. Sauvegarder le quiz
    let quizResponse;
    const quizData = {
      lesson: lessonId,
      title: data.title,
      description: data.description,
      time_limit_minutes: data.time_limit_minutes ? Number(data.time_limit_minutes) : 0,
      max_attempts: Number(data.max_attempts),
      pass_percentage: Number(data.pass_percentage),
      points_available: Number(data.points_available),
      randomize_questions: data.randomize_questions,
    };

    if (initialQuiz) {
      quizResponse = await updateQuiz({ id: initialQuiz.id, data: quizData }).unwrap();
    } else {
      quizResponse = await createQuiz(quizData).unwrap();
    }

    // 2. Supprimer les questions marquées
    for (const questionId of deletedQuestionIds) {
      await deleteQuestion(questionId).unwrap();
    }

    // 3. Sauvegarder les questions et leurs choix
    const questions = data.questions || [];
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];

        // Validation
  if (!question.text || question.text.trim() === '') {
    toast.error(`La question ${i + 1} n'a pas de texte`);
    continue;
  }
  
  if (!question.media_url || question.media_url.trim() === '') {
    toast.error(`La question ${i + 1} n'a pas d'URL média`);
    continue;
  }
      
      // Sauvegarder la question
      let questionResponse;
      const questionData = {
        quiz: quizResponse.id,
        text: question.text,
        media_url: question.media_url,
        media_type: question.media_type,
        points: Number(question.points),
        explanation: question.explanation || '',
        demonstration_video_url: question.demonstration_video_url || '',
        order: i,
      };

      if (question.id) {
        questionResponse = await updateQuestion({ 
          id: question.id, 
          data: questionData 
        }).unwrap();
      } else {
        questionResponse = await createQuestion(questionData).unwrap();
      }

      // 4. Sauvegarder les choix pour cette question
      const choices = question.choices || [];
      for (let j = 0; j < choices.length; j++) {
        const choice = choices[j];
        const choiceData = {
          question: questionResponse.id,
          text: choice.text,
          sign_video_url: choice.sign_video_url || '',
          is_correct: choice.is_correct,
          order: j,
        };

        if (choice.id) {
          await updateChoice({ id: choice.id, data: choiceData }).unwrap();
        } else {
          await createChoice(choiceData).unwrap();
        }
      }
    }

    toast.success(initialQuiz ? 'Quiz mis à jour avec succès' : 'Quiz créé avec succès');
    
    if (onSuccess) {
      onSuccess();
    } else {
      router.push(`/formation/lessons/${lessonId}`);
    }
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    toast.error('Erreur lors de la sauvegarde du quiz');
  } finally {
    setIsSaving(false);
  }
};

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* En-tête */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Configuration du Quiz</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre du quiz *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Le titre est requis' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="EX: Quiz de validation"
            />
            {/* {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )} */}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              {...register('description')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Description optionnelle"
            />
          </div>

          {/* Temps limite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temps limite (minutes)
            </label>
            <input
              type="number"
              {...register('time_limit_minutes')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
              placeholder="Laissez vide pour illimité"
            />
          </div>

          {/* Tentatives max */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tentatives maximum
            </label>
            <input
              type="number"
              {...register('max_attempts', { min: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
            />
          </div>

          {/* Pourcentage de réussite */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pourcentage de réussite requis
            </label>
            <input
              type="number"
              {...register('pass_percentage', { min: 0, max: 100 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="0"
              max="100"
            />
          </div>

          {/* Points disponibles */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points totaux
            </label>
            <input
              type="number"
              {...register('points_available', { min: 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              min="1"
            />
          </div>

          {/* Options */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register('randomize_questions')}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span className="text-sm text-gray-700">
                Mélanger les questions aléatoirement
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Questions</h2>
            <p className="text-gray-600 mt-1">
              Ajoutez les questions avec leurs choix de réponses
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddQuestion}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <FiPlus size={18} />
            Ajouter une question
          </button>
        </div>

        {fields.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FiHelpCircle className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune question
            </h3>
            <p className="text-gray-600 mb-4">
              Commencez par ajouter votre première question
            </p>
            <button
              type="button"
              onClick={handleAddQuestion}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FiPlus size={18} />
              Ajouter une question
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {fields.map((field, index) => (
              <QuestionForm
                key={field.id}
                index={index}
                question={field}
                onRemove={() => handleRemoveQuestion(index, field.id)}
                onMoveUp={() => handleMoveQuestion(index, index - 1)}
                onMoveDown={() => handleMoveQuestion(index, index + 1)}
                isFirst={index === 0}
                isLast={index === fields.length - 1}
                onChange={(updatedQuestion) => {
                  // Mettre à jour la question dans le form
                  // La mise à jour est automatique via le watch
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <FiSave size={18} />
          {isSaving ? 'Enregistrement...' : initialQuiz ? 'Mettre à jour' : 'Créer le quiz'}
        </button>
      </div>
    </form>
  );
};

export default QuizForm;