import { 
  Check, 
  CheckCheck, 
  File, 
  FileText, 
  Image, 
  Video, 
  Music, 
  FolderArchive,
  FileCode2,
  FileJson,
  FileCog,
  Phone
} from "lucide-react";
import { useRef, useState } from "react";

interface ChatMessageProps {
  messageId: string;
  message?: string;
  type?: "text" | "image" | "file" | "voice" | "call-audio" | "call-video" | "deleted";
  image?: string | null;
  file?: string | null;
  fileName?: string;
  fileSize?: number;
  voice?: { audio: string; duration: number };
  currentUrl?: string | null;
  currentTime?: number;
  duration?: number;
  isPlaying?: boolean;
  onPlayVoice?: (url: string) => void;
  callStatus?: "ringing" | "ongoing" | "ended" | "missed";
  callDuration?: number;
  createdAt?: string;
  senderId: string;
  isOwn: boolean;
  read?: boolean;
  previousSenderId?: string | null;
  onDelete?: (messageId: string, forEveryone: boolean) => void;
  selectionMode: boolean;
  selectedMessages: string[];
  setSelectedMessages: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatMessage({ 
  onDelete,
  messageId,
  type = "text", 
  message, 
  image, 
  file, 
  fileName, 
  fileSize, 
  voice, 
  currentUrl, 
  currentTime, 
  duration, 
  isPlaying, 
  onPlayVoice,
  callStatus, 
  callDuration, 
  createdAt, 
  senderId, 
  isOwn, 
  read, 
  previousSenderId,
  selectionMode,
  selectedMessages,
  setSelectedMessages,
  setSelectionMode
}: ChatMessageProps) {
  const timestamp = createdAt
    ? new Date(createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : "";

  const isImage = image && /\.(png|jpe?g|webp|gif|svg|bmp|tiff?)$/i.test(image);
  const isConsecutive = previousSenderId === senderId;
  const isSelected = selectedMessages.includes(messageId);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Déterminer l'icône du fichier
  const getFileIcon = (filename?: string) => {
    if (!filename) return <File size={20} className="text-gray-700" />;
    
    const extension = filename.split('.').pop()?.toLowerCase();
    
    if (['pdf'].includes(extension || '')) {
      return <FileText size={20} className="text-red-600" />;
    }
    if (['doc', 'docx', 'odt'].includes(extension || '')) {
      return <FileText size={20} className="text-blue-600" />;
    }
    if (['xls', 'xlsx', 'csv', 'ods'].includes(extension || '')) {
      return <FileText size={20} className="text-green-600" />;
    }
    if (['ppt', 'pptx', 'odp'].includes(extension || '')) {
      return <FileText size={20} className="text-orange-600" />;
    }
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff', 'tif'].includes(extension || '')) {
      return <Image size={20} className="text-purple-600" />;
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'mkv', 'flv', 'webm'].includes(extension || '')) {
      return <Video size={20} className="text-purple-500" />;
    }
    if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a', 'wma'].includes(extension || '')) {
      return <Music size={20} className="text-green-500" />;
    }
    if (['zip', 'rar', '7z', 'tar', 'gz', 'bz2'].includes(extension || '')) {
      return <FolderArchive size={20} className="text-yellow-600" />;
    }
    if (['js', 'ts', 'jsx', 'tsx', 'py', 'java', 'cpp', 'c', 'cs', 'php', 'rb', 'go'].includes(extension || '')) {
      return <FileCode2 size={20} className="text-yellow-500" />;
    }
    if (['html', 'htm', 'css', 'scss', 'sass', 'less'].includes(extension || '')) {
      return <FileCode2 size={20} className="text-orange-500" />;
    }
    if (['json', 'xml', 'yml', 'yaml'].includes(extension || '')) {
      return <FileJson size={20} className="text-gray-600" />;
    }
    if (['txt', 'rtf', 'md', 'markdown', 'log'].includes(extension || '')) {
      return <FileText size={20} className="text-gray-700" />;
    }
    
    return <File size={20} className="text-gray-700" />;
  };

  // Formatage de la taille du fichier
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Formatage de la durée
  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Long press (mobile) - Active le mode sélection
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isOwn) return;
    e.preventDefault();
    
    longPressTimer.current = setTimeout(() => {
      setSelectionMode(true);
      setSelectedMessages((prev) => [...prev, messageId]);
    }, 500); // 500ms comme WhatsApp
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Clic droit (desktop) - Active le mode sélection
  const handleContextMenu = (e: React.MouseEvent) => {
    if (!isOwn) return;
    e.preventDefault();
    
    setSelectionMode(true);
    setSelectedMessages((prev) => [...prev, messageId]);
  };

  // Clic en mode sélection - Sélectionne/désélectionne le message
  const handleClick = (e: React.MouseEvent) => {
    if (selectionMode) {
      e.stopPropagation();
      setSelectedMessages((prev) =>
        prev.includes(messageId)
          ? prev.filter(id => id !== messageId)
          : [...prev, messageId]
      );
    }
  };

  // Props d'interaction
  const interactionProps = {
    onClick: handleClick,
    onContextMenu: handleContextMenu,
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
  };

  // Classes conditionnelles
  const bubbleClass = isOwn
    ? isConsecutive
      ? "bg-[#82EFCF] rounded-tr-xl rounded-bl-xl rounded-tl-xl"
      : "bg-[#82EFCF] rounded-tr-xl rounded-tl-xl rounded-bl-xl"
    : isConsecutive
    ? "bg-gray-200 rounded-tl-xl rounded-br-xl rounded-tr-xl"
    : "bg-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-xl";

  // Message supprimé
  if (type === "deleted") {
    return (
      <div className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
        <div className={`px-4 py-2 text-sm italic text-gray-500 ${bubbleClass}
        ${isSelected ? "ring-2 ring-green-500 bg-green-100" : ""}`}>
          Ce message a été supprimé
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[70%] flex flex-col ${isOwn ? "items-end" : "items-start"} relative`}>
        
        {/* Message texte */}
        {type === "text" && message && (
          <div 
            {...interactionProps} 
            className={`relative px-4 py-2 text-sm shadow-sm ${bubbleClass} ${
              selectionMode && isSelected ? 'ring-2 ring-green-500 bg-green-100' : ''
            }`} 
            style={{ wordBreak: "break-word" }}
          >
            <div className="break-words whitespace-pre-wrap overflow-wrap-anywhere text-gray-900">
              {message}
            </div>
            {isOwn && (
              <span className="absolute bottom-1 right-1">
                {read ? (
                  <CheckCheck size={16} className="text-blue-500" />
                ) : (
                  <Check size={16} className="text-gray-600" />
                )}
              </span>
            )}
          </div>
        )}

        {/* VOICE */}
        {type === "voice" && voice?.audio && (
          <div 
            {...interactionProps} 
            className={`${bubbleClass} px-3 py-2 rounded-xl flex items-center gap-3 max-w-xs ${
              selectionMode && isSelected ? 'ring-2 ring-green-500 bg-green-100' : ''
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPlayVoice?.(voice.audio);
              }}
              className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center"
            >
              {isPlaying && currentUrl === voice.audio ? "⏸" : "▶"}
            </button>

            <div className="flex-1 h-1 bg-gray-300 rounded overflow-hidden">
              <div
                className="h-full bg-green-700"
                style={{
                  width: currentUrl === voice.audio && duration
                    ? `${(currentTime! / duration) * 100}%`
                    : "0%",
                }}
              />
            </div>

            <span className="text-xs font-mono text-gray-700">
              {formatDuration(voice.duration)}
            </span>
          </div>
        )}

        {/* Image */}
        {image && isImage && (
          <div 
            {...interactionProps} 
            className={`relative mt-1 ${isConsecutive ? 'mt-1' : 'mt-2'}`}
          >
            <div className={`rounded-xl shadow-md overflow-hidden ${bubbleClass} ${
              selectionMode && isSelected ? 'ring-2 ring-green-500 bg-green-100 rounded-xl p-1' : ''
            }`}>
              <img
                src={image}
                className="max-w-[220px] max-h-[220px] object-cover"
                alt={fileName || "Image partagée"}
              />
            </div>
            {isOwn && (
              <div className="absolute bottom-2 right-2">
                {read ? (
                  <CheckCheck size={16} className="text-blue-500" />
                ) : (
                  <Check size={16} className="text-gray-600" />
                )}
              </div>
            )}
          </div>
        )}

        {/* Fichier */}
        {file && !isImage && (
          <div 
            {...interactionProps} 
            className={`relative mt-1 ${isConsecutive ? 'mt-1' : 'mt-2'}`}
          >
            <div className={`relative ${bubbleClass} ${
              selectionMode && isSelected ? 'ring-2 ring-green-500 bg-green-100 rounded-xl p-1' : ''
            }`}>
              <a
                href={file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 px-4 py-3 rounded-xl shadow-sm no-underline hover:opacity-90 transition-opacity"
                onClick={(e) => selectionMode && e.preventDefault()}
              >
                <div className="flex-shrink-0">
                  {getFileIcon(fileName)}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-medium block truncate text-gray-900">
                    {fileName || "Fichier"}
                  </span>
                  {fileSize && (
                    <span className="text-xs text-gray-600 block mt-1">
                      {formatFileSize(fileSize)}
                    </span>
                  )}
                </div>
              </a>
              {isOwn && (
                <div className="absolute bottom-2 right-2">
                  {read ? (
                    <CheckCheck size={16} className="text-blue-500" />
                  ) : (
                    <Check size={16} className="text-gray-600" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Appel */}
        {(type === "call-audio" || type === "call-video") && (
          <div 
            {...interactionProps} 
            className={`flex items-center gap-3 ${bubbleClass} px-4 py-2 rounded-xl ${
              selectionMode && isSelected ? 'ring-2 ring-green-500 bg-green-100' : ''
            }`}
          >
            <Phone
              size={18}
              className={callStatus === "missed" ? "text-red-500" : "text-green-600"}
            />
            <div className="flex flex-col">
              <span className="text-sm text-gray-900">
                {callStatus === "missed"
                  ? "Appel manqué"
                  : type === "call-video"
                  ? "Appel vidéo"
                  : "Appel audio"}
              </span>
              {callStatus !== "missed" && callDuration && (
                <span className="text-xs text-gray-600">
                  {formatDuration(callDuration)}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {!isConsecutive && timestamp && (
          <span className="text-[10px] text-gray-500 mt-1 px-1">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}