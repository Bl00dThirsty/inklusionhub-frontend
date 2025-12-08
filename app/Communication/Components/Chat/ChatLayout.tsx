"use client";

import { useState } from "react";
import ChatSection from "./chatSection";
import ChatMessage from "../Messages/ChatMessage";
import { SendHorizontal, Video } from "lucide-react";

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  messages: {
    type: "sent" | "received" | "image";
    text?: string;
    image?: string;
    timestamp?: string;
  }[];
}

export default function ChatLayout() {
  const users: User[] = [
    {
      id: 1,
      name: "Alice Dupont",
      avatar: "/images/avatar1.jpg",
      status: "En ligne",
      messages: [
        { type: "received", text: "Bonjour Alice, vous allez bien ?" },
        { type: "sent", text: "Oui merci ! C’est très clair." },
        { type: "image", image: "/images/lsf1.jpg" },
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

  const [activeUser, setActiveUser] = useState<User | null>(users[0]);

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 h-[600px] border rounded-lg overflow-hidden">
      {/* ChatSection à gauche 
      <div className="md:col-span-3 border-r md:border-r md:overflow-auto">
        <ChatSection
          users={users}
          activeUserId={activeUser?.id || null}
          onSelectUser={setActiveUser}
          className="w-full"
        />
      </div>*/}

      {/* Zone de messages à droite */}
      <div className="md:col-span-9 flex flex-col px-4 py-2 flex-1">
        {activeUser ? (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 pb-3 border-b">
              <div className="flex items-center gap-3">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-black">{activeUser.name}</p>
                  <p className="text-xs text-gray-500">{activeUser.status}</p>
                </div>
              </div>
              <div className="ml-auto">
                <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                  <Video size={18} />
                  <span>Appel vidéo avec sous-titres</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-3">
              {activeUser.messages.map((msg, idx) => (
                <ChatMessage key={idx} {...msg} />
              ))}
            </div>

            {/* Input */}
            <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Écrire un message..."
                className="w-full border rounded-lg px-3 py-2"
              />
              <SendHorizontal  className="bg-[#82EFCF] text-black px-4 py-2 rounded-lg font-semibold w-full sm:w-auto" />
              
            </div>
          </>
        ) : (
          <p className="text-gray-500">Sélectionnez un utilisateur pour voir les messages.</p>
        )}
      </div>
    </div>
  );
}
