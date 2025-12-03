'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Plus, X, Calendar, Briefcase, Award, Star, Clock, Tag } from 'lucide-react';

type ProfileType = 'employer' | 'translator' | 'user' | null;

export default function AdvancedProfilesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeProfile, setActiveProfile] = useState<ProfileType>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  
  // États pour les différents profils
  const [employerProfile, setEmployerProfile] = useState({
    companyName: '',
    industry: '',
    companyType: '',
    designation: '',
    companyAddress: '',
    companySize: '',
    website: ''
  });

  const [translatorProfile, setTranslatorProfile] = useState({
    level: '',
    experienceYears: '',
    qualifications: [] as string[],
    skills: [] as string[],
    availability: {
      days: [] as string[],
      hours: { start: '09:00', end: '17:00' }
    },
    certificationNumber: '',
    hourlyRate: ''
  });

  const [userProfile, setUserProfile] = useState({
    hearingLevel: '',
    hearingAid: false,
    signLanguageLevel: '',
    learningPreferences: [] as string[],
    languages: [] as string[],
    accessibilityNeeds: [] as string[]
  });

  const [qualificationInput, setQualificationInput] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');

  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  useEffect(() => {
    // Récupérer les rôles sélectionnés
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    setSelectedRoles(roles);
    
    // Déterminer le profil actif depuis l'URL
    const type = searchParams.get('type') as ProfileType;
    if (type) {
      setActiveProfile(type);
    }
  }, [searchParams]);

  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEmployerProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleTranslatorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTranslatorProfile(prev => ({ 
      ...prev, 
      [name]: value 
    }));
  };

  const addQualification = () => {
    if (qualificationInput.trim()) {
      setTranslatorProfile(prev => ({
        ...prev,
        qualifications: [...prev.qualifications, qualificationInput.trim()]
      }));
      setQualificationInput('');
    }
  };

  const removeQualification = (index: number) => {
    setTranslatorProfile(prev => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index)
    }));
  };

  const addSkill = () => {
    if (skillInput.trim()) {
      setTranslatorProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (index: number) => {
    setTranslatorProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const toggleDay = (day: string) => {
    setTranslatorProfile(prev => {
      const days = prev.availability.days.includes(day)
        ? prev.availability.days.filter(d => d !== day)
        : [...prev.availability.days, day];
      return {
        ...prev,
        availability: { ...prev.availability, days }
      };
    });
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
      const prefs = prev.learningPreferences.includes(preference)
        ? prev.learningPreferences.filter(p => p !== preference)
        : [...prev.learningPreferences, preference];
      return { ...prev, learningPreferences: prefs };
    });
  };

  const addLanguage = () => {
    if (languageInput.trim()) {
      setUserProfile(prev => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()]
      }));
      setLanguageInput('');
    }
  };

  const saveProfile = () => {
    // Sauvegarder les données selon le profil actif
    const profiles = JSON.parse(localStorage.getItem('advancedProfiles') || '{}');
    
    if (activeProfile === 'employer') {
      localStorage.setItem('advancedProfiles', JSON.stringify({
        ...profiles,
        employer: employerProfile
      }));
    } else if (activeProfile === 'translator') {
      localStorage.setItem('advancedProfiles', JSON.stringify({
        ...profiles,
        translator: translatorProfile
      }));
    } else if (activeProfile === 'user') {
      localStorage.setItem('advancedProfiles', JSON.stringify({
        ...profiles,
        user: userProfile
      }));
    }

    // Rediriger vers les préférences
    router.push('/preferences');
  };

  const renderEmployerProfile = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Briefcase className="h-6 w-6 text-orange-600" />
        <h2 className="text-2xl font-bold text-gray-900">Profil Employeur</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nom de l'entreprise *
          </label>
          <input
            type="text"
            name="companyName"
            value={employerProfile.companyName}
            onChange={handleEmployerChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Nom de votre entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Domaine d'activité *
          </label>
          <select
            name="industry"
            value={employerProfile.industry}
            onChange={handleEmployerChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            <option value="">Sélectionnez un domaine</option>
            <option value="tech">Technologie</option>
            <option value="health">Santé</option>
            <option value="education">Éducation</option>
            <option value="retail">Commerce</option>
            <option value="finance">Finance</option>
            <option value="other">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'entreprise *
          </label>
          <select
            name="companyType"
            value={employerProfile.companyType}
            onChange={handleEmployerChange}
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Désignation *
          </label>
          <input
            type="text"
            name="designation"
            value={employerProfile.designation}
            onChange={handleEmployerChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Votre poste dans l'entreprise"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Adresse de l'entreprise *
          </label>
          <textarea
            name="companyAddress"
            value={employerProfile.companyAddress}
            onChange={handleEmployerChange}
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Adresse complète de l'entreprise"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taille de l'entreprise
          </label>
          <select
            name="companySize"
            value={employerProfile.companySize}
            onChange={handleEmployerChange}
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
            name="website"
            value={employerProfile.website}
            onChange={handleEmployerChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="https://example.com"
          />
        </div>
      </div>
    </div>
  );

  const renderTranslatorProfile = () => (
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
            name="level"
            value={translatorProfile.level}
            onChange={handleTranslatorChange}
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
          <select
            name="experienceYears"
            value={translatorProfile.experienceYears}
            onChange={handleTranslatorChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="">Sélectionnez</option>
            <option value="0-2">0-2 ans</option>
            <option value="3-5">3-5 ans</option>
            <option value="6-10">6-10 ans</option>
            <option value="10+">10+ ans</option>
          </select>
        </div>

        {/* Qualifications */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Qualifications & Certifications
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={qualificationInput}
              onChange={(e) => setQualificationInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addQualification())}
              placeholder="Ajouter une qualification (ex: Certifié LSF)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addQualification}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {translatorProfile.qualifications.map((qual, index) => (
              <div key={index} className="flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                <span>{qual}</span>
                <button
                  type="button"
                  onClick={() => removeQualification(index)}
                  className="text-purple-600 hover:text-purple-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Compétences */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Compétences (tags)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              placeholder="Ajouter une compétence (ex: Interprétation conférence)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {translatorProfile.skills.map((skill, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                <Tag className="h-3 w-3" />
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(index)}
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
                  className={`px-4 py-2 rounded-lg border ${translatorProfile.availability.days.includes(day)
                      ? 'bg-purple-100 border-purple-500 text-purple-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
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
                value={translatorProfile.availability.hours.start}
                onChange={(e) => setTranslatorProfile(prev => ({
                  ...prev,
                  availability: { ...prev.availability, hours: { ...prev.availability.hours, start: e.target.value } }
                }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Heure de fin
              </label>
              <input
                type="time"
                value={translatorProfile.availability.hours.end}
                onChange={(e) => setTranslatorProfile(prev => ({
                  ...prev,
                  availability: { ...prev.availability, hours: { ...prev.availability.hours, end: e.target.value } }
                }))}
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
            name="hourlyRate"
            value={translatorProfile.hourlyRate}
            onChange={handleTranslatorChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: 50"
          />
        </div>
      </div>
    </div>
  );

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
                  name="hearingLevel"
                  value={userProfile.hearingLevel}
                  onChange={handleUserChange}
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
                  id="hearingAid"
                  name="hearingAid"
                  type="checkbox"
                  checked={userProfile.hearingAid}
                  onChange={handleUserChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="hearingAid" className="ml-2 block text-sm text-gray-900">
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
                name="signLanguageLevel"
                value={userProfile.signLanguageLevel}
                onChange={handleUserChange}
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
                    checked={userProfile.learningPreferences.includes(pref)}
                    onChange={() => togglePreference(pref)}
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
              placeholder="Ajouter une langue (ex: Français, Anglais)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button
              type="button"
              onClick={addLanguage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {userProfile.languages.map((lang, index) => (
              <div key={index} className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                <span>{lang}</span>
                <button
                  type="button"
                  onClick={() => setUserProfile(prev => ({
                    ...prev,
                    languages: prev.languages.filter((_, i) => i !== index)
                  }))}
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
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeProfile === 'employer'
                    ? 'bg-orange-600 text-white'
                    : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                  }`}
              >
                <Briefcase className="inline h-5 w-5 mr-2" />
                Profil Employeur
              </button>
            )}
            {selectedRoles.includes('traducteur') && (
              <button
                onClick={() => setActiveProfile('translator')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeProfile === 'translator'
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  }`}
              >
                <Award className="inline h-5 w-5 mr-2" />
                Profil Traducteur
              </button>
            )}
            {(selectedRoles.includes('malentendant') || selectedRoles.includes('apprenant') || selectedRoles.includes('entendant')) && (
              <button
                onClick={() => setActiveProfile('user')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${activeProfile === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  }`}
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
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Retour
          </button>
          
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/onboarding/preferences')}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Passer
            </button>
            <button
              onClick={saveProfile}
              disabled={!activeProfile}
              className={`px-8 py-3 rounded-lg font-medium transition-colors ${!activeProfile
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
            >
              Enregistrer et continuer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}