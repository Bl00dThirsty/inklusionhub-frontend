"use client";

import Image from "next/image";

interface ConversationItemProps {
  name: string;
  lastMessage: string;
  avatar: string;
}

export default function ConversationItem({ name, lastMessage, avatar }: ConversationItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 border rounded-lg hover:bg-gray-100 cursor-pointer">
      <Image src={avatar} alt="Avatar" width={40} height={40} className="rounded-full" />
      <div>
        <p className="font-medium text-black">{name}</p>
        <p className="text-xs text-gray-500">{lastMessage}</p>
      </div>
    </div>
  );
}
