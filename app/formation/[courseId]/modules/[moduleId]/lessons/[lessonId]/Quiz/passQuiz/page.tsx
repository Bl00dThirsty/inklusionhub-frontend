// app/formation/[courseId]/modules/[moduleId]/lessons/[lessonId]/Quiz/passQuiz/page.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    useGetCourseByIdQuery,
  useGetCourseBySlugQuery,
  useGetCourseModulesQuery,
  useGetLessonByIdQuery,
  useGetModuleLessonsQuery,
  useGetQuizQuestionsLearnerQuery,
  useSubmitQuizMutation
} from '@/state/learningApi';
import { 
  FiArrowLeft, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiLoader,
  FiAward,
  FiRefreshCw,
  FiChevronRight
} from 'react-icons/fi';
import { toast } from 'sonner';
import Link from 'next/link';


interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  total_points: number;
  lessons_count: number;
  lessons: Lesson[];
  estimated_hours: number;
  created_at: string;
}
interface Lesson {
  id: string;
  module: string;
  title: string;
  description: string;
  lesson_number: number;
  content_type: 'video' | 'text' | 'interactive' | 'mixed';
  video_url?: string;
  video_duration: number;
  text_content?: string;
  has_subtitles: boolean;
  has_lsf_translation: boolean;
  lsf_video_url?: string;
  has_quiz: boolean;
  quiz_points: number;
  quiz_pass_percentage: number;
  is_free_preview: boolean;
  difficulty: string;
  is_completed: boolean;
  attachments?: any[];
  created_at: string;
}

const QuizPage = () => {
  const { courseId, lessonId, moduleId } = useParams();
  const router = useRouter();

    // LOG 1: Vérifier les paramètres d'URL
  console.log('🔍 PARAMÈTRES URL:', { courseId, lessonId, moduleId });

  // États
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [startTime] = useState(Date.now());
  // Récupérer les données du cours
  const { data: course, isLoading: isCourseLoading, error: courseError } = useGetCourseByIdQuery(
    courseId as string
  );
   // LOG 2: Résultat de la requête cours
  console.log('🔍 COURS:', { course, isCourseLoading, courseError });

  // Récupérer les données

   // Récupérer la leçon
  const { data: lesson, isLoading: isLessonLoading, error: lessonError } = useGetLessonByIdQuery(
    lessonId as string
  );
   // LOG 3: Résultat de la requête leçon
  console.log('🔍 LEÇON:', { lesson, isLessonLoading, lessonError });

   // Récupérer le quiz - ATTENTION: dépend de course?.slug
  const { 
    data: quizData, 
    isLoading: isQuizLoading, 
    error: quizError,
    refetch 
  } = useGetQuizQuestionsLearnerQuery({
    courseSlug: course?.slug as string,
    lessonNumber: lesson?.lesson_number || 1,
    moduleId: moduleId as string
  }, { 
    skip: !lesson || !course?.slug // Ne pas exécuter tant que lesson et course.slug ne sont pas disponibles
  });
  
  // LOG 4: Résultat de la requête quiz
  console.log('🔍 QUIZ:', { 
    quizData, 
    isQuizLoading, 
    quizError,
    courseSlug: course?.slug,
    lessonNumber: lesson?.lesson_number 
  });

    // Récupérer les modules du cours
  const { data: modules, isLoading: isModulesLoading, error: modulesError } = useGetCourseModulesQuery(
    courseId as string,
    { skip: !courseId }
  );

  const { data: moduleLessons, isLoading: isLoadingLessons } = useGetModuleLessonsQuery(
    moduleId as string,
    { skip: !moduleId }
  );
  
  // LOG 5: Résultat des modules
  console.log('🔍 MODULES:', { modules, isModulesLoading, modulesError });

  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  // États existants...
  const [nextLesson, setNextLesson] = useState<any>(null);
  // Calculer la prochaine leçon
   // Calculer la prochaine leçon
 // Calculer la prochaine leçon - UTILISER moduleLessons au lieu de fetch
  useEffect(() => {
    console.log('🔍 CALCUL NEXT LESSON - Déclenché avec:', { 
      lesson, 
      moduleLessons, 
      moduleId 
    });
    
    if (lesson && moduleLessons && moduleLessons.length > 0) {
      console.log('🔍 Lesson actuelle:', lesson);
      console.log('🔍 Toutes les leçons du module:', moduleLessons);
      
      // Trouver la prochaine leçon dans le même module
      const next = moduleLessons.find(
        (l: any) => l.lesson_number === lesson.lesson_number + 1
      );
      
      console.log('🔍 Prochaine leçon trouvée:', next);
      setNextLesson(next);
    } else {
      console.log('🔍 Données manquantes pour next lesson:', { 
        lessonExists: !!lesson, 
        moduleLessonsExists: !!moduleLessons,
        moduleLessonsLength: moduleLessons?.length
      });
    }
  }, [lesson, moduleLessons]);

//     // LOG 6: Vérifier si on doit afficher l'écran de chargement ou d'erreur
//   useEffect(() => {
//     if (!isQuizLoading && !quizData) {
//       console.log('🔍 AFFICHAGE ERREUR - quizData est null/undefined');
//       console.log('🔍 Valeurs au moment de l\'erreur:', {
//         course: course?.slug,
//         lessonNumber: lesson?.lesson_number,
//         moduleId,
//         quizError,
//         isQuizLoading,
//         courseError,
//         lessonError
//       });
//     }
//   }, [isQuizLoading, quizData, course, lesson, quizError]);

  // Gestion du timer
  useEffect(() => {
    if (quizData?.quiz?.time_limit_minutes && !quizCompleted) {
      const totalSeconds = quizData.quiz.time_limit_minutes * 60;
      setTimeRemaining(totalSeconds);

      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            handleAutoSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizData, quizCompleted]);

   // Gestion des erreurs
  useEffect(() => {
    if (!isQuizLoading && !quizData && quizError) {
      console.log('🔍 AFFICHAGE ERREUR - quizData est null/undefined');
      console.log('🔍 Valeurs au moment de l\'erreur:', {
        course: course?.slug,
        lessonNumber: lesson?.lesson_number,
        moduleId,
        quizError,
        isQuizLoading,
      });
    }
  }, [isQuizLoading, quizData, course, lesson, quizError]);

  const handleAutoSubmit = async () => {
    if (!quizCompleted && Object.keys(answers).length > 0) {
      toast.warning('Temps écoulé ! Soumission automatique...');
      await handleSubmitQuiz();
    }
  };

  const handleAnswerSelect = (questionId: string, choiceId: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: choiceId
    }));
  };

  const handleNext = () => {
    if (quizData && currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (!quizData) return;

    // Vérifier que toutes les questions ont une réponse
    const unansweredQuestions = quizData.questions.filter(q => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      if (!confirm(`${unansweredQuestions.length} question(s) sans réponse. Voulez-vous quand même soumettre ?`)) {
        return;
      }
    }

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    try {
      const result = await submitQuiz({
        courseSlug: course?.slug as string,
        lessonNumber: lesson?.lesson_number || 1,
        moduleId: moduleId as string,
        data: {
          answers,
          time_spent_seconds: timeSpent
        }
      }).unwrap();

      setResult(result);
      setQuizCompleted(true);

      if (result.is_passed) {
        toast.success('Félicitations ! Quiz réussi ! 🎉');
      } else {
        if (result.remaining_attempts > 0) {
          toast.warning(`Quiz non réussi. Il vous reste ${result.remaining_attempts} tentative(s).`);
        } else {
          toast.error('Nombre maximum de tentatives atteint.');
        }
      }
    } catch (error) {
      toast.error('Erreur lors de la soumission du quiz');
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setQuizCompleted(false);
    setResult(null);
    refetch();
  };

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isQuizLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FiLoader className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-4xl mx-auto bg-red-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold text-red-800">Quiz non trouvé</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  // Écran de résultats
  if (quizCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Icône de résultat */}
            <div className="text-center mb-6">
              {result.is_passed ? (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                  <FiAward className="text-green-600" size={40} />
                </div>
              ) : (
                <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                  <FiXCircle className="text-red-600" size={40} />
                </div>
              )}
            </div>

            {/* Score */}
            <h1 className="text-3xl font-bold text-center mb-2">
              {result.is_passed ? 'Quiz Réussi !' : 'Quiz Non Réussi'}
            </h1>
            <div className="text-center mb-6">
              <span className="text-5xl font-bold text-blue-600">
                {Math.round(result.score_percentage)}%
              </span>
              <p className="text-gray-600 mt-2">
                {result.correct_answers} bonnes réponses sur {result.total_questions} questions
              </p>
              <p className="text-gray-600">
                Points gagnés: {result.points_earned} / {result.total_points}
              </p>
            </div>

            {/* Informations supplémentaires */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-gray-600">Tentative</p>
                  <p className="text-xl font-semibold">{result.attempt_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tentatives restantes</p>
                  <p className="text-xl font-semibold">{result.remaining_attempts}</p>
                </div>
              </div>
            </div>

            {/* Détail des réponses */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Détail des réponses</h2>
              <div className="space-y-4">
                {result.answers_detail.map((detail: any, index: number) => (
                  <div key={detail.question_id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {detail.is_correct ? (
                          <FiCheckCircle className="text-green-600" size={20} />
                        ) : (
                          <FiXCircle className="text-red-600" size={20} />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium mb-2">Question {index + 1}</p>
                        <p className="text-gray-700 mb-2">{detail.question_text}</p>
                        
                        <div className="bg-gray-50 p-3 rounded">
                          <p className="text-sm">
                            <span className="font-medium">Votre réponse: </span>
                            {detail.user_choice_text || 'Non répondue'}
                          </p>
                          {!detail.is_correct && (
                            <p className="text-sm text-green-600 mt-1">
                              <span className="font-medium">Bonne réponse: </span>
                              {detail.correct_choice_text}
                            </p>
                          )}
                        </div>

                        {detail.explanation && (
                          <div className="mt-3 text-sm text-gray-600">
                            <span className="font-medium">Explication: </span>
                            {detail.explanation}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3">
              {!result.is_passed && result.remaining_attempts > 0 && (
                <button
                  onClick={handleRetry}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiRefreshCw size={18} />
                  Recommencer le quiz
                </button>
              )}

              {result.is_passed && nextLesson && (
                <Link
                  href={`/formation/${courseId}/${course?.slug}/learn/${nextLesson.id}`}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiChevronRight size={18} />
                  Prochaine leçon
                </Link>
              )}

              <Link
                href={`/formation/${courseId}/${course?.slug}`}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Retour au cours
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Écran du quiz en cours
  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (confirm('Voulez-vous quitter le quiz ? Votre progression sera perdue.')) {
                    router.back();
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{quizData.quiz.title}</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} sur {quizData.questions.length}
                </p>
              </div>
            </div>

            {timeRemaining !== null && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 60 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
              }`}>
                <FiClock size={18} />
                <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          {/* Barre de progression */}
          <div className="mt-4 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contenu du quiz */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {currentQuestion && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Média de la question */}
            {currentQuestion.media_url && (
              <div className="mb-6">
                {currentQuestion.media_type === 'video' ? (
                  <video src={currentQuestion.media_url} controls className="w-full rounded-lg" />
                ) : (
                  <img src={currentQuestion.media_url} alt="Question" className="w-full rounded-lg" />
                )}
              </div>
            )}

            {/* Texte de la question */}
            <h2 className="text-xl font-semibold mb-4">{currentQuestion.text}</h2>

            {/* Points */}
            <p className="text-sm text-gray-500 mb-4">Points: {currentQuestion.points}</p>

            {/* Choix de réponses */}
            <div className="space-y-3 mb-8">
              {currentQuestion.choices.map((choice: any) => (
                <label
                  key={choice.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    answers[currentQuestion.id] === choice.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={choice.id}
                      checked={answers[currentQuestion.id] === choice.id}
                      onChange={() => handleAnswerSelect(currentQuestion.id, choice.id)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="text-gray-900">{choice.text}</p>
                      {choice.sign_video_url && (
                        <video src={choice.sign_video_url} className="mt-2 max-h-20 rounded" controls />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>

              {currentQuestionIndex === quizData.questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? <FiLoader className="animate-spin" size={18} /> : 'Terminer'}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Suivant
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;