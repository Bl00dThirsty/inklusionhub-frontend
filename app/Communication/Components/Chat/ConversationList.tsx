"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Conversation } from "@/state/chatApi";
import UserSearchDrawer from "./UserSearchDrawer";

interface Props {
  conversations: Conversation[];
  currentUserId: string;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  onSelectConversation,
}: Props) {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filtered = conversations
  // ✅ garder uniquement les conversations avec messages
  .filter((conv) => conv.last_message !== null)
  // ✅ filtre de recherche
  .filter((conv) => {
    const other = conv.participants.find((u) => u.id !== currentUserId);
    return other?.name.toLowerCase().includes(search.toLowerCase());
  });


  const handleUserSelected = (conversationId: string) => {
    // Ajouter la conversation à la liste
    onSelectConversation(conversationId);
    setIsDrawerOpen(false);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2">
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full hover:bg-blue-500"
        >
          <Plus size={16} />
        </button>

        <input
          className="flex-1 mt-2 px-3 py-2 border rounded-lg text-sm"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto ">
        {filtered.map((conv) => {
          const other = conv.participants.find(
            (u) => u.id !== currentUserId
          );
          if (!other) return null;

          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full flex items-center gap-3 p-3 text-left ${
                conv.id === activeConversationId
                  ? "bg-gray-100"
                  : "hover:bg-gray-50"
              }`}
            >
              <img
                src={other.avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full"
              />

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-black">{other.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {conv.last_message?.content ?? "Aucun message"}
                </p>
              </div>

              {conv.unread_count > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {conv.unread_count}
                </span>
              )}
            </button>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-gray-500 p-4">Aucune conversation trouvée</p>
        )}
      </div>

      {/* UserSearchDrawer */}
      {isDrawerOpen && (
        <UserSearchDrawer
          onClose={() => setIsDrawerOpen(false)}
          onSelectConversation={handleUserSelected}
        />
      )}
    </div>
  );
}
