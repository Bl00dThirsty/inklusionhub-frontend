"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  useGetUsersQuery,
  useCreateOrGetConversationMutation,
} from "@/state/chatApi";

interface User {
  id: string;
  name: string;
  avatar?: string | null;
  online?: boolean;
}

interface UserSearchDrawerProps {
  onClose: () => void;
  onSelectConversation: (conversationId: string) => void;
}

export default function UserSearchDrawer({
  onClose,
  onSelectConversation,
}: UserSearchDrawerProps) {
  const { data: allUsers, isFetching: fetchingUsers } = useGetUsersQuery();
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [createOrGetConversation] = useCreateOrGetConversationMutation();

  // Filtrage au fur et à mesure que l'utilisateur tape
  useEffect(() => {
    if (!allUsers) return;
    setFilteredUsers(
      allUsers.filter((u) =>
        u.name.toLowerCase().includes(query.toLowerCase())
      )
    );
    console.log(
      "[Chat] Utilisateurs filtrés:",
      query,
      filteredUsers.map((u) => u.name)
    );
  }, [query, allUsers]);

  const handleSelectUser = async (userId: string) => {
    try {
      const conversation = await createOrGetConversation({ userId }).unwrap();
      console.log("[Chat] Conversation créée/récupérée :", conversation);
      onSelectConversation(conversation.id);
      onClose();
    } catch (err) {
      console.error("[Chat] Erreur création conversation :", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col">
      <div className="p-4 border-b flex items-center gap-2">
        <Search size={18} />
        <input
          className="flex-1 outline-none"
          placeholder="Rechercher un utilisateur..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={onClose}>✕</button>
      </div>

      <div className="flex-1 overflow-y-auto ">
        {fetchingUsers && <p className="p-4 text-center">Chargement...</p>}
        {!fetchingUsers &&
          filteredUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelectUser(user.id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-black"
            >
              <img
                src={user.avatar || "/default-avatar.png"}
                className="w-10 h-10 rounded-full"
              />
              <span>{user.name}</span>
              {user.online && (
                <span className="ml-auto w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
              )}
            </button>
          ))}
        {!fetchingUsers && filteredUsers.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            Aucun utilisateur trouvé
          </p>
        )}
      </div>
    </div>
  );
}
