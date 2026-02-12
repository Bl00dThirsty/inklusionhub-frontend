'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCourseBySlugQuery } from '@/state/learningApi';
import CourseEnrollmentButton from '../../../Components/Formation/CourseEnrollmentButton';
import { useAuth } from '../../../Components/hooks/useAuth';
import { getThumbnailUrl, getCoverImageUrl } from '../../../Components/utils/imageHelpers';
import { useGetCourseByIdQuery, usePublishCourseMutation, 
    useUnpublishCourseMutation, useDeleteCourseMutation, 
    useDeleteModuleMutation, useGetCourseModulesQuery,   useGetModuleLessonsQuery,
      } from '@/state/learningApi';
import { 
  FiClock, 
  FiUsers, 
  FiBookOpen, 
  FiChevronRight,
  FiChevronDown,
  FiStar,
  FiCheckCircle,
  FiPlayCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { MdOutlineQuiz } from 'react-icons/md';

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
  title: string;
  description: string;
  lesson_number: number;
  duration_minutes: number;
  is_published: boolean;
  has_quiz: boolean;
  is_completed?: boolean;
  created_at: string;
}

const CoursePublicPage = () => {
  const { slug } = useParams() as { slug: string };
  const { courseId } = useParams()  as { courseId:string };
  const router = useRouter();
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  
  // const { data: course, isLoading, error } = useGetCourseBySlugQuery(
  //   slug as string,
  //   { skip: !slug }
  // );

   const { data: course, isLoading, error, refetch } = useGetCourseByIdQuery(
      courseId  );

  //  const { data: course, isLoading, error, refetch } = useGetCourseBySlugQuery(
  //   slug  );

  const { 
    data: modulesData, 
    isLoading: isLoadingModules, 
    error: modulesError,
    refetch: refetchModules 
  } = useGetCourseModulesQuery(
    courseId as string,
    { skip: !courseId }
  );
 
   const modules: Module[] = (modulesData || []).map((apiModule: any) => ({
    ...apiModule,
    lessons_count: apiModule.lessons_count ?? apiModule.lessons?.length ?? 0,
    lessons: apiModule.lessons || [],
  }));
  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const getImageUrl = (path: string | undefined) => {
    if (!path) return '/images/default-course-cover.png';
    const filename = path.split('/').pop() || '';
    const baseUrl = process.env.NEXT_PUBLIC_LEARNING_API_URL || 'http://localhost:8002';
    return `${baseUrl}/media/courses/covers/${filename}`;
  };

  if (isLoading || isLoadingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-3/4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Cours non trouvé</h2>
            <p className="text-red-600 mb-4">
              Le cours que vous cherchez n'existe pas ou a été supprimé.
            </p>
            <button
              onClick={() => router.push('/formation')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Retour aux cours
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si le cours n'est pas publié et l'utilisateur n'est pas admin
  if (!course.is_published) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center">
            <FiClock className="mx-auto text-yellow-500 mb-4" size={48} />
            <h2 className="text-2xl font-bold text-yellow-800 mb-2">Cours en préparation</h2>
            <p className="text-yellow-600 mb-6">
              Ce cours n'est pas encore disponible. Revenez bientôt !
            </p>
            <button
              onClick={() => router.push('/formation')}
              className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Découvrir d'autres cours
            </button>
          </div>
        </div>
      </div>
    );
  }

  const thumbnailUrl = getThumbnailUrl(course.thumbnail);
  const coverImageUrl = getCoverImageUrl(course.cover_image);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/formation')}
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <FiArrowLeft className="mr-2" />
            Retour aux cours
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Contenu */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-white/20 rounded-full text-sm capitalize">
                  {course.difficulty}
                </span>
                {course.is_free && (
                  <span className="px-3 py-1 bg-green-500 rounded-full text-sm">
                    Gratuit
                  </span>
                )}
                {course.is_featured && (
                  <span className="px-3 py-1 bg-yellow-500 rounded-full text-sm flex items-center">
                    <FiStar className="mr-1" size={12} /> Vedette
                  </span>
                )}
              </div>
              
              <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
              
              {course.subtitle && (
                <p className="text-xl text-blue-100 mb-6">{course.subtitle}</p>
              )}
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center">
                  <FiClock className="mr-2" />
                  <span>{course.estimated_total_hours || 0}h</span>
                </div>
                <div className="flex items-center">
                  <FiUsers className="mr-2" />
                  <span>{course.enrolled_count || 0} apprenants</span>
                </div>
                <div className="flex items-center">
                  <FiBookOpen className="mr-2" />
                  <span>{course.stats.module_count || 0} modules</span>
                </div>
              </div>
              
              {/* Bouton d'inscription */}
              <div className="space-y-4">
                <CourseEnrollmentButton 
                  course={{
                    id: course.id,
                    slug: course.slug,
                    title: course.title,
                    is_published: course.is_published,
                    is_free: course.is_free,
                    enrolled_count: course.enrolled_count
                  }}
                  userProfile={user}
                  variant="secondary"
                  size="lg"
                />
                
                {!user && (
                  <p className="text-sm text-blue-200">
                    Connectez-vous pour commencer l'apprentissage
                  </p>
                )}
              </div>
            </div>
            
            {/* Image */}
            {coverImageUrl && (
              <div className="relative">
                <img
                  src={coverImageUrl}
                  alt={course.title}
                  className="rounded-xl shadow-2xl w-full h-64 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-course-cover.png';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu détaillé */}
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne principale */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">À propos de ce cours</h2>
              <div className="prose max-w-none">
                <p className="text-lg text-gray-700 mb-4">{course.short_description}</p>
                <p className="text-gray-600">{course.description}</p>
              </div>
            </section>

            {/* Objectifs d'apprentissage */}
            {course.learning_outcomes && course.learning_outcomes.length > 0 && (
              <section className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce que vous apprendrez</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.learning_outcomes.map((outcome: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <FiCheckCircle className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{outcome}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Contenu du cours */}
            <section className="bg-white rounded-xl shadow p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contenu du cours</h2>
              
              {/* Modules */}
              <div className="space-y-4">
                {modules?.map((module: any, index: number) => {
                  const isExpanded = expandedModules.has(module.id);
                  const moduleLessons = module.lessons || [];
                  
                  return (
                    <div key={module.id} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-4 bg-gray-50 hover:bg-gray-100 flex items-center justify-between text-left transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mr-4">
                            {module.order || index + 1}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{module.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {module.lessons_count || moduleLessons.length} leçons • {module.estimated_hours || 0}h
                            </p>
                          </div>
                        </div>
                        <FiChevronRight 
                          className={`transform transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`} 
                        />
                      </button>
                      
                      {isExpanded && moduleLessons.length > 0 && (
                        <div className="border-t border-gray-200 p-4 bg-white">
                          {moduleLessons
                            .sort((a: any, b: any) => a.lesson_number - b.lesson_number)
                            .map((lesson: any) => (
                              <div key={lesson.id} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                                <div className="flex items-center flex-1">
                                  {lesson.is_completed ? (
                                    <FiCheckCircle className="text-green-500 mr-3" size={18} />
                                  ) : (
                                    <FiPlayCircle className="text-gray-400 mr-3" size={18} />
                                  )}
                                  <div>
                                    <div className="font-medium text-gray-900 flex items-center gap-2">
                                      {lesson.lesson_number}. {lesson.title}
                                      {lesson.has_quiz && (
                                        <MdOutlineQuiz className="text-yellow-500" size={14} title="Contient un quiz" />
                                      )}
                                    </div>
                                    {lesson.description && (
                                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                    )}
                                  </div>
                                </div>
                                {lesson.duration_minutes && (
                                  <span className="text-sm text-gray-500 ml-4">
                                    {lesson.duration_minutes} min
                                  </span>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {/* Statistiques du cours */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{course.enrolled_count || 0}</div>
                    <div className="text-sm text-gray-600">Apprenants</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{course.completion_rate || 0}%</div>
                    <div className="text-sm text-gray-600">Complétion</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{course.estimated_total_hours || 0}</div>
                    <div className="text-sm text-gray-600">Heures</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{course.total_points_available || 0}</div>
                    <div className="text-sm text-gray-600">Points</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Prérequis */}
            {course.prerequisites && (
              <section className="bg-white rounded-xl shadow p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Prérequis</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700">{course.prerequisites}</p>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cartouche d'inscription */}
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {course.is_free ? 'Gratuit' : 'Accès Premium'}
                </div>
                {!course.is_free && (
                  <div className="text-sm text-gray-500">
                    Accès à vie • Certificat inclus
                  </div>
                )}
              </div>
              
              <CourseEnrollmentButton 
                course={{
                  id: course.id,
                  slug: course.slug,
                  title: course.title,
                  is_published: course.is_published,
                  is_free: course.is_free,
                  enrolled_count: course.enrolled_count
                }}
                userProfile={user}
                variant="primary"
                size="md"
              />
              
              <div className="mt-6 space-y-3 text-sm">
                <div className="flex items-center text-gray-600">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>Accès à vie au contenu</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>Certificat de complétion</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                  <span>Support communautaire</span>
                </div>
                {course.is_free && (
                  <div className="flex items-center text-gray-600">
                    <FiCheckCircle className="text-green-500 mr-3 flex-shrink-0" />
                    <span>100% gratuit</span>
                  </div>
                )}
              </div>
            </div>

            {/* Miniature */}
            {thumbnailUrl && (
              <div className="bg-white rounded-xl shadow p-4">
                <img
                  src={thumbnailUrl}
                  alt={course.title}
                  className="rounded-lg w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-course-thumbnail.png';
                  }}
                />
              </div>
            )}

            {/* Informations du cours */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 block">Difficulté</span>
                  <span className="font-medium capitalize">{course.difficulty}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Langue</span>
                  <span className="font-medium">
                    {course.language === 'lsf' ? 'Langue des Signes Française' : 
                     course.language === 'bilingue' ? 'Bilingue FR/LSF' : 
                     'Multilingue'}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Durée estimée</span>
                  <span className="font-medium">{course.estimated_total_hours || 0} heures</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Date de publication</span>
                  <span className="font-medium">
                    {course.published_at ? new Date(course.published_at).toLocaleDateString('fr-FR') : 'Non publié'}
                  </span>
                </div>
              </div>
            </div>

            {/* Partager */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Partager ce cours</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Lien copié dans le presse-papier !');
                  }}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                >
                  Copier le lien
                </button>
                <button
                  onClick={() => window.open(`https://twitter.com/intent/tweet?url=${window.location.href}&text=${course.title}`, '_blank')}
                  className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  𝕏
                </button>
                <button
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}
                  className="px-3 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
                >
                  f
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePublicPage;