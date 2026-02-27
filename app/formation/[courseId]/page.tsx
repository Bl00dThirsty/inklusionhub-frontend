'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCourseByIdQuery, usePublishCourseMutation, 
    useUnpublishCourseMutation, useDeleteCourseMutation, 
    useDeleteModuleMutation, useGetCourseModulesQuery,   useGetModuleLessonsQuery,
      } from '@/state/learningApi';
import { 
  FiArrowLeft, 
  FiBookOpen, 
  FiClock, 
  FiUsers, 
  FiChevronDown, 
  FiChevronRight,
  FiCheckCircle,
  FiPlayCircle,
  FiEdit,
  FiPlus,
  FiTrash2,
  FiEye,
  FiLoader,
  FiChevronUp
} from 'react-icons/fi';
import { MdOutlineQuiz } from 'react-icons/md';
import { useGetCurrentUserQuery} from '@/state/api';
import { toast } from 'sonner';
import { getThumbnailUrl, getCoverImageUrl } from '../../Components/utils/imageHelpers';

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

const CourseDetailPage = () => {
  const { courseId } = useParams()  as { courseId:string }; // Changé de 'slug' à 'courseId'
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
   // État pour stocker les leçons de chaque module
  const [moduleLessons, setModuleLessons] = useState<Record<string, Lesson[]>>({});
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
  
  
  // Utilisation de l'endpoint getCourseById avec l'ID
  const { data: course, isLoading, error, refetch } = useGetCourseByIdQuery(
    courseId  );

const { 
  data: modulesData, 
  isLoading: isLoadingModules, 
  error: modulesError,
  refetch: refetchModules 
} = useGetCourseModulesQuery(
  courseId as string,
  { skip: !courseId }
);

  // Mutations
  const [publishCourse, { isLoading: isPublishing }] = usePublishCourseMutation();
  const [unpublishCourse, { isLoading: isUnpublishing }] = useUnpublishCourseMutation();

  //DELETE
    const [deleteCourse] = useDeleteCourseMutation();

    // Utilisez les données réelles de l'API et transformez-les pour correspondre à l'interface Module
  const modules: Module[] = (modulesData || []).map((apiModule: any) => ({
    ...apiModule,
    lessons_count: apiModule.lessons_count ?? moduleLessons[apiModule.id]?.length ?? 0,
    lessons: moduleLessons[apiModule.id] || [],
  }));

   // Hook pour charger les leçons quand un module est expandé
  const ModuleLessonsLoader = ({ moduleId, isExpanded }: { moduleId: string, isExpanded: boolean }) => {
    const { data: lessons, isLoading } = useGetModuleLessonsQuery(moduleId, {
      skip: !isExpanded, // Ne charger que si le module est expandé
    });

    useEffect(() => {
  if (!isExpanded || !lessons) return;

  setModuleLessons((prev) => {
    // 🔍 Compare pour éviter la boucle
    const current = prev[moduleId];
    const isSame =
      current &&
      Array.isArray(current) &&
      current.length === lessons.length &&
      current.every((l, i) => l.id === lessons[i].id);

    // Si les leçons n’ont pas réellement changé, on ne met pas à jour
    if (isSame) return prev;

    return { ...prev, [moduleId]: lessons };
  });
}, [lessons, moduleId, isExpanded]);

    if (isLoading && isExpanded) {
      return (
        <div className="mt-2 ml-16 text-gray-500 flex items-center gap-2">
          <FiLoader className="animate-spin" size={16} />
          <span className="text-sm">Chargement des leçons...</span>
        </div>
      );
    }

    return null;
  };

   // Fonction pour rafraîchir les leçons d'un module
  const refreshModuleLessons = (moduleId: string) => {
    // Invalider le cache pour ce module
    setModuleLessons(prev => {
      const newState = { ...prev };
      delete newState[moduleId];
      return newState;
    });
  };
  
  // Calculer la progression basée sur les données réelles
  const totalLessons = modules.reduce((acc, module) => acc + (module.lessons_count || 0), 0);
  const completedLessons = modules.reduce((acc, module) => {
    // Si vous avez un champ pour les leçons complétées, ajustez ici
    return acc + (module.lessons?.filter(l => l.is_completed).length || 0);
  }, 0);
  
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleEditModule = (moduleId: string) => {
    router.push(`/formation/${courseId}/modules/edit/${moduleId}`);
  };

  const handleLessonClick = (lessonId: string, moduleId: string) => {
    router.push(`/formation/${courseId}/modules/${moduleId}/lessons/${lessonId}`);
  };

  const handleAddLesson = (moduleId: string) => {  
    router.push(`/formation/${courseId}/modules/${moduleId}/lessons/create`);   
  };

  const handleEditCourse = () => {
    router.push(`/formation/edit/${courseId}`);
  };

  const handleAddModule = () => {
    router.push(`/formation/${courseId}/modules/create`);
  };

  const [deleteModule] = useDeleteModuleMutation();

  const handleDeleteModule = (moduleId: string) => {

    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.')) {
        try {
        deleteModule({ id: moduleId, courseId });
        toast.success('Module supprimé avec succès.');
        } catch (error) {
            console.error('Erreur lors de la suppression du module:', error);
            toast.error('Erreur lors de la suppression du module.');
        }
    }
    };

  const handleDeleteCourse = () => {
    if (!courseId) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce cours ? Cette action est irréversible.')) {
      try {
    deleteCourse(courseId);
      router.push('/formation');
      toast.success('Cours supprimé avec succès.');
      } catch (error) {
        console.error('Erreur lors de la suppression du cours:', error);
        toast.error('Erreur lors de la suppression du cours.');
      }
    }
  };

  const handlePreviewCourse = () => {
    // Pour prévisualiser, on utilise le slug si disponible, sinon l'ID
    const previewPath = course?.slug 
      ? `/preview/${course.slug}`
      : `/preview/course/${courseId}`;
    router.push(previewPath);
  };

  const handlePublishCourse = async () => {
    if (!courseId) return;
    
    const action = course?.is_published ? 'dépublier' : 'publier';
    
    if (window.confirm(`Voulez-vous ${action} ce cours ?`)) {
        
      try {
        if (course?.is_published) {
          // Dépublier le cours
          await unpublishCourse(courseId).unwrap();
        } else {
          // Publier le cours
          await publishCourse(courseId).unwrap();
        }
        
        // Recharger les données
        refetchCourse();
        
        // Afficher un toast de succès
        // Vous pouvez utiliser react-hot-toast, sonner, ou un autre système de notification
        alert(`Cours ${action === 'publier' ? 'publié' : 'dépublié'} avec succès !`);
        
      } catch (error) {
        console.error(`Erreur lors de l'${action} du cours:`, error);
        
        // Afficher un message d'erreur
        alert(`Erreur lors de l'${action} du cours. Veuillez réessayer.`);
      }
    }
  };

  // Version optimisée avec gestion d'état de chargement
  const handlePublishCourseOptimized = async () => {
    if (!courseId || isPublishing || isUnpublishing) return;
    
    const action = course?.is_published ? 'dépublier' : 'publier';
    const confirmationMessage = course?.is_published 
      ? 'Voulez-vous dépublier ce cours ? Les apprenants ne pourront plus y accéder.'
      : 'Voulez-vous publier ce cours ? Il sera accessible aux apprenants.';
    
    if (window.confirm(confirmationMessage)) {
      try {
        if (course?.is_published) {
          await unpublishCourse(courseId).unwrap();
        } else {
          await publishCourse(courseId).unwrap();
        }
        
        // Les tags invalidés vont automatiquement recharger les données
        // Vous pouvez aussi utiliser refetch() si nécessaire
        
      } catch (error: any) {
        const errorMessage = error?.data?.detail 
          || error?.data?.message 
          || `Erreur lors de l'${action} du cours`;
        
        alert(`❌ ${errorMessage}`);
      }
    }
  };
  const thumbnailUrl = getThumbnailUrl(course?.thumbnail);
  const coverUrl = getCoverImageUrl(course?.cover_image);



  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">Cours non trouvé</h3>
            <p className="text-red-600 mb-4">
              Le cours avec l'ID "{courseId}" n'existe pas ou vous n'avez pas les permissions pour y accéder.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FiArrowLeft className="inline mr-2" />
                Retour
              </button>
              <button
                onClick={() => router.push('/courses')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Voir tous les cours
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

//   const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
//   const completedLessons = modules.flatMap(m => m.lessons).filter(l => l.is_completed).length;
//   const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/formation')}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Retour aux cours
            </button>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreviewCourse}
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <FiEye className="mr-2" />
                Prévisualiser
              </button>
              
              <button
                onClick={handleEditCourse}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiEdit className="mr-2" />
                Modifier
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Informations principales */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  course.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {course.is_published ? 'Publié' : 'Brouillon'}
                </span>
                {course.is_featured && (
                  <span className="px-3 py-1 text-sm font-medium bg-pink-100 text-pink-800 rounded-full">
                    En vedette
                  </span>
                )}
                {course.is_free && (
                  <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full">
                    Gratuit
                  </span>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
              
              {course.subtitle && (
                <p className="text-xl text-gray-600 mt-2">{course.subtitle}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center text-gray-600">
                  <FiBookOpen className="mr-2" />
                  <span className="font-medium">{modules.length} modules</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiClock className="mr-2" />
                  <span className="font-medium">{course.estimated_total_hours || 0}h</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiUsers className="mr-2" />
                  <span className="font-medium">{course.enrolled_count || 0} apprenants</span>
                </div>
                <div className="text-gray-500 text-sm">
                  ID: <code className="bg-gray-100 px-2 py-1 rounded">{courseId}</code>
                </div>
              </div>
            </div>

            {/* Miniature */}
            {course.thumbnail && (
              <div className="flex-shrink-0">
                <img
                  src={thumbnailUrl}
                  alt={course.title}
                  className="w-32 h-32 object-cover rounded-lg shadow"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Contenu du cours */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du cours</h2>
              <div className="prose max-w-none space-y-4">
                <p className="text-gray-700">{course.short_description}</p>
                <p className="text-gray-700">{course.description}</p>
                
                {course.prerequisites && (
                  <div className="mt-6">
                    <h3 className="font-medium text-gray-900 mb-2 font-semibold">Prérequis</h3>
                    <p className="text-gray-700">{course.prerequisites}</p>
                  </div>
                )}
              </div>
            </div>

           {/* Gestion des modules - Section mise à jour */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Modules et leçons</h2>
                  <p className="text-gray-600 mt-1">
                    {isLoadingModules ? (
                      <span className="inline-flex items-center">
                        <FiLoader className="animate-spin mr-2" size={14} />
                        Chargement des modules...
                      </span>
                    ) : (
                      `${modules.length} modules • ${totalLessons} leçons • ${progress}% complété`
                    )}
                  </p>
                </div>
                <button
                  onClick={handleAddModule}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiPlus className="mr-2" />
                  Ajouter un module
                </button>
              </div>

              {/* Liste des modules */}
              <div className="divide-y divide-gray-200">
                {isLoadingModules ? (
                  <div className="p-8 text-center">
                    <FiLoader className="mx-auto animate-spin text-blue-600 mb-4" size={32} />
                    <p className="text-gray-600">Chargement des modules...</p>
                  </div>
                ) : modulesError ? (
                  <div className="p-8 text-center">
                    <div className="text-red-500 mb-4">❌</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
                    <p className="text-gray-600 mb-4">
                      Impossible de charger les modules. 
                      <button 
                        onClick={() => refetchModules()}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        Réessayer
                      </button>
                    </p>
                  </div>
                ) : modules.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiBookOpen className="mx-auto text-gray-400 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun module</h3>
                    <p className="text-gray-600 mb-4">Commencez par ajouter votre premier module.</p>
                    <button
                      onClick={handleAddModule}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      <FiPlus className="mr-2" />
                      Créer un module
                    </button>
                  </div>
                ) : (
                  modules.sort((a, b) => a.order - b.order).map((module) => {
                    const isExpanded = expandedModules.has(module.id);
                    // Calculer la progression du module
                    const moduleLessons = module.lessons || [];
                    const moduleCompletedLessons = moduleLessons.filter(l => l.is_completed).length;
                    const moduleProgress = moduleLessons.length > 0 
                      ? Math.round((moduleCompletedLessons / moduleLessons.length) * 100) 
                      : 0;

                    const sortedLessons = [...moduleLessons].sort((a, b) => a.lesson_number - b.lesson_number);

                    return (
                      <div key={module.id} className="transition-colors hover:bg-gray-50">
                        <ModuleLessonsLoader moduleId={module.id} isExpanded={isExpanded} />
                        {/* En-tête du module */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-start gap-4 flex-1">
                              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">{module.order}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                      {module.title}
                                    </h3>
                                    {module.description && (
                                      <p className="text-gray-600 text-sm">{module.description}</p>
                                    )}
                                  </div>
                                  <button
                                    onClick={() => toggleModule(module.id)}
                                    className="text-gray-400 hover:text-gray-600 ml-4"
                                    title={isExpanded ? "Réduire" : "Développer"}
                                  >
                                    {isExpanded ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                                  </button>
                                </div>
                                
                                {/* Métadonnées du module */}
                                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <FiBookOpen size={14} />
                                    {module.lessons_count || moduleLessons.length} leçons
                                  </span>
                                  <span>{module.total_points} points</span>
                                  {module.estimated_hours && (
                                    <span className="flex items-center gap-1">
                                      <FiClock size={14} />
                                      {module.estimated_hours}h
                                    </span>
                                  )}
                                  {moduleLessons.length > 0 && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                        <div 
                                          className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                                          style={{ width: `${moduleProgress}%` }}
                                        ></div>
                                      </div>
                                      <span>{moduleProgress}%</span>
                                    </div>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    Créé le {formatDate(module.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Actions du module */}
                          <div className="ml-16 mt-4 flex gap-2">
                            <button
                              onClick={() => handleEditModule(module.id)}
                              className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors"
                            >
                              Éditer
                            </button>
                            <button
                              onClick={() => handleDeleteModule(module.id)}
                              className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 transition-colors"
                            >
                              Supprimer
                            </button>
                            <button
                              onClick={() => handleAddLesson(module.id)}
                              className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors"
                            >
                              Ajouter une leçon
                            </button>
                          </div>

                          {/* Leçons du module (déroulées) */}
                          {isExpanded && (
                            <div className="mt-6 ml-16 space-y-3">
                              {moduleLessons.length === 0 ? (
                                <div className="p-4 text-center border border-gray-200 rounded-lg">
                                  <p className="text-gray-500">Aucune leçon dans ce module.</p>
                                  <button
                                    onClick={() => handleAddLesson(module.id)}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                  >
                                    Ajouter une première leçon
                                  </button>
                                </div>
                              ) : (
                                sortedLessons.map((lesson) => (
                                    <div
                                      key={lesson.id}
                                      onClick={() => handleLessonClick(lesson.id, module.id)}
                                      className="group p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-all"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="flex-shrink-0">
                                            {lesson.is_completed ? (
                                              <FiCheckCircle className="text-green-500" size={20} />
                                            ) : (
                                              <FiPlayCircle className="text-gray-400 group-hover:text-blue-500" size={20} />
                                            )}
                                          </div>
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                                                {lesson.lesson_number}. {lesson.title}
                                              </h4>
                                              {lesson.has_quiz && (
                                                <MdOutlineQuiz className="text-yellow-500" size={16} title="Contient un quiz" />
                                              )}
                                              {/* {!lesson.is_published && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                                  Brouillon
                                                </span>
                                              )} */}
                                            </div>
                                            {lesson.description && (
                                              <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                            )}
                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                                              {/* {lesson.duration_minutes && (
                                                <span>{lesson.duration_minutes} min</span>
                                              )} */}
                                              <span>Créé le {formatDate(lesson.created_at)}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-gray-400 group-hover:text-gray-600">
                                          <FiChevronRight />
                                        </div>
                                      </div>
                                    </div>
                                  ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Colonne droite - Informations et actions */}
          <div className="space-y-6">
            {/* Actions principales */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button
                    onClick={handlePublishCourse}
                    disabled={isPublishing || isUnpublishing}
                    className={`w-full px-4 py-2 rounded-lg transition-colors flex items-center justify-center ${
                    course?.is_published
                      ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                >
                {(isPublishing || isUnpublishing) ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 {course?.is_published ? 'Dépublication...' : 'Publication...'}
                </>
               ) : (
               <>
                 {course?.is_published ? 'Dépublier le cours' : 'Publier le cours'}
               </>
              )}
              </button>
                
                <button
                  onClick={handleEditCourse}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiEdit className="inline mr-2" />
                  Modifier les détails
                </button>
                
                <button
                  onClick={handleAddModule}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <FiPlus className="inline mr-2" />
                  Ajouter un module
                </button>
                
                <button
                  onClick={handleDeleteCourse}
                  className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <FiTrash2 className="inline mr-2" />
                  Supprimer le cours
                </button>
              </div>
            </div>

            {/* Informations du cours */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-gray-600 block">ID du cours</span>
                  <code className="font-mono text-sm bg-gray-100 px-2 py-1 rounded block truncate">
                    {courseId}
                  </code>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block">Difficulté</span>
                  <span className="font-medium capitalize">{course.difficulty}</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block">Langue</span>
                  <span className="font-medium">
                    {course.language === 'lsf' ? 'LSF' : 
                     course.language === 'bilingue' ? 'Bilingue FR/LSF' : 
                     'Multilingue'}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block">Durée</span>
                  <span className="font-medium">{course.estimated_total_hours || 0} heures</span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600 block">Date de création</span>
                  <span className="font-medium">{formatDate(course.created_at)}</span>
                </div>
                
                {course.published_at && (
                  <div>
                    <span className="text-sm text-gray-600 block">Date de publication</span>
                    <span className="font-medium">{formatDate(course.published_at)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Progression globale</span>
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{modules.length}</div>
                    <div className="text-sm text-gray-600">Modules</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{totalLessons}</div>
                    <div className="text-sm text-gray-600">Leçons</div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">Apprenants inscrits</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {course.enrolled_count || 0}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;