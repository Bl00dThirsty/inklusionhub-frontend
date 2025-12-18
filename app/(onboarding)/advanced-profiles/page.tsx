'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, X, Calendar, Briefcase, Award, Star, Clock, Tag } from 'lucide-react';
import { 
  useUpdateAdvancedProfileMutation,
  useGetCurrentUserQuery,
  useGetTempDataQuery 
} from '@/state/api';

type ProfileType = 'employer' | 'translator' | 'user' | null;

export default function AdvancedProfilesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeProfile, setActiveProfile] = useState<ProfileType>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // RTK Query hooks
  const [updateAdvancedProfile] = useUpdateAdvancedProfileMutation();
  const { data: userData } = useGetCurrentUserQuery();
  const { data: tempData } = useGetTempDataQuery();
  
  // États pour les différents profils - CORRESPONDANCE AVEC LE BACKEND
  const [employerProfile, setEmployerProfile] = useState({
    company_name: '',
    Domaine_activity: '',
    Type_company: '',
    Adresse_company: '',
    Taille_Company: '',
    Site_web: ''
  });

  const [translatorProfile, setTranslatorProfile] = useState({
    certification: '',
    Annee_experience: 0,
    niveau_expertise: '',
    Competence: '',
    Jour_disponible: '',
    Creneau_horaire_disponible: '',
    Tarif_horaire: 0
  });

  const [userProfile, setUserProfile] = useState({
    niveau_perte_auditive: '',
    status_utilisez_vous_un_appareil_auditif: false,
    level_en_LSF: '',
    preference_apprentissage: [] as string[],
    langue_parlee: [] as string[]
  });

  const [qualificationInput, setQualificationInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    // Récupérer les rôles depuis l'utilisateur connecté
    if (userData) {
      const roles = userData.secondary_roles || [];
      if (userData.role) {
        setSelectedRoles([userData.role, ...roles]);
      }
    }
    
    // Déterminer le profil actif depuis l'URL
    const type = searchParams.get('type') as ProfileType;
    if (type) {
      setActiveProfile(type);
    }
    
    // Pré-remplir avec les données temporaires
    if (tempData) {
      if (tempData.company_name) {
        setEmployerProfile(prev => ({ ...prev, company_name: tempData.company_name }));
      }
      if (tempData.niveau_expertise) {
        setTranslatorProfile(prev => ({ ...prev, niveau_expertise: tempData.niveau_expertise }));
      }
    }
  }, [searchParams, userData, tempData]);

  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployerProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleTranslatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTranslatorProfile(prev => ({ 
      ...prev, 
      [name]: name === 'Annee_experience' || name === 'Tarif_horaire' 
        ? parseFloat(value) || 0 
        : value 
    }));
  };

  const handleCompetenceChange = (skills: string[]) => {
    setTranslatorProfile(prev => ({
      ...prev,
      Competence: skills.join(', ') // Convertir en string pour le backend
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      const newSkills = [...translatorProfile.Competence.split(', ').filter(s => s), skillInput.trim()];
      handleCompetenceChange(newSkills);
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    const currentSkills = translatorProfile.Competence.split(', ').filter(s => s);
    const newSkills = currentSkills.filter((_, i) => i !== index);
    handleCompetenceChange(newSkills);
  };

  const handleAvailabilityChange = (days: string[], startTime: string, endTime: string) => {
    setTranslatorProfile(prev => ({
      ...prev,
      Jour_disponible: days.join(', '),
      Creneau_horaire_disponible: `${startTime}-${endTime}`
    }));
  };

  const toggleDay = (day: string) => {
    const currentDays = translatorProfile.Jour_disponible.split(', ').filter(d => d);
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];
    
    handleAvailabilityChange(
      newDays,
      translatorProfile.Creneau_horaire_disponible.split('-')[0] || '09:00',
      translatorProfile.Creneau_horaire_disponible.split('-')[1] || '17:00'
    );
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setUserProfile(prev => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setUserProfile(prev => ({ ...prev, [name]: value }));
    }
  };

  const togglePreference = (preference: string) => {
    setUserProfile(prev => {
      const prefs = prev.preference_apprentissage.includes(preference)
        ? prev.preference_apprentissage.filter(p => p !== preference)
        : [...prev.preference_apprentissage, preference];
      return { ...prev, preference_apprentissage: prefs };
    });
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setUserProfile(prev => ({
        ...prev,
        langue_parlee: [...prev.langue_parlee, languageInput.trim()]
      }));
      setLanguageInput('');
    }
  };

  const removeLanguage = (index: number) => {
    setUserProfile(prev => ({
      ...prev,
      langue_parlee: prev.langue_parlee.filter((_, i) => i !== index)
    }));
  };

  const saveProfile = async () => {
    if (!activeProfile) return;
    
    setLoading(true);
    setErrors({});
    
    try {
      let profileData: any = {};
      
      // Préparer les données selon le profil actif
      if (activeProfile === 'employer') {
        profileData = {
          ...employerProfile,
          // Validation des champs obligatoires
          company_name: employerProfile.company_name || '',
          Domaine_activity: employerProfile.Domaine_activity || '',
          Type_company: employerProfile.Type_company || '',
          Adresse_company: employerProfile.Adresse_company || ''
        };
      } 
      else if (activeProfile === 'translator') {
        profileData = {
          ...translatorProfile,
          // Assurer que les nombres sont corrects
          Annee_experience: translatorProfile.Annee_experience || 0,
          Tarif_horaire: translatorProfile.Tarif_horaire || 0
        };
      } 
      else if (activeProfile === 'user') {
        profileData = {
          ...userProfile,
          langue_parlee: userProfile.langue_parlee
        };
      }
      
      // Appel API
      const response = await updateAdvancedProfile(profileData).unwrap();
      
      // Mettre à jour la progression
      const current = Number(localStorage.getItem("OnboardProgress")) || 0;
      const updated = current + 20;
      localStorage.setItem("OnboardProgress", String(updated));
      
      // Nettoyer les données temporaires
      localStorage.removeItem('temp_company_name');
      localStorage.removeItem('temp_translator_level');
      
      // Rediriger vers les préférences
      router.push('/preferences');
      
    } catch (error: any) {
      console.error('Erreur API:', error);
      
      // Gérer les erreurs
      if (error.data?.errors) {
        setErrors(error.data.errors);
      } else {
        setErrors({ submit: 'Erreur lors de la sauvegarde' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Fonctions de rendu des profils (à adapter avec les bons noms de champs)
  const renderEmployerProfile = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">Profil Employeur</h2>
      </div>

      {errors.submit && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{errors.submit}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'entreprise *
          </label>
          <input
            type="text"
            name="company_name"
            value={employerProfile.company_name}
            onChange={handleEmployerChange}
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.company_name ? 'border-red-500' : 'border-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            placeholder="Nom de votre entreprise"
          />
          {errors.company_name && (
            <p className="mt-1 text-sm text-red-600">{errors.company_name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domaine d'activité *
          </label>
          <select
            name="Domaine_activity"
            value={employerProfile.Domaine_activity}
            onChange={handleEmployerChange}
            disabled={loading}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
              errors.Domaine_activity ? 'border-red-500' : 'border-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <option value="">Sélectionnez un domaine</option>
            <option value="tech">Technologie</option>
            <option value="health">Santé</option>
            <option value="education">Éducation</option>
            <option value="retail">Commerce</option>
            <option value="finance">Finance</option>
            <option value="droit">Droit</option>
            <option value="other">Autre</option>
          </select>
          {errors.Domaine_activity && (
            <p className="mt-1 text-sm text-red-600">{errors.Domaine_activity}</p>
          )}
        </div>

        {/* ... Continuez avec les autres champs en utilisant les bons noms ... */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'entreprise *
          </label>
          <select
            name="Type_company"
            value={employerProfile.Type_company}
            onChange={handleEmployerChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Sélectionnez un type</option>
            <option value="startup">Startup</option>
            <option value="sme">PME</option>
            <option value="large">Grande entreprise</option>
            <option value="public">Organisation publique</option>
            <option value="nonprofit">Association</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse de l'entreprise *
          </label>
          <textarea
            name="Adresse_company"
            value={employerProfile.Adresse_company}
            onChange={handleEmployerChange}
            rows={3}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Adresse complète de l'entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille de l'entreprise
          </label>
          <select
            name="Taille_Company"
            value={employerProfile.Taille_Company}
            onChange={handleEmployerChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Nombre d'employés</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="500+">500+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site web
          </label>
          <input
            type="url"
            name="Site_web"
            value={employerProfile.Site_web}
            onChange={handleEmployerChange}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>
      </div>
    </div>
  );

  const renderTranslatorProfile = () => {
    const currentSkills = translatorProfile.Competence.split(', ').filter(s => s);
    const currentDays = translatorProfile.Jour_disponible.split(', ').filter(d => d);
    const [startTime = '09:00', endTime = '17:00'] = translatorProfile.Creneau_horaire_disponible.split('-');
    
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Award className="h-6 w-6 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Profil Traducteur LSF</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Niveau d'expertise *
            </label>
            <select
              name="niveau_expertise"
              value={translatorProfile.niveau_expertise}
              onChange={handleTranslatorChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="">Sélectionnez votre niveau</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
              <option value="expert">Expert certifié</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Années d'expérience *
            </label>
            <input
              type="number"
              name="Annee_experience"
              value={translatorProfile.Annee_experience}
              onChange={handleTranslatorChange}
              disabled={loading}
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Nombre d'années"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de certification
            </label>
            <input
              type="text"
              name="certification"
              value={translatorProfile.certification}
              onChange={handleTranslatorChange}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Numéro de certification"
            />
          </div>

          {/* Compétences */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Compétences (séparées par des virgules)
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                disabled={loading}
                placeholder="Ajouter une compétence (ex: Interprétation conférence)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addSkill}
                disabled={loading}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {currentSkills.map((skill, index) => (
                <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                  <Tag className="h-3 w-3" />
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    disabled={loading}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Disponibilités */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">Disponibilités</h3>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Jours disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    disabled={loading}
                    className={`px-4 py-2 rounded-lg border ${currentDays.includes(day)
                        ? 'bg-purple-100 border-purple-500 text-purple-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                      } disabled:opacity-50`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de début
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => handleAvailabilityChange(
                    currentDays,
                    e.target.value,
                    endTime
                  )}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heure de fin
                </label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => handleAvailabilityChange(
                    currentDays,
                    startTime,
                    e.target.value
                  )}
                  disabled={loading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tarif horaire (Fcfa)
            </label>
            <input
              type="number"
              name="Tarif_horaire"
              value={translatorProfile.Tarif_horaire}
              onChange={handleTranslatorChange}
              disabled={loading}
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: 50"
            />
          </div>
        </div>
      </div>
    );
  };

  const renderUserProfile = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Star className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-900">Profil Personnel</h2>
      </div>

      <div className="space-y-6">
        {selectedRoles.includes('malentendant') && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Informations sur l'audition
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau de perte auditive
                </label>
                <select
                  name="niveau_perte_auditive"
                  value={userProfile.niveau_perte_auditive}
                  onChange={handleUserChange}
                  disabled={loading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                >
                  <option value="">Sélectionnez</option>
                  <option value="leger">Léger</option>
                  <option value="moyen">Moyen</option>
                  <option value="severe">Sévère</option>
                  <option value="profound">Profond</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <input
                  id="status_utilisez_vous_un_appareil_auditif"
                  name="status_utilisez_vous_un_appareil_auditif"
                  type="checkbox"
                  checked={userProfile.status_utilisez_vous_un_appareil_auditif}
                  onChange={handleUserChange}
                  disabled={loading}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="status_utilisez_vous_un_appareil_auditif" className="ml-2 block text-sm text-gray-900">
                  Utilisez-vous un appareil auditif ?
                </label>
              </div>
            </div>
          </div>
        )}

        {(selectedRoles.includes('malentendant') || selectedRoles.includes('apprenant') || selectedRoles.includes('entendant')) && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Langue des Signes Française (LSF)
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Niveau en LSF
              </label>
              <select
                name="level_en_LSF"
                value={userProfile.level_en_LSF}
                onChange={handleUserChange}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Sélectionnez votre niveau</option>
                <option value="debutant">Débutant</option>
                <option value="intermediaire">Intermédiaire</option>
                <option value="avance">Avancé</option>
                <option value="courant">Courant</option>
              </select>
            </div>
          </div>
        )}

        {selectedRoles.includes('apprenant') && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Préférences d'apprentissage
            </h3>
            <div className="space-y-3">
              {['Vidéo', 'Texte', 'Quiz', 'Pratique interactive', 'Cours en direct'].map((pref) => (
                <div key={pref} className="flex items-center">
                  <input
                    id={`pref-${pref}`}
                    type="checkbox"
                    checked={userProfile.preference_apprentissage.includes(pref)}
                    onChange={() => togglePreference(pref)}
                    disabled={loading}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`pref-${pref}`} className="ml-2 block text-sm text-gray-900">
                    {pref}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Langues parlées
          </h3>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={languageInput}
              onChange={(e) => setLanguageInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
              disabled={loading}
              placeholder="Ajouter une langue (ex: Français, Anglais)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addLanguage}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.langue_parlee.map((lang, index) => (
              <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={() => removeLanguage(index)}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Profils avancés
          </h1>
          <p className="text-gray-600">
            Complétez les détails spécifiques à votre rôle
          </p>
        </div>

        {/* Navigation entre profils */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {selectedRoles.includes('employeur') && (
              <button
                onClick={() => setActiveProfile('employer')}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeProfile === 'employer'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                } disabled:opacity-50`}
              >
                <Briefcase className="inline h-5 w-5 mr-2" />
                Profil Employeur
              </button>
            )}
            {selectedRoles.includes('traducteur') && (
              <button
                onClick={() => setActiveProfile('translator')}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeProfile === 'translator'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                } disabled:opacity-50`}
              >
                <Award className="inline h-5 w-5 mr-2" />
                Profil Traducteur
              </button>
            )}
            {(selectedRoles.includes('malentendant') || selectedRoles.includes('apprenant') || selectedRoles.includes('entendant')) && (
              <button
                onClick={() => setActiveProfile('user')}
                disabled={loading}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeProfile === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                } disabled:opacity-50`}
              >
                <Star className="inline h-5 w-5 mr-2" />
                Profil Personnel
              </button>
            )}
          </div>
        </div>

        {/* Affichage du profil actif */}
        {activeProfile === 'employer' && renderEmployerProfile()}
        {activeProfile === 'translator' && renderTranslatorProfile()}
        {activeProfile === 'user' && renderUserProfile()}
        
        {!activeProfile && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Sélectionnez un profil à compléter
            </h3>
            <p className="text-gray-600">
              Choisissez un profil dans la navigation ci-dessus pour commencer
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => router.back()}
            disabled={loading}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Retour
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/preferences')}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Passer
            </button>
            <button
              onClick={saveProfile}
              disabled={!activeProfile || loading}
              className={`px-8 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                !activeProfile || loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sauvegarde...
                </>
              ) : 'Enregistrer et continuer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}