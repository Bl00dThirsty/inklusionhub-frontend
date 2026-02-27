"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "@/state/api";
import CommunicationLayout from "./Chat/ComLayout";
import ChatLayout from "./Chat/ChatLayout";
import DashboardHeader from "@/app/Components/DashboardHeader";
import Footer from "@/app/Components/Footer"

interface Profile {
  name: string;
  forename: string;
  avatar?: string;
  role: string;
  email: string;
}

interface CurrentUser {
  id: string; // pour le chat
}

export default function CommunicationPage() {
  const router = useRouter();
  const { data: apiUserData } = useGetCurrentUserQuery();

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [profile, setProfile] = useState<Profile>({
    name: "",
    forename: "",
    avatar: "",
    role: "malentendant",
    email: "",
  });

  // Vérification de l'authentification
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) router.push("/");
  }, [router]);

  // Mise à jour des données après réponse API
  useEffect(() => {
    if (!apiUserData) return;

    const user = apiUserData.user || apiUserData;

    setCurrentUser({ id: (user.id) });
    setProfile({
      name: user.name || "",
      forename: user.forename || "",
      avatar: user.avatar || "",
      role: user.role || "malentendant",
      email: user.email || "",
    });
  }, [apiUserData]);

  // URL complète de l'avatar
  const getAvatarUrl = (avatarPath?: string) => {
    if (!avatarPath) return "/default-avatar.jpg";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const filename = avatarPath.split("/").pop() || "";
    return `${baseUrl}/avatars/${filename}`;
  };

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Initiales
  const getInitials = (name: string) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (!currentUser) return <p>Chargement...</p>; // éviter le rendu avant récupération

  return (
    <div className="flex flex-col h-screen overflow-auto bg-gray-50">
      {/* Header 
      <DashboardHeader
        userName={`${profile.name} ${getInitials(profile.forename)}`}
        userRole={profile.role}
        userEmail={profile.email}
        userAvatar={getAvatarUrl(profile.avatar)}
      />*/}

      {/* Layout communication */}
      <CommunicationLayout>
        {/* Colonne centrale : Chat */}
        <div className="chat-responsive-wrapper col-span-12 md:col-span-12 px-2 md:px-4 overflow-y-auto h-[700px] md:h-[700px]">
          <ChatLayout conversationId={activeConversationId} currentUserId={currentUser.id.toString()} />
        </div>
      </CommunicationLayout>

      {/* Footer 
      <Footer />*/}
    </div>
  );
}
