'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

const roles = [
  {
    id: 'malentendant',
    title: 'Malentendant',
    description: 'Accédez à des outils de communication adaptés, transcription en temps réel et interprètes LSF.',
    icon: '👂',
    color: 'bg-blue-50 border-blue-200',
    selectedColor: 'bg-blue-100 border-blue-500',
    textColor: 'text-blue-700'
  },
  {
    id: 'entendant',
    title: 'Entendant',
    description: 'Communiquez efficacement avec des personnes malentendantes, apprenez la LSF.',
    icon: '👂',
    color: 'bg-green-50 border-green-200',
    selectedColor: 'bg-green-100 border-green-500',
    textColor: 'text-green-700'
  },
  {
    id: 'traducteur',
    title: 'Traducteur LSF',
    description: 'Proposez vos services d\'interprétation, gérez vos rendez-vous et votre emploi du temps.',
    icon: '👋',
    color: 'bg-purple-50 border-purple-200',
    selectedColor: 'bg-purple-100 border-purple-500',
    textColor: 'text-purple-700'
  },
  {
    id: 'employeur',
    title: 'Employeur',
    description: 'Recrutez des talents inclusifs, gérez les CV vidéo et planifiez des entretiens accessibles.',
    icon: '💼',
    color: 'bg-orange-50 border-orange-200',
    selectedColor: 'bg-orange-100 border-orange-500',
    textColor: 'text-orange-700'
  },
  {
    id: 'apprenant',
    title: 'Apprenant',
    description: 'Suivez des cours de LSF, progressez à votre rythme avec des quiz interactifs.',
    icon: '📚',
    color: 'bg-indigo-50 border-indigo-200',
    selectedColor: 'bg-indigo-100 border-indigo-500',
    textColor: 'text-indigo-700'
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const toggleRole = (roleId: string) => {
    setSelectedRoles(prev => 
      prev.includes(roleId) 
        ? prev.filter(id => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleContinue = () => {
    if (selectedRoles.length > 0) {
      // TODO: Sauvegarder les rôles sélectionnés via API
      localStorage.setItem('userRoles', JSON.stringify(selectedRoles));
      router.push('/basic-profile');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez votre rôle
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sélectionnez un ou plusieurs rôles qui correspondent à votre profil.
            Cela nous aide à personnaliser votre expérience sur InklusionHub.
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
            <span className="mr-2"></span>
            Vous pourrez modifier ces choix plus tard
          </div>
        </div>

        {/* Grille des rôles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {roles.map((role) => {
            const isSelected = selectedRoles.includes(role.id);
            return (
              <button
                key={role.id}
                onClick={() => toggleRole(role.id)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${isSelected ? role.selectedColor + ' border-2' : role.color} hover:shadow-lg`}
              >
                {/* Indicateur de sélection */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="bg-blue-600 text-white p-1 rounded-full">
                      <Check className="h-5 w-5" />
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="text-4xl mb-4">{role.icon}</div>

                {/* Titre */}
                <h3 className={`text-xl font-bold mb-2 ${role.textColor}`}>
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm">
                  {role.description}
                </p>

                {/* Avantages débloqués */}
                <div className="mt-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">
                    Débloque :
                  </h4>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {role.id === 'malentendant' && (
                      <>
                        <li>✓ Transcription automatique</li>
                        <li>✓ Communication adaptés</li>
                        <li>✓ Accès aux interprètes</li>
                      </>
                    )}
                    {role.id === 'entendant' && (
                      <>
                        <li>✓ Cours de LSF gratuits</li>
                        <li>✓ Outils de communication</li>
                        <li>✓ Communauté inclusive</li>
                      </>
                    )}
                    {role.id === 'traducteur' && (
                      <>
                        <li>✓ Tableau de bord professionnel</li>
                        <li>✓ Gestion des rendez-vous</li>
                        <li>✓ Profil certifié</li>
                      </>
                    )}
                    {role.id === 'employeur' && (
                      <>
                        <li>✓ Publication d'offres</li>
                        <li>✓ CV vidéo accessibles</li>
                        <li>✓ Outils de recrutement</li>
                      </>
                    )}
                    {role.id === 'apprenant' && (
                      <>
                        <li>✓ Cours progressifs</li>
                        <li>✓ Quiz interactifs</li>
                        <li>✓ Suivi de progression</li>
                      </>
                    )}
                  </ul>
                </div>
              </button>
            );
          })}
        </div>

        {/* Compteur et bouton continuer */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-700">
                <span className="font-bold text-blue-600">{selectedRoles.length}</span> rôle(s) sélectionné(s)
              </p>
              <p className="text-sm text-gray-500">
                Multi-sélection possible
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Retour
              </button>
              <button
                onClick={handleContinue}
                disabled={selectedRoles.length === 0}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${selectedRoles.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                Suivant
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}