"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import CourseForm from '../../Components/Formation/CourseForm';
import { useGetCourseBySlugQuery } from '@/state/learningApi';
import { useGetCurrentUserQuery} from '@/state/api';
import { toast } from 'sonner';
import { useAuth } from '../../Components/hooks/useAuth';
import DashboardHeader from '@/app/Components/DashboardHeader';

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


const CreateCoursePage = () => {
  const router = useRouter();
 // const { user, isLoading: authLoading } = useAuth();
  // Vérifier si l'utilisateur est admin ou instructeur
  
    const { 
        data: apiUserData, 
        isLoading:authLoading, 
        isError, 
        error,
        refetch 
    } = useGetCurrentUserQuery();

    // Gérer les erreurs de récupération des données utilisateur
    useEffect(() => {
      if (isError) {
        toast.error('Erreur de chargement, vous êtes redirigé vers la page principale');
        router.push('/');
      }
    }, [isError, error, router]);


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


useEffect(() => {
  console.log("🔍 Auth check", {
    authLoading,
    userLoaded,
    role: userData.role,
  });

  if (authLoading || !userLoaded) {
    console.log("⏳ Attente chargement utilisateur...");
    toast.error(
      "⏳ Attente chargement utilisateur..."
    );
    //router.push('/unauthorized');
    return;
  }

  const allowedRoles = ["admin", "traducteur", "employeur"];

  if (!allowedRoles.includes(userData.role)) {
    console.log("❌ rôle non autorisé :", userData.role);
    toast.error(
      `❌ Vous n'avez pas les droits nécessaires : ${userData.role}`
    );
    router.push("/unauthorized");
    return;
  }

  console.log("✅ Accès autorisé");
}, [authLoading, userLoaded, userData.role, router]);


if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const handleSuccess = (course: { id: string }) => {
    // Rediriger vers la page d'ajout des modules
    router.push(`/Formation/courses/${course.id}/modules/create`);
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <DashboardHeader 
            userName={`${userData.name} ${getInitials(userData.forename)}.`}
            userRole={userData.role}
            userEmail={userData.email}
            userAvatar={avatarUrl}
          />
      <Head>
        <title>Créer un nouveau cours | InklusionHub</title>
      </Head>
      
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <nav className="flex mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-4">
                <li>
                  <div>
                    <a href="/formation" className="text-gray-400 hover:text-gray-500">
                      Apprentissage
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <a href="/formation/courses" className="ml-4 text-gray-400 hover:text-gray-500">
                      Cours
                    </a>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-4 text-gray-500 font-medium">Créer un cours</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <div className="md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold leading-tight text-gray-900">
                  Créer un nouveau cours
                </h1>
                <p className="mt-2 text-sm text-gray-600">
                  Remplissez les informations de base de votre cours. Vous pourrez ajouter les modules et leçons ensuite.
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="mt-8">
            <CourseForm course={null} onSuccess={handleSuccess} />
          </div>
          
          {/* Informations complémentaires */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-2">💡 Conseils pour créer un bon cours</h3>
            <ul className="list-disc pl-5 text-blue-700 space-y-1">
              <li>Choisissez un titre clair et descriptif</li>
              <li>La description courte doit donner envie d'en savoir plus</li>
              <li>Les vidéos LSF doivent être de bonne qualité et bien éclairées</li>
              <li>Prévoyez des quiz après chaque leçon pour valider les acquis</li>
              <li>Ajoutez des sous-titres pour l'accessibilité</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default CreateCoursePage;