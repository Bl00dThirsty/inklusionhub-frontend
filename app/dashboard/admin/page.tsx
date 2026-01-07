/*'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../Components/DashboardHeader';
import { MessageSquare, CheckCircle, Users, Plus, Bell, Star, ArrowRight } from 'lucide-react';

interface UserData {
  name: string;
  role: string;
  onboardingProgress: number;
}

export default function AdminDashboardPage() {
  const [userData, setUserData] = useState<UserData>({
    name: 'Admin',
    role: 'admin',
    onboardingProgress: 85,
  });

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


  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    const onboardProgress = Number(localStorage.getItem('OnboardProgress')) || 85;

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserData({
          name: parsedData.basicProfile?.firstName || 'Admin',
          role: 'admin',
          onboardingProgress: onboardProgress,
        });
      } catch (err) {
        console.error('Erreur parsing userData', err);
      }
    }
  }, []);
    const onboard = userData.onboardingProgress;

     const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <DashboardHeader userName={userData.name} userRole={userData.role} />
      <h1 className="text-3xl font-bold mb-6 text-center">Statistiques Administrateur</h1>
      <main className="mt-6">
           {/* Hero Section - Welcome 
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
                
                {/* Badge rôle et progression 
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2">
                    <span className="capitalize font-medium">
                       {userData.role === 'admin' && '👤 admin'}
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

              {/* Actions rapides Hero 
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
          
      {/* Section 3 - Statistiques clés 
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="font-medium">Messages</p>
              <p className="text-sm text-gray-500">Ce mois</p>
            </div>
            <div className="text-2xl font-bold">24</div>
            <MessageSquare className="h-6 w-6 text-blue-600" />
            </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="font-medium">Activités</p>
              <p className="text-sm text-gray-500">Cette semaine</p>
            </div>
            <div className="text-2xl font-bold">18</div>
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>

          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div>
              <p className="font-medium">Utilisateurs</p>
              <p className="text-sm text-gray-500">Total communauté</p>
            </div>
            <div className="text-2xl font-bold">156</div>
            <Users className="h-6 w-6 text-purple-600" />
          </div>
        </div>
     
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
          {/* Section 2 - Fil d'activité 
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
                   <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Forum
                  </button>
                  <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Annonces
                  </button> 
                </div>
              </div>

              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div 
                    key={item.id}
                    className="p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700"
                  >
                    <div className="flex items-start gap-4">
                     Icon type 
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
          
         </div>
      </main>
    </div>
  );
}*/


'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from '../../Components/DashboardHeader';
import { 
  MessageSquare, Calendar, BookOpen, Briefcase, Users, TrendingUp,
  ArrowRight, Plus, Clock, CheckCircle, Star, Bell, Download,
  Shield, BarChart, UserPlus, Settings, AlertTriangle, Database,
  FileText, Eye, Lock, CreditCard, DollarSign, Activity, PieChart,
  Package, LogOut, RefreshCw, Server, Cpu, HardDrive, Network
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
  type: 'system' | 'warning' | 'announcement' | 'achievement' | 'security' | 'backup';
  title: string;
  description: string;
  time: string;
  author?: string;
  priority?: 'high' | 'medium' | 'low';
}

interface SystemMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkUsage: number;
  activeSessions: number;
  responseTime: number;
}

interface UserStats {
  total: number;
  active: number;
  newToday: number;
  byRole: Record<string, number>;
  banned: number;
  pendingVerification: number;
}

interface RevenueStats {
  total: number;
  thisMonth: number;
  lastMonth: number;
  byService: Record<string, number>;
  pendingPayouts: number;
}

export default function AdminDashboardPage() {
  const [userData, setUserData] = useState<UserData>({
    name: 'Admin',
    role: 'admin',
    onboardingProgress: 100
  });

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics>({
    cpuUsage: 65,
    memoryUsage: 72,
    diskUsage: 45,
    networkUsage: 38,
    activeSessions: 89,
    responseTime: 125
  });

  const [userStats, setUserStats] = useState<UserStats>({
    total: 156,
    active: 89,
    newToday: 24,
    byRole: {
      malentendant: 45,
      entendant: 30,
      traducteur: 15,
      employeur: 8,
      apprenant: 58
    },
    banned: 3,
    pendingVerification: 12
  });

  const [revenueStats, setRevenueStats] = useState<RevenueStats>({
    total: 2450,
    thisMonth: 1850,
    lastMonth: 1650,
    byService: {
      premium: 1200,
      translations: 650,
      courses: 350,
      jobposting: 250
    },
    pendingPayouts: 420
  });

  const [moderationStats, setModerationStats] = useState({
    pendingReports: 5,
    pendingReviews: 8,
    flaggedContent: 12,
    recentBans: 2
  });

  const [quickActions, setQuickActions] = useState<QuickAction[]>([
    {
      id: 1,
      title: 'Gestion utilisateurs',
      description: `${userStats.newToday} nouveaux inscrits aujourd'hui`,
      icon: <UserPlus className="h-6 w-6" />,
      color: 'bg-blue-600',
      action: 'Voir la liste'
    },
    {
      id: 2,
      title: 'Modération',
      description: `${moderationStats.pendingReports} signalements en attente`,
      icon: <Shield className="h-6 w-6" />,
      color: 'bg-red-600',
      action: 'Examiner'
    },
    {
      id: 3,
      title: 'Statistiques avancées',
      description: 'Analyses détaillées disponibles',
      icon: <BarChart className="h-6 w-6" />,
      color: 'bg-purple-600',
      action: 'Générer rapports'
    },
    {
      id: 4,
      title: 'Configuration système',
      description: 'Mettre à jour les paramètres',
      icon: <Settings className="h-6 w-6" />,
      color: 'bg-gray-700',
      action: 'Configurer'
    },
    {
      id: 5,
      title: 'Sauvegarde',
      description: 'Dernière sauvegarde: Aujourd\'hui 02:00',
      icon: <Database className="h-6 w-6" />,
      color: 'bg-green-600',
      action: 'Exécuter maintenant'
    },
    {
      id: 6,
      title: 'Facturation',
      description: `${revenueStats.pendingPayouts}€ en attente de paiement`,
      icon: <CreditCard className="h-6 w-6" />,
      color: 'bg-yellow-600',
      action: 'Gérer les paiements'
    }
  ]);

  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([
    {
      id: 1,
      type: 'backup',
      title: 'Sauvegarde automatique réussie',
      description: 'La sauvegarde complète de la base de données a été effectuée avec succès',
      time: 'Il y a 2h',
      author: 'Système',
      priority: 'low'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Utilisateur signalé',
      description: 'Un utilisateur a été signalé 3 fois pour comportement inapproprié',
      time: 'Il y a 4h',
      author: 'Modérateur',
      priority: 'high'
    },
    {
      id: 3,
      type: 'announcement',
      title: 'Mise à jour système planifiée',
      description: 'Maintenance prévue ce weekend de 02:00 à 04:00',
      time: 'Demain 02:00',
      author: 'Équipe technique',
      priority: 'medium'
    },
    {
      id: 4,
      type: 'achievement',
      title: 'Nouveau record d\'inscriptions',
      description: '50 nouvelles inscriptions aujourd\'hui - Record battu!',
      time: 'Il y a 1 jour',
      author: 'Système',
      priority: 'low'
    },
    {
      id: 5,
      type: 'security',
      title: 'Tentative de connexion suspecte',
      description: '5 tentatives de connexion depuis une IP inhabituelle',
      time: 'Il y a 3h',
      author: 'Sécurité',
      priority: 'high'
    },
    {
      id: 6,
      type: 'system',
      title: 'Performance système optimale',
      description: 'Tous les services fonctionnent normalement',
      time: 'Il y a 6h',
      author: 'Système',
      priority: 'low'
    }
  ]);

  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [systemHealth, setSystemHealth] = useState<'healthy' | 'warning' | 'critical'>('healthy');

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    const onboardProgress = Number(localStorage.getItem('OnboardProgress')) || 100;

    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setUserData({
          name: parsedData.basicProfile?.firstName || 'Admin',
          role: 'admin',
          onboardingProgress: onboardProgress,
        });
      } catch (err) {
        console.error('Erreur parsing userData', err);
      }
    }

    // Simuler des métriques système en temps réel
    const interval = setInterval(() => {
      setSystemMetrics(prev => ({
        ...prev,
        cpuUsage: Math.min(100, Math.max(20, prev.cpuUsage + (Math.random() * 10 - 5))),
        activeSessions: Math.max(50, prev.activeSessions + Math.floor(Math.random() * 10 - 5))
      }));

      // Vérifier la santé du système
      const cpuHealth = systemMetrics.cpuUsage > 90 ? 'critical' : systemMetrics.cpuUsage > 70 ? 'warning' : 'healthy';
      const memoryHealth = systemMetrics.memoryUsage > 90 ? 'critical' : systemMetrics.memoryUsage > 75 ? 'warning' : 'healthy';
      setSystemHealth(cpuHealth === 'critical' || memoryHealth === 'critical' ? 'critical' : 
                     cpuHealth === 'warning' || memoryHealth === 'warning' ? 'warning' : 'healthy');
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleRefreshMetrics = () => {
    // Rafraîchir les métriques
    setSystemMetrics({
      cpuUsage: 65 + Math.floor(Math.random() * 10),
      memoryUsage: 72 + Math.floor(Math.random() * 8),
      diskUsage: 45 + Math.floor(Math.random() * 5),
      networkUsage: 38 + Math.floor(Math.random() * 7),
      activeSessions: 89 + Math.floor(Math.random() * 15),
      responseTime: 125 + Math.floor(Math.random() * 25)
    });
  };

  const handleBanUser = (userId: string) => {
    console.log(`Banning user ${userId}`);
    // Logique de bannissement
  };

  const handleExportData = () => {
    console.log('Exporting data...');
    // Logique d'export
  };

  const handleSystemUpdate = () => {
    console.log('Starting system update...');
    // Logique de mise à jour
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getSystemHealthColor = () => {
    switch (systemHealth) {
      case 'healthy': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

   const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader userName={userData.name} userRole={userData.role} userEmail={''} />
      
      <main className="p-6">
        {/* Hero Section - Admin */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="h-8 w-8" />
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Tableau de bord Administrateur
                  </h1>
                </div>
                <p className="text-gray-300 text-lg mb-4">
                  Bonjour <span className="font-semibold">{userData.name}</span>, supervisez l'ensemble de la plateforme
                </p>
                
                {/* Statut système */}
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getSystemHealthColor()} animate-pulse`} />
                    <span className="font-medium capitalize">
                      Système {systemHealth === 'healthy' ? 'Opérationnel' : 
                              systemHealth === 'warning' ? 'Surveillance requise' : 
                              'Critique - Intervention nécessaire'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-48 bg-white/30 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${userData.onboardingProgress}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">
                      Tout opérationnel
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions rapides Admin */}
              <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleRefreshMetrics}
                  className="bg-white text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors flex items-center"
                >
                  <RefreshCw className="h-5 w-5 mr-2" />
                  Actualiser
                </button>
                <button className="bg-white/20 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors">
                  Exporter rapport
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1 - Actions rapides Admin */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Actions Administrateur
            </h2>
            
            {/* Nouveau calendrier de sélection de période */}
            <div className="flex items-center gap-2 relative">
              <span className="text-sm text-gray-500">Période:</span>
              <button
                onClick={() => setShowCalendar(!showCalendar)}
                className="text-sm border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-1.5 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <Calendar className="h-4 w-4" />
                {selectedTimeRange === 'today' && 'Aujourd\'hui'}
                {selectedTimeRange === 'week' && 'Cette semaine'}
                {selectedTimeRange === 'month' && 'Ce mois'}
                {selectedTimeRange === 'quarter' && 'Ce trimestre'}
                {selectedTimeRange === 'custom' && 'Personnalisé'}
              </button>

              {showCalendar && (
                <div className="absolute top-full mt-2 right-0 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white">Sélectionner une période</h4>
                    <button
                      onClick={() => setShowCalendar(false)}
                      className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Options rapides */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setSelectedTimeRange('today');
                          setDateRange({
                            startDate: new Date(),
                            endDate: new Date(),
                          });
                          setShowCalendar(false);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg ${selectedTimeRange === 'today' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        Aujourd'hui
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTimeRange('week');
                          const start = new Date();
                          start.setDate(start.getDate() - start.getDay());
                          setDateRange({
                            startDate: start,
                            endDate: new Date(),
                          });
                          setShowCalendar(false);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg ${selectedTimeRange === 'week' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        Cette semaine
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTimeRange('month');
                          const start = new Date();
                          start.setDate(1);
                          setDateRange({
                            startDate: start,
                            endDate: new Date(),
                          });
                          setShowCalendar(false);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg ${selectedTimeRange === 'month' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        Ce mois
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTimeRange('quarter');
                          const start = new Date();
                          const quarter = Math.floor(start.getMonth() / 3);
                          start.setMonth(quarter * 3, 1);
                          setDateRange({
                            startDate: start,
                            endDate: new Date(),
                          });
                          setShowCalendar(false);
                        }}
                        className={`px-3 py-2 text-sm rounded-lg ${selectedTimeRange === 'quarter' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                      >
                        Ce trimestre
                      </button>
                    </div>

                    {/* Sélecteur de dates */}
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Personnalisé:</span>
                        <div className="flex gap-2">
                          <input
                            type="date"
                            value={formatDateForInput(dateRange.startDate)}
                            onChange={(e) => {
                              setDateRange(prev => ({ ...prev, startDate: new Date(e.target.value) }));
                              setSelectedTimeRange('custom');
                            }}
                            className="text-sm border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 w-32"
                          />
                          <span className="text-gray-500">à</span>
                          <input
                            type="date"
                            value={formatDateForInput(dateRange.endDate)}
                            onChange={(e) => {
                              setDateRange(prev => ({ ...prev, endDate: new Date(e.target.value) }));
                              setSelectedTimeRange('custom');
                            }}
                            className="text-sm border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 w-32"
                          />
                        </div>
                      </div>
                      
                      <button
                        onClick={() => setShowCalendar(false)}
                        className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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
                    Admin
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  {action.description}
                </p>
                
                <button className="w-full mt-4 py-2.5 bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                  {action.action}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2 - Statistiques système */}
        <section className="mb-10">
          
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             
            {/* <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Performance système
                </h3>
                <Server className="h-6 w-6 text-blue-500" />
              </div>
              
              <div className="space-y-6">
                {/* CPU 
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Utilisation CPU</span>
                    </div>
                    <span className={`text-lg font-bold ${
                      systemMetrics.cpuUsage > 90 ? 'text-red-600' : 
                      systemMetrics.cpuUsage > 70 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {systemMetrics.cpuUsage.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        systemMetrics.cpuUsage > 90 ? 'bg-red-500' : 
                        systemMetrics.cpuUsage > 70 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${systemMetrics.cpuUsage}%` }}
                    />
                  </div>
                </div>

                {/* Mémoire 
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Utilisation mémoire</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {systemMetrics.memoryUsage}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-purple-500"
                      style={{ width: `${systemMetrics.memoryUsage}%` }}
                    />
                  </div>
                </div>

                {/* Stockage 
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Stockage</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {systemMetrics.diskUsage}% utilisé
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-green-500"
                      style={{ width: `${systemMetrics.diskUsage}%` }}
                    />
                  </div>
                </div>

                {/* Réseau 
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Network className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Trafic réseau</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {systemMetrics.networkUsage} Mbps
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-orange-500"
                      style={{ width: `${systemMetrics.networkUsage}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.activeSessions}
                  </div>
                  <div className="text-sm text-gray-500">Sessions actives</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {systemMetrics.responseTime}ms
                  </div>
                  <div className="text-sm text-gray-500">Temps de réponse</div>
                </div>
              </div>
            </div> */}

            {/* Statistiques utilisateurs */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Statistiques utilisateurs
                </h3>
                <Users className="h-6 w-6 text-green-500" />
              </div>
              
              <div className="space-y-6">
                {/* Total users */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Total utilisateurs</span>
                      <span className="text-2xl font-bold text-blue-600">{userStats.total}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {userStats.active} actifs maintenant
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Nouveaux aujourd'hui</span>
                      <span className="text-2xl font-bold text-green-600">+{userStats.newToday}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Inscriptions
                    </p>
                  </div>
                </div>

                {/* Répartition par rôle */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Répartition par rôle
                  </h4>
                  <div className="space-y-2">
                    {Object.entries(userStats.byRole).map(([role, count]) => (
                      <div key={role} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                          {role}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${(count / userStats.total) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-8 text-right">
                            {count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modération */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Utilisateurs bannis</span>
                      <span className="text-2xl font-bold text-red-600">{userStats.banned}</span>
                    </div>
                    <button 
                      onClick={() => handleBanUser('test')}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Voir la liste
                    </button>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">En attente</span>
                      <span className="text-2xl font-bold text-yellow-600">{userStats.pendingVerification}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Vérifications
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3 - Revenus et finances */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Revenus et finances
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Revenus totaux</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${revenueStats.total.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>+{(revenueStats.thisMonth - revenueStats.lastMonth).toLocaleString()} ce mois</span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ce mois-ci</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${revenueStats.thisMonth.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Vs ${revenueStats.lastMonth.toLocaleString()} mois dernier
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Paiements en attente</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    ${revenueStats.pendingPayouts.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <CreditCard className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="text-sm text-yellow-600 dark:text-yellow-400">
                Nécessite traitement
              </div>
            </div>
          </div>

          {/* Répartition par service */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Répartition des revenus par service
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(revenueStats.byService).map(([service, amount]) => (
                <div key={service} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium capitalize">{service}</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      ${amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(amount / revenueStats.thisMonth) * 100}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    {((amount / revenueStats.thisMonth) * 100).toFixed(1)}% du total
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section 4 - Journal d'activité */}
          <section className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Journal d'activité système
                </h2>
                <div className="flex gap-2">
                  <button className="text-sm px-3 py-1 bg-gray-900 dark:bg-gray-700 text-white rounded-lg">
                    Toutes
                  </button>
                  <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Système
                  </button>
                  <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Sécurité
                  </button>
                  <button className="text-sm px-3 py-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    Modération
                  </button>
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
                        item.type === 'system' ? 'bg-gray-100 dark:bg-gray-900/30' :
                        item.type === 'warning' ? 'bg-red-100 dark:bg-red-900/30' :
                        item.type === 'announcement' ? 'bg-blue-100 dark:bg-blue-900/30' :
                        item.type === 'achievement' ? 'bg-green-100 dark:bg-green-900/30' :
                        item.type === 'security' ? 'bg-orange-100 dark:bg-orange-900/30' :
                        'bg-purple-100 dark:bg-purple-900/30'
                      }`}>
                        {item.type === 'system' && <Settings className="h-5 w-5 text-gray-600 dark:text-gray-400" />}
                        {item.type === 'warning' && <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />}
                        {item.type === 'announcement' && <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
                        {item.type === 'achievement' && <Star className="h-5 w-5 text-green-600 dark:text-green-400" />}
                        {item.type === 'security' && <Shield className="h-5 w-5 text-orange-600 dark:text-orange-400" />}
                        {item.type === 'backup' && <Database className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                {item.title}
                              </h4>
                              {item.priority && (
                                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
                                  {item.priority === 'high' ? 'Haute' : 
                                   item.priority === 'medium' ? 'Moyenne' : 'Basse'}
                                </span>
                              )}
                            </div>
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
                            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                              <span className="text-xs font-semibold">
                                {item.author === 'Système' ? 'S' : 
                                 item.author === 'Modérateur' ? 'M' : 
                                 item.author === 'Équipe technique' ? 'T' :
                                 item.author === 'Sécurité' ? 'SEC' :
                                 item.author.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              Par {item.author}
                            </span>
                          </div>
                        )}

                        <div className="flex gap-3 mt-4">
                          {item.type === 'warning' && (
                            <button className="text-sm bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 px-3 py-1 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50">
                              Intervenir
                            </button>
                          )}
                          <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Détails
                          </button>
                          <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            Archiver
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
                <button className="text-blue-600 dark:text-blue-400 hover:underline">
                  Voir tout le journal
                </button>
              </div>
            </div>
          </section>

          {/* Section 5 - Actions urgentes et modération */}
          <section>
            <div className="space-y-6">
              {/* Actions urgentes */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Actions urgentes
                  </h3>
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Signalements en attente
                      </span>
                      <span className="text-xl font-bold text-red-600">{moderationStats.pendingReports}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Nécessitent une révision immédiate
                    </p>
                    <button className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                      Réviser maintenant
                    </button>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Contenu signalé
                      </span>
                      <span className="text-xl font-bold text-yellow-600">{moderationStats.flaggedContent}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Messages et publications
                    </p>
                    <button className="w-full py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors">
                      Examiner le contenu
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        Mises à jour système
                      </span>
                      <span className="text-xl font-bold text-blue-600">2</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Disponibles pour installation
                    </p>
                    <button 
                      onClick={handleSystemUpdate}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                      Installer maintenant
                    </button>
                  </div>
                </div>
              </div>

              {/* Export et sauvegarde */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                  Export et sauvegarde
                </h3>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleExportData}
                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Database className="h-5 w-5" />
                    Exporter toutes les données
                  </button>
                  
                  <button className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <FileText className="h-5 w-5" />
                    Générer rapport mensuel
                  </button>
                  
                  <button className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                    <Download className="h-5 w-5" />
                    Télécharger les logs
                  </button>
                </div>
              </div>

              {/* Bannière état système */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-3">État du système</h3>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-3 h-3 rounded-full ${getSystemHealthColor()} animate-pulse`} />
                  <span className="font-medium">
                    {systemHealth === 'healthy' ? 'Tous les services opérationnels' : 
                     systemHealth === 'warning' ? 'Surveillance requise' : 
                     'Attention - Problèmes détectés'}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Dernière vérification: Maintenant
                </p>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span>Uptime:</span>
                    <span className="font-medium">99.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Erreurs 24h:</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latence moyenne:</span>
                    <span className="font-medium">{systemMetrics.responseTime}ms</span>
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