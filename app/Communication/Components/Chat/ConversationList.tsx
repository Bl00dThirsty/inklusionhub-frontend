"use client";

import { useState } from "react";
import { FileText, ImageIcon, Mic, Phone, Plus, Search, Video, Check, CheckCheck } from "lucide-react";
import { Conversation } from "@/state/chatApi";
import UserSearchDrawer from "./UserSearchDrawer";

interface Props {
  conversations: Conversation[];
  currentUserId: string;
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
}

export default function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  onSelectConversation,
}: Props) {
  const [search, setSearch] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filtered = conversations
    .filter((conv) => conv.last_message !== null)
    .filter((conv) => {
      const other = conv.participants.find((u) => u.id !== currentUserId);
      return other?.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => {
      // Trier par date du dernier message (le plus récent en premier)
      const dateA = a.last_message?.timestamp ? new Date(a.last_message.timestamp).getTime() : 0;
      const dateB = b.last_message?.timestamp ? new Date(b.last_message.timestamp).getTime() : 0;
      return dateB - dateA;
    });

  const handleUserSelected = (conversationId: string) => {
    onSelectConversation(conversationId);
    setIsDrawerOpen(false);
  };

  // Format last message based on type
  const formatLastMessage = (conv: Conversation) => {
    const lastMessage = conv.last_message;
    if (!lastMessage) return "Aucun message";
    
    const senderPrefix = lastMessage.sender_id === currentUserId ? "Vous : " : "";

    switch (lastMessage.type) {
      case "image":
        return (
          <div className="flex items-center gap-1">
            <ImageIcon size={12} className="text-gray-500" />
            <span className="text-gray-500 text-xs">{senderPrefix}Photo</span>
          </div>
        );
        
      case "file":
        return (
          <div className="flex items-center gap-1">
            <FileText size={12} className="text-gray-500" />
            <span className="text-gray-500 text-xs truncate">
              {senderPrefix}{lastMessage.file_name || "Document"}
            </span>
          </div>
        );
        
      case "voice":
        return (
          <div className="flex items-center gap-1">
            <Mic size={12} className="text-gray-500" />
            <span className="text-gray-500 text-xs">{senderPrefix}Message vocal</span>
          </div>
        );
        
      case "call-audio":
        return (
          <div className="flex items-center gap-1">
            <Phone size={12} className="text-gray-500" />
            <span className="text-gray-500 text-xs">
              {senderPrefix}Appel audio
            </span>
          </div>
        );
        
      case "call-video":
        return (
          <div className="flex items-center gap-1">
            <Video size={12} className="text-gray-500" />
            <span className="text-gray-500 text-xs">
              {senderPrefix}Appel vidéo
            </span>
          </div>
        );
        
      default:
        return (
          <span className="text-gray-500 text-xs truncate">
            {senderPrefix}{lastMessage.content || "Message"}
          </span>
        );
    }
  };

  // Format time like WhatsApp
  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return date.toLocaleTimeString("fr-FR", { 
          hour: "2-digit", 
          minute: "2-digit" 
        });
      } else if (diffDays === 1) {
        return "Hier";
      } else if (diffDays < 7) {
        return date.toLocaleDateString("fr-FR", { weekday: "short" });
      } else {
        return date.toLocaleDateString("fr-FR", { 
          day: "2-digit", 
          month: "2-digit" 
        });
      }
    } catch {
      return "";
    }
  };

  return (
    <div className="flex flex-col h-full bg-white p-6 rounded-xl border border-gray-200 shadow-xl">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">Discussions</h2>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="flex items-center justify-center w-10 h-10 bg-[#00A884]  rounded-full text-white transition-colors"
            aria-label="Nouvelle discussion"
          >
            <Plus size={20} />
          </button>
        </div>
        
        <div className="relative shadow-sm rounded-lg">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 ">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00A884] text-gray-800"
            placeholder="Rechercher une conversation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto ">
        {filtered.map((conv) => {
          const other = conv.participants.find((u) => u.id !== currentUserId);
          if (!other) return null;

          const isActive = conv.id === activeConversationId;
          const lastMessage = conv.last_message;
          
          return (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full flex items-center gap-3 p-4 text-left border-b border-gray-200 hover:bg-gray-50 transition-colors  ${
                isActive ? "bg-[#F0F2F5]" : ""
              }`}
            >
              {/* Avatar with online status */}
              <div className="relative">
                <img
                  src={other.avatar || "/default-avatar.png"}
                  className="w-12 h-12 rounded-full object-cover"
                  //alt={other.name}
                />
                {other.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                {/* First line: Name and time */}
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-gray-800 truncate">{other.name}</p>
                  {lastMessage?.timestamp && (
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                      {formatTime(lastMessage.timestamp)}
                    </span>
                  )}
                </div>
                
                {/* Second line: Last message preview and status */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {formatLastMessage(conv)}
                  </div>
                  
                  {/* Message status and unread count */}
                  <div className="flex items-center gap-1 ml-2">
                    {lastMessage?.sender_id === currentUserId && (
                      <span className="text-gray-400">
                        {lastMessage?.read ? (
                          <CheckCheck size={16} className="text-blue-500" />
                        ) : (
                          <Check size={16} />
                        )}
                      </span>
                    )}
                    
                    {conv.unread_count > 0 && (
                      <span className="bg-[#25D366] text-white text-xs font-medium px-2 py-0.5 rounded-full min-w-[20px] flex items-center justify-center">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <Search size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 text-center">
              {search ? "Aucune conversation trouvée" : "Aucune conversation"}
            </p>
            {!search && (
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="mt-4 px-4 py-2 bg-[#00A884] text-white rounded-lg hover:bg-[#008069] transition-colors"
              >
                Commencer une discussion
              </button>
            )}
          </div>
        )}
      </div>

      {/* UserSearchDrawer */}
      {isDrawerOpen && (
        <UserSearchDrawer
          onClose={() => setIsDrawerOpen(false)}
          onSelectConversation={handleUserSelected}
        />
      )}
    </div>
  );
}