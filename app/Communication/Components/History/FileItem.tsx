"use client";

import { 
  FileText, 
  Image, 
  FileVideo, 
  Music, 
  Archive, 
  FileSpreadsheet, 
  FileType,
  Download,
  File,
  ExternalLink
} from "lucide-react";
import { useState } from "react";

export interface FileItemProps {
  id: string;
  name: string;
  url: string;
  size?: string;
  senderName?: string;
  createdAt?: string;
  fileType?: string;
}

export default function FileItem({
  id,
  name,
  url,
  size = "—",
  senderName,
  createdAt,
  fileType = "document",
}: FileItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Formatage de la date
  const formattedTime = createdAt
    ? new Date(createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // Obtenir l'icône appropriée
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image size={20} className="text-purple-600 flex-shrink-0" />;
      case 'pdf':
        return <FileText size={20} className="text-red-600 flex-shrink-0" />;
      case 'word':
        return <FileText size={20} className="text-blue-600 flex-shrink-0" />;
      case 'excel':
        return <FileSpreadsheet size={20} className="text-green-600 flex-shrink-0" />;
      case 'powerpoint':
        return <FileType size={20} className="text-orange-600 flex-shrink-0" />;
      case 'video':
        return <FileVideo size={20} className="text-purple-500 flex-shrink-0" />;
      case 'audio':
        return <Music size={20} className="text-green-500 flex-shrink-0" />;
      case 'archive':
        return <Archive size={20} className="text-yellow-600 flex-shrink-0" />;
      default:
        return <File size={20} className="text-gray-600 flex-shrink-0" />;
    }
  };

  // Formater le nom du fichier
  const formatFileName = (fileName: string) => {
    if (fileName.length > 35) {
      return fileName.substring(0, 32) + '...';
    }
    return fileName;
  };
  // Fonction pour ouvrir le fichier
  /*const handleOpenFile = (e: React.MouseEvent) => {
    // Pour les PDF et images, ouvrir dans un nouvel onglet
    if (fileType === 'pdf' || fileType === 'image') {
      e.preventDefault();
      window.open(url, '_blank');
    }
  };*/

  return (
    <div className="relative group">
      <div
        className={`flex items-center gap-3 p-3 border border-gray-200 rounded-lg 
                   transition-all duration-200 bg-white hover:bg-gray-50 
                   hover:shadow-sm cursor-pointer ${isHovered ? 'bg-gray-50' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        //onClick={handleOpenFile}
      >
        {/* Icône du fichier */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
            {getFileIcon()}
          </div>
        </div>

        {/* Informations du fichier */}
        <div className="flex-1 min-w-0">
          {/* Nom du fichier avec optimisation Chrome */}
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate 
                         antialiased subpixel-antialiased tracking-tight">
              {formatFileName(name)}
            </p>
          </div>
          
          {/* Métadonnées */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs">
            {senderName && (
              <span className="text-gray-600 font-medium truncate">
                {senderName}
              </span>
            )}
            
            <div className="flex items-center gap-1 text-gray-500">
              {size && (
                <>
                  <span className="font-medium">{size}</span>
                  {formattedTime && <span className="hidden sm:inline">•</span>}
                </>
              )}
              {formattedTime && (
                <span className="text-gray-500">{formattedTime}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Indicateur de survol */}
      <div className={`absolute inset-0 rounded-lg border-2 border-transparent 
                      transition-all duration-200 pointer-events-none
                      ${isHovered ? 'border-[#008069]/20' : ''}`} />
    </div>
  );
}