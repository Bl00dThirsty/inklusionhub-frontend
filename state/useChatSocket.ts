"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useChatStore } from "./chatStore";

interface UseChatSocketProps {
  currentUserId: string;
  activeConversationId: string | null;
  onCallOffer?: (offer: RTCSessionDescriptionInit) => void;
  onCallAnswer?: (answer: RTCSessionDescriptionInit) => void;
  onCallIce?: (candidate: RTCIceCandidateInit) => void;
  onCallReject?: () => void;
}

export interface ChatMessageWS {
  id: string;
  content: string;
  sender: { id: string; name: string; avatar?: string };
  timestamp: string;
  read?: boolean;
  voice?: string | null;
  voiceDuration?: number | null;
  image?: string | null;
  file?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
  conversation_id?: string;
}

interface Notification {
  id: string;
  type: "new_message" | "new_conversation" | "presence" | "typing" | "read_receipt";
  data: any;
  timestamp: string;
  conversation_id?: string;
}

export const useChatSocket = ({ 
  currentUserId, 
  activeConversationId,
  onCallOffer,
  onCallAnswer,
  onCallIce,
  onCallReject, 
}: UseChatSocketProps) => {

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<Record<string, NodeJS.Timeout>>({});
  const messageQueueRef = useRef<any[]>([]);
  const joinedConversationsRef = useRef<Set<string>>(new Set());
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;
  const maxReconnectDelay = 30000;
  const isMounted = useRef(true);
 const connectingRef = useRef(false);

  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, { [conversationId: string]: boolean }>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<"disconnected" | "connecting" | "connected" | "error">("disconnected");

  const addNotification = useChatStore(state => state.addNotification);
  const applyIncomingNotification = useChatStore(state => state.applyIncomingNotification);
  const addMessage = useChatStore(state => state.addMessage);
  const setMessagesForConv = useChatStore(state => state.setMessagesForConv);
  const setMessageRead = useChatStore(state => state.setMessageRead);


   // --- STABILISATION DES CALLBACKS VIA REFS ---
  // Cela permet au WebSocket d'appeler la version la plus récente de tes fonctions sans se reconnecter
  const callbacksRef = useRef({
    onCallOffer, onCallAnswer, onCallIce, onCallReject
  });
  
  useEffect(() => {
    callbacksRef.current = { onCallOffer, onCallAnswer, onCallIce, onCallReject };
  }, [onCallOffer, onCallAnswer, onCallIce, onCallReject]);
  const clearTypingTimeout = useCallback((userId: string) => {
    if (typingTimeoutRef.current[userId]) {
      clearTimeout(typingTimeoutRef.current[userId]);
      delete typingTimeoutRef.current[userId];
    }
  }, []);

  const updateTypingStatus = useCallback((userId: string, convId: string, isTyping: boolean) => {
    setTypingUsers(prev => {
      const newTyping = { ...prev };
      if (isTyping) {
        if (!newTyping[userId]) newTyping[userId] = {};
        newTyping[userId][convId] = true;
        clearTypingTimeout(userId);
        typingTimeoutRef.current[userId] = setTimeout(() => updateTypingStatus(userId, convId, false), 3000);
      } else {
        if (newTyping[userId]) {
          delete newTyping[userId][convId];
          if (Object.keys(newTyping[userId]).length === 0) delete newTyping[userId];
        }
        clearTypingTimeout(userId);
      }
      return newTyping;
    });
  }, [clearTypingTimeout]);

  const processMessageQueue = useCallback(() => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    while (messageQueueRef.current.length > 0) {
      const message = messageQueueRef.current.shift();
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch {
        messageQueueRef.current.unshift(message);
        break;
      }
    }
  }, []);

  const sendMessage = useCallback((payload: any, queueIfOffline = true) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(payload));
        return true;
      } catch {
        if (queueIfOffline) messageQueueRef.current.push(payload);
        return false;
      }
    } else {
      if (queueIfOffline) messageQueueRef.current.push(payload);
      return false;
    }
  }, []);

 const handleChatMessage = useCallback((data: any) => {
  const messageData = data.data || data;

  //  Vérification minimale
  if (!messageData.id || !messageData.conversation_id) return;

  const msg: ChatMessageWS = {
    id: messageData.id,
    content: messageData.content,
    sender: {
      id: messageData.sender?.id ?? "",
      name: messageData.sender?.name ?? "Utilisateur",
    },
    timestamp: messageData.timestamp || new Date().toISOString(),
    read: messageData.is_read || false,
    conversation_id: messageData.conversation_id,
    image: messageData.image ?? null,
    file: messageData.file ?? null,
    voice: messageData.voice ?? null,
  };

  //  addMessage gère l'anti-doublon dans le store
  addMessage(msg, currentUserId);

}, [currentUserId]);

  const handleNotification = useCallback((data: any) => {
  const notifData = data.data ?? data;

  // Générer un id de fallback si absent pour ne jamais bloquer
  const notifId = notifData.id
    ? String(notifData.id)
    : `${notifData.conversation_id ?? "unknown"}-${Date.now()}`;

  const notifType = notifData.type ?? "new_message";

  if (!notifData.conversation_id) {
    console.error("[NOTIF]  conversation_id manquant:", notifData);
    return;
  }

  const notification: Notification = {
    id: notifId,
    type: notifType,
    data: notifData,
    timestamp: new Date().toISOString(),
    conversation_id: notifData.conversation_id,
  };

  addNotification(notification);
  applyIncomingNotification(notification, currentUserId);
}, [addNotification, applyIncomingNotification, currentUserId]);

 
// sans recréer le WebSocket à chaque changement
const onMessageRef = useRef(handleChatMessage);
const onNotifRef = useRef(handleNotification);
const onTypingRef = useRef(updateTypingStatus);

// Mets à jour les refs à chaque rendu (sans déclencher de useEffect)
useEffect(() => {
  onMessageRef.current = handleChatMessage;
  onNotifRef.current = handleNotification;
  onTypingRef.current = updateTypingStatus;
}, [handleChatMessage, handleNotification, updateTypingStatus]);



  // --- LOGIQUE DE CONNEXION PRINCIPALE ---
  //  Sortir handleChatMessage etc. des dépendances de connectWebSocket

const connectWebSocket = useCallback(() => {
  if (!isMounted.current || connectingRef.current) return;

  const token = localStorage.getItem("access_token");
  if (!token) { setConnectionStatus("error"); return; }

  if (wsRef.current?.readyState === WebSocket.OPEN || 
      wsRef.current?.readyState === WebSocket.CONNECTING) return;

  connectingRef.current = true;
  setConnectionStatus("connecting");

  const wsUrl = `ws://localhost:8000/ws/user/?token=${encodeURIComponent(token)}`;
  const ws = new WebSocket(wsUrl);
  wsRef.current = ws;

  ws.onopen = () => {
    connectingRef.current = false;
    reconnectAttempts.current = 0;
    setIsConnected(true);
    setConnectionStatus("connected");
    joinedConversationsRef.current.forEach(id =>
      sendMessage({ type: "join_conversation", conversation_id: id })
    );
    processMessageQueue();
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    pingIntervalRef.current = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) sendMessage({ type: "ping" }, false);
    }, 25000);
  };

  ws.onmessage = (event) => {
    if (!isMounted.current) return;
    try {
      const data = JSON.parse(event.data);
       console.log("[WS RAW FULL]", JSON.stringify(data));
      //console.log(" [WS RAW]", data.type, JSON.stringify(data).slice(0, 200));
      //  Utiliser les REFS au lieu des fonctions directes
      // Comme ça connectWebSocket ne dépend plus de handleChatMessage etc.
      switch (data.type) {
        case "conversation_history": {
          const { conversation_id, messages } = data;
          if (!conversation_id || !Array.isArray(messages)) break;
         setMessagesForConv(conversation_id, messages);
          break;
        }
        case "chat_message":
          onMessageRef.current(data);
          break;
        case "presence": {
          const { user_id, is_online } = data.data;
          setOnlineUsers(prev => ({ ...prev, [user_id]: is_online }));
          break;
        }
        case "typing": {
          const t = data.data;
          if (t.user_id !== currentUserIdRef.current) {
            onTypingRef.current(t.user_id, t.conversation_id, t.is_typing);
          }
          break;
        }
        case "read_receipt": {
          const rr = data.data || data;
          if (rr.conversation_id && rr.message_id) {
         setMessageRead(rr.conversation_id, rr.message_id);
          }
          break;
        }
        case "join_success":
          joinedConversationsRef.current.add(data.conversation_id);
          break;
        case "notification":
           console.log("[WS] Notification reçue, appel onNotifRef");
          onNotifRef.current(data);
          break;
        case "call.offer": callbacksRef.current.onCallOffer?.(data.offer); break;
        case "call.answer": callbacksRef.current.onCallAnswer?.(data.answer); break;
        case "call.ice": callbacksRef.current.onCallIce?.(data.candidate); break;
        case "call.reject": callbacksRef.current.onCallReject?.(); break;
      }
    } catch (e) {
      console.error("[WS] Parse Error:", e);
    }
  };

  ws.onclose = (e) => {
    connectingRef.current = false;
    setIsConnected(false);
    setConnectionStatus("disconnected");
    wsRef.current = null;
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    if (e.code !== 1000 && e.code !== 4001 && isMounted.current) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
      reconnectAttempts.current += 1;
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, delay);
    }
  };

  ws.onerror = () => { connectingRef.current = false; };

//  DÉPENDANCES MINIMALES — plus de handleChatMessage ici
}, [sendMessage, processMessageQueue]);

//  Ref pour currentUserId
const currentUserIdRef = useRef(currentUserId);
useEffect(() => { currentUserIdRef.current = currentUserId; }, [currentUserId]);

//  useEffect stable — ne se relance QUE si currentUserId change
useEffect(() => {
  isMounted.current = true;
  const timer = setTimeout(() => {
    if (currentUserId && isMounted.current) connectWebSocket();
  }, 150);

  return () => {
    isMounted.current = false;
    clearTimeout(timer);
    if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    if (wsRef.current) {
      wsRef.current.onclose = null;
      wsRef.current.onerror = null;
      wsRef.current.close(1000);
      wsRef.current = null;
    }
  };
}, [currentUserId]); //SEULEMENT currentUserId — pas connectWebSocket

  const isUserTyping = useCallback((userId: string, convId?: string) => {
  if (convId) {
    return !!typingUsers[userId]?.[convId];
  }
  return false;
}, [typingUsers]);
  // FONCTION D'ENVOI CORRIGÉE
  const sendMessageWS = useCallback((conversationId: string, content: string, receiverId: string) => {
  if (!joinedConversationsRef.current.has(conversationId)) {
    sendMessage({ type: "join_conversation", conversation_id: conversationId });
  }
  return sendMessage({ 
    type: "send_message", 
    conversation_id: conversationId, 
    content,
    receiver_id: receiverId  
  });
}, [sendMessage]);

   const handleHistory = useCallback((messages: any[]) => {
    if (!activeConversationId) return;

    useChatStore.getState().setMessagesForConv(activeConversationId, messages);
  }, [activeConversationId]);

  const joinConversation = useCallback((conversationId: string) => {
  if (!conversationId) return;
  if (joinedConversationsRef.current.has(conversationId)) return; // ← STOP si déjà joint
  
  joinedConversationsRef.current.add(conversationId);
  sendMessage({
    type: "join_conversation",
    conversation_id: conversationId
  });
}, [sendMessage]);

  return {
    onlineUsers,
    typingUsers,
    isConnected,
    connectionStatus,
    sendMessageWS,
    sendTypingWS: (isTyping: boolean, convId: string) => sendMessage({ type: "typing", conversation_id: convId, is_typing: isTyping }),
    sendReadReceiptWS: (messageId: string) => sendMessage({ type: "read_receipt", message_id: messageId }),
    joinConversation,
    leaveConversation: (id: string) => { joinedConversationsRef.current.delete(id); sendMessage({ type: "leave_conversation", conversation_id: id }); },
    isUserOnline: (uid: string) => !!onlineUsers[uid],
    isUserTyping,
    reconnect: () => { reconnectAttempts.current = 0; connectWebSocket(); }
  };
};
