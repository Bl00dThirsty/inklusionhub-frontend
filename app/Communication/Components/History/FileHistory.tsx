"use client";

import FileItem from "./FileItem";
import { useGetConversationFilesQuery } from "@/state/chatApi";
import { File, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface FileHistoryProps {
  conversationId: string | null;
}

interface ConversationFile {
  id: string;
  file?: string;
  image?: string;
  sender_name?: string;
  created_at?: string;
  file_name?: string;
  file_size?: number;
  sender_id?: string;
}

export default function FileHistory({ conversationId }: FileHistoryProps) {
  const { data: files = [], isLoading, refetch } =
    useGetConversationFilesQuery(conversationId!, {
      skip: !conversationId,
      refetchOnMountOrArgChange: true,
    });

  // Force un refetch quand la conversation change
  useEffect(() => {
    if (conversationId) {
      refetch();
    }
  }, [conversationId, refetch]);

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <File className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500 text-sm text-center">
          Sélectionnez une conversation
          <br />
          pour voir les fichiers partagés
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <Loader2 className="w-8 h-8 text-[#008069] animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Chargement des fichiers…</p>
      </div>
    );
  }

  const fileList = files as ConversationFile[];
  const totalSize = fileList.reduce((sum, file) => sum + (file.file_size || 0), 0);

  return (
    <div className="h-full flex flex-col">

      {/* Liste des fichiers avec scroll */}
      <div className="flex-1 overflow-y-auto ">
        <div className="p-4 space-y-3">
          {fileList.map((file) => {
            const url = file.file ?? file.image;
            if (!url) return null;

            const name = file.file_name || 
                        url.split("/").pop()?.split("?")[0] || 
                        "Document";

            const createdAt = typeof file.created_at === "string"
              ? file.created_at
              : undefined;

            const senderName = file.sender_name || "Utilisateur";

            return (
              <FileItem
                key={file.id}
                id={file.id}
                name={name}
                url={url}
                size={file.file_size ? formatFileSize(file.file_size) : "—"}
                senderName={senderName}
                createdAt={createdAt}
                fileType={getFileType(url, name)}
              />
            );
          })}

          {fileList.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12">
              <File className="w-16 h-16 text-gray-300 mb-4" />
              <p className="text-gray-500 text-sm text-center">
                Aucun fichier partagé dans cette conversation
              </p>
              <p className="text-gray-400 text-xs mt-1">
                Les fichiers que vous envoyez apparaîtront ici
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour formater la taille
const formatFileSize: (bytes: number) => string | undefined = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

// Fonction utilitaire pour déterminer le type de fichier
const getFileType: (arg0: string, arg1: string) => string | undefined=(url: string, name: string): string => {
  const extension = name.split('.').pop()?.toLowerCase() || '';
  
  if (url.includes('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
    return 'image';
  }
  if (['pdf'].includes(extension)) {
    return 'pdf';
  }
  if (['doc', 'docx'].includes(extension)) {
    return 'word';
  }
  if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return 'excel';
  }
  if (['ppt', 'pptx'].includes(extension)) {
    return 'powerpoint';
  }
  if (['mp4', 'avi', 'mov', 'mkv'].includes(extension)) {
    return 'video';
  }
  if (['mp3', 'wav', 'flac'].includes(extension)) {
    return 'audio';
  }
  if (['zip', 'rar', '7z'].includes(extension)) {
    return 'archive';
  }
  return 'document';
}

// Fonction pour obtenir la date du dernier fichier
function getLastFileDate(files: ConversationFile[]): string {
  if (files.length === 0) return "—";
  
  const lastFile = files.reduce((latest, file) => {
    const fileDate = file.created_at ? new Date(file.created_at).getTime() : 0;
    const latestDate = latest.created_at ? new Date(latest.created_at).getTime() : 0;
    return fileDate > latestDate ? file : latest;
  });
  
  if (!lastFile.created_at) return "—";
  
  const date = new Date(lastFile.created_at);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
  
  if (diffDays === 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}