'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../Components/DashboardHeader';
import { BookOpen, Download, Plus } from 'lucide-react';

interface UserData {
  name: string;
  role: string;
  onboardingProgress: number;
}

export default function ApprenantDashboardPage() {
  const [userData, setUserData] = useState<UserData>({
    name: 'Apprenant',
    role: 'apprenant',
    onboardingProgress: 65,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    const onboardProgress = Number(localStorage.getItem('OnboardProgress')) || 65;

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserData({
          name: parsedData.basicProfile?.firstName || 'Apprenant',
          role: 'apprenant',
          onboardingProgress: onboardProgress,
        });
      } catch (err) {
        console.error('Erreur parsing userData', err);
      }
    }
  }, []);
    const onboard = userData.onboardingProgress;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <DashboardHeader userName={userData.name} userRole={userData.role} />

      <main className="mt-6">
        <h1 className="text-3xl font-bold mb-6">Mon apprentissage</h1>
          {/* Hero Section - Welcome */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Bonjour, {userData.name} 
                </h1>
                <p className="text-blue-100 text-lg mb-4">
                  Bienvenue sur votre tableau de bord personnalisé
                </p>
                
                {/* Badge rôle et progression */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="capitalize font-medium">
                      {userData.role === 'apprenant' && '📚 Apprenant'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-48 bg-white/30 rounded-full h-2">
                      <div 
                        className="bg-white h-2 rounded-full transition-all duration-500"
                        style={{ width: `${onboard}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      {onboard}% complété
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions rapides Hero */}
              <div className="mt-6 md:mt-0 flex gap-3">
                <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-colors">
                  <Plus className="inline h-5 w-5 mr-2" />
                  Nouvelle action
                </button>
                <button className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                  Explorer
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="font-medium mb-2">Progression globale</p>
            <p className="text-blue-600 text-2xl font-bold mb-1">65%</p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
            </div>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="font-medium mb-2">Certificats obtenus</p>
            <p className="text-green-600 text-2xl font-bold mb-1">2</p>
            <p className="text-sm text-gray-500">LSF Niveau 1 & Accessibilité</p>
          </div>
        </div>

        <div className="mt-6">
          <button className="py-3 px-6 bg-blue-600 text-white rounded-lg flex items-center gap-2">
            <Download className="h-5 w-5" /> Télécharger certificats
          </button>
        </div>
      </main>
    </div>
  );
}
