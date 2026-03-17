"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { SendHorizontal, File as FileIcon, Video, X, Mic, Smile, Phone, PhoneOff, CirclePause, Play, PhoneMissed,ChevronDown, Check, CheckCheck } from "lucide-react";
import dynamic from 'next/dynamic';
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageReadMutation,
  Message,
  useDeleteMessageMutation,
} from "@/state/chatApi";
import ConversationList from "./ConversationList";
import ChatMessage from "../Messages/ChatMessage";
import { useChatSocket } from "@/state/useChatSocket";
import FileHistory from "../History/FileHistory";
import { useWebRTC } from "@/state/useWebRTC";
import { useAudioPlayer } from "@/state/useAudioPlayer";
import { useChatStore } from "@/state/chatStore";

const EmojiPicker = dynamic(
  () => import('emoji-picker-react'),
  { 
    ssr: false,
    loading: () => <div className="w-[300px] h-[350px] bg-gray-100 animate-pulse rounded-lg" />
  }
);

interface ChatLayoutProps {
  currentUserId: string;
  conversationId: string | null;
}

const EMPTY_MESSAGES: any[] = [];

export default function ChatLayout({
  currentUserId,
  conversationId,
}: ChatLayoutProps) {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

// ─── Local state ────────────────────────────────────
 const activeConversationId = useChatStore(state => state.activeConversationId);
const setActiveConversation = useChatStore(state => state.setActiveConversation);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLoadingEmoji, setIsLoadingEmoji] = useState(false);
  const processedReadMessages = useRef<Set<string>>(new Set());

  const [toastNotif, setToastNotif] = useState<{
  senderName: string;
  preview: string;
  convId: string;
} | null>(null);


   // ─── ZUSTAND : Source de vérité réactive ─────────────────
const messagesFromStore = useChatStore(
  useCallback(
    (state) => (activeConversationId ? state.messagesByConv[activeConversationId] || EMPTY_MESSAGES : EMPTY_MESSAGES),
    [activeConversationId]
  )
);

  // ✅ SCROLL INFINI
  const PAGE_SIZE = 40;
  const [messageOffset, setMessageOffset] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const hasMore = useChatStore(state => activeConversationId ? state.hasMoreByConv[activeConversationId] ?? true : false);
  const isLoadingMore = useChatStore(state => activeConversationId ? state.loadingMoreByConv[activeConversationId] ?? false : false);
  const setHasMore = useChatStore(state => state.setHasMore);
  const setLoadingMore = useChatStore(state => state.setLoadingMore);
  const prependMessages = useChatStore(state => state.prependMessages);

const notifications = useChatStore(state => state.notifications);
const conversationsFromStore = useChatStore(state => state.conversations);
const setConversations = useChatStore(state => state.setConversations);

  // ─── RTK Query ──────────────────────────────────────
  const {
    data: conversationsFromApi = [],
    isSuccess: hasConversationsData,
  } = useGetConversationsQuery();
  const [sendMessage] = useSendMessageMutation();
  const [markMessageRead] = useMarkMessageReadMutation();

  useEffect(() => {
    if (!hasConversationsData) return;
    setConversations(conversationsFromApi);
  }, [hasConversationsData, conversationsFromApi, setConversations]);

  const conversations = conversationsFromStore;
  /* Voice recording */
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [cancelRecording, setCancelRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // ─── WebSocket ──────────────────────────────────────
  const {
    sendMessageWS,
    sendTypingWS,
    sendReadReceiptWS,
    isUserOnline,
    isUserTyping,
    joinConversation, 
    isConnected,  
    
  } = useChatSocket({ currentUserId,activeConversationId });

// ─── Affichage toast quand nouvelle notification ─────
const lastNotifIdRef = useRef<string | null>(null);

const activeConvIdRef = useRef(activeConversationId);
useEffect(() => {
  activeConvIdRef.current = activeConversationId;
}, [activeConversationId]);


useEffect(() => {
  if (!notifications.length) return;

  const latest = notifications[0];
  const senderId = latest.data?.sender?.id;
  const notifConvId = latest.conversation_id;

  if (senderId === currentUserId) return;
  if (latest.id === lastNotifIdRef.current) return;
  if (latest.conversation_id === activeConversationId) return;
  if (notifConvId === activeConvIdRef.current) return;

  lastNotifIdRef.current = latest.id;
  setToastNotif({
    senderName: latest.data?.sender?.name ?? "Nouveau message",
    preview: latest.data?.preview ?? "...",
    convId: latest.conversation_id ?? "",
  });

  const timer = setTimeout(() => setToastNotif(null), 4000);
  return () => clearTimeout(timer);
}, [notifications, currentUserId, activeConversationId]);
  
   // ─── Messages API ───────────────────────────────────
const { data: apiMessages = [] } = useGetMessagesQuery(activeConversationId ?? "", { 
  skip: !activeConversationId 
});

// ─── Synchronisation API -> Zustand ─────────────────

const apiMessagesKey = useMemo(
  () => apiMessages.map(m => m.id).join(","),
  [apiMessages]
);

const setMessagesForConv = useChatStore(state => state.setMessagesForConv);
useEffect(() => {
  if (!activeConversationId) return;

  setMessagesForConv(activeConversationId, apiMessages, true);
  setHasMore(activeConversationId, apiMessages.length >= PAGE_SIZE);
}, [apiMessagesKey, activeConversationId]);

  const [voiceDraft, setVoiceDraft] = useState<{
    blob: Blob | null;
    url: string | null;
    duration: number;
    isPaused: boolean;
  } | null>(null);


  /* ───────────────── WebRTC ───────────────── 
  const webrtc = useWebRTC({
    sendWS,
    conversationId: activeConversationId!, 
  });*/

  // ─── Computed values ────────────────────────────────
  const activeConversation = useMemo(
    () => conversations.find(c => c.id === activeConversationId),
    [conversations, activeConversationId]
  );

  const otherUser = useMemo(
    () => activeConversation?.participants.find(u => u.id !== currentUserId),
    [activeConversation, currentUserId]
  );

  // ─── Merge and normalize messages ───────────────────
  const normalizedMessages = useMemo(() => {
    return messagesFromStore.map(msg => ({
      ...msg,
      fileName: msg.fileName ?? (msg as any).file_name,
      fileSize: msg.fileSize ?? (msg as any).file_size,
      created_at: msg.timestamp,
    }));
  }, [messagesFromStore]);
  // ─── Effects ────────────────────────────────────────
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const shouldScroll = container.scrollHeight - container.scrollTop - container.clientHeight < 200;

    if (shouldScroll) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          //block: 'end'
        });
      }, 100);
    }
  }, [normalizedMessages]);

  console.log(`[Render Chat] ${normalizedMessages.length} messages dans le store`);


 
  useEffect(() => {
  if (activeConversationId) {
    joinConversation(activeConversationId);
    setMessageOffset(0);
  }
}, [activeConversationId]);
 
 const markAsRead = useChatStore(state => state.markAsRead);
  useEffect(() => {
  if (!activeConversationId || !otherUser || normalizedMessages.length === 0) return;

  // On filtre les messages vraiment non lus ET qu'on n'a pas déjà traité dans cette session
  
  const unreadMessages = normalizedMessages.filter(
    msg => !msg.read && 
           msg.sender?.id !== currentUserId && 
           !processedReadMessages.current.has(msg.id)
  );

  if (unreadMessages.length === 0) return;

  unreadMessages.forEach(msg => {
    if (msg.id) {
      // Marquer comme traité immédiatement pour bloquer le prochain loop
      processedReadMessages.current.add(msg.id);
      
      // Appels API et WebSocket
      markMessageRead({ messageId: msg.id });
      sendReadReceiptWS(msg.id);
    }
  });
  markAsRead(activeConversationId);

  // On nettoie la Ref quand on change de conversation
}, [normalizedMessages, activeConversationId, currentUserId]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && 
          !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener('mousedown', handleClickOutside);
      if (window.innerWidth < 768) {
        document.body.style.overflow = 'hidden';
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [showEmojiPicker]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setShowEmojiPicker(prev => !prev);
      }
      if (e.key === 'Escape' && showEmojiPicker) {
        setShowEmojiPicker(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showEmojiPicker]);

    // ─── Event handlers ─────────────────────────────────
  const handleSendMessage = async () => {
    // 1. Validations de base
    if (!newMessage.trim() && !selectedFile) return;
    if (!activeConversationId) return;

    // 2. Trouver le destinataire
    const currentConv = conversations.find(c => c.id === activeConversationId);
    const otherUser = currentConv?.participants.find(u => u.id !== currentUserId);

    if (!otherUser) {
      console.error("Destinataire non trouvé");
      return;
    }

    // 3. Préparation des données
    const formData = new FormData();
    formData.append("content", newMessage.trim());
    formData.append("conversation", activeConversationId);
    formData.append("receiver_id", otherUser.id);
    
    if (selectedFile) {
      const fieldName = selectedFile.type.startsWith("image/") ? "image" : "file";
      formData.append(fieldName, selectedFile);
    }

    try {
      // 4. Envoi à l'API avec .unwrap() pour "sortir" l'erreur du catch interne de RTK Query
      const sentMsg = await sendMessage({
        conversationId: activeConversationId,
        formData,
      }).unwrap();
       console.log("WebSocket reçu, ajout au store...");

      // 5. Mise à jour immédiate du store Zustand (Temps réel local)
      if (sentMsg) {
      useChatStore.getState().addMessage(sentMsg as any, currentUserId);
    }

    //NOUVEAU : Notifier les autres participants via WebSocket
    // Ceci déclenche handle_chat_message → broadcast à tous les participants
    if (newMessage.trim()) {
      sendMessageWS(activeConversationId, newMessage.trim(), otherUser.id);
    }
      // 6. Reset propre de l'interface
      setNewMessage("");
      setSelectedFile(null);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      setShowEmojiPicker(false);

    } catch (err: any) {
      // 7. DEBUGGING CRUCIAL : Affiche l'erreur réelle de Django
      console.error("Détails complets de l'erreur API :", err);
      
      // Si Django renvoie une erreur de validation (ex: champ manquant)
      const serverError = err?.data ? JSON.stringify(err.data) : "Erreur serveur";
      alert(`Impossible d'envoyer le message : ${serverError}`);
    }
  };

 const [deleteMessage] = useDeleteMessageMutation();

const handleDeleteMessage = useCallback(async (messageId: string, forEveryone: boolean) => {
  if (forEveryone) {
    useChatStore.getState().updateMessage(activeConversationId!, messageId, {
      content: "Ce message a été supprimé",
      type: "deleted" as any,
    });
  } else {
    useChatStore.getState().deleteMessage(activeConversationId!, messageId, false);
  }
  await deleteMessage({ messageId, forEveryone });
}, [activeConversationId, deleteMessage]);

  /* ───────────────── Voice recording ───────────────── */
  const startVoiceRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      setVoiceDraft({
        blob,
        url,
        duration: 0,
        isPaused: false,
      });
    };

    recorder.start();

    recordTimerRef.current = setInterval(() => {
      setVoiceDraft((prev) =>
        prev ? { ...prev, duration: prev.duration + 1 } : prev
      );
    }, 1000);
  };

  const stopVoiceRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isRecording) return;
    if (e.touches[0].clientX < 100) {
      setCancelRecording(true);
    }
  };

  const sendVoiceMessage = async () => {
    if (!voiceDraft || !activeConversationId || !otherUser) return;

    const formData = new FormData();
    formData.append("voice", voiceDraft.blob!, "voice.webm");
    formData.append("type", "voice");
    formData.append("content", "🎤 Message vocal");
    formData.append("conversation", activeConversationId);
    formData.append("receiver_id", otherUser.id);

    await sendMessage({ conversationId: activeConversationId, formData });

    URL.revokeObjectURL(voiceDraft.url!);
    setVoiceDraft(null);
  };

  // ─── Audio player instance ─────────────────
  const audioPlayer = useAudioPlayer();

  /* ─── Emoji selection ─────────────────*/
  const handleEmojiSelect = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji);
  };

  /* ─── Typing indicator ─────────────────*/
  const handleTyping = useCallback((text: string) => {
    setNewMessage(text);
    if (activeConversationId && text.length > 0) {
      sendTypingWS(true, activeConversationId);
    }
  }, [activeConversationId, sendTypingWS]);

  // ─── File selection ─────────────────
  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  }, []);

  // ─── Remove selected file ────────────────
  const removeSelectedFile = useCallback(() => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [previewUrl]);

  // ─── Handle Enter key to send message ────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
    setIsLoadingEmoji(true);
  };

  // ─── Grouper les messages par date ───────────────────
  const groupedMessagesByDate = useMemo(() => {
    if (normalizedMessages.length === 0) return {};
    
    const groups: { [dateKey: string]: any[] } = {};
    
    normalizedMessages.forEach((message) => {
      if (!message.timestamp) return;
      
      const messageDate = new Date(message.timestamp);
      const dateKey = messageDate.toISOString().split('T')[0];
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      
      groups[dateKey].push(message);
    });
    
    return groups;
  }, [normalizedMessages]);


  // scrollToBottom helper
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // Détection scroll : bouton bas + scroll infini vers le haut
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const distFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
      setShowScrollButton(distFromBottom > 400);

      if (container.scrollTop < 100 && hasMore && !isLoadingMore && activeConversationId) {
        loadMoreMessages();
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoadingMore, activeConversationId]);

  // SCROLL INFINI : charger les messages précédents
  const loadMoreMessages = useCallback(async () => {
  if (!activeConversationId || isLoadingMore || !hasMore) return;

  setLoadingMore(activeConversationId, true);

  try {
    const newOffset = messageOffset + PAGE_SIZE;

    const token = localStorage.getItem("access_token");
    if (!token) {
      console.error("[ChatLayout] Aucun token trouvé !");
      setLoadingMore(activeConversationId, false);
      return;
    }

    const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/communication";

const url = `${API_URL}/conversations/${activeConversationId}/messages/?offset=${newOffset}&limit=${PAGE_SIZE}`;

    console.log("[ChatLayout] Fetch messages older", { url, newOffset, PAGE_SIZE });

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("[ChatLayout] Fetch échoué", { status: response.status, responseText: text });
      setLoadingMore(activeConversationId, false);
      return;
    }

    const data = await response.json();
    console.log("[ChatLayout] Réponse fetch messages :", data);

    const olderMessages = Array.isArray(data.results) ? data.results : data;

    if (!olderMessages || olderMessages.length === 0) {
      console.log("[ChatLayout] Aucun message ancien trouvé, désactivation scroll infini");
      setHasMore(activeConversationId, false);
      setLoadingMore(activeConversationId, false);
      return;
    }

    // Formatage des messages pour le store
    const formatted = olderMessages.map((msg: any) => ({
      id: msg.id,
      content: msg.content || "",
      sender: typeof msg.sender === "object" ? msg.sender : { id: msg.sender_id || msg.sender, name: "Utilisateur" },
      timestamp: msg.timestamp || msg.created_at,
      conversation_id: activeConversationId,
      read: !!msg.is_read,
      is_delivered: !!msg.is_delivered,
      image: msg.image ?? null,
      file: msg.file ?? null,
      fileName: msg.file_name ?? null,
      fileSize: msg.file_size ?? null,
      voice: msg.voice ?? null,
    }));

    const container = messagesContainerRef.current;
    const scrollHeightBefore = container?.scrollHeight ?? 0;

    prependMessages(activeConversationId, formatted);
    setMessageOffset(newOffset);
    setHasMore(activeConversationId, olderMessages.length >= PAGE_SIZE);

    // Restaure la position scroll
    requestAnimationFrame(() => {
      if (container) container.scrollTop = container.scrollHeight - scrollHeightBefore;
    });

  } catch (err) {
    console.error("[ChatLayout] loadMoreMessages catch error:", err);
  } finally {
    if (activeConversationId) setLoadingMore(activeConversationId, false);
  }
}, [activeConversationId, messageOffset, hasMore, isLoadingMore]);

  const dateGroups = useMemo(() => {
    return Object.entries(groupedMessagesByDate).map(([dateKey, messages]) => ({
      date: dateKey,
      messages: messages.sort((a, b) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
      )
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [groupedMessagesByDate]);

  const formatDateLikeWhatsApp = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const dateWithoutTime = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayWithoutTime = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const yesterdayWithoutTime = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
    
    if (dateWithoutTime.getTime() === todayWithoutTime.getTime()) {
      return "Aujourd'hui";
    }
    
    if (dateWithoutTime.getTime() === yesterdayWithoutTime.getTime()) {
      return "Hier";
    }
    
    const diffDays = Math.floor((todayWithoutTime.getTime() - dateWithoutTime.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString("fr-FR", { weekday: "long" });
    }
    
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined
    });
  };

  const getMessageType = (msg: Message & { voice?: { audio: string }; call_type?: string }) => {
    if (msg.voice?.audio) return "voice";
    if (msg.call_type === "audio") return "call-audio";
    if (msg.call_type === "video") return "call-video";
    if (msg.image) return "image";
    if (msg.file) return "file";
    return "text";
  };

  // ─── Render helpers ────────────────────────────────
  const renderMobileHeader = () => (
    <div className="lg:hidden flex items-center justify-between p-3 text-black">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2"
          aria-label="Menu conversations"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        {otherUser && (
          <div className="flex items-center gap-3">
            <img 
              src={otherUser.avatar || "/default-avatar.jpg"} 
              className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-sm"
             // alt={otherUser.name}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{otherUser.name}</p>
              <div className="flex items-center gap-2">
                {isUserTyping(otherUser.id) ? (
                  <span className="text-xs text-white/80 animate-pulse italic">
                    en train d'écrire...
                  </span>
                ) : (
                  <p className="text-xs text-gray-500">
                    {isUserOnline(otherUser.id) ? "en ligne" : "hors ligne"}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="p-2"
          aria-label="Historique des fichiers"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </button>
       {/* <button
          onClick={() => webrtc.startCall(false)}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="Appel audio"
        >
          <Phone size={20} />
        </button>
        <button 
          onClick={() => webrtc.startCall(true)}
          className="p-2"
          aria-label="Appel vidéo"
        >
          <Video size={20} /> 
        </button>*/}
      </div>
    </div>
  );

  const renderDesktopHeader = () => (
    <div className="hidden lg:flex items-center justify-between p-3 text-black">
      <div className="flex items-center gap-3">
        <img 
          src={otherUser?.avatar || "/default-avatar.jpg"} 
          className="w-10 h-10 rounded-full object-cover border-2 border-white/30 shadow-sm"
          //alt={otherUser?.name}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{otherUser?.name}</p>
          <div className="flex items-center gap-2">
            {otherUser && isUserTyping(otherUser.id) ? (
              <span className="text-xs text-white/80 animate-pulse italic">
                en train d'écrire...
              </span>
            ) : (
              <p className="text-xs text-gray-500">
                {otherUser && isUserOnline(otherUser.id) ? "en ligne" : "hors ligne"}
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/*<button
          onClick={() => webrtc.startCall(false)}
          className="p-2 hover:bg-gray-300 rounded-full shadow-sm"
          aria-label="Appel audio"
        >
          <PhoneMissed size={20} />
        </button>
        <button 
          onClick={() => webrtc.startCall(true)}
          className="p-2 hover:bg-gray-300 rounded-full shadow-sm"
          aria-label="Appel vidéo"
        >
          <Video size={20} /> 
        </button>*/}
      </div>
    </div>
  );

  const renderEmojiPicker = () => {
    if (!showEmojiPicker) return null;

    return (
      <div className="absolute bottom-full mb-2 left-0 right-0 md:right-auto md:left-0 z-50">
        <div className="bg-white rounded-lg shadow-2xl border overflow-hidden" ref={emojiPickerRef}>
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            height={350}
            width="100%"
            searchPlaceHolder="Rechercher un emoji..." 
          />
          <div className="p-2 border-t bg-gray-50 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {isLoadingEmoji ? "Chargement..." : "Cliquez sur un emoji pour l'ajouter"}
            </span>
            <button
              onClick={() => setShowEmojiPicker(false)}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFilePreview = () => {
    if (!previewUrl || !selectedFile) return null;

    return (
      <div className="px-4 pt-2">
        <div className="inline-flex items-center gap-3 bg-white rounded-lg p-3 border shadow-sm">
          {selectedFile.type.startsWith("image/") ? (
            <>
              <div className="relative">
                <img 
                  src={previewUrl} 
                  className="w-16 h-16 object-cover rounded-lg"
                  alt="Preview"
                />
                <button
                  onClick={removeSelectedFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Supprimer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="w-16 h-16 flex items-center justify-center bg-blue-50 rounded-lg border">
                  <FileIcon size={24} className="text-blue-500" />
                </div>
                <button
                  onClick={removeSelectedFile}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  aria-label="Supprimer"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.type}
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  // ─── Main render ───────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row h-screen max-h-screen bg-gray-50">

       {/* TOAST */}
    {toastNotif && (
      <div
        className="fixed top-4 right-4 z-[100] bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 flex items-center gap-3 max-w-sm cursor-pointer"
        style={{ animation: "slideIn 0.3s ease-out" }}
        onClick={() => { setActiveConversation(toastNotif.convId); setToastNotif(null); }}
      >
        <div className="w-10 h-10 rounded-full bg-[#00A884] flex items-center justify-center text-white font-bold text-sm shrink-0">
          {toastNotif.senderName.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{toastNotif.senderName}</p>
          <p className="text-gray-500 text-xs truncate">{toastNotif.preview}</p>
        </div>
        <button onClick={(e) => { e.stopPropagation(); setToastNotif(null); }} className="text-gray-400 hover:text-gray-600 shrink-0 ml-1">
          <X size={16} />
        </button>
      </div>
    )}

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-4/5 max-w-sm bg-white shadow-xl">
            {/*<div className="p-4 border-b bg-[#00A884] text-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Discussions</h2>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>*/}
            <ConversationList
              conversations={conversations}
              currentUserId={currentUserId}
              activeConversationId={activeConversationId}
              onSelectConversation={(id) => {
                setActiveConversation(id);
                setIsMobileMenuOpen(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Mobile history overlay */}
      {isHistoryOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsHistoryOpen(false)} />
          <div className="absolute inset-y-0 right-0 w-4/5 max-w-sm bg-white shadow-xl">
            <div className="p-4  text-black">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg">Fichiers</h2>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-2"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <FileHistory conversationId={activeConversationId} />
          </div>
        </div>
      )}

      {/* Left sidebar - Desktop */}
      <div className="hidden lg:flex w-full lg:w-1/3 xl:w-1/4  flex-col bg-white">
        {/*<div className="p-4   text-black">
          <h2 className="text-2xl font-semibold text-gray-800">Discussions</h2>
        </div>*/}
        <div className="flex-1 overflow-y-auto">
          <ConversationList
            conversations={conversations}
            currentUserId={currentUserId}
            activeConversationId={activeConversationId}
            onSelectConversation={setActiveConversation}
          />
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-h-0">
        {renderMobileHeader()}
        
        {activeConversation && otherUser ? (
          <>
            {renderDesktopHeader()}
            
            {/* Messages container */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto bg-gray-50 bg-opacity-95 bg-repeat"
              style={{ 
                
                backgroundSize: '400px'
              }}
            >
              <div className="max-w-4xl mx-auto px-2 py-4">
                {dateGroups.length > 0 ? (
                  dateGroups.map((group, groupIndex) => (
                    <div key={group.date}>
                      {/* Date separator */}
                      <div className="flex justify-center my-4">
                        <div className="px-4 py-1 bg-gray-200 text-black text-xs rounded-full font-medium backdrop-blur-sm shadow-sm">
                          {formatDateLikeWhatsApp(group.date)}
                        </div>
                      </div>
                      
                      {/* Messages of the day */}
                      <div className="space-y-1">
                        {group.messages.map((msg, index) => {
                          const previousMsg = group.messages[index - 1];
                          const isConsecutive = previousMsg && 
                            previousMsg.sender?.id === msg.sender?.id &&
                            new Date(msg.timestamp).getTime() - new Date(previousMsg.timestamp).getTime() < 5 * 60 * 1000;
                          
                          return (
                            <ChatMessage
                              key={`${msg.id}-${msg.timestamp}-${index}`}
                              messageId={msg.id}
                              type={getMessageType(msg)}
                              message={msg.content}
                              image={msg.image}
                              file={msg.file}
                              fileName={msg.fileName ?? msg.file_name}
                              fileSize={msg.fileSize ?? msg.file_size}
                              voice={msg.voice}
                              createdAt={msg.timestamp}
                              senderId={msg.sender?.id}
                              isOwn={msg.sender?.id === currentUserId}
                              read={msg.read}
                              previousSenderId={isConsecutive ? previousMsg?.sender?.id : null}
                              onPlayVoice={audioPlayer.toggle}
                              isPlaying={audioPlayer.isPlaying && audioPlayer.currentUrl === msg.voice?.audio}
                              currentUrl={audioPlayer.currentUrl}
                              currentTime={audioPlayer.currentTime}
                              duration={audioPlayer.duration}
                              onDelete={handleDeleteMessage}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-600">
                    <div className="text-lg font-medium mb-2">Aucun message</div>
                    <div className="text-sm">Commencez la conversation en envoyant un message</div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Incoming call popup 
            {webrtc.incomingCall && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-xl text-center w-80">
                  <h3 className="font-semibold mb-4">
                    Appel {webrtc.incomingCall.type === "video" ? "vidéo" : "audio"} entrant de {otherUser.name}
                  </h3>
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={webrtc.endCall}
                      className="flex-1 bg-red-500 text-white py-2 rounded-lg"
                    >
                      Refuser
                    </button>
                    <button
                      //onClick={webrtc.acceptCall}
                      className="flex-1 bg-green-500 text-white py-2 rounded-lg"
                    >
                      Accepter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Active call - full screen 
          {webrtc.isInCall && (
              <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
                <video
                 // ref={webrtc.remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <video
                  ref={webrtc.localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-36 h-36 absolute bottom-4 right-4 rounded-lg border"
                />
                <button
                  onClick={webrtc.endCall}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-red-600 p-4 rounded-full text-white"
                >
                  <PhoneOff />
                </button>
              </div>
            )}*/}

            {/* File preview */}
            {renderFilePreview()}

            {/* Input area */}
            <div className="bg-white  p-3">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2">
                  {/* Emoji button */}
                  <div className="relative">
                    <button 
                      onClick={toggleEmojiPicker}
                      className={`p-3 rounded-full transition-colors ${
                        showEmojiPicker 
                          ? 'bg-gray-200 text-gray-700' 
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                      aria-label="Sélectionner un emoji"
                    >
                      <Smile size={22} />
                    </button>
                    {renderEmojiPicker()}
                  </div>
                  
                  {/* File attachment button */}
                  <div className="relative">
                    <label className="cursor-pointer p-3 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                      <FileIcon size={22} />
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleFileSelect(file);
                            setShowEmojiPicker(false);
                          }
                        }}
                      />
                    </label>
                  </div>
                  
                  {/* Message input / Voice recording */}
                  <div className="flex-1 relative">
                    {voiceDraft ? (
                      <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-full w-full">
                        <button onClick={() => setVoiceDraft(null)}>
                          <X className="text-red-500" />
                        </button>
                        <span className="font-mono text-sm text-gray-700">
                          {voiceDraft.duration}s
                        </span>
                        <div className="flex-1 h-1 bg-gray-300 rounded">
                          <div
                            className="h-1 bg-[#00A884] rounded"
                            style={{ width: `${Math.min(voiceDraft.duration * 3, 100)}%` }}
                          />
                        </div>
                        <button
                          onClick={sendVoiceMessage}
                          className="p-2 bg-[#00A884] text-white rounded-full"
                        >
                          <SendHorizontal size={18} />
                        </button>
                      </div>
                    ) : (
                      <>
                        <input
                          type="text"
                          placeholder="Écrire un message"
                          value={newMessage}
                          onChange={(e) => {
                            handleTyping(e.target.value);
                            setShowEmojiPicker(false);
                          }}
                          onKeyDown={handleKeyDown}
                          onFocus={() => setShowEmojiPicker(false)}
                          className="w-full border border-gray-300 rounded-full px-5 py-3 focus:outline-none focus:border-gray-400 bg-gray-100 text-gray-700 placeholder-gray-500"
                          aria-label="Message"
                        />
                        {newMessage && (
                          <button
                            onClick={() => setNewMessage("")}
                            className="absolute right-14 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                            aria-label="Effacer"
                          >
                            <X size={18} />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                  
                  {/* Send/Voice button */}
                  {newMessage.trim() || selectedFile ? (
                    <button 
                      onClick={handleSendMessage}
                      className="bg-[#00A884]  text-white p-3 rounded-full transition-colors"
                      aria-label="Envoyer"
                    >
                      <SendHorizontal size={22} />
                    </button>
                  ) : (
                    <div className="flex flex-col items-center">
                      <button
                        onMouseDown={startVoiceRecording}
                        onMouseUp={stopVoiceRecording}
                        onTouchStart={startVoiceRecording}
                        onTouchEnd={stopVoiceRecording}
                        className="bg-[#00A884] text-white p-3 rounded-full"
                      >
                        <Mic size={22} />
                      </button>
                      {isRecording && (
                        <span className="text-red-600 font-mono text-sm select-none">
                          {recordDuration}s
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#E5DDD5]">
            <div className="max-w-md">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <svg className="w-10 h-10 text-[#008069]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Aucune conversation sélectionnée
              </h3>
              <p className="text-gray-600">
                {conversations.length === 0 
                  ? "Commencez par créer une nouvelle conversation" 
                  : "Sélectionnez une conversation pour commencer à discuter"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar - Desktop */}
      <div className="hidden lg:flex w-full lg:w-1/3 xl:w-1/4 border-l flex-col bg-white border-gray-200 shadow-xl">
        <div className="p-4  text-black">
          <h2 className="font-semibold text-lg">Fichiers partagés</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          <FileHistory conversationId={activeConversationId} />
        </div>
      </div>
    </div>
  );
}
