'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, Building, Languages } from 'lucide-react';
import Image from 'next/image';
import { useUpdateBasicProfileMutation } from '@/state/api';

export default function BasicProfilePage() {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    phone: '',
    address: '',
    profession: '',
  });
  
  // Pour les liens vers advanced profiles
  const [tempCompanyName, setTempCompanyName] = useState('');
  const [tempTranslatorLevel, setTempTranslatorLevel] = useState('');
  
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // RTK Query mutation
  const [updateBasicProfile] = useUpdateBasicProfileMutation();

  useEffect(() => {
    // Récupérer les rôles depuis l'utilisateur connecté
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        const roles = user.secondary_roles || [];
        if (user.role) {
          setSelectedRoles([user.role, ...roles]);
        }
      } catch (error) {
        console.error('Error parsing user:', error);
      }
    }
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ avatar: 'La photo ne doit pas dépasser 5MB' });
        return;
      }
      
      // Vérifier le type
      if (!file.type.match('image.*')) {
        setErrors({ avatar: 'Veuillez sélectionner une image valide' });
        return;
      }
      
      setAvatarFile(file);
      
      // Créer un preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Effacer les erreurs d'avatar
      if (errors.avatar) {
        setErrors(prev => ({ ...prev, avatar: '' }));
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Effacer l'erreur du champ modifié
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCompanyNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempCompanyName(e.target.value);
  };

  const handleTranslatorLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTempTranslatorLevel(e.target.value);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Validation du téléphone
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[+]?[\d\s\-\+\(\)]{8,20}$/.test(formData.phone)) {
      newErrors.phone = 'Format de téléphone invalide. Utilisez des chiffres, espaces, +, - ou ().';
    }
    
    // Validation de l'adresse
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    
    // Validation de la profession
    if (!formData.profession.trim()) {
      newErrors.profession = 'La profession est requise';
    }
    
    return newErrors;
  };

  const handleSaveAndContinue = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});
    
    try {
      // Créer FormData pour envoyer les fichiers
      const formDataObj = new FormData();
      
      // Ajouter les champs obligatoires (noms exacts attendus par le backend)
      formDataObj.append('phone', formData.phone);
      formDataObj.append('adresse', formData.address);
      formDataObj.append('Profession', formData.profession);
      
      // Ajouter l'avatar si présent
      if (avatarFile) {
        formDataObj.append('avatar', avatarFile);
      }
      
      // Appel API via RTK Query
      const response = await updateBasicProfile(formDataObj).unwrap();
      
      // Stocker temporairement les données pour advanced profiles
      if (tempCompanyName) {
        localStorage.setItem('temp_company_name', tempCompanyName);
      }
      
      if (tempTranslatorLevel) {
        localStorage.setItem('temp_translator_level', tempTranslatorLevel);
      }
      
      // Mettre à jour l'utilisateur dans localStorage
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      
      // Rediriger selon le next_step retourné par l'API ou selon les rôles
      const nextStep = response.next_step;
      if (nextStep === 'advanced-profiles' || 
          selectedRoles.includes('employeur') || 
          selectedRoles.includes('traducteur')) {
        router.push('/advanced-profiles');
      } else {
        router.push('/preferences');
      }
      
    } catch (error: any) {
      console.error('Erreur API:', error);
      
      // Gérer les erreurs d'API
      if (error.data?.errors) {
        // Convertir les erreurs Django en format frontend
        const apiErrors: Record<string, string> = {};
        Object.entries(error.data.errors).forEach(([key, value]) => {
          if (Array.isArray(value) && value.length > 0) {
            apiErrors[key] = value[0];
          } else if (typeof value === 'string') {
            apiErrors[key] = value;
          }
        });
        setErrors(apiErrors);
      } else if (error.status === 400) {
        setErrors({ submit: 'Erreur de validation des données' });
      } else if (error.status === 401) {
        setErrors({ submit: 'Session expirée. Veuillez vous reconnecter.' });
        localStorage.clear();
        router.push('/sign-up');
      } else {
        setErrors({ submit: 'Erreur de connexion au serveur' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    setLoading(true);
    
    try {
      // Envoyer des valeurs par défaut pour les champs obligatoires
      const formDataObj = new FormData();
      formDataObj.append('phone', formData.phone || '(non spécifié)');
      formDataObj.append('adresse', formData.address || '(non spécifié)');
      formDataObj.append('Profession', formData.profession || '(non spécifié)');
      
      if (avatarFile) {
        formDataObj.append('avatar', avatarFile);
      }
      
      await updateBasicProfile(formDataObj).unwrap();
      
      // Rediriger directement vers les préférences
      router.push('/preferences');
      
    } catch (error) {
      console.error('Erreur skip:', error);
      setErrors({ submit: 'Erreur lors de la sauvegarde' });
    } finally {
      setLoading(false);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Complétez votre profil de base
          </h1>
          <p className="text-gray-600">
            Ces informations nous aident à personnaliser votre expérience
          </p>
          
          {/* Message d'erreur global */}
          {errors.submit && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{errors.submit}</p>
            </div>
          )}
          
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <span className="mr-2"></span>
            Remplissez au moins les champs obligatoires (*)
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          {/* Photo de profil */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Photo de profil (optionnelle)
            </h2>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 mb-4">
                {avatarPreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="rounded-full object-cover border-4 border-white shadow-lg w-full h-full"
                    />
                    <button
                      onClick={removeAvatar}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      title="Supprimer la photo"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  <span>Télécharger une photo</span>
                </button>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
              
              {errors.avatar && (
                <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
              )}
              
              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG ou GIF. Max 5MB.
              </p>
            </div>
          </div>

          {/* Informations de base - CHAMPS OBLIGATOIRES */}
          <div className="space-y-6">
            {/* Numéro de téléphone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de téléphone *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+237 613 45 67 89"
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>

            {/* Adresse */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Adresse complète"
                rows={3}
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address}</p>
              )}
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profession *
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                placeholder="Ex: Développeur web, Enseignant, Chef de projet..."
                disabled={loading}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.profession ? 'border-red-500' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {errors.profession && (
                <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
              )}
            </div>

            {/* SECTION OPTIONNELLE : Liens vers Advanced Profiles */}
            
            {/* Pour les employeurs - Suggestion seulement */}
            {selectedRoles.includes('employeur') && (
              <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Profil Employeur (optionnel)</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">
                    Nom de l'entreprise (pré-remplissage)
                  </label>
                  <input
                    type="text"
                    value={tempCompanyName}
                    onChange={handleCompanyNameChange}
                    placeholder="Nom de votre entreprise (optionnel ici)"
                    disabled={loading}
                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempCompanyName) {
                        localStorage.setItem('temp_company_name', tempCompanyName);
                      }
                      router.push('/advanced-profiles?type=employer');
                    }}
                    disabled={loading}
                    className="mt-3 text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    <Building className="h-4 w-4" />
                    Ajouter plus de détails sur l'entreprise
                  </button>
                  <p className="mt-2 text-xs text-orange-600">
                    Note: Les détails complets de l'entreprise seront saisis à l'étape suivante
                  </p>
                </div>
              </div>
            )}

            {/* Pour les traducteurs - Suggestion seulement */}
            {selectedRoles.includes('traducteur') && (
              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded-r">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Profil Traducteur LSF (optionnel)</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Niveau d'expertise (pré-remplissage)
                  </label>
                  <select
                    value={tempTranslatorLevel}
                    onChange={handleTranslatorLevelChange}
                    disabled={loading}
                    className="w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value="">Sélectionnez votre niveau (optionnel)</option>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                    <option value="expert">Expert certifié</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      if (tempTranslatorLevel) {
                        localStorage.setItem('temp_translator_level', tempTranslatorLevel);
                      }
                      router.push('/advanced-profiles?type=translator');
                    }}
                    disabled={loading}
                    className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1 disabled:opacity-50"
                  >
                    <Languages className="h-4 w-4" />
                    Compléter le profil traducteur
                  </button>
                  <p className="mt-2 text-xs text-purple-600">
                    Note: Les détails complets seront saisis à l'étape suivante
                  </p>
                </div>
              </div>
            )}

            {/* Pour malentendants et apprenants */}
            {(selectedRoles.includes('malentendant') || selectedRoles.includes('apprenant')) && (
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600">👂</span>
                  <h3 className="font-semibold text-blue-800">Informations complémentaires (optionnel)</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Vous pouvez ajouter des informations sur votre degré de perte auditive
                  ou vos préférences d'apprentissage à l'étape suivante
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/advanced-profiles?type=user')}
                  disabled={loading}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
                >
                  Ajouter des informations personnelles
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <button
                onClick={() => router.back()}
                disabled={loading}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Retour
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={handleSkip}
                  disabled={loading}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Passer pour l\'instant'}
                </button>
                <button
                  onClick={handleSaveAndContinue}
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sauvegarde...
                    </>
                  ) : 'Sauvegarder et continuer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}