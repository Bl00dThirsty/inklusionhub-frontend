// app/formation/[courseId]/modules/[moduleId]/lessons/[lessonId]/quiz/[quizId]/questions/page.tsx
"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  useGetQuizQuestionsQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
  useGetQuestionChoicesQuery
} from '@/state/learningApi';
import { FiArrowLeft, FiPlus, FiEdit2, FiTrash2, FiLoader, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { toast } from 'sonner';

const QuizQuestionsListPage = () => {
  const { courseId, moduleId, lessonId, quizId } = useParams();
  const router = useRouter();

  // Récupérer les questions du quiz
  const { data: questions, isLoading, refetch } = useGetQuizQuestionsQuery(quizId as string);

  // Mutations
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return;
    
    setIsDeleting(questionId);
    try {
      await deleteQuestion(questionId).unwrap();
      toast.success('Question supprimée avec succès');
      refetch();
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleMoveQuestion = async (index: number, direction: 'up' | 'down') => {
    if (!questions || reordering) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= questions.length) return;

    setReordering(true);
    try {
      const currentQuestion = questions[index];
      const otherQuestion = questions[newIndex];

      await updateQuestion({ 
        id: currentQuestion.id, 
        data: { order: newIndex } 
      }).unwrap();
      
      await updateQuestion({ 
        id: otherQuestion.id, 
        data: { order: index } 
      }).unwrap();

      toast.success('Ordre mis à jour');
      refetch();
    } catch (error) {
      toast.error('Erreur lors du réordonnancement');
    } finally {
      setReordering(false);
    }
  };

  if (isLoading) {
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
            href={`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}`}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft />
            Retour aux quiz
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Questions du quiz</h1>
              <p className="text-gray-600 mt-2">
                Gérez les questions pour ce quiz
              </p>
            </div>
            <Link
              href={`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question/create`}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <FiPlus size={18} />
              Nouvelle question
            </Link>
          </div>
        </div>

        {/* Liste des questions */}
        <div className="bg-white shadow rounded-lg p-6">
          {questions && questions.length > 0 ? (
            <div className="space-y-4">
              {questions.map((question: any, index: number) => (
                <div
                  key={question.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMoveQuestion(index, 'up')}
                            disabled={index === 0 || reordering}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                          >
                            <FiChevronUp size={16} />
                          </button>
                          <button
                            onClick={() => handleMoveQuestion(index, 'down')}
                            disabled={index === questions.length - 1 || reordering}
                            className="p-1 text-gray-500 hover:bg-gray-100 rounded disabled:opacity-30"
                          >
                            <FiChevronDown size={16} />
                          </button>
                        </div>
                        <span className="text-sm font-medium text-gray-500">
                          Question {index + 1}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold mt-2">{question.text}</h3>
                      
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Points: {question.points}</span>
                        <span>•</span>
                        <span>Média: {question.media_type}</span>
                        <span>•</span>
                        <span>Choix: {question.choices?.length || 0}</span>
                      </div>

                      {/* Aperçu des choix */}
                      {question.choices && question.choices.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {question.choices.map((choice: any, idx: number) => (
                            <span
                              key={choice.id || idx}
                              className={`inline-flex items-center px-2 py-1 rounded text-xs ${
                                choice.is_correct
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {choice.text || `Choix ${idx + 1}`}
                              {choice.is_correct && ' ✓'}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question/${question.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <FiEdit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDeleteQuestion(question.id)}
                        disabled={isDeleting === question.id}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Supprimer"
                      >
                        {isDeleting === question.id ? (
                          <FiLoader className="animate-spin" size={18} />
                        ) : (
                          <FiTrash2 size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">Aucune question pour ce quiz</p>
              <Link
                href={`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question/create`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <FiPlus size={18} />
                Créer la première question
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizQuestionsListPage;