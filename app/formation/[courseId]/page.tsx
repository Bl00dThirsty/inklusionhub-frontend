'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useGetCourseBySlugQuery } from '@/state/learningApi';
import { 
  FiArrowLeft, 
  FiBookOpen, 
  FiClock, 
  FiUsers, 
  FiChevronDown, 
  FiChevronRight,
  FiCheckCircle,
  FiPlayCircle,
  FiEdit
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
}

const CourseDetailPage = () => {
  const { slug } = useParams();
  const router = useRouter();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());
  
  const { data: course, isLoading, error } = useGetCourseBySlugQuery(
    slug as string,
    { skip: !slug }
  );

  // Données simulées pour les modules (à remplacer par votre API)
  const modules: Module[] = [
    {
      id: '1',
      title: 'Introduction à la LSF',
      description: 'Découverte des bases de la Langue des Signes Française',
      order: 1,
      total_points: 100,
      lessons_count: 5,
      lessons: [
        { id: '1', title: 'Histoire de la LSF', description: 'Origines et développement', lesson_number: 1, duration_minutes: 15, is_published: true, has_quiz: false, is_completed: true },
        { id: '2', title: 'Alphabet manuel', description: 'Apprendre à signer les lettres', lesson_number: 2, duration_minutes: 25, is_published: true, has_quiz: true, is_completed: true },
        { id: '3', title: 'Les nombres', description: 'Compter de 0 à 100', lesson_number: 3, duration_minutes: 20, is_published: true, has_quiz: false },
        { id: '4', title: 'Se présenter', description: 'Dire son nom, son âge', lesson_number: 4, duration_minutes: 30, is_published: true, has_quiz: true },
        { id: '5', title: 'Exercice pratique', description: 'Mise en situation', lesson_number: 5, duration_minutes: 40, is_published: true, has_quiz: true },
      ]
    },
    {
      id: '2',
      title: 'Communication quotidienne',
      description: 'Signes essentiels pour la vie de tous les jours',
      order: 2,
      total_points: 150,
      lessons_count: 6,
      lessons: [
        { id: '6', title: 'La famille', description: 'Signes des membres de la famille', lesson_number: 1, duration_minutes: 20, is_published: true, has_quiz: false },
        { id: '7', title: 'Les émotions', description: 'Exprimer ses sentiments', lesson_number: 2, duration_minutes: 25, is_published: true, has_quiz: true },
      ]
    }
  ];

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId);
    } else {
      newExpanded.add(moduleId);
    }
    setExpandedModules(newExpanded);
  };

  const handleLessonClick = (lessonId: string) => {
    router.push(`/courses/${slug}/lessons/${lessonId}`);
  };

  const handleEditCourse = () => {
    router.push(`/courses/edit/${course?.id}`);
  };

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
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Cours non trouvé</p>
            <button
              onClick={() => router.back()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Retour
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = modules.flatMap(m => m.lessons).filter(l => l.is_completed).length;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="mr-2" />
              Retour aux cours
            </button>
            
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                course.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {course.is_published ? 'Publié' : 'Brouillon'}
              </span>
              <button
                onClick={handleEditCourse}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiEdit className="mr-2" />
                Modifier
              </button>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            {course.subtitle && (
              <p className="text-xl text-gray-600 mt-2">{course.subtitle}</p>
            )}
            
            <div className="flex flex-wrap gap-4 mt-4">
              <div className="flex items-center text-gray-600">
                <FiBookOpen className="mr-2" />
                <span className="font-medium">{modules.length} modules</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiClock className="mr-2" />
                <span className="font-medium">{course.estimated_total_hours}h</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FiUsers className="mr-2" />
                <span className="font-medium">{course.enrolled_count || 0} apprenants</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne gauche - Contenu du cours */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description du cours</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">{course.short_description}</p>
                <p className="text-gray-700">{course.description}</p>
              </div>
            </div>

            {/* Modules et leçons */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Contenu du cours</h2>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-gray-600">
                    {totalLessons} leçons • {progress}% complété
                  </p>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Liste des modules */}
              <div className="divide-y divide-gray-200">
                {modules.sort((a, b) => a.order - b.order).map((module) => {
                  const isExpanded = expandedModules.has(module.id);
                  const moduleCompletedLessons = module.lessons.filter(l => l.is_completed).length;
                  const moduleProgress = module.lessons.length > 0 
                    ? Math.round((moduleCompletedLessons / module.lessons.length) * 100) 
                    : 0;

                  return (
                    <div key={module.id} className="transition-colors hover:bg-gray-50">
                      {/* En-tête du module */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full p-6 flex items-center justify-between text-left"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-bold">{module.order}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {module.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">{module.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{module.lessons.length} leçons</span>
                              <span>{module.total_points} points</span>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-600 h-1.5 rounded-full"
                                    style={{ width: `${moduleProgress}%` }}
                                  ></div>
                                </div>
                                <span>{moduleProgress}%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400">
                            {isExpanded ? <FiChevronDown size={24} /> : <FiChevronRight size={24} />}
                          </span>
                        </div>
                      </button>

                      {/* Leçons du module (déroulées) */}
                      {isExpanded && (
                        <div className="px-6 pb-6">
                          <div className="ml-16 space-y-3">
                            {module.lessons.sort((a, b) => a.lesson_number - b.lesson_number).map((lesson) => (
                              <div
                                key={lesson.id}
                                onClick={() => handleLessonClick(lesson.id)}
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
                                          <MdOutlineQuiz className="text-yellow-500" size={16} />
                                        )}
                                      </div>
                                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500">
                                      {lesson.duration_minutes} min
                                    </span>
                                    {!lesson.is_published && (
                                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                                        Brouillon
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Colonne droite - Informations */}
          <div className="space-y-6">
            {/* Image du cours */}
            {course.cover_image && (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <img
                  src={course.cover_image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            )}

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">Progression</span>
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
                    <div className="text-2xl font-bold text-blue-600">{totalLessons}</div>
                    <div className="text-sm text-gray-600">Leçons</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{completedLessons}</div>
                    <div className="text-sm text-gray-600">Terminées</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Informations */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 block">Difficulté</span>
                  <span className="font-medium">{course.difficulty}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Langue</span>
                  <span className="font-medium">{course.language}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Durée estimée</span>
                  <span className="font-medium">{course.estimated_total_hours} heures</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">Gratuit</span>
                  <span className="font-medium">{course.is_free ? 'Oui' : 'Non'}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600 block">En vedette</span>
                  <span className="font-medium">{course.is_featured ? 'Oui' : 'Non'}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Publier le cours
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  Prévisualiser
                </button>
                <button className="w-full px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                  Supprimer le cours
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;