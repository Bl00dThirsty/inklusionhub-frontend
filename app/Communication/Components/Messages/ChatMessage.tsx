import { Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  messageId: string;
  message?: string;
  image?: string | null;
  file?: string | null;
  fileName?: string;
  fileSize?: number; // en octets
  createdAt?: string;
  senderId: string;
  isOwn: boolean;
  read?: boolean;
  previousSenderId?: string | null; // pour fusionner bulles
}

export default function ChatMessage({
  messageId,
  message,
  image,
  file,
  fileName,
  fileSize,
  createdAt,
  senderId,
  isOwn,
  read,
  previousSenderId,
}: ChatMessageProps) {
  const timestamp = createdAt
    ? new Date(createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  const isImage = image && /\.(png|jpe?g|webp|gif)$/i.test(image);

  // Fusion des bulles si même utilisateur que le précédent
  const bubbleClass = isOwn
    ? previousSenderId === senderId
      ? "bg-[#82EFCF]  rounded-tr-xl rounded-bl-xl rounded-tl-xl"
      : "bg-[#82EFCF] rounded-br-none rounded-tr-xl rounded-tl-xl rounded-bl-xl"
    : previousSenderId === senderId
    ? "bg-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xl"
    : "bg-gray-200 rounded-bl-none rounded-tl-xl rounded-tr-xl rounded-br-xl";

  return (
    <div className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
        {message && (
          <div className={`px-4 py-2 text-sm shadow-sm whitespace-pre-wrap relative text-black ${bubbleClass}`}>
            <span>{message}</span>
            {isOwn && (
              <span className="absolute bottom-1 right-1">
                {read ? (
                  <CheckCheck size={16} className="text-blue-500" />
                ) : (
                  <Check size={16} className="text-gray-400" />
                )}
              </span>
            )}
          </div>
        )}

        {image && isImage && (
          <img
            src={image}
            className="rounded-xl shadow-md mt-1 max-w-[220px] max-h-[220px]"
          />
        )}

        {file && !isImage && (
          <a
            href={file}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-start gap-1 px-4 py-2 mt-1 rounded-xl shadow-sm text-sm underline ${
              isOwn ? "bg-[#82EFCF]" : "bg-gray-200"
            }`}
          >
            <span>📄 {fileName || "Fichier"}</span>
            {fileSize && (
              <span className="text-[10px] text-gray-500">
                {(fileSize / 1024).toFixed(2)} KB
              </span>
            )}
          </a>
        )}

        <span className="text-[10px] text-gray-500 mt-1">{timestamp}</span>
      </div>
    </div>
  );
}
