"use client";

import FileItem from "./FileItem";
import { useGetConversationFilesQuery } from "@/state/chatApi";

interface FileHistoryProps {
  conversationId: string | null;
}

export default function FileHistory({ conversationId }: FileHistoryProps) {
  const { data: files = [], isLoading } =
    useGetConversationFilesQuery(conversationId!, {
      skip: !conversationId,
    });

  if (!conversationId) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Aucune conversation sélectionnée
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 text-sm text-gray-500">
        Chargement des fichiers…
      </div>
    );
  }

  return (
    <div className="px-3">
      <h2 className="font-semibold mb-3 text-black">
        Fichiers partagés
      </h2>

      <div className="space-y-3">
        {files.map((file) => {
          const url = file.file ?? file.image;
          if (!url) return null;

          const name =
            url.split("/").pop() ?? "Document";

          const createdAt =
            typeof file.created_at === "string"
              ? file.created_at
              : undefined;

          return (
            <FileItem
              key={file.id}
              name={name}
              url={url}
              senderName={file.sender_name}
              createdAt={createdAt}
            />
          );
        })}

        {files.length === 0 && (
          <p className="text-sm text-gray-500">
            Aucun fichier partagé
          </p>
        )}
      </div>
    </div>
  );
}
