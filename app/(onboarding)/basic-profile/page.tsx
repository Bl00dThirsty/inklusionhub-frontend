'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, Camera, Building, Languages } from 'lucide-react';
import Image from 'next/image';

export default function BasicProfilePage() {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    profileImage: null as string | null,
    phone: '',
    address: '',
    profession: '',
    companyName: '',
    translatorLevel: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Récupérer les rôles sélectionnés
    const roles = JSON.parse(localStorage.getItem('userRoles') || '[]');
    setSelectedRoles(roles);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le numéro de téléphone est requis';
    } else if (!/^[+]?[\d\s-]+$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }
    
    if (!formData.profession.trim()) {
      newErrors.profession = 'La profession est requise';
    }
    
    if (selectedRoles.includes('employeur') && !formData.companyName.trim()) {
      newErrors.companyName = 'Le nom de l\'entreprise est requis';
    }
    
    if (selectedRoles.includes('traducteur') && !formData.translatorLevel) {
      newErrors.translatorLevel = 'Le niveau est requis pour les traducteurs';
    }
    
    return newErrors;
  };

  const handleSaveAndContinue = () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Sauvegarder les données
      localStorage.setItem('basicProfile', JSON.stringify(formData));
      
      // Rediriger vers l'étape suivante
      if (selectedRoles.includes('employeur') || selectedRoles.includes('traducteur')) {
        router.push('/advanced-profiles');
      } else {
        router.push('/preferences');
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleSkip = () => {
    localStorage.setItem('basicProfile', JSON.stringify(formData));
    router.push('/preferences');
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
                {formData.profileImage ? (
                  <Image
                    src={formData.profileImage}
                    alt="Profile"
                    className="rounded-full object-cover border-4 border-white shadow-lg"
                    fill
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gray-100 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer">
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>Télécharger une photo</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </div>
              </label>
            </div>
          </div>

          {/* Informations de base */}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.profession ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.profession && (
                <p className="mt-1 text-sm text-red-600">{errors.profession}</p>
              )}
            </div>

            {/* Profils spécifiques selon le rôle */}
            {selectedRoles.includes('employeur') && (
              <div className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-50 rounded-r">
                <div className="flex items-center gap-2 mb-3">
                  <Building className="h-5 w-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Profil Employeur</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-orange-700 mb-2">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="Nom de votre entreprise"
                    className={`w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.companyName ? 'border-red-500' : ''}`}
                  />
                  {errors.companyName && (
                    <p className="mt-1 text-sm text-red-600">{errors.companyName}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push('/advanced-profiles?type=employer')}
                    className="mt-3 text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Building className="h-4 w-4" />
                    Ajouter plus de détails sur l'entreprise
                  </button>
                </div>
              </div>
            )}

            {selectedRoles.includes('traducteur') && (
              <div className="border-l-4 border-purple-500 pl-4 py-2 bg-purple-50 rounded-r">
                <div className="flex items-center gap-2 mb-3">
                  <Languages className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-purple-800">Profil Traducteur LSF</h3>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-2">
                    Niveau d'expertise *
                  </label>
                  <select
                    name="translatorLevel"
                    value={formData.translatorLevel}
                    onChange={handleSelectChange}
                    className={`w-full px-4 py-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${errors.translatorLevel ? 'border-red-500' : ''}`}
                  >
                    <option value="">Sélectionnez votre niveau</option>
                    <option value="debutant">Débutant</option>
                    <option value="intermediaire">Intermédiaire</option>
                    <option value="avance">Avancé</option>
                    <option value="expert">Expert certifié</option>
                  </select>
                  {errors.translatorLevel && (
                    <p className="mt-1 text-sm text-red-600">{errors.translatorLevel}</p>
                  )}
                  <button
                    type="button"
                    onClick={() => router.push('/advanced-profiles?type=translator')}
                    className="mt-3 text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center gap-1"
                  >
                    <Languages className="h-4 w-4" />
                    Compléter le profil traducteur
                  </button>
                </div>
              </div>
            )}

            {/* Autres rôles - champs optionnels */}
            {(selectedRoles.includes('malentendant') || selectedRoles.includes('apprenant')) && (
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-blue-600">👂</span>
                  <h3 className="font-semibold text-blue-800">Informations complémentaires</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  Vous pouvez ajouter des informations sur votre degré de perte auditive
                  ou vos préférences d'apprentissage (optionnel)
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/advanced-profiles?type=user')}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
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
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              
              <div className="flex gap-4">
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Passer pour l'instant
                </button>
                <button
                  onClick={handleSaveAndContinue}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Sauvegarder et continuer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}