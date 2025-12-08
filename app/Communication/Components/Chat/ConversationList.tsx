"use client";
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import ConversationItem from "./ConversationItem";

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
  messages: { text: string }[];
}

interface ConversationListProps {
  users: {
    status: string;
    id: number;
    name: string;
    avatar: string;
    messages: {
      type: "sent" | "received" | "image";
      text?: string;
      image?: string;
      timestamp?: string;
    }[];
  }[];
  onSelectUser: (userId: number) => void;
}
export default function ConversationList({ users, onSelectUser }: ConversationListProps) {
  // On sélectionne par défaut le premier utilisateur en ligne
  const [activeUserId, setActiveUserId] = useState<number | null>(null);

  useEffect(() => {
    const onlineUser = users.find((u) => u.status === "En ligne");
    if (onlineUser) setActiveUserId(onlineUser.id);
  }, [users]);

  const handleSelectUser = (userId: number) => {
    setActiveUserId(userId);
    onSelectUser(userId);
  };

  return (
    <div className="col-span-3 border-r pr-4 flex flex-col h-full">
      <h2 className="font-semibold mb-3 text-black">Conversation</h2>

      {/* Barre de recherche */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher une discussion..."
          className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring focus:ring-primary/20"
        />
      </div>

      {/* Liste */}
      <div className="space-y-3 overflow-y-auto flex-1 pr-2">
        {users.map((user) => {
          const lastMessage =
            user.messages && user.messages.length > 0
              ? user.messages[user.messages.length - 1]?.text || ""
              : "";

          const isActive = user.id === activeUserId;

          return (
            <div
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className={`w-full text-left rounded-xl cursor-pointer ${
                isActive ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
            >
              <ConversationItem
                name={user.name}
                lastMessage={lastMessage}
                avatar={user.avatar}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
