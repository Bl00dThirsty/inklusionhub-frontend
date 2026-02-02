'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGetCoursesQuery } from '@/state/learningApi';
// import { Course, PaginatedResponse } from '@/types/learning';
import { FiSearch, FiFilter, FiEye, FiEdit, FiPlus } from 'react-icons/fi';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { useGetCurrentUserQuery} from '@/state/api';
import { toast } from 'sonner';
import DashboardHeader from '../Components/DashboardHeader';

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  description: string;
  short_description: string;
  thumbnail?: string;
  cover_image?: string;
  promo_video_url?: string;
  difficulty: 'debutant' | 'intermediaire' | 'avance' | 'expert';
  language: 'lsf' | 'bilingue' | 'multilingue';
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  estimated_total_hours: number;
  total_points_available: number;
  is_published: boolean;
  is_featured: boolean;
  is_free: boolean;
  enrolled_count: number;
  lesson_count: number;
  module_count: number;
  created_at: string;
  updated_at: string;
}

interface UserData {
  id: string;
  name: string;
  forename: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  onboarding_completed: boolean;
}

const CourseListPage = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [language, setLanguage] = useState('');


  ///####### user data fetch and avatar handling/////######
  const { 
          data: apiUserData, 
          isLoading:authLoading, 
          isError, 
         
          
      } = useGetCurrentUserQuery();
  
      // Gérer les erreurs de récupération des données utilisateur
      useEffect(() => {
        if (isError) {
          toast.error('Erreur de chargement, vous êtes redirigé vers la page principale');
          router.push('/');
        }
      }, [isError, router]);
  
  
      const [userData, setUserData] = useState<UserData>({
          id: '',
          name: '',
          forename: '',
          email: '',
          role: 'malentendant',
          phone: '',
          avatar: '',
          onboarding_completed: false,
      });
  
      const [userLoaded, setUserLoaded] = useState(false);
  
  
      // Mettre à jour les données utilisateur
    useEffect(() => {
     if (apiUserData) {
      let user;
  
      if (apiUserData.user) {
        user = apiUserData.user;
      } else if (apiUserData.id) {
        user = apiUserData;
      } else {
        console.error("Structure API inattendue:", apiUserData);
        return;
      }
  
      setUserData({
        id: user.id || '',
        name: user.name || '',
        forename: user.forename || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        onboarding_completed: user.onboarding_completed || false,
      });
  
      setUserLoaded(true); // ✅ IMPORTANT
    }
  }, [apiUserData]);
  
        // Fonction pour obtenir l'URL de l'avatar
        const getAvatarUrl = (avatarPath: string | undefined): string => {
          if (!avatarPath) return '';
          const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
          const filename = avatarPath.split('/').pop() || '';
          return `${baseUrl}/avatars/${filename}`;
        };
      
        const avatarUrl = getAvatarUrl(userData.avatar);
    
        // Fonction pour obtenir les initiales
        const getInitials = (name: string) => {
        if (!name) return '??';
        return name
          .split(' ')
          .map(part => part[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
      };
//////########===========###########////////
  
  const { data, isLoading, error, refetch } = useGetCoursesQuery({
    page,
    pageSize,
    search,
    difficulty: difficulty || undefined,
    language: language || undefined,
  });

  const courses = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const handleViewCourse = (courseSlug: string) => {
    router.push(`/courses/${courseSlug}`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/courses/${courseId}/edit`);
  };

  const handleCreateCourse = () => {
    router.push('/courses/create_course');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-700">Erreur lors du chargement des cours</p>
            <button
              onClick={() => refetch()}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <DashboardHeader 
                    userName={`${userData.name} ${getInitials(userData.forename)}.`}
                    userRole={userData.role}
                    userEmail={userData.email}
                    userAvatar={avatarUrl}
        />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Cours</h1>
              <p className="text-gray-600 mt-2">
                Gérez et organisez tous les cours de la plateforme
              </p>
            </div>
            <button
              onClick={handleCreateCourse}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Nouveau cours
            </button>
          </div>

          {/* Filtres */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Barre de recherche */}
              <div className="md:col-span-2">
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un cours..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filtre difficulté */}
              <div>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tous les niveaux</option>
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              {/* Filtre langue */}
              <div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Toutes les langues</option>
                  <option value="lsf">LSF</option>
                  <option value="bilingue">Bilingue</option>
                  <option value="multilingue">Multilingue</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des cours */}
        <div className="space-y-4">
          {courses.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun cours trouvé</h3>
              <p className="text-gray-600 mb-4">
                {search ? 'Aucun cours ne correspond à votre recherche.' : 'Commencez par créer votre premier cours.'}
              </p>
              <button
                onClick={handleCreateCourse}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiPlus className="mr-2" />
                Créer un cours
              </button>
            </div>
          ) : (
            courses.map((course: Course) => (
              <div
                key={course.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Informations du cours */}
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {course.thumbnail && (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              course.difficulty === 'debutant' ? 'bg-green-100 text-green-800' :
                              course.difficulty === 'intermediaire' ? 'bg-yellow-100 text-yellow-800' :
                              course.difficulty === 'avance' ? 'bg-orange-100 text-orange-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {course.difficulty}
                            </span>
                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {course.language}
                            </span>
                            {course.is_free && (
                              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                                Gratuit
                              </span>
                            )}
                            {course.is_featured && (
                              <span className="px-2 py-1 text-xs font-medium bg-pink-100 text-pink-800 rounded-full">
                                Vedette
                              </span>
                            )}
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              course.is_published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {course.is_published ? 'Publié' : 'Brouillon'}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {course.title}
                          </h3>
                          {course.subtitle && (
                            <p className="text-gray-600 mb-3">{course.subtitle}</p>
                          )}
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {course.short_description}
                          </p>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <FiEye className="text-gray-400" />
                              <span>{course.enrolled_count || 0} inscrits</span>
                            </div>
                            <div>
                              <span>{course.estimated_total_hours || 0}h</span>
                            </div>
                            <div>
                              <span>Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                      <button
                        onClick={() => handleViewCourse(course.slug)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <FiEye className="mr-2" />
                        Voir
                      </button>
                      <button
                        onClick={() => handleEditCourse(course.id)}
                        className="inline-flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <FiEdit className="mr-2" />
                        Éditer
                      </button>
                    </div>
                  </div>

                  {/* Bouton pour voir les détails */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => handleViewCourse(course.slug)}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800"
                    >
                      Voir les détails et modules
                      <MdKeyboardArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Précédent
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-2 border rounded-lg ${
                      page === pageNum
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Suivant
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseListPage;