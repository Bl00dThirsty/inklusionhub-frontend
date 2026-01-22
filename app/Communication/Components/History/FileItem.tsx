"use client";

import { FileText } from "lucide-react";

export interface FileItemProps {
  name: string;
  url: string;
  size?: string;
  senderName?: string;
  createdAt?: string;
}

export default function FileItem({
  name,
  url,
  size = "—",
  senderName,
  createdAt,
}: FileItemProps) {
  const time = createdAt
    ? new Date(createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-100"
    >
      <FileText size={22} className="text-blue-500" />

      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        {senderName && (
          <p className="text-xs text-gray-500">{senderName}</p>
        )}
        <p className="text-xs text-gray-400">
          {size} {time && `• ${time}`}
        </p>
      </div>
    </a>
  );
}
