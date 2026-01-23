// app/communication/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  MessageSquare, 
  Mic, 
  Headphones, 
  Volume2, 
  ArrowRight, 
  Users,
  Zap,
  Globe,
  Shield,
  Clock
} from "lucide-react";
import { useGetCurrentUserQuery } from '@/state/api';
import DashboardHeader from "@/app/Components/DashboardHeader";
import Footer from "@/app/Components/Footer";
import { toast } from 'sonner';

interface UserData {
  id: string;
  name: string;
  forename: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  onboarding_completed: boolean;
}

export default function CommunicationHub() {
  const router = useRouter();
    const { 
    data: apiUserData, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useGetCurrentUserQuery(); 
  const [userData, setUserData] = useState<UserData>({
    id: '',
    name: '',
    forename: '',
    email: '',
    role: 'malentendant',
    phone: '',
    avatar: '',
    onboarding_completed: false,
  });
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  // Vérifier si l'utilisateur est authentifié
   useEffect(() => {
    if (isError) {
      toast.error('Erreur de chargement, vous êtes redirigé vers la page principale');
      router.push('/');
    }
  }, [isError, error, router]);

  // Mettre à jour les données utilisateur
  useEffect(() => {
    if (apiUserData) {
      let user;
      
      if (apiUserData.user) {
        user = apiUserData.user;
      } else if (apiUserData.id) {
        user = apiUserData;
      } else {
        console.error('Structure API inattendue:', apiUserData);
        return;
      }
      
      setUserData({
        id: user.id || '',
        name: user.name || '',
        forename: user.forename || '',
        email: user.email || '',
        role: user.role || 'malentendant',
        phone: user.phone || '',
        avatar: user.avatar || '',
        onboarding_completed: user.onboarding_completed || false,
      });
    }
  }, [apiUserData]);

  // Fonction pour obtenir l'URL de l'avatar
  const getAvatarUrl = (avatarPath: string | undefined): string => {
    if (!avatarPath) return '';
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const filename = avatarPath.split('/').pop() || '';
    return `${baseUrl}/avatars/${filename}`;
  };

  const avatarUrl = getAvatarUrl(userData.avatar);

  // Fonction pour naviguer vers le chat
  const navigateToChat = () => {
    router.push('/Communication/Components');
  };

  // Fonction pour naviguer vers la communication live
  const navigateToLiveCommunication = () => {
    router.push('/Communication/LiveCommunication');
  };

  // Statistiques simulées (à remplacer par des vraies données plus tard)
  const stats = {
    unreadMessages: 3,
    recentConversations: 5,
    activeUsers: 12,
    avgResponseTime: 2
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <DashboardHeader 
        userName={`${userData.name} ${userData.forename}`}
        userRole={userData.role}
        userEmail={userData.email}
        userAvatar={avatarUrl}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* En-tête avec bienvenue */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Bienvenue dans le <span className="text-primary">Module Communication</span>
          </h1>
          {/* <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Choisissez votre mode de communication préféré. Connectez-vous avec la communauté InklusionHub de manière simple et accessible.
          </p> */}
        </div>

        {/* Section statistiques */}
        <div className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-8 shadow-xl mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Votre activité sur InklusionHub
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.unreadMessages}</div>
              <p className="text-gray-600 text-sm">Messages non lus</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.recentConversations}</div>
              <p className="text-gray-600 text-sm">Conversations récentes</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.activeUsers}</div>
              <p className="text-gray-600 text-sm">Contacts</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-xl mb-4">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stats.avgResponseTime}</div>
              <p className="text-gray-600 text-sm">Groupes</p>
            </div>
          </div>
        </div>

        {/* Cartes de sélection principales */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Carte Chat Textuel */}
          <div 
            className={`relative bg-white rounded-3xl shadow-2xl p-8 border-2 transition-all duration-500 transform hover:scale-[1.02] ${
              hoveredCard === 'chat' 
                ? 'border-primary shadow-2xl shadow-primary/20' 
                : 'border-gray-100'
            }`}
            onMouseEnter={() => setHoveredCard('chat')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={navigateToChat}
          >
            
            
            {/* Icone et titre */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Chat Textuel</h2>
                <p className="text-gray-500">Discussions écrites instantanées</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8 text-lg">
              Échangez des messages texte et images en temps réel avec vos contacts. 
              Parfait pour les conversations asynchrones et le partage de documents.
            </p>

            {/* Features */}
            {/* <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Messages texte et images</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Notifications en temps réel</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Historique des conversations</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">Groupes de discussion</span>
              </div>
            </div> */}

            {/* Bouton d'action */}
            <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span>Accéder au Chat</span>
              <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Carte Communication Live */}
          <div 
            className={`relative bg-white rounded-3xl shadow-2xl p-8 border-2 transition-all duration-500 transform hover:scale-[1.02] ${
              hoveredCard === 'live' 
                ? 'border-green-500 shadow-2xl shadow-green-500/20' 
                : 'border-gray-100'
            }`}
            onMouseEnter={() => setHoveredCard('live')}
            onMouseLeave={() => setHoveredCard(null)}
            onClick={navigateToLiveCommunication}
          >
            
            {/* Icone et titre */}
            <div className="flex items-center gap-4 mb-6">
              <div className="p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Communication Live</h2>
                <p className="text-gray-500">Parole ↔ Texte en temps réel</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-8 text-lg">
              Système accessible de conversion parole-texte et texte-parole en direct. 
              Idéal pour faciliter la communication entre personnes sourdes et entendantes.
            </p>

            {/* Features */}
            {/* <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Transcription voix → texte</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Synthèse texte → voix</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Support multi-langues</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Historique des échanges</span>
              </div>
            </div> */}

            {/* Bouton d'action */}
            <button className="w-full flex items-center justify-center gap-3 py-4 px-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group">
              <span>Essayer en Live</span>
              <Zap className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>

        

        {/* Guide rapide */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Comment choisir ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <h4 className="font-semibold text-blue-800">Quand utiliser le Chat ?</h4>
              </div>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Pour des échanges écrits classiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Pour partager des documents/images</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Quand vous préférez prendre votre temps</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Pour les conversations de groupe</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Mic className="w-5 h-5 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-800">Quand utiliser le Live ?</h4>
              </div>
              <ul className="space-y-2 text-sm text-green-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Pour communiquer avec des personnes sourdes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Quand vous préférez parler plutôt qu'écrire</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Pour des échanges en temps réel urgent</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Pour les consultations accessibles</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="w-5 h-5 text-purple-600" />
                </div>
                <h4 className="font-semibold text-purple-800">Sécurité & Confidentialité</h4>
              </div>
              <ul className="space-y-2 text-sm text-purple-700">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Toutes vos conversations sont chiffrées</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Vous contrôlez vos données personnelles</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Suppression possible à tout moment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Respect strict du RGPD</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Témoignage ou appel à l'action
        <div className="text-center py-10 px-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-3xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Prêt à communiquer ?
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Rejoignez des milliers d'utilisateurs qui utilisent déjà nos outils de communication accessibles.
            Que vous soyez sourd, malentendant ou entendant, InklusionHub vous connecte.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={navigateToChat}
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Démarrer avec le Chat
            </button>
            <button
              onClick={navigateToLiveCommunication}
              className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Essayer le Live
            </button>
          </div>
        </div> */}
      </main>

      {/* <Footer /> */}

      {/* Styles d'animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        /* Animation pour les cartes */
        .card-hover-effect {
          transition: all 0.3s ease;
        }
        
        .card-hover-effect:hover {
          transform: translateY(-5px);
        }
        
        /* Gradient text */
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}