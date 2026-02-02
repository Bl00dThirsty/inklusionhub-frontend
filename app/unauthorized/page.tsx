'use client';

import { useRouter } from 'next/navigation';
import { ShieldAlert, Home, Lock } from 'lucide-react';
import DashboardHeader from '@/app/Components/DashboardHeader';
import Footer from '@/app/Components/Footer';
import { useEffect, useState } from 'react';
import { useGetCurrentUserQuery } from '@/state/api';


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

export default function UnauthorizedPage() {
  const router = useRouter();
   const { 
      data: apiUserData, 
      isLoading, 
      isError, 
      error,
      refetch 
    } = useGetCurrentUserQuery(); 

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
  // Mettre à jour les données utilisateur
    useEffect(() => {
      if (apiUserData) {
        let user;
        
        if (apiUserData.user) {
          user = apiUserData.user;
        } else if (apiUserData.id) {
          user = apiUserData;
        } else {
          console.error('Structure API inattendue:', apiUserData);
          return;
        }
        
        setUserData({
          id: user.id || '',
          name: user.name || '',
          forename: user.forename || '',
          email: user.email || '',
          role: user.role || 'malentendant',
          phone: user.phone || '',
          avatar: user.avatar || '',
          onboarding_completed: user.onboarding_completed || false,
        });
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
  // Effet pour éventuellement rediriger après X secondes (optionnel)
  // useEffect(() => {
  //   const timer = setTimeout(() => router.push('/'), 5000);
  //   return () => clearTimeout(timer);
  // }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col">
      {/* En-tête */}
      <DashboardHeader 
        userName={`${userData.name} ${getInitials(userData.forename)}.`}
        userRole={userData.role}
        userEmail={userData.email}
        userAvatar={avatarUrl}
      />

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        {/* Icône d’avertissement */}
        <div className="p-6 bg-gradient-to-br from-red-100 to-rose-200 rounded-3xl shadow-lg mb-8">
          <ShieldAlert className="w-16 h-16 text-red-600" />
        </div>

        {/* Titres */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Accès <span className="text-blue-600">refusé</span>
        </h1>

        <p className="text-gray-600 text-lg max-w-xl mb-8">
          Vous n’avez pas les droits nécessaires pour accéder à cette page.  
          Si vous pensez que c’est une erreur, contactez un administrateur.
        </p>

        {/* Boutons d’action */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            Retour à l'accueil
          </button>

          <button
            onClick={() => router.push('/sign-out')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-200 to-gray-100 hover:from-gray-300 hover:to-gray-200 text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Lock className="w-5 h-5" />
            Se reconnecter
          </button>
        </div>
      </main>

      {/* Pied de page */}
      <Footer />
    </div>
  );
}