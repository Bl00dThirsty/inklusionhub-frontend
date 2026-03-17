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
  setMessageDelivered: (convId: string, messageId: string) => void;
  setMessagesForConv(convId: string, messages: Message[], replace?: boolean): void;
  conversations: Conversation[];
  messagesByConv: Record<string, ChatMessageWS[]>;
  activeConversationId: string | null;
  notifications: AppNotification[];
  hasMoreByConv: Record<string, boolean>;
  loadingMoreByConv: Record<string, boolean>;
  addNotification: (notif: AppNotification) => void;
  applyIncomingNotification: (notif: AppNotification, currentUserId: string) => void;
  clearNotifications: () => void;
  setConversations: (convs: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  clearMessages: (convId: string) => void;
  prependMessages: (convId: string, messages: ChatMessageWS[]) => void;
  updateConversation: (convId: string, updater: (conv: Conversation) => Conversation) => void;
  addMessage: (msg: ChatMessageWS, currentUserId: string) => void;
  markAsRead: (convId: string) => void;
  setMessageRead: (convId: string, messageId: string) => void;
  clearOldMessages: (convId: string, limit?: number) => void;
  setHasMore: (convId: string, hasMore: boolean) => void;
  setLoadingMore: (convId: string, loading: boolean) => void;
}

const MAX_MESSAGES_PER_CONV = 200;

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
      // ─── State initial ────────────────────────────────
      conversations: [],
      messagesByConv: {},
      activeConversationId: null,
      notifications: [],
      hasMoreByConv: {},
      loadingMoreByConv: {},

      // ─── Conversations ────────────────────────────────
      setActiveConversation: (id) => set({ activeConversationId: id }),

      setConversations: (convs) => set({ conversations: convs }),

      setMessagesForConv: (convId, messages, replace = false) =>
        set((state) => {
          const formattedApiMessages = (messages as any[]).map((msg) => ({
            id: msg.id,
            content: msg.content || "",
            is_delivered: !!msg.is_delivered,
            fileName: msg.fileName ?? msg.file_name ?? null,
            fileSize: msg.fileSize ?? msg.file_size ?? null,
            sender: typeof msg.sender === 'object'
              ? msg.sender
              : { id: msg.sender_id || msg.sender, name: "Utilisateur" },
            timestamp: msg.timestamp || msg.created_at || new Date().toISOString(),
            conversation_id: convId,
            read: !!msg.read || !!msg.read_at,
            image: msg.image ?? null,
            file: msg.file ?? null,
            voice: msg.voice ?? null,
          })) as ChatMessageWS[];

          const existingMessages = state.messagesByConv[convId] || [];

          // Anti-boucle : si les IDs sont identiques, pas de re-render
          const existingIds = existingMessages.map(m => m.id).sort().join(",");
          const newIds = formattedApiMessages.map(m => m.id).sort().join(",");
          if (existingIds === newIds && replace) return state;

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

      // ─── Notifications ────────────────────────────────
      addNotification: (notif) =>
        set((state) => ({
          notifications: [notif, ...state.notifications].slice(0, 50)
        })),

      clearNotifications: () => set({ notifications: [] }),

      // ─── Conversations helpers ────────────────────────
      updateConversation: (convId, updater) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId ? updater(c) : c
          ),
        })),

      // ─── Messages ─────────────────────────────────────
      addMessage: (msg, currentUserId) => {
        const convId = msg.conversation_id;
        if (!convId) return;

        set((state): Partial<ChatStore> => {
          const existingMessages = state.messagesByConv[convId] || [];
          const isActive = state.activeConversationId === convId;
          const isOwn = msg.sender.id === currentUserId;

          // Anti-doublon : si message existe, mettre à jour le statut
          if (existingMessages.some((m) => m.id === msg.id)) {
            return {
              messagesByConv: {
                ...state.messagesByConv,
                [convId]: existingMessages.map(m =>
                  m.id === msg.id
                    ? {
                        ...m,
                        read: m.read || msg.read,
                        is_delivered: m.is_delivered || msg.is_delivered,
                      }
                    : m
                ),
              },
            };
          }

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
                type: msg.image ? "image" : msg.file ? "file" : msg.voice ? "voice" : "text",
                read: msg.read || false,
              } as any,
              unread_count: !isOwn && !isActive
                ? (c.unread_count ?? 0) + 1
                : c.unread_count ?? 0,
            } as Conversation;
          });

          return {
            ...state,
            conversations: newConversations,
            messagesByConv: {
              ...state.messagesByConv,
              [convId]: newMessages,
            },
          };
        });
      },

      clearMessages: (convId) =>
        set((state) => ({
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: []
          }
        })),

      markAsRead: (convId) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === convId ? { ...c, unread_count: 0 } : c
          ),
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: (state.messagesByConv[convId] || []).map((m) => ({ ...m, read: true })),
          },
        })),

      setMessageRead: (convId, messageId) =>
        set((state) => ({
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: (state.messagesByConv[convId] || []).map((m) =>
              m.id === messageId ? { ...m, read: true } : m
            ),
          },
        })),

      clearOldMessages: (convId, limit = MAX_MESSAGES_PER_CONV) =>
        set((state) => ({
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: (state.messagesByConv[convId] || []).slice(-limit)
          }
        })),

      // ─── Scroll infini ────────────────────────────────
      prependMessages: (convId, messages) =>
        set((state) => {
          const existing = state.messagesByConv[convId] || [];
          const existingIds = new Set(existing.map(m => m.id));
          const newOnes = messages.filter(m => !existingIds.has(m.id));
          const merged = [...newOnes, ...existing].sort(
            (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
          return {
            messagesByConv: { ...state.messagesByConv, [convId]: merged },
          };
        }),

      setHasMore: (convId, hasMore) =>
        set((state) => ({
          hasMoreByConv: { ...state.hasMoreByConv, [convId]: hasMore },
        })),

      setLoadingMore: (convId, loading) =>
        set((state) => ({
          loadingMoreByConv: { ...state.loadingMoreByConv, [convId]: loading },
        })),

      // ─── Statut livré ─────────────────────────────────
      setMessageDelivered: (convId, messageId) =>
        set((state) => ({
          messagesByConv: {
            ...state.messagesByConv,
            [convId]: (state.messagesByConv[convId] || []).map((m) =>
              m.id === messageId ? { ...m, is_delivered: true } : m
            ),
          },
        })),

    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        // Limite à 50 messages par conv pour ne pas dépasser 5MB localStorage
        messagesByConv: Object.fromEntries(
          Object.entries(state.messagesByConv).map(([k, v]) => [k, v.slice(-50)])
        ),
        activeConversationId: state.activeConversationId,
      }),
    }
  )
);