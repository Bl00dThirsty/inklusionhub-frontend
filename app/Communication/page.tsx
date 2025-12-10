"use client";
import Header from "@/app/Components/Header";
import Footer from "@/app/Components/Footer";
import CommunicationLayout from "./Components/Chat/ComLayout";
import ConversationList from "./Components/Chat/ConversationList";
import ChatLayout from "./Components/Chat/ChatLayout";
import FileHistory from "./Components/History/FileHistory";

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

  return (
    <div>
      <Header />

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
