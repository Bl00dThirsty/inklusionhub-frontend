'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../Components/DashboardHeader';
import { 
  MessageSquare, Calendar, BookOpen, Briefcase, Users, TrendingUp,
  ArrowRight, Plus, Clock, CheckCircle, Star, Bell, Download
} from 'lucide-react';

// Types
interface UserData {
  name: string;
  role: string;
  onboardingProgress: number;
}

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  action: string;
}

interface ActivityItem {
  id: number;
  type: 'forum' | 'announcement' | 'translator' | 'achievement';
  title: string;
  description: string;
  time: string;
  author?: string;
}

export default function DashboardPage() {
  const [userData, setUserData] = useState<UserData>({
    name: 'User',
    role: 'malentendant',
    onboardingProgress: 85
  });

  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

  // Initialiser les données selon le rôle
  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setUserData({
        name: parsedData.basicProfile?.firstName || 'Utilisateur',
        role: parsedData.roles?.[0] || 'malentendant',
        onboardingProgress: 85
      });
    }
    
    // Actions rapides selon le rôle
    const baseActions: QuickAction[] = [
      {
        id: 1,
        title: 'Messages récents',
        description: '3 conversations non lues',
        icon: <MessageSquare className="h-6 w-6" />,
        color: 'bg-blue-500',
        action: 'Voir messages'
      },
      {
        id: 2,
        title: 'Événements à venir',
        description: '2 événements cette semaine',
        icon: <Calendar className="h-6 w-6" />,
        color: 'bg-green-500',
        action: 'Voir calendrier'
      },
      {
        id: 3,
        title: 'Cours recommandés',
        description: 'LSF Niveau 2 - 75% complété',
        icon: <BookOpen className="h-6 w-6" />,
        color: 'bg-purple-500',
        action: 'Continuer'
      },
      {
        id: 4,
        title: 'Offres pertinentes',
        description: '5 nouvelles offres correspondantes',
        icon: <Briefcase className="h-6 w-6" />,
        color: 'bg-orange-500',
        action: 'Explorer'
      },
    ];

    // Actions spécifiques selon le rôle
    const roleSpecificActions: Record<string, QuickAction[]> = {
      employeur: [
        {
          id: 5,
          title: 'Candidatures',
          description: '12 nouvelles candidatures',
          icon: <Users className="h-6 w-6" />,
          color: 'bg-red-500',
          action: 'Voir candidatures'
        }
      ],
      traducteur: [
        {
          id: 5,
          title: 'Demandes en attente',
          description: '3 demandes de traduction',
          icon: <Clock className="h-6 w-6" />,
          color: 'bg-indigo-500',
          action: 'Voir demandes'
        }
      ],
      apprenant: [
        {
          id: 5,
          title: 'Progression',
          description: 'Certificat LSF 1 disponible',
          icon: <TrendingUp className="h-6 w-6" />,
          color: 'bg-pink-500',
          action: 'Télécharger'
        }
      ]
    };

    setQuickActions([
      ...baseActions,
      ...(roleSpecificActions[userData.role] || [])
    ]);

    // Fil d'activité
    setActivityFeed([
      {
        id: 1,
        type: 'forum',
        title: 'Nouvelle discussion sur l\'accessibilité',
        description: 'Comment améliorer la communication au travail ?',
        time: 'Il y a 2h',
        author: 'Marie L.'
      },
      {
        id: 2,
        type: 'announcement',
        title: 'Webinaire inclusif',
        description: 'Rejoignez notre webinaire sur les technologies d\'assistance',
        time: 'Demain 14h',
        author: 'InklusionHub Team'
      },
      {
        id: 3,
        type: 'translator',
        title: 'Traducteur disponible',
        description: 'Jean D. est disponible pour des interprétations LSF',
        time: 'Disponible maintenant',
        author: 'Jean D.'
      },
      {
        id: 4,
        type: 'achievement',
        title: 'Nouveau badge débloqué !',
        description: 'Vous avez terminé le module LSF débutant',
        time: 'Il y a 1 jour',
        author: 'Système'
      }
    ]);

  }, [userData.role]);
  const onboard = Number(localStorage.getItem("OnboardProgress")) || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader 
        userName={userData.name}
        userRole={userData.role}
      />

      <main className="p-6">
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
                      {userData.role === 'malentendant' && '👂 Malentendant'}
                      {userData.role === 'traducteur' && '👋 Traducteur LSF'}
                      {userData.role === 'employeur' && '💼 Employeur'}
                      {userData.role === 'apprenant' && '📚 Apprenant'}
                      {userData.role === 'entendant' && '👤 Entendant'}
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

        {/* Section 1 - Actions rapides */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Actions rapides
            </h2>
            {/* <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
              Tout voir <ArrowRight className="h-4 w-4" />
            </a> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => (
              <div 
                key={action.id}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${action.color} p-3 rounded-xl`}>
                    {action.icon}
                  </div>
                  <span className="text-xs font-medium px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                    {userData.role}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {action.description}
                </p>
                
                <button className="w-full mt-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  {action.action}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 2 - Fil d'activité */}
          <section className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Fil d'activité
                </h2>
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
                    Tous
                  </button>
                  {/* <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Forum
                  </button>
                  <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Annonces
                  </button> */}
                </div>
              </div>

              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon type */}
                      <div className={`p-2 rounded-lg ${
                        item.type === 'forum' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        item.type === 'announcement' ? 'bg-green-100 dark:bg-green-900/30' :
                        item.type === 'translator' ? 'bg-purple-100 dark:bg-purple-900/30' :
                        'bg-yellow-100 dark:bg-yellow-900/30'
                      }`}>
                        {item.type === 'forum' && <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        {item.type === 'announcement' && <Bell className="h-5 w-5 text-green-600 dark:text-green-400" />}
                        {item.type === 'translator' && <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                        {item.type === 'achievement' && <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {item.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                            {item.time}
                          </span>
                        </div>
                        
                        {item.author && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            <span className="text-sm text-gray-500">
                              Par {item.author}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Voir plus
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Partager
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Sauvegarder
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <a href="/dashboard/activity" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Charger plus d'activités
                </a>
              </div>
            </div>
          </section>

          {/* Section 3 - Widgets par rôle */}
          <section>
            <div className="space-y-6">
              {/* Widget selon rôle */}
              {userData.role === 'employeur' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Espace Employeur
                    </h3>
                    <Briefcase className="h-6 w-6 text-orange-500" />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Offres actives
                        </span>
                        <span className="text-2xl font-bold text-orange-600">5</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        12 candidatures en attente
                      </p>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          CV consultés
                        </span>
                        <span className="text-2xl font-bold text-blue-600">24</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cette semaine
                      </p>
                    </div>

                    <button className="w-full mt-4 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                      <Plus className="h-5 w-5" />
                      Publier une offre
                    </button>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Dernières candidatures
                      </h4>
                      <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                              <p className="font-medium">Candidat {i}</p>
                              <p className="text-sm text-gray-500">Poste Développeur</p>
                            </div>
                            <button className="text-sm text-blue-600 hover:underline">
                              Voir
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userData.role === 'traducteur' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Espace Traducteur
                    </h3>
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Demandes en attente
                        </span>
                        <span className="text-2xl font-bold text-purple-600">3</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        2 urgentes
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Disponibilités
                        </span>
                        <span className="text-2xl font-bold text-green-600">85%</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Cette semaine
                      </p>
                    </div>

                    <button className="w-full mt-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors">
                      Gérer mon agendas
                    </button>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Prochaines réservations
                      </h4>
                      <div className="space-y-3">
                        {[1, 2].map((i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <p className="font-medium">Client {i}</p>
                              <span className="text-sm text-gray-500">14:00</span>
                            </div>
                            <p className="text-sm text-gray-600">Consultation médicale</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {userData.role === 'apprenant' && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Mon apprentissage
                    </h3>
                    <BookOpen className="h-6 w-6 text-blue-500" />
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Progression globale
                        </span>
                        <span className="text-2xl font-bold text-blue-600">65%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900 dark:text-white">
                          Certificats obtenus
                        </span>
                        <span className="text-2xl font-bold text-green-600">2</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        LSF Niveau 1 & Accessibilité
                      </p>
                    </div>

                    <button className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                      <Download className="h-5 w-5" />
                      Télécharger certificats
                    </button>

                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Cours en cours
                      </h4>
                      <div className="space-y-3">
                        {[
                          { title: 'LSF Niveau 2', progress: 75 },
                          { title: 'Communication inclusive', progress: 30 },
                        ].map((course, i) => (
                          <div key={i} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <p className="font-medium">{course.title}</p>
                              <span className="text-sm font-semibold">{course.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                              <div 
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{ width: `${course.progress}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Widget commun - Statistiques */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Statistiques
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <MessageSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium">Messages</p>
                        <p className="text-sm text-gray-500">Ce mois</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">24</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium">Activités</p>
                        <p className="text-sm text-gray-500">Cette semaine</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">18</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <p className="font-medium">Connexions</p>
                        <p className="text-sm text-gray-500">Communauté</p>
                      </div>
                    </div>
                    <span className="text-2xl font-bold">156</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}