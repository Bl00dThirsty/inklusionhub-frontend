'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Mail, Smartphone, Globe, Eye, Video, CheckCircle } from 'lucide-react';
import { useUpdatePreferencesMutation, useGetCurrentUserQuery } from '@/state/api';

export default function PreferencesPage() {
  const router = useRouter();
  const [updatePreferences, { isLoading, error }] = useUpdatePreferencesMutation();
  const { data: userData } = useGetCurrentUserQuery();
  
  const [preferences, setPreferences] = useState({
    // Notifications
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    
    // Accessibilité
    auto_subtitles: true,
    sign_language_videos: true,
    high_contrast_mode: false,
    font_size: 'medium',
    
    // Général
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    language: 'fr',
    profile_visibility: 'public',
    show_online_status: true,
    
    // Langues parlées
    langue_parlee: [] as string[]
  });

  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
  // Pré-remplir avec les langues de l'utilisateur si disponibles
  if (userData?.langue_parlee) {
    setPreferences(prev => ({
      ...prev,
      langue_parlee: userData.langue_parlee || []  // ← Garantir que c'est un array
    }));
  }
}, [userData]);

  const handleToggle = (key: keyof typeof preferences) => {
    if (typeof preferences[key] === 'boolean') {
      setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleComplete = async () => {
    setErrors({});
    
    try {
      // Appel API pour sauvegarder les préférences
      const response = await updatePreferences(preferences).unwrap();
      
      // Mettre à jour l'utilisateur dans localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      // Nettoyer les données temporaires
      localStorage.removeItem('temp_company_name');
      localStorage.removeItem('temp_translator_level');
      localStorage.removeItem('basicProfile');
      localStorage.removeItem('advancedProfiles');
      localStorage.removeItem('userRoles');
      
      // Afficher l'animation de succès
      setIsComplete(true);
      
      // Rediriger vers le dashboard après 2 secondes
      setTimeout(() => {
        router.push(response.redirect || '/dashboard');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error saving preferences:', error);
      
      // Gérer les erreurs
      if (error.data?.errors) {
        setErrors(error.data.errors);
      } else {
        setErrors({ submit: 'Erreur lors de la sauvegarde des préférences' });
      }
    }
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
          
          {/* Affichage des erreurs */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">Erreur API: {JSON.stringify(error)}</p>
            </div>
          )}
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
                  onClick={() => handleToggle('email_notifications')}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    preferences.email_notifications ? 'bg-blue-600' : 'bg-gray-300'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.email_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
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
                  onClick={() => handleToggle('push_notifications')}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    preferences.push_notifications ? 'bg-blue-600' : 'bg-gray-300'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.push_notifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
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
                  onClick={() => handleToggle('marketing_emails')}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    preferences.marketing_emails ? 'bg-blue-600' : 'bg-gray-300'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.marketing_emails ? 'translate-x-6' : 'translate-x-1'
                  }`} />
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

            {/* <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500">📝</span>
                  <div>
                    <h3 className="font-medium text-gray-900">Sous-titres automatiques</h3>
                    <p className="text-sm text-gray-600">Active les sous-titres par défaut sur les vidéos</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggle('auto_subtitles')}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    preferences.auto_subtitles ? 'bg-blue-600' : 'bg-gray-300'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.auto_subtitles ? 'translate-x-6' : 'translate-x-1'
                  }`} />
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
                  onClick={() => handleToggle('sign_language_videos')}
                  disabled={isLoading}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                    preferences.sign_language_videos ? 'bg-blue-600' : 'bg-gray-300'
                  } disabled:opacity-50`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                    preferences.sign_language_videos ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Taille de police
                </label>
                <select
                  name="font_size"
                  value={preferences.font_size}
                  onChange={handleSelectChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="small">Petite</option>
                  <option value="medium">Moyenne</option>
                  <option value="large">Grande</option>
                  <option value="xlarge">Très grande</option>
                </select>
              </div> */}
            {/* </div> */}
              <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                <input
                  id="show_online_status"
                  name="show_online_status"
                  type="checkbox"
                  checked={preferences.show_online_status}
                  onChange={() => handleToggle('show_online_status')}
                  disabled={isLoading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="show_online_status" className="ml-2 block text-sm text-gray-900">
                  Afficher mon statut en ligne
                </label>
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
                  Fuseau horaire
                </label>
                <select
                  name="timezone"
                  value={preferences.timezone}
                  onChange={handleSelectChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  {timezones.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Langue de l'interface
                </label>
                <select
                  name="language"
                  value={preferences.language}
                  onChange={handleSelectChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
                  name="profile_visibility"
                  value={preferences.profile_visibility}
                  onChange={handleSelectChange}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
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
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Retour
            </button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-3">
                Vous avez presque terminé !
              </p>
              <button
                onClick={handleComplete}
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sauvegarde...
                  </>
                ) : 'Terminer l\'inscription'}
              </button>
            </div>
            
            <div className="hidden sm:block w-24"></div>
          </div>
        </div>
      </div>
    </div>
  );
}