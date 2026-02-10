"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  avatar?: string | null;
}

interface UserListProps {
  users: User[];
  currentUserId: string; 
  onSelectUser: (userId: string) => void;
}

export default function UserList({ users, onSelectUser }: UserListProps) {
  const [search, setSearch] = useState("");

  // Filtrage côté frontend
  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 flex flex-col h-full">
      <h3 className="font-semibold text-black mb-3">Nouvelle discussion</h3>

      {/* Barre de recherche */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          className="w-full pl-10 pr-3 py-2 border rounded-lg text-sm focus:ring focus:ring-primary/20"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Liste des utilisateurs */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredUsers.length === 0 && <p className="text-gray-500">Aucun utilisateur trouvé</p>}
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            onClick={() => onSelectUser(user.id)}
            className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-50"
          >
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.name}
              className="w-9 h-9 rounded-full"
            />
            <span>{user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
