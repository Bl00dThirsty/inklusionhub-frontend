
"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetLessonQuizQuery,
  useGetQuizQuestionsQuery,
  useDeleteQuizMutation,
  useDeleteQuestionMutation,
  useGetQuizByIdQuery,
  useGetQuestionChoicesQuery
} from '@/state/learningApi';
import {
  FiArrowLeft,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiClock,
  FiAward,
  FiHelpCircle,
  FiVideo,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
  FiSettings,
  FiAlertTriangle,
} from 'react-icons/fi';
import { MdOutlineQuiz, MdOutlineQuestionAnswer } from 'react-icons/md';
import { toast } from 'sonner';
import Link from 'next/link';

interface Choice {
   id: string;
  text: string;
  sign_video_url?: string;
  is_correct: boolean;
  order: number;
}

const QuizDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseId, moduleId, lessonId, quizId } = params as {
    courseId: string;
    moduleId: string;
    lessonId: string;
    quizId: string;
  };

  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  console.log('quiId:', quizId); // Debug: Affichez le quizId pour vérifier sa valeur

  // Récupérer le quiz
  const { 
    data: quizdata, 
    isLoading: isLoadingQuizData, 
    error: quizErrorData,
    refetch: refetchQuiz 
  } = useGetLessonQuizQuery(lessonId);

    // État pour stocker les IDs des questions dont on a déjà chargé les choix
  const [loadedChoicesForQuestions, setLoadedChoicesForQuestions] = useState<Set<string>>(new Set());

   // Récupérer les détails du quiz (pour s'assurer que nous avons les bonnes données)
  const {
    data: quiz,
    isLoading: isLoadingQuiz,
    error: quizError,
  } = useGetQuizByIdQuery(quizId);

  // Récupérer les questions du quiz
  const { 
    data: questions, 
    isLoading: isLoadingQuestions,
    refetch: refetchQuestions 
  } = useGetQuizQuestionsQuery(quizId, { 
    skip: !quizId 
  });

  // Charger les choix pour chaque question individuellement
  const questionsChoices = questions?.reduce((acc, question) => {
    // Utiliser le hook pour chaque question (mais les hooks ne peuvent pas être appelés dans une boucle)
    // Nous allons plutôt créer un composant séparé ou utiliser une approche différente
    return acc;
  }, {});

  // Solution 1: Utiliser un composant séparé pour chaque question
  // Nous allons créer un composant QuestionWithChoices plus bas

  // Mutations
  const [deleteQuiz, { isLoading: isDeletingQuiz }] = useDeleteQuizMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const handleDeleteQuiz = async () => {
    if (!quiz) return;
    
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce quiz ? Cette action est irréversible et supprimera toutes les questions associées.')) {
      return;
    }

    try {
      await deleteQuiz(quiz.id).unwrap();
      toast.success('Quiz supprimé avec succès');
      router.push(`/formation/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression du quiz');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await deleteQuestion(questionId).unwrap();
      toast.success('Question supprimée avec succès');
      refetchQuestions();
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression de la question');
    }
  };

  const handleEditQuestion = (questionId: string) => {
    router.push(
      `/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question/${questionId}/`
    );
  };

  const handleAddQuestion = () => {
    router.push(
      `/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question`
    );
  };

  const handleEditQuiz = () => {
    router.push(
      `/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/edit/${quizId}`
    );
  };
  
  const backToLesson = () => {
    router.push(`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  };

  // États de chargement
  if (isLoadingQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Chargement du quiz...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (quizError || !quiz) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <FiAlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-red-800 mb-2">Quiz non trouvé</h2>
            <p className="text-red-600 mb-6">
              Aucun quiz n'a été créé pour cette leçon ou le quiz n'existe pas.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={backToLesson}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Retour
              </button>
              <Link
                href={`/formation/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/create`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Créer un quiz
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={backToLesson}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Retour à la leçon"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MdOutlineQuiz className="text-blue-600" />
                  {quiz.title}
                </h1>
                <p className="text-gray-600 mt-1">
                  {quiz.description || "Quiz de validation de la leçon"}
                </p>
              </div>
            </div>

            {/* Actions du quiz */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleEditQuiz}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit size={18} />
                Modifier le quiz
              </button>
              <button
                onClick={handleDeleteQuiz}
                disabled={isDeletingQuiz}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isDeletingQuiz ? <FiLoader className="animate-spin" size={18} /> : <FiTrash2 size={18} />}
                Supprimer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Carte d'informations du quiz */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiClock className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temps limite</p>
                <p className="text-lg font-semibold">
                  {quiz.time_limit_minutes ? `${quiz.time_limit_minutes} min` : 'Illimité'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <FiAward className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Points disponibles</p>
                <p className="text-lg font-semibold">{quiz.points_available} pts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <MdOutlineQuestionAnswer className="text-purple-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Questions</p>
                <p className="text-lg font-semibold">{questions?.length || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <FiSettings className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Configuration</p>
                <p className="text-lg font-semibold">
                  {quiz.max_attempts} tentative{quiz.max_attempts > 1 ? 's' : ''} • {quiz.pass_percentage}% requis
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2 text-sm text-gray-600">
            <span className={`px-2 py-1 rounded-full ${quiz.randomize_questions ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
              {quiz.randomize_questions ? 'Questions aléatoires' : 'Ordre fixe'}
            </span>
            <span className="text-gray-300">•</span>
            <span>Créé le {new Date(quiz.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Section des questions */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <FiHelpCircle className="text-blue-600" />
                  Questions ({questions?.length || 0})
                </h2>
                <p className="text-gray-600 mt-1">
                  Gérez les questions du quiz et leurs choix de réponses
                </p>
              </div>
              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <FiPlus size={18} />
                Ajouter une question
              </button>
            </div>
          </div>

          {isLoadingQuestions ? (
            <div className="p-12 text-center">
              <FiLoader className="animate-spin text-blue-600 mx-auto mb-4" size={32} />
              <p className="text-gray-600">Chargement des questions...</p>
            </div>
          ) : questions?.length === 0 ? (
            <div className="p-12 text-center">
              <div className="bg-gray-50 rounded-lg p-8 max-w-md mx-auto">
                <MdOutlineQuiz className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune question</h3>
                <p className="text-gray-600 mb-6">
                  Commencez par ajouter votre première question à ce quiz.
                </p>
                <button
                  onClick={handleAddQuestion}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  <FiPlus size={18} />
                  Ajouter une question
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {questions?.map((question, index) => (
                <QuestionWithChoices
                  key={question.id}
                  question={question}
                  index={index}
                  courseId={courseId}
                  moduleId={moduleId}
                  lessonId={lessonId}
                  quiId={quizId}
                  isExpanded={expandedQuestions.has(question.id)}
                  onToggle={() => toggleQuestion(question.id)}
                  onEdit={() => handleEditQuestion(question.id)}
                  onDelete={() => setShowDeleteConfirm(question.id)}
                  showDeleteConfirm={showDeleteConfirm === question.id}
                  onConfirmDelete={() => handleDeleteQuestion(question.id)}
                  onCancelDelete={() => setShowDeleteConfirm(null)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pied de page avec bouton d'ajout rapide */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleAddQuestion}
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg"
          >
            <FiPlus size={20} />
            Ajouter une nouvelle question
          </button>
        </div>
      </div>
    </div>
  );
};

// Composant séparé pour gérer les choix d'une question
const QuestionWithChoices = ({ 
  question, 
  index, 
  courseId, 
  moduleId, 
  lessonId,
  quizId,
  isExpanded,
  onToggle,
  onEdit,
  onDelete,
  showDeleteConfirm,
  onConfirmDelete,
  onCancelDelete
}: any) => {
  // Charger les choix pour cette question spécifique
  const { data: choices, isLoading: isLoadingChoices } = useGetQuestionChoicesQuery(question.id);
  const router = useRouter();
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      {/* En-tête de la question */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-700 rounded-full font-semibold">
              {index + 1}
            </span>
            <div className="flex items-center gap-2">
              {question.media_type === 'video' ? (
                <FiVideo className="text-purple-600" size={16} />
              ) : (
                <FiImage className="text-green-600" size={16} />
              )}
              <span className="text-sm font-medium text-gray-600">
                {question.points} point{question.points > 1 ? 's' : ''}
              </span>
            </div>
            <button
              onClick={onToggle}
              className="text-gray-400 hover:text-gray-600"
            >
              {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {question.text}
          </h3>

          {/* Aperçu du média */}
          {!isExpanded && question.media_url && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-gray-100 rounded">
                Média: {question.media_url.split('/').pop()?.substring(0, 30)}...
              </span>
            </div>
          )}

          {/* Aperçu des choix */}
          {!isExpanded && (
            <div className="mt-3 flex flex-wrap gap-2">
              {isLoadingChoices ? (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <FiLoader className="animate-spin" size={12} />
                  Chargement...
                </span>
              ) : choices && choices.length > 0 ? (
                choices.map((choice: any, idx: number) => (
                  <span
                    key={choice.id || idx}
                    className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                      choice.is_correct
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {choice.is_correct && <FiCheckCircle size={12} />}
                    {choice.text?.substring(0, 20)}...
                  </span>
                ))
              ) : (
                <span className="text-sm text-yellow-600">
                  Aucun choix défini
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions de la question */}
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Modifier la question"
          >
            <FiEdit size={18} />
          </button>
          
          {showDeleteConfirm ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onConfirmDelete}
                className="p-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                title="Confirmer la suppression"
              >
                <FiCheckCircle size={18} />
              </button>
              <button
                onClick={onCancelDelete}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                title="Annuler"
              >
                <FiXCircle size={18} />
              </button>
            </div>
          ) : (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Supprimer la question"
            >
              <FiTrash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Détails de la question (déroulée) */}
      {isExpanded && (
        <div className="mt-6 pl-11 space-y-4">
          {/* Média */}
          {question.media_url && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-2">Média de la question :</p>
              <div className="flex items-center gap-2">
                {question.media_type === 'video' ? (
                  <FiVideo className="text-purple-600" size={20} />
                ) : (
                  <FiImage className="text-green-600" size={20} />
                )}
                <a 
                  href={question.media_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {question.media_url}
                </a>
              </div>
            </div>
          )}

          {/* Choix de réponses */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-gray-700">Choix de réponses :</p>
              {isLoadingChoices && (
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <FiLoader className="animate-spin" size={14} />
                  Chargement...
                </span>
              )}
            </div>
            
            {choices && choices.length > 0 ? (
              <div className="space-y-2">
                {choices.map((choice: any, idx: number) => (
                  <div
                    key={choice.id || idx}
                    className={`p-3 rounded-lg border ${
                      choice.is_correct
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 pt-1">
                        {choice.is_correct ? (
                          <FiCheckCircle className="text-green-600" size={18} />
                        ) : (
                          <FiXCircle className="text-gray-400" size={18} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-gray-900 ${choice.is_correct ? 'font-medium' : ''}`}>
                          {choice.text}
                        </p>
                        {choice.sign_video_url && (
                          <a
                            href={choice.sign_video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-2 text-sm text-purple-600 hover:underline"
                          >
                            <FiVideo size={14} />
                            Voir le signe
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Aucun choix défini pour cette question</p>
                <button
                  onClick={() => router.push(
                    `/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quizId}/question/${question.id}`
                  )}
                  className="mt-2 text-sm text-blue-600 hover:underline"
                >
                  Ajouter des choix
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetailPage;