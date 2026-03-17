
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Conversation, Message } from "@/state/chatApi"; 
import type { ChatMessageWS } from "@/state/useChatSocket"; 


export interface AppNotification {
  id: string;
  type: "new_message" | "new_conversation" | "presence" | "typing" | "read_receipt";
  data: any;
  timestamp: string;
  conversation_id?: string;
}
interface ChatStore {
  setMessagesForConv(convId: string, messages: Message[], replace?: boolean): void;
  conversations: Conversation[];
  messagesByConv: Record<string, ChatMessageWS[]>;
  activeConversationId: string | null;
  notifications: AppNotification[];
  addNotification: (notif: AppNotification) => void;
  applyIncomingNotification: (notif: AppNotification, currentUserId: string) => void;
  clearNotifications: () => void;
  // Actions
  setConversations: (convs: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  clearMessages: (convId: string) => void;

  updateConversation: (convId: string, updater: (conv: Conversation) => Conversation) => void;
  addMessage: (msg: ChatMessageWS, currentUserId: string) => void;
  markAsRead: (convId: string) => void;
  setMessageRead: (convId: string, messageId: string) => void;
  clearOldMessages: (convId: string, limit?: number) => void;
}

const MAX_MESSAGES_PER_CONV = 50; // Limite pour le LocalStorage

type ConversationMessageType = NonNullable<Conversation["last_message"]>["type"];

const resolveMessageTypeFromNotification = (data: any): ConversationMessageType => {
  const rawType = data?.message_type ?? data?.type;
  if (
    rawType === "image" ||
    rawType === "file" ||
    rawType === "voice" ||
    rawType === "call-audio" ||
    rawType === "call-video"
  ) {
    return rawType;
  }
  if (data?.image) return "image";
  if (data?.file) return "file";
  if (data?.voice) return "voice";
  return "text";
};

const resolvePreviewFromNotification = (data: any): string => {
  if (typeof data?.preview === "string" && data.preview.trim().length > 0) return data.preview;
  if (typeof data?.content === "string" && data.content.trim().length > 0) return data.content;
  return "";
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: [],
      messagesByConv: {},

       activeConversationId: null, 

       

  setActiveConversation: (id) => set({ activeConversationId: id }),

      // Initialise ou écrase la liste des conversations (ex: après un fetch API)
      setConversations: (convs) => set({ conversations: convs }),

      // Cette fonction permet de remplir le store avec les messages venant de ton API (RTK Query)
setMessagesForConv: (convId, messages, replace = false) =>
  set((state) => {
    const formattedApiMessages = (messages as any[]).map((msg) => ({
      id: msg.id,
      content: msg.content || "",
      sender: typeof msg.sender === 'object'
        ? msg.sender
        : { id: msg.sender_id || msg.sender, name: "Utilisateur" },
      timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
      conversation_id: convId,
      read: !!msg.read || !!msg.read_at,
      image: msg.image,
      file: msg.file,
      voice: msg.voice,
    })) as ChatMessageWS[];

    const existingMessages = state.messagesByConv[convId] || [];

    // ✅ Anti-boucle : si les IDs sont identiques, on ne set rien
    const existingIds = existingMessages.map(m => m.id).sort().join(",");
    const newIds = formattedApiMessages.map(m => m.id).sort().join(",");
    if (existingIds === newIds && replace) return state; // ← retourne le même state = pas de re-render

    const existingWSMessages = replace
      ? []
      : existingMessages.filter(
          localMsg => !formattedApiMessages.some(m => m.id === localMsg.id)
        );

    const merged = [...formattedApiMessages, ...existingWSMessages].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return {
      messagesByConv: {
        ...state.messagesByConv,
        [convId]: merged,
      },
    };
  }),

  notifications: [],

addNotification: (notif) =>
  set((state) => ({
    notifications: [notif, ...state.notifications].slice(0, 50) // garde 50 max
  })),

applyIncomingNotification: (notif, currentUserId) =>
  set((state) => {
    const convId = notif.conversation_id;
    if (notif.type !== "new_message" || !convId) return state;

    const senderId = notif.data?.sender?.id ?? notif.data?.sender_id ?? "";
    const senderName =
      notif.data?.sender?.name ??
      notif.data?.sender_name ??
      "Utilisateur";
    const timestamp = notif.data?.timestamp ?? notif.timestamp ?? new Date().toISOString();
    const preview = resolvePreviewFromNotification(notif.data);
    const messageType = resolveMessageTypeFromNotification(notif.data);

    let hasTargetConversation = false;

    const updatedConversations = state.conversations.map((conversation) => {
      if (conversation.id !== convId) return conversation;

      hasTargetConversation = true;
      const isOwn = senderId === currentUserId;
      const isActive = state.activeConversationId === convId;

      return {
        ...conversation,
        unread_count:
          !isOwn && !isActive
            ? (conversation.unread_count ?? 0) + 1
            : conversation.unread_count ?? 0,
        last_message: {
          ...(conversation.last_message ?? {}),
          content: preview || conversation.last_message?.content || "",
          sender: senderName,
          sender_id: senderId || conversation.last_message?.sender_id || "",
          timestamp,
          created_at: timestamp,
          type: messageType,
          file_name: conversation.last_message?.file_name ?? "",
          read: isOwn || isActive,
        } as any,
      };
    });

    if (!hasTargetConversation) return state;

    return { conversations: updatedConversations };
  }),

clearNotifications: () => set({ notifications: [] }),
      // Met à jour une conversation spécifique (ex: changer le nom, l'avatar)
      updateConversation: (convId, updater) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId ? updater(c) : c
          ),
        })),

     // ACTION PRINCIPALE : Appelée par le WebSocket
      addMessage: (msg, currentUserId) => {
  const convId = msg.conversation_id;
  if (!convId) return;

  set((state): Partial<ChatStore> => {
    const existingMessages = state.messagesByConv[convId] || [];

    const isActive = state.activeConversationId === convId; 
    const isOwn = msg.sender.id === currentUserId;          

    //  anti doublon
    if (existingMessages.some((m) => m.id === msg.id)) return state;

    let newMessages = [...existingMessages, msg].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    if (newMessages.length > MAX_MESSAGES_PER_CONV) {
      newMessages = newMessages.slice(-MAX_MESSAGES_PER_CONV);
    }

    const newConversations = state.conversations.map((c) => {
      if (c.id !== convId) return c;

      return {
        ...c,
        last_message: {
          ...c.last_message,
          content: msg.content,
          sender: msg.sender.name,
          sender_id: msg.sender.id,
          timestamp: msg.timestamp,
          created_at: msg.timestamp,
          type: msg.image
            ? "image"
            : msg.file
            ? "file"
            : msg.voice
            ? "voice"
            : "text",
          read: msg.read || false,
        } as any,

        // LOGIQUE WHATSAPP 
        unread_count:
          !isOwn && !isActive
            ? (c.unread_count ?? 0) + 1   
            : c.unread_count ?? 0         
      } as Conversation;
    });

    return {
      ...state,
      conversations: newConversations,
      messagesByConv: {
        ...state.messagesByConv,
        [convId]: newMessages
      }
    };
  });
},

// Dans l'implémentation :
clearMessages: (convId: any) =>
  set((state) => ({
    messagesByConv: {
      ...state.messagesByConv,
      [convId]: []
    }
  })),
      // Marque toute une conversation comme lue
      markAsRead: (convId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId ? { ...c, unread_count: 0 } : c
          ),
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: (state.messagesByConv[convId] || []).map((m) => ({ ...m, read: true })),
          },
           //activeConversationId: convId 
        })),

      // Accusé de réception pour un message précis
      setMessageRead: (convId, messageId) =>
        set((state) => ({
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: (state.messagesByConv[convId] || []).map((m) =>
              m.id === messageId ? { ...m, read: true } : m
            ),
          },
        })),

      // Action manuelle pour vider les vieux messages si besoin
      clearOldMessages: (convId, limit = MAX_MESSAGES_PER_CONV) => 
        set((state) => ({
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: (state.messagesByConv[convId] || []).slice(-limit)
          }
        }))
    }),
    { 
      name: "chat-storage", // Nom de la clé dans le localStorage
      storage: createJSONStorage(() => localStorage),
       partialize: (state) => ({
    // ✅ On persiste seulement ce qui est utile entre sessions
    conversations: state.conversations,
    messagesByConv: state.messagesByConv,
    activeConversationId: state.activeConversationId,
  }),
    }
  )
);
