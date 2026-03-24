"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  useGetLessonByIdQuery,
  useGetCourseByIdQuery,
  useGetCourseModulesQuery,
  useGetModuleLessonsQuery,
  useDeleteLessonMutation,
  useGetLessonQuizQuery,
} from '@/state/learningApi';
import {
  FiArrowLeft,
  FiCheckCircle,
  FiPlayCircle,
  FiLock,
  FiUnlock,
  FiBookOpen,
  FiClock,
  FiFileText,
  FiVideo,
  FiHelpCircle,
  FiChevronRight,
  FiChevronLeft,
  FiLoader,
  FiAward,
  FiTrash,
  FiPackage,
  FiEye,
  FiPenTool
} from 'react-icons/fi';
import { MdOutlineQuiz, MdSubtitles } from 'react-icons/md';
import { FaSignLanguage } from 'react-icons/fa';
import Link from 'next/link';
import { TrashIcon, PencilIcon} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { useGetCurrentUserQuery } from '@/state/api';

const LessonPage = () => {
  const params = useParams();
  const router = useRouter();
  const { courseId, moduleId, lessonId } = params as {
    courseId: string;
    moduleId: string;
    lessonId: string;
  };

  const { data: quizArray, isLoading: isLoadingQuiz } = useGetLessonQuizQuery(lessonId as string);
  // Extraire le premier élément du tableau (s'il existe)
  const quiz = Array.isArray(quizArray) && quizArray.length > 0 ? quizArray[0] : null;
  console.log('Quiz data:', quiz?.id); // Debug: Affichez les données du quiz pour vérifier leur structure
  const { 
    data: apiUserData, 
    isLoading:authLoading, 
    isError, 
    refetch: refetchCourse      
   } = useGetCurrentUserQuery();
    
    // Gérer les erreurs de récupération des données utilisateur
    useEffect(() => {
        if (isError) {
            toast.error('Erreur de chargement, vous êtes redirigé vers la page principale');
            router.push('/');
          }
    }, [isError, router]);

  const [showQuiz, setShowQuiz] = useState(false);
  const [showLSF, setShowLSF] = useState(false);

  // Récupérer les détails de la leçon
  const {
    data: lesson,
    isLoading: isLoadingLesson,
    error: lessonError,
  } = useGetLessonByIdQuery(lessonId);

  // Récupérer les détails du cours
  const {
    data: course,
    isLoading: isLoadingCourse,
  } = useGetCourseByIdQuery(courseId);

  // Récupérer toutes les leçons du module pour la navigation
  const {
    data: moduleLessons,
    isLoading: isLoadingLessons,
  } = useGetModuleLessonsQuery(moduleId);

  // Trouver la leçon précédente et suivante
  const findAdjacentLessons = () => {
    if (!moduleLessons || !lesson) return { prev: null, next: null };
    
    const sortedLessons = [...moduleLessons].sort((a, b) => a.lesson_number - b.lesson_number);
    const currentIndex = sortedLessons.findIndex(l => l.id === lessonId);
    
    return {
      prev: currentIndex > 0 ? sortedLessons[currentIndex - 1] : null,
      next: currentIndex < sortedLessons.length - 1 ? sortedLessons[currentIndex + 1] : null
    };
  };

  const { prev, next } = findAdjacentLessons();

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/images/default-course-cover.png';
  };

// Fonction pour extraire l'ID YouTube d'une URL
const extractYouTubeId = (url:any) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

  // Rendu du contenu selon le type
  const renderContent = () => {
    if (!lesson) return null;

    switch (lesson.content_type) {
      case 'video':
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden">
              <video
                src={lesson.video_url}
                controls
                className="w-full h-full"
                poster={lesson.lsf_video_url ? getImageUrl(lesson.lsf_video_url) : undefined}
              >
                {/* {lesson.has_subtitles && (
                  <track kind="subtitles" src={lesson.subtitles_url} srcLang="fr" label="Français" />
                )} */}
              </video>
            </div>
            
            {/* Informations vidéo */}
            {lesson.video_duration > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <FiClock size={16} />
                <span>Durée: {Math.floor(lesson.video_duration / 60)}min {lesson.video_duration % 60}s</span>
              </div>
            )}
          </div>
        );

      case 'text':
        return (
          <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
            <div dangerouslySetInnerHTML={{ __html: lesson.text_content || '' }} />
          </div>
        );

      case 'interactive':
        return (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600">Contenu interactif en cours de chargement...</p>
            {/* Intégrer ici votre composant interactif */}
          </div>
        );

      case 'mixed':
        return (
          <div className="space-y-6">
            {lesson.video_url && (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <video src={lesson.video_url} controls className="w-full h-full" />
              </div>
            )}
            {lesson.text_content && (
              <div className="prose max-w-none bg-gray-50 p-6 rounded-lg">
                <div dangerouslySetInnerHTML={{ __html: lesson.text_content }} />
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-6 rounded-lg">
            <p className="text-gray-600">Type de contenu non supporté</p>
          </div>
        );
    }
  };

const handleEditLesson = () => {
  // ouvrir un modal, rediriger, ou pré-remplir un formulaire
  router.push(`/formation/${courseId}/modules/${moduleId}/lessons/edit/${lessonId}`);
};

const [deleteLesson] = useDeleteLessonMutation();

  const handleDeleteLesson = (lessonId: string) => {

    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette leçon ? Cette action est irréversible.')) {
        try {
        deleteLesson({ id: lessonId, moduleId });
        toast.success('Leçon supprimée avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression de la leçon:', error);
            toast.error('Erreur lors de la suppression de la leçon.');
        }
    }
    };


  // Rendu du quiz
  const renderQuiz = () => {
    if (!lesson) return null;

    if (quiz?.id && lesson && lesson.has_quiz) {
      return (
    <div className="mt-8 border-t pt-6">
      {/* Toggle */}
      <button
        onClick={() => setShowQuiz((prev) => !prev)}
        className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4"
      >
        <MdOutlineQuiz size={24} className="text-yellow-500" />
        Quiz de validation
        <FiChevronRight
          className={`transform transition-transform ${
            showQuiz ? 'rotate-90' : ''
          }`}
        />
      </button>

      {/* Contenu */}
      {showQuiz && (
        <div className="bg-yellow-50 p-6 rounded-lg">
          <div className="mb-4 text-gray-700">
            <span className="font-medium">Points :</span>{' '}
            {lesson.quiz_points ?? 0} |{' '}
            <span className="font-medium">Réussite :</span>{' '}
            {lesson.quiz_pass_percentage ?? 0}%
          </div>

          <button
            onClick={() =>
              router.push(

                `/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/passQuiz`

              )
            }
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors flex items-center"
          >
            Commencer le quiz
          </button>
            <p className="text-sm text-gray-500 mt-2">
                {quiz?.max_attempts} tentative{quiz?.max_attempts > 1 ? 's' : ''} maximum • 
                Note de passage: {quiz?.pass_percentage}% • 
                {quiz?.time_limit_minutes ? ` Temps limité: ${quiz.time_limit_minutes}min` : ' Temps illimité'}
            </p>
        </div>
      )}
    </div>
  );
  }
  // 3️⃣ Quiz existant
  return (
      <div className="bg-yellow-50 p-6 rounded-lg">
        <button
          onClick={() =>
            router.push(
              `/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/create`
            )
          }
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
        >
          Créer un Quiz
        </button>
      </div>
    );
  };

  // États de chargement
  if (isLoadingLesson || isLoadingCourse || isLoadingLessons) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiLoader className="animate-spin text-blue-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600">Chargement de la leçon...</p>
        </div>
      </div>
    );
  }

  // Gestion des erreurs
  if (lessonError || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <FiHelpCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Leçon non trouvée</h2>
          <p className="text-gray-600 mb-6">
            La leçon que vous recherchez n'existe pas ou n'est pas accessible.
          </p>
          <button
            onClick={() => router.push(`/formation/${courseId}`)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retour au cours
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Barre de navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push(`/formation/${courseId}`)}
                // onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Retour"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 line-clamp-1">
                  {course?.title} - {lesson.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1">
                    <FiBookOpen size={14} />
                    {course?.title}
                  </span>
                  <span className="flex items-center gap-1">
                    <FiPlayCircle size={14} />
                    Leçon {lesson.lesson_number}
                  </span>
                  <span className="flex items-center gap-1">
                    {lesson.difficulty === 'debutant' && '👶 Débutant'}
                    {lesson.difficulty === 'intermediaire' && '👍 Intermédiaire'}
                    {lesson.difficulty === 'avance' && '💪 Avancé'}
                  </span>
                </div>
              </div>
            </div>

            {/* Badge de statut (optionnel) */}
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                Leçon {lesson.lesson_number}/{moduleLessons?.length || '?'}
              </span>
              {/* Bouton modifier */}
              <button
                  onClick={() => handleEditLesson()}
                  className="p-1 rounded-full hover:bg-yellow-100 text-yellow-600 transition"
                  title="Modifier la leçon"
              >
              <FiPenTool className="w-5 h-5" />
              </button>

             {/* Bouton supprimer */}
             <button
                 onClick={() => handleDeleteLesson(lesson.id)}
                 className="p-1 rounded-full hover:bg-red-100 text-red-600 transition"
                 title="Supprimer la leçon"
            >
              <FiTrash className="w-5 h-5" />
            </button>

              <button
                 onClick={() =>
              router.push(
                `/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}/Quiz/${quiz?.id}`
              )}
                 className="p-1 rounded-full hover:bg-blue-100 text-blue-600 transition"
                 title="Voir le Quiz"
              >
              <FiEye className="w-5 h-5" />
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale - Contenu */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badges d'accessibilité */}
            <div className="flex flex-wrap items-center gap-4">
              {lesson.has_subtitles && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                  <MdSubtitles size={16} />
                  Sous-titres
                </span>
              )}
              {lesson.has_lsf_translation && lesson.lsf_video_url && (
                <button
                  onClick={() => setShowLSF(!showLSF)}
                  className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
                    showLSF 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                  }`}
                >
                  <FaSignLanguage size={16} />
                  Traduction LSF
                  {showLSF && ' (actif)'}
                </button>
              )}
              {lesson.is_free_preview && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Accès libre
                </span>
              )}
            </div>

            {/* Vidéo LSF si activée showLSF && */}
           {lesson.lsf_video_url && (
              <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <FaSignLanguage className="text-purple-600" />
                   Traduction en Langue des Signes Française
                </h3>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                   src={`https://www.youtube.com/embed/${extractYouTubeId(lesson.lsf_video_url)}`}
                   title="YouTube video player"
                   frameBorder="0"
                   allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                   allowFullScreen
                   className="w-full h-full"
                ></iframe>
              </div>
              </div>
         )}

            {/* Contenu principal de la leçon */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                {/* Description de la leçon */}
                {lesson.description && (
                  <div className="mb-6 pb-6 border-b">
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                    <p className="text-gray-700">{lesson.description}</p>
                  </div>
                )}
                
                {/* Contenu */}
                {renderContent()}

              </div>
            </div>
            {/* Quiz */}
            {renderQuiz()}
          </div>

          {/* Colonne latérale - Navigation */}
          <div className="space-y-6">
            {/* Informations sur la leçon */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Module</span>
                  <span className="font-medium text-gray-900">{course?.title}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Leçon n°</span>
                  <span className="font-medium text-gray-900">{lesson.lesson_number}</span>
                </div>
                {lesson.quiz_points > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Points</span>
                    <span className="font-medium text-yellow-600">{lesson.quiz_points} pts</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Difficulté</span>
                  <span className="font-medium text-gray-900">
                    {lesson.difficulty === 'debutant' && 'Débutant'}
                    {lesson.difficulty === 'intermediaire' && 'Intermédiaire'}
                    {lesson.difficulty === 'avance' && 'Avancé'}
                  </span>
                </div>
                {lesson.created_at && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Créée le</span>
                    <span className="font-medium text-gray-900">
                      {new Date(lesson.created_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation entre leçons */}
            {(prev || next) && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Navigation</h3>
                <div className="space-y-3">
                  {prev && (
                    <Link
                      href={`/formation/${courseId}/modules/${moduleId}/lessons/${prev.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-gray-100"
                    >
                      <FiChevronLeft className="text-gray-400 group-hover:text-blue-600" size={20} />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500">Précédent</p>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
                          {prev.lesson_number}. {prev.title}
                        </p>
                      </div>
                    </Link>
                  )}

                  {next && (
                    <Link
                      href={`/formation/${courseId}/modules/${moduleId}/lessons/${next.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group border border-gray-100"
                    >
                      <div className="flex-1 text-right">
                        <p className="text-xs text-gray-500">Suivant</p>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-1">
                          {next.lesson_number}. {next.title}
                        </p>
                      </div>
                      <FiChevronRight className="text-gray-400 group-hover:text-blue-600" size={20} />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Liste des leçons du module */}
            {moduleLessons && moduleLessons.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Leçons du module</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                  {[...moduleLessons]
                    .sort((a, b) => a.lesson_number - b.lesson_number)
                    .map((l) => (
                      <Link
                        key={l.id}
                        href={`/formation/${courseId}/modules/${moduleId}/lessons/${l.id}`}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                          l.id === lessonId
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          l.id === lessonId
                            ? 'bg-blue-200 text-blue-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {l.lesson_number}
                        </div>
                        <span className="flex-1 text-sm truncate">{l.title}</span>
                        {l.has_quiz && (
                          <MdOutlineQuiz size={14} className="text-yellow-500 flex-shrink-0" />
                        )}
                      </Link>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;