"use client";

import { useEffect, useRef, useState } from "react";

interface UseChatSocketProps {
  currentUserId: string;
  conversationId?: string | null;
}

// 🔹 Type pour message WebSocket
export interface ChatMessageWS {
  id: string;
  content: string;
  sender: { id: string; name: string; avatar?: string };
  timestamp: string;
  read?: boolean;
  image?: string | null;
  file?: string | null;
  fileName?: string;
  fileSize?: number;
}

export const useChatSocket = ({ currentUserId, conversationId }: UseChatSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  // ─── Messages WS
  const [wsMessages, setWsMessages] = useState<ChatMessageWS[]>([]);

  // ─── Présence utilisateurs
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});

  // ─── Typing status
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // ─── Connexion WebSocket
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const baseUrl = process.env.NEXT_PUBLIC_WS_BASE_URL;
    if (!baseUrl) return console.error("[WS] BASE URL non définie");

    wsRef.current = new WebSocket(`${baseUrl}/ws/user/?token=${token}`);

    wsRef.current.onopen = () => console.log("[WS] Connecté");

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "chat_message":
          // 🔹 Assurer que le message contient id et timestamp
          const msg: ChatMessageWS = {
            id: data.data.id,
            content: data.data.content,
            sender: data.data.sender,
            timestamp: data.data.timestamp,
            read: data.data.read,
            image: data.data.image || null,
            file: data.data.file || null,
            fileName: data.data.file_name || data.data.fileName,
            fileSize: data.data.file_size || data.data.fileSize,
          };
          console.log("[WS] Nouveau message :", msg);
          setWsMessages((prev) => [...prev, msg]);
          break;

        case "user_status":
           console.log("[WS] Statut utilisateur :", data.user_id, data.online);
          setOnlineUsers((prev) => ({ ...prev, [data.user_id]: data.online }));
          break;

        case "typing":
          console.log("[WS] Typing :", data.user_id, data.is_typing);
          setTypingUsers((prev) => ({ ...prev, [data.user_id]: data.is_typing }));
          break;

        case "read_receipt":
          console.log("[WS] Message lu :", data.message_id);
          setWsMessages((prev) =>
            prev.map((msg) =>
              msg.id === data.message_id ? { ...msg, read: true } : msg
            )
          );
          break;

        default:
          break;
      }
    };

    wsRef.current.onclose = () => console.log("[WS] Déconnecté");

    return () => wsRef.current?.close();
  }, []);

  // ─── Envoi message (texte + fichier/image)
  const sendMessageWS = (message: ChatMessageWS) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: "chat_message",
        data: message,
      })
    );
  };

  // ─── Envoi typing
  const sendTypingWS = (isTyping: boolean, convId?: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: "typing",
        is_typing: isTyping,
        conversation_id: convId ?? conversationId,
      })
    );
  };

  // ─── Envoi read receipt
  const sendReadReceiptWS = (messageId: string) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        type: "read_receipt",
        message_id: messageId,
      })
    );
  };

  // ─── Helpers
  const isUserOnline = (userId: string) => !!onlineUsers[userId];
  const isUserTyping = (userId: string) => !!typingUsers[userId];

  return {
    wsMessages,
    sendMessageWS,
    sendTypingWS,
    sendReadReceiptWS,
    isUserOnline,
    isUserTyping,
  };
};
