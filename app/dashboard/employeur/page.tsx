'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../Components/DashboardHeader';
import { Briefcase, Users, Plus } from 'lucide-react';

interface UserData {
  name: string;
  role: string;
  onboardingProgress: number;
}

export default function EmployeurDashboardPage() {
  const [userData, setUserData] = useState<UserData>({
    name: 'Employeur',
    role: 'employeur',
    onboardingProgress: 80,
  });

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    const onboardProgress = Number(localStorage.getItem('OnboardProgress')) || 80;

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserData({
          name: parsedData.basicProfile?.firstName || 'Employeur',
          role: 'employeur',
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
        <h1 className="text-3xl font-bold mb-6">Espace Employeur</h1>
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
                      {userData.role === 'employeur' && '💼 Employeur'}
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="font-medium mb-2">Offres actives</p>
            <p className="text-orange-600 text-2xl font-bold mb-1">5</p>
            <p className="text-sm text-gray-500">12 candidatures en attente</p>
            <button className="mt-4 py-2 px-4 bg-orange-600 text-white rounded-lg flex items-center gap-2">
              <Plus className="h-5 w-5" /> Publier une offre
            </button>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="font-medium mb-2">CV consultés</p>
            <p className="text-blue-600 text-2xl font-bold mb-1">24</p>
            <p className="text-sm text-gray-500">Cette semaine</p>
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
            <p className="font-medium mb-2">Dernières candidatures</p>
            <ul className="space-y-2">
              {[1, 2, 3].map((i) => (
                <li key={i} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span>Candidat {i}</span>
                  <button className="text-blue-600 hover:underline">Voir</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}