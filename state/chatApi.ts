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
  file: string | null;
  image: string | null;
   // snake_case (API)
  file_name?: string;
  file_size?: number;

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
    content: string;
    sender: string;
    timestamp: string;
  };
  unread_count: number;
}
export interface ConversationFile {
  id: string;
  file: string | null;
  image: string | null;
  created_at: string;
  sender_id: string;
  sender_name: string;
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
      query: () => "/conversations/",
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Conversations" as const, id })),
              { type: "Conversations", id: "LIST" },
            ]
          : [{ type: "Conversations", id: "LIST" }],
    }),

    // Créer ou récupérer une conversation avec un utilisateur
    createOrGetConversation: builder.mutation<{ id: string }, { userId: string }>({
      query: ({ userId }) => ({
        url: "/conversations/create-or-get/",
        method: "POST",
        body: { user_id: userId },
      }),
      invalidatesTags: [{ type: "Conversations", id: "LIST" }],
    }),

    // Liste des utilisateurs (excluant l’utilisateur connecté)
    getUsers: builder.query<User[], void>({
      query: () => "/users/",
      providesTags: ["Users"],
    }),

    // Liste des messages d'une conversation
    getMessages: builder.query<Message[], string>({
      query: (conversationId) => `/conversations/${conversationId}/messages/`,
      providesTags: (result, _error, conversationId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Messages" as const, id })),
              { type: "Messages", id: conversationId },
            ]
          : [{ type: "Messages", id: conversationId }],
    }),

    // Envoyer un message
    sendMessage: builder.mutation<
          Message,
          { conversationId: string; formData: FormData }
      >({
        query: ({ conversationId, formData }) => ({
          url: `/conversations/${conversationId}/messages/list-create/`, 
          method: "POST",
          body: formData,
        }),
        invalidatesTags: (_result, _error, { conversationId }) => [
          { type: "Messages", id: conversationId },
          { type: "Conversations", id: conversationId },
        ],
      }),



    // Marquer un message comme lu
    markMessageRead: builder.mutation<void, { messageId: string }>({
      query: ({ messageId }) => ({
        url: `/messages/${messageId}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["Messages"],
    }),

    /* ---------- 🔍 Recherche utilisateurs (WhatsApp) ---------- */
    searchUsers: builder.query<
  { results: User[]; next: string | null; previous: string | null; count: number },
  { q: string; page?: number }
>({
  query: ({ q, page = 1 }) => ({
    url: "/users/search/",
    params: { q, page },
  }),
  providesTags: ["Users"],
}),
    // Récupérer les fichiers d'une conversation
    getConversationFiles: builder.query<ConversationFile[], string>({
      query: (conversationId) => `/conversations/${conversationId}/files/`,
      providesTags: (result, _error, conversationId) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Messages" as const, id })),
              { type: "Messages", id: `files-${conversationId}` },
            ]
          : [{ type: "Messages", id: `files-${conversationId}` }],
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
} = chatApi;