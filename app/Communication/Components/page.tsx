"use client";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import CommunicationLayout from "./Chat/ComLayout";
import ConversationList from "./Chat/ConversationList";
import ChatLayout from "./Chat/ChatLayout";
import FileHistory from "./History/FileHistory";
import { useGetCurrentUserQuery } from '@/state/api';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import DashboardHeader from "@/app/Components/DashboardHeader";

interface Message {
  type: "sent" | "received" | "image";
  text?: string;
  image?: string;
  timestamp?: string;
}

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  messages: Message[];
}

interface UserData {
  id: string;
  name: string;
  forename: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  adresse?: string;
  Profession?: string;
  onboarding_completed: boolean;
  onboarding_step: number;
  langue_parlee: string[];
  // Champs spécifiques selon le rôle
  company_name?: string;
  niveau_expertise?: string;
  niveau_perte_auditive?: string;
  Jour_disponible?: string;// Pour traducteur
  Creneau_horaire_disponible?: string;// Pour traducteur
  Tarif_horaire?: number;// Pour traducteur
  
  Domaine_activity?: string;//Pour employeur
  Type_company?: string;//Pour employeur
  Adresse_company?: string;//Pour employeur
  Taille_Company?: string;//Pour employeur
  Site_web?: string;//Pour employeur
  secondary_roles?: string[];
  preferences?: string[];
}

export default function CommunicationPage() {
  const users: User[] = [
    {
      id: 1,
      name: "Alice Dupont",
      avatar: "/images/avatar1.jpg",
      status: "En ligne",
      messages: [
        { type: "received", text: "Bonjour Alice, vous allez bien ?" },
        { type: "sent", text: "Oui merci ! C’est très clair." },
      ],
    },
    {
      id: 2,
      name: "Bob Martin",
      avatar: "/images/avatar2.jpg",
      status: "Hors ligne",
      messages: [
        { type: "received", text: "Salut Bob !" },
        { type: "sent", text: "Comment ça va ?" },
      ],
    },
  ];

  const router = useRouter();
    const { data: apiUserData, isLoading, error, refetch } = useGetCurrentUserQuery();
    
    const [userData, setUserData] = useState<UserData>({
      id: '',
      name: '',
      forename: '',
      email: '',
      role: 'malentendant',
      phone: '',
      avatar: '',
      adresse: '',
      Profession: '',
      onboarding_completed: false,
      onboarding_step: 1,
      langue_parlee: []
    });
  
     // Vérifier si l'utilisateur est authentifié
      useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
          // Rediriger vers l'inscription si pas de token
          router.push('/');
        }
      }, [router]);

    // Mettre à jour les données utilisateur lorsque l'API répond
    useEffect(() => {
      if (apiUserData) {
      
        let user;
        
        // Essayez différentes structures possibles
        if (apiUserData.user) {
          // Structure: { success: true, user: {...} }
          user = apiUserData.user;
        } else if (apiUserData.id) {
          // Structure: user directement
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
          adresse: user.adresse || '',
          Profession: user.Profession || '',
          onboarding_completed: user.onboarding_completed || false,
          onboarding_step: user.onboarding_step || 1,
          langue_parlee: Array.isArray(user.langue_parlee) ? user.langue_parlee : [],
          company_name: user.company_name,
          niveau_expertise: user.niveau_expertise,
          niveau_perte_auditive: user.niveau_perte_auditive
        });
      }
    }, [apiUserData]);

  // Fonction pour obtenir l'URL complète de l'avatar  
  const getAvatarUrl = (avatarPath: string | undefined): string => {
    if (!avatarPath) return '';
  
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  
       // Extraire juste le nom du fichier
      const filename = avatarPath.split('/').pop() || '';
    return `${baseUrl}/avatars/${filename}`;
  };

  const avatarUrl = getAvatarUrl(userData.avatar);

 // Fonction pour obtenir les initiales
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div>
      <DashboardHeader 
             userName={`${userData.name} ${getInitials(userData.forename)}.`}
             userRole={userData.role}
             userEmail={userData.email}
             userAvatar={avatarUrl}
      />

      <CommunicationLayout>
        {/* Colonne gauche : ConversationList */}
        <div className="col-span-3 border-r px-3 overflow-y-auto h-[700px]">
          <ConversationList
            users={users}
            onSelectUser={(userId) => console.log("Utilisateur sélectionné :", userId)}
          />
        </div>

        {/* Colonne centrale : ChatLayout */}
        <div className="col-span-6 px-4 overflow-y-auto h-[700px]">
          <ChatLayout />
        </div>

        {/* Colonne droite : FileHistory */}
        <div className="col-span-3 border-l px-3 overflow-y-auto h-[700px]">
          <FileHistory />
        </div>
      </CommunicationLayout>

      <Footer />
    </div>
  );
}
