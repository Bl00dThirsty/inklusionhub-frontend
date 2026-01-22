"use client";

import Image from "next/image";

interface User {
  id: number;
  name: string;
  avatar: string;
  status: string;
}

interface ChatSectionProps {
  users: User[];
  activeUserId: number | null;
  onSelectUser: (user: User) => void;
  className?: string;
}

export default function ChatSection({
  users,
  activeUserId,
  onSelectUser,
  className,
}: ChatSectionProps) {
  return (
    <div className={`col-span-6 border-r px-4 overflow-y-auto h-full ${className}`}>
      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelectUser(user)}
          className={`flex items-center gap-3 p-4 mb-2 cursor-pointer rounded-lg transition hover:bg-gray-100 ${
            activeUserId === user.id ? "bg-gray-200" : ""
          }`}
        >
          <Image
            src={user.avatar}
            alt={user.name}
            width={45}
            height={45}
            className="rounded-full"
          />
          <div>
            <p className="font-semibold text-black">{user.name}</p>
            <p className="text-xs text-gray-500">{user.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
