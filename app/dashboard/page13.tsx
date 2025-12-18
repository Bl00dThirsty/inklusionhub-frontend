// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardHeader from '../Components/DashboardHeader';
// import { 
//   MessageSquare, Calendar, BookOpen, Briefcase, Users, TrendingUp,
//   ArrowRight, Plus, Clock, CheckCircle, Star, Bell, Download
// } from 'lucide-react';
// import { useGetCurrentUserQuery } from '@/state/api';

// // Types
// interface UserData {
//   id: string;
//   name: string;
//   forename: string;
//   email: string;
//   role: string;
//   phone?: string;
//   avatar?: string;
//   adresse?: string;
//   Profession?: string;
//   onboarding_completed: boolean;
//   onboarding_step: number;
//   langue_parlee: string[];
//   // Champs spécifiques selon le rôle
//   company_name?: string;
//   niveau_expertise?: string;
//   niveau_perte_auditive?: string;
//   // ... autres champs selon votre modèle
// }

// interface QuickAction {
//   id: number;
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   color: string;
//   action: string;
//   link?: string;
// }

// interface ActivityItem {
//   id: number;
//   type: 'forum' | 'announcement' | 'translator' | 'achievement' | 'profile_update';
//   title: string;
//   description: string;
//   time: string;
//   author?: string;
// }

// export default function DashboardPage() {
//   // Récupérer les vraies données utilisateur
//   const { data: apiUserData, isLoading, error, refetch } = useGetCurrentUserQuery();
  
//   const [userData, setUserData] = useState<UserData>({
//     id: '',
//     name: '',
//     forename: '',
//     email: '',
//     role: 'malentendant',
//     phone: '',
//     avatar: '',
//     adresse: '',
//     Profession: '',
//     onboarding_completed: false,
//     onboarding_step: 1,
//     langue_parlee: []
//   });

//   const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
//   const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

//   // Mettre à jour les données utilisateur quand l'API répond
//   useEffect(() => {
//     if (apiUserData) {
//       console.log('Données utilisateur reçues:', apiUserData);
      
//       // Si apiUserData est déjà l'objet user
//       const user = apiUserData.user || apiUserData;
      
//       setUserData({
//         id: user.id || '',
//         name: user.name || '',
//         forename: user.forename || '',
//         email: user.email || '',
//         role: user.role || 'malentendant',
//         phone: user.phone || '',
//         avatar: user.avatar || '',
//         adresse: user.adresse || '',
//         Profession: user.Profession || '',
//         onboarding_completed: user.onboarding_completed || false,
//         onboarding_step: user.onboarding_step || 1,
//         langue_parlee: Array.isArray(user.langue_parlee) ? user.langue_parlee : [],
//         // Champs spécifiques
//         company_name: user.company_name,
//         niveau_expertise: user.niveau_expertise,
//         niveau_perte_auditive: user.niveau_perte_auditive
//       });
//     }
//   }, [apiUserData]);

//   // Initialiser les actions rapides et l'activité
//   useEffect(() => {
//     if (!userData.role) return;
    
//     // Actions rapides de base pour tous les rôles
//     const baseActions: QuickAction[] = [
//       {
//         id: 1,
//         title: 'Messages récents',
//         description: '3 conversations non lues',
//         icon: <MessageSquare className="h-6 w-6" />,
//         color: 'bg-blue-100 text-blue-600',
//         action: 'Voir messages',
//         link: '/messages'
//       },
//       {
//         id: 2,
//         title: 'Événements à venir',
//         description: '2 événements cette semaine',
//         icon: <Calendar className="h-6 w-6" />,
//         color: 'bg-green-100 text-green-600',
//         action: 'Voir calendrier',
//         link: '/events'
//       },
//       {
//         id: 3,
//         title: 'Cours recommandés',
//         description: 'LSF Niveau 2 - 75% complété',
//         icon: <BookOpen className="h-6 w-6" />,
//         color: 'bg-purple-100 text-purple-600',
//         action: 'Continuer',
//         link: '/courses'
//       }
//     ];

//     // Actions spécifiques selon le rôle
//     const roleSpecificActions: Record<string, QuickAction[]> = {
//       employeur: [
//         {
//           id: 4,
//           title: 'Candidatures',
//           description: userData.company_name ? `Pour ${userData.company_name}` : '12 nouvelles candidatures',
//           icon: <Users className="h-6 w-6" />,
//           color: 'bg-red-100 text-red-600',
//           action: 'Voir candidatures',
//           link: '/employer/applications'
//         },
//         {
//           id: 5,
//           title: 'Poster une offre',
//           description: 'Recrutez des talents inclusifs',
//           icon: <Plus className="h-6 w-6" />,
//           color: 'bg-orange-100 text-orange-600',
//           action: 'Créer',
//           link: '/employer/post-job'
//         }
//       ],
//       traducteur: [
//         {
//           id: 4,
//           title: 'Demandes en attente',
//           description: userData.niveau_expertise ? `Niveau: ${userData.niveau_expertise}` : '3 demandes de traduction',
//           icon: <Clock className="h-6 w-6" />,
//           color: 'bg-indigo-100 text-indigo-600',
//           action: 'Voir demandes',
//           link: '/translator/requests'
//         },
//         {
//           id: 5,
//           title: 'Disponibilités',
//           description: 'Gérez vos créneaux',
//           icon: <Calendar className="h-6 w-6" />,
//           color: 'bg-teal-100 text-teal-600',
//           action: 'Modifier',
//           link: '/translator/availability'
//         }
//       ],
//       apprenant: [
//         {
//           id: 4,
//           title: 'Progression',
//           description: 'Certificat LSF 1 disponible',
//           icon: <TrendingUp className="h-6 w-6" />,
//           color: 'bg-pink-100 text-pink-600',
//           action: 'Télécharger',
//           link: '/learner/progress'
//         },
//         {
//           id: 5,
//           title: 'Quiz du jour',
//           description: 'Testez vos connaissances',
//           icon: <CheckCircle className="h-6 w-6" />,
//           color: 'bg-yellow-100 text-yellow-600',
//           action: 'Commencer',
//           link: '/learner/quiz'
//         }
//       ],
//       malentendant: [
//         {
//           id: 4,
//           title: 'Traducteurs disponibles',
//           description: 'Trouvez un interprète LSF',
//           icon: <Users className="h-6 w-6" />,
//           color: 'bg-cyan-100 text-cyan-600',
//           action: 'Rechercher',
//           link: '/community/translators'
//         },
//         {
//           id: 5,
//           title: 'Paramètres accessibilité',
//           description: 'Personnalisez votre expérience',
//           icon: <Star className="h-6 w-6" />,
//           color: 'bg-violet-100 text-violet-600',
//           action: 'Configurer',
//           link: '/settings/accessibility'
//         }
//       ],
//       entendant: [
//         {
//           id: 4,
//           title: 'Apprendre la LSF',
//           description: 'Cours gratuits disponibles',
//           icon: <BookOpen className="h-6 w-6" />,
//           color: 'bg-emerald-100 text-emerald-600',
//           action: 'Commencer',
//           link: '/learn/lsf'
//         },
//         {
//           id: 5,
//           title: 'Communauté',
//           description: 'Rejoignez les discussions',
//           icon: <Users className="h-6 w-6" />,
//           color: 'bg-amber-100 text-amber-600',
//           action: 'Participer',
//           link: '/community/forum'
//         }
//       ]
//     };

//     // Fil d'activité basé sur les actions récentes
//     const userActivities: ActivityItem[] = [
//       {
//         id: 1,
//         type: 'profile_update',
//         title: 'Profil complété',
//         description: `Vous avez terminé votre onboarding en tant que ${userData.role}`,
//         time: 'Aujourd\'hui',
//         author: 'Système'
//       },
//       ...(userData.langue_parlee && userData.langue_parlee.length > 0 ? [{
//         id: 2,
//         type: 'achievement',
//         title: 'Langues ajoutées',
//         description: `Langues parlées: ${userData.langue_parlee.join(', ')}`,
//         time: 'Récemment',
//         author: 'Système'
//       }] : []),
//       {
//         id: 3,
//         type: 'announcement',
//         title: 'Bienvenue sur InklusionHub !',
//         description: 'Découvrez toutes les fonctionnalités de la plateforme',
//         time: 'Il y a 1 jour',
//         author: 'Équipe InklusionHub'
//       },
//       {
//         id: 4,
//         type: 'forum',
//         title: 'Nouvelle discussion',
//         description: 'Comment améliorer l\'inclusion en entreprise ?',
//         time: 'Il y a 2 jours',
//         author: 'Marie L.'
//       }
//     ];

//     setQuickActions([
//       ...baseActions,
//       ...(roleSpecificActions[userData.role] || [])
//     ]);

//     setActivityFeed(userActivities);

//   }, [userData]);

//   // Calculer la progression
//   const calculateOnboardingProgress = () => {
//     if (userData.onboarding_completed) return 100;
//     return Math.min(userData.onboarding_step * 20, 100);
//   };

//   const onboardingProgress = calculateOnboardingProgress();

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Chargement de votre tableau de bord...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="bg-red-100 text-red-600 p-4 rounded-lg">
//             <p>Erreur lors du chargement des données</p>
//             <button 
//               onClick={() => refetch()}
//               className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
//             >
//               Réessayer
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <DashboardHeader 
//         userName={`${userData.forename} ${userData.name}`}
//         userRole={userData.role}
//         userEmail={userData.email}
//         userAvatar={userData.avatar}
//       />

//       <main className="p-4 md:p-6 lg:p-8">
//         {/* Hero Section - Welcome */}
//         <div className="mb-8">
//           <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
//             <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
//               <div className="mb-6 md:mb-0 md:mr-6">
//                 <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
//                   Bonjour, {userData.forename || 'Utilisateur'} !
//                 </h1>
//                 <p className="text-blue-100 text-base md:text-lg mb-4">
//                   Bienvenue sur votre tableau de bord personnalisé
//                 </p>
                
//                 {/* Informations utilisateur */}
//                 <div className="flex flex-wrap gap-3 mb-4">
//                   {userData.Profession && (
//                     <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
//                       <span className="font-medium">{userData.Profession}</span>
//                     </div>
//                   )}
//                   {userData.phone && (
//                     <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
//                       <span className="font-medium">📱 {userData.phone}</span>
//                     </div>
//                   )}
//                   {userData.langue_parlee && userData.langue_parlee.length > 0 && (
//                     <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm">
//                       <span className="font-medium">
//                         🌐 {userData.langue_parlee.length} langue(s)
//                       </span>
//                     </div>
//                   )}
//                 </div>
                
//                 {/* Badge rôle et progression */}
//                 <div className="flex flex-wrap gap-4 items-center">
//                   <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
//                     <span className="capitalize font-medium flex items-center gap-2">
//                       {userData.role === 'malentendant' && '👂 Malentendant'}
//                       {userData.role === 'traducteur' && '👋 Traducteur LSF'}
//                       {userData.role === 'employeur' && '💼 Employeur'}
//                       {userData.role === 'apprenant' && '📚 Apprenant'}
//                       {userData.role === 'entendant' && '👤 Entendant'}
//                       {userData.role === 'admin' && '⚡ Administrateur'}
//                     </span>
//                   </div>
                  
//                   {!userData.onboarding_completed && (
//                     <div className="flex items-center gap-2">
//                       <div className="w-32 md:w-48 bg-white/30 rounded-full h-2">
//                         <div 
//                           className="bg-white h-2 rounded-full transition-all duration-500"
//                           style={{ width: `${onboardingProgress}%` }}
//                         />
//                       </div>
//                       <span className="text-sm font-medium whitespace-nowrap">
//                         {onboardingProgress}% complété
//                       </span>
//                     </div>
//                   )}
                  
//                   {userData.onboarding_completed && (
//                     <div className="flex items-center gap-2 bg-green-500/30 backdrop-blur-sm rounded-full px-4 py-2">
//                       <CheckCircle className="h-4 w-4" />
//                       <span className="text-sm font-medium">Onboarding terminé ✓</span>
//                     </div>
//                   )}
//                 </div>
//               </div>
              
//               {/* Bouton d'action rapide */}
//               <div className="self-stretch md:self-center">
//                 <button 
//                   onClick={() => refetch()}
//                   className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
//                 >
//                   <Bell className="h-5 w-5" />
//                   Actualiser
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Quick Actions */}
//         <div className="mb-8">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">
//             Actions rapides
//           </h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {quickActions.map((action) => (
//               <div 
//                 key={action.id}
//                 className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700"
//                 onClick={() => action.link && window.location.href = action.link}
//               >
//                 <div className="flex items-start justify-between mb-4">
//                   <div className={`${action.color} p-3 rounded-lg`}>
//                     {action.icon}
//                   </div>
//                   <ArrowRight className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
//                   {action.title}
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
//                   {action.description}
//                 </p>
//                 <button className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
//                   {action.action}
//                   <ArrowRight className="h-4 w-4" />
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Activity Feed */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
//               Activité récente
//             </h2>
//             <button className="text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center gap-1">
//               Voir tout
//               <ArrowRight className="h-4 w-4" />
//             </button>
//           </div>
          
//           <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
//             {activityFeed.map((activity) => (
//               <div 
//                 key={activity.id}
//                 className="p-5 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
//               >
//                 <div className="flex items-start gap-4">
//                   <div className={`p-2 rounded-lg ${
//                     activity.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
//                     activity.type === 'announcement' ? 'bg-blue-100 text-blue-600' :
//                     activity.type === 'forum' ? 'bg-green-100 text-green-600' :
//                     activity.type === 'translator' ? 'bg-purple-100 text-purple-600' :
//                     'bg-gray-100 text-gray-600'
//                   }`}>
//                     {activity.type === 'achievement' && <Star className="h-5 w-5" />}
//                     {activity.type === 'announcement' && <Bell className="h-5 w-5" />}
//                     {activity.type === 'forum' && <MessageSquare className="h-5 w-5" />}
//                     {activity.type === 'translator' && <Users className="h-5 w-5" />}
//                     {activity.type === 'profile_update' && <CheckCircle className="h-5 w-5" />}
//                   </div>
                  
//                   <div className="flex-1">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
//                       <h3 className="font-semibold text-gray-900 dark:text-white">
//                         {activity.title}
//                       </h3>
//                       <span className="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">
//                         {activity.time}
//                       </span>
//                     </div>
//                     <p className="text-gray-600 dark:text-gray-300 mb-2">
//                       {activity.description}
//                     </p>
//                     {activity.author && (
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Par {activity.author}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* User Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* Profile Completion */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
//               Complétion du profil
//             </h3>
//             <div className="space-y-4">
//               {[
//                 { label: 'Informations de base', completed: !!userData.phone && !!userData.Profession },
//                 { label: 'Photo de profil', completed: !!userData.avatar },
//                 { label: 'Préférences', completed: userData.onboarding_completed },
//                 { label: 'Informations spécifiques', completed: 
//                   (userData.role === 'employeur' && !!userData.company_name) ||
//                   (userData.role === 'traducteur' && !!userData.niveau_expertise) ||
//                   (userData.role === 'malentendant' && !!userData.niveau_perte_auditive)
//                 }
//               ].map((item, index) => (
//                 <div key={index} className="flex items-center justify-between">
//                   <span className="text-gray-600 dark:text-gray-300">{item.label}</span>
//                   <div className={`h-2 w-24 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-200'}`}>
//                     <div 
//                       className={`h-full rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`}
//                       style={{ width: item.completed ? '100%' : '0%' }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Quick Info */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
//               Informations
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between">
//                 <span className="text-gray-600 dark:text-gray-300">Email</span>
//                 <span className="font-medium">{userData.email}</span>
//               </div>
//               {userData.phone && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600 dark:text-gray-300">Téléphone</span>
//                   <span className="font-medium">{userData.phone}</span>
//                 </div>
//               )}
//               {userData.adresse && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-gray-600 dark:text-gray-300">Adresse</span>
//                   <span className="font-medium text-right">{userData.adresse}</span>
//                 </div>
//               )}
//               <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
//                 <button 
//                   onClick={() => window.location.href = '/profile/edit'}
//                   className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Modifier le profil
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Next Steps */}
//           <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
//             <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
//               Prochaines étapes
//             </h3>
//             <div className="space-y-3">
//               {!userData.onboarding_completed && (
//                 <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                   <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-lg">
//                     <ArrowRight className="h-5 w-5 text-blue-600 dark:text-blue-400" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900 dark:text-white">
//                       Terminer l'onboarding
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-300">
//                       {onboardingProgress}% complété
//                     </p>
//                   </div>
//                 </div>
//               )}
              
//               {userData.role === 'apprenant' && (
//                 <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                   <div className="bg-green-100 dark:bg-green-800 p-2 rounded-lg">
//                     <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900 dark:text-white">
//                       Commencer un cours
//                     </p>
//                     <p className="text-sm text-gray-600 dark:text-gray-300">
//                       LSF Niveau 1 disponible
//                     </p>
//                   </div>
//                 </div>
//               )}
              
//               <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
//                 <div className="bg-purple-100 dark:bg-purple-800 p-2 rounded-lg">
//                   <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900 dark:text-white">
//                     Rejoindre la communauté
//                   </p>
//                   <p className="text-sm text-gray-600 dark:text-gray-300">
//                     Connectez-vous avec d'autres membres
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }