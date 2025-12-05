'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Mail, Smartphone, Globe, Eye, Video, CheckCircle } from 'lucide-react';

export default function PreferencesPage() {
  const router = useRouter();
  
  const [preferences, setPreferences] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    
    // Accessibilité
    autoSubtitles: true,
    signLanguageVideos: true,
    highContrastMode: false,
    fontSize: 'medium',
    
    // Communication
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'fr',
    
    // Confidentialité
    profileVisibility: 'public',
    showOnlineStatus: true
  });

  const [isComplete, setIsComplete] = useState(false);

  const handleToggle = (key: keyof typeof preferences) => {
    if (typeof preferences[key] === 'boolean') {
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const timezones = [
    'Europe/Paris',
    'Europe/London',
    'Europe/Berlin',
    'America/New_York',
    'America/Los_Angeles',
    'Asia/Tokyo',
    'Australia/Sydney'
  ];

  const handleComplete = async () => {
    try {
      // Récupérer toutes les données d'onboarding
      const userRoles = JSON.parse(localStorage.getItem('userRoles') || '[]');
      const basicProfile = JSON.parse(localStorage.getItem('basicProfile') || '{}');
      const advancedProfiles = JSON.parse(localStorage.getItem('advancedProfiles') || '{}');
      const current = Number(localStorage.getItem("OnboardProgress")) || 0;
      const updated = current + 20;

      localStorage.setItem("OnboardProgress", String(updated));
      // Préparer les données finales
      const userData = {
        roles: userRoles,
        basicProfile,
        advancedProfiles,
        preferences,
        completedOnboarding: true,
        completedAt: new Date().toISOString()
      };

      // TODO: Envoyer au backend
      console.log('User data to save:', userData);

      // Simulation de sauvegarde
      localStorage.setItem('userData', JSON.stringify(userData));
      
      // Afficher l'animation de succès
      setIsComplete(true);
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
      
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🎉 Configuration terminée !
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Votre compte est prêt. Redirection vers votre tableau de bord...
          </p>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Dernière étape : Préférences
          </h1>
          <p className="text-gray-600">
            Personnalisez votre expérience sur InklusionHub
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <span className="mr-2"></span>
            Vous pourrez modifier ces paramètres à tout moment
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Section Notifications */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications par email</h3>
                    <p className="text-sm text-gray-600">Recevez des mises à jour importantes</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('emailNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.emailNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Notifications push</h3>
                    <p className="text-sm text-gray-600">Alertes sur votre appareil</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${preferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.pushNotifications ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Emails marketing</h3>
                    <p className="text-sm text-gray-600">Nouvelles fonctionnalités et offres</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('marketingEmails')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${preferences.marketingEmails ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.marketingEmails ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div> */}
            </div>
          </div>

          {/* Section Accessibilité */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Eye className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Accessibilité</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">📝</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Sous-titres automatiques</h3>
                    <p className="text-sm text-gray-600">Active les sous-titres par défaut sur les vidéos</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('autoSubtitles')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${preferences.autoSubtitles ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.autoSubtitles ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Video className="h-5 w-5 text-gray-500" />
                  <div>
                    <h3 className="font-medium text-gray-900">Vidéos LSF par défaut</h3>
                    <p className="text-sm text-gray-600">Affiche la langue des signes quand disponible</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('signLanguageVideos')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${preferences.signLanguageVideos ? 'bg-blue-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${preferences.signLanguageVideos ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              
            </div>
          </div>

          {/* Section Général */}
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="h-6 w-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Paramètres généraux</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue de l'interface
                </label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="fr">Français</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visibilité du profil
                </label>
                <select
                  name="profileVisibility"
                  value={preferences.profileVisibility}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="public">Public</option>
                  <option value="connections">Seulement mes contacts</option>
                  <option value="private">Privé</option>
                </select>
              </div>

              
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <button
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Retour
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Vous avez presque terminé !
              </p>
              <button
                onClick={handleComplete}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg"
              >
                Terminer l'inscription 
              </button>
            </div>
            
            <div className="hidden sm:block w-24"></div> {/* Spacer pour l'alignement */}
          </div>
        </div>
      </div>
    </div>
  );
}