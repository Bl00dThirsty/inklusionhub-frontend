import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface User {
  id: string;
  name: string;
  avatar?: string | null;
  online?: boolean;
}

export interface Message {
  id: string;
  content: string;
  type: 'text' | 'image' | 'file' | 'voice' | 'call-audio' | 'call-video';
  call: any;
  conversation_id: string | null;

  file: string | null;
  image: string | null;
   // snake_case (API)
  file_name?: string;
  file_size?: number;
  voice?: {
    audio: string;
    duration: number;
  };
   call_type?: 'audio' | 'video';
  call_status?: 'ringing' | 'ongoing' | 'ended' | 'missed';
  call_duration?: number;
  created_at: string;
  updated_at: string;

  // camelCase (WS / frontend)
  fileName?: string;
  fileSize?: number;
  timestamp: string;
  sender: User;
  receiver?: User;
  read: boolean;
  is_own: boolean;
  read_at?: string | null;
}

export interface Conversation {
  id: string;
  participants: User[];
  last_message?: {
    delivered: any;
    read: any;
    file_name: string;
    sender_id: string;
    content: string;
    type: "text" | "image" | "file" | "voice" | "call-audio" | "call-video";
    fileName?: string;
    created_at: string;
    sender: string;
    timestamp: string;
  };
  avatar: string;
  unread_count: number;
  updatedAt: string;
}
export interface ConversationFile {
  id: string;
  file: string | null;
  image: string | null;
  created_at: string;
  sender_id: string;
  sender_name: string;
}

export interface CommunicationStats {
  unreadMessages: number;
  recentConversations: number;
  activeUsers: number;
  groups: number;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/communication',
    prepareHeaders: (headers) => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Users","Conversations","Messages"],
  endpoints: (builder) => ({

     /* ---------- Conversations ---------- */
    // Liste des conversations
    getConversations: builder.query<Conversation[], void>({
      query: () => "/communication/conversations/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Conversations" as const, id })),
              { type: "Conversations", id: "LIST" },
            ]
          : [{ type: "Conversations", id: "LIST" }],
    }),

    // Liste des messages d'une conversation
    getMessages: builder.query<Message[], string>({
      query: (conversationId) => `/communication/conversations/${conversationId}/messages/`,
      providesTags: (result, _error, conversationId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Messages" as const, id })),
              { type: "Messages", id: conversationId },
            ]
          : [{ type: "Messages", id: conversationId }],
    }),

    // Créer ou récupérer une conversation avec un utilisateur
    createOrGetConversation: builder.mutation<{ id: string }, { userId: string }>({
      query: ({ userId }) => ({
        url: "/communication/conversations/create-or-get/",
        method: "POST",
        body: { user_id: userId },
      }),
      invalidatesTags: [{ type: "Conversations", id: "LIST" }],
    }),

    // Liste des utilisateurs (excluant l’utilisateur connecté)
    getUsers: builder.query<User[], void>({
      query: () => "/communication/users/",
      providesTags: ["Users"],
    }),

    // Envoyer un message
    sendMessage: builder.mutation<
        Message,
        { conversationId: string; formData: FormData }
      >({
        query: ({ conversationId, formData }) => ({
          url: `/communication/conversations/${conversationId}/messages/list-create/`,
          method: "POST",
          body: formData,
        }),
        invalidatesTags: (_result, _error, { conversationId }) => [
          { type: "Messages", id: conversationId },       // rafraîchit les messages
          { type: "Conversations", id: "LIST" },        // ⚡ rafraîchit la liste des conversations
        ],
      }),




    // Marquer un message comme lu
    markMessageRead: builder.mutation<void, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/communication/messages/${messageId}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["Messages"],
    }),
     
//Suppression d'un message envoyé
    deleteMessage: builder.mutation<
  void,
  { messageId: string; forEveryone: boolean }
>({
  query: ({ messageId, forEveryone }) => ({
    url: `/messages/${messageId}/delete/`,
    method: "POST",
    body: { for_everyone: forEveryone },
  }),
}),
    

    /* ----------  Recherche utilisateurs (WhatsApp) ---------- */
    searchUsers: builder.query<
  { results: User[]; next: string | null; previous: string | null; count: number },
  { q: string; page?: number }
>({
  query: ({ q, page = 1 }) => ({
    url: "/communication/users/search/",
    params: { q, page },
  }),
  providesTags: ["Users"],
}),
    // Récupérer les fichiers d'une conversation
    getConversationFiles: builder.query<ConversationFile[], string>({
      query: (conversationId) => `/communication/conversations/${conversationId}/files/`,
      providesTags: (result, _error, conversationId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Messages" as const, id })),
              { type: "Messages", id: `files-${conversationId}` },
            ]
          : [{ type: "Messages", id: `files-${conversationId}` }],
    }),

    getCommunicationStats: builder.query<CommunicationStats, void>({
  query: () => "/stats/",
  providesTags: ["Conversations", "Messages"],
}),
  }),
});

export const {
  useGetUsersQuery,
  useGetConversationsQuery,
  useCreateOrGetConversationMutation,
  useGetMessagesQuery,
  useSendMessageMutation,
  useMarkMessageReadMutation,
  useGetConversationFilesQuery,
  useSearchUsersQuery,
  useDeleteMessageMutation,
  useGetCommunicationStatsQuery
} = chatApi;