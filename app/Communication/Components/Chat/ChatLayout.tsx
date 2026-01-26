"use client";

import { useState, useEffect, useRef } from "react";
import { SendHorizontal, File as FileIcon, Video } from "lucide-react";
import {
  useGetConversationsQuery,
  useGetMessagesQuery,
  useCreateOrGetConversationMutation,
  useSendMessageMutation,
  useMarkMessageReadMutation,
} from "@/state/chatApi";
import ConversationList from "./ConversationList";
import ChatMessage from "../Messages/ChatMessage";
import { useChatSocket, ChatMessageWS } from "@/state/useChatSocket";
import FileHistory from "../History/FileHistory";

interface ChatLayoutProps {
  currentUserId: string;
  conversationId: string | null;
}

export default function ChatLayout({
  currentUserId,
  conversationId,
}: ChatLayoutProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ─── RTK Query
  const { data: conversations = [], refetch: refetchConversations } =
    useGetConversationsQuery();
  const [createOrGetConversation] = useCreateOrGetConversationMutation();
  const [sendMessage] = useSendMessageMutation();
  const [markMessageRead] = useMarkMessageReadMutation();

  // ─── Local state
  const [activeConversationId, setActiveConversationId] =
    useState<string | null>(conversationId);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // pour prévisualisation

  // ─── WebSocket
  const { wsMessages, sendMessageWS, sendReadReceiptWS, sendTypingWS, isUserOnline, isUserTyping } =
    useChatSocket({ currentUserId, conversationId: activeConversationId });

  // ─── Messages API
  const { data: messages = [], refetch: refetchMessages } = useGetMessagesQuery(
    activeConversationId ?? "",
    { skip: !activeConversationId }
  );

  // ─── Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, wsMessages]);

  // ─── Auto select first conversation
  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  // ─── Active conversation
  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  );
  const otherUser = activeConversation?.participants.find(
    (u) => u.id !== currentUserId
  );

  // ─── Merge API + WS messages
  const allMessagesMap: Record<string, any> = {};
  [...messages, ...wsMessages].forEach((msg) => {
    allMessagesMap[msg.id] = msg;
  });
  const allMessages = Object.values(allMessagesMap).sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  // ─── Handle send message
  const handleSendMessage = async () => {
  if (!newMessage.trim() && !selectedFile) return;
  if (!activeConversationId) return;

  const formData = new FormData();
  formData.append("content", newMessage);

  if (selectedFile) {
    if (selectedFile.type.startsWith("image/")) {
      formData.append("image", selectedFile);
      console.log("[Chat] Envoi image :", selectedFile);
    } else {
      formData.append("file", selectedFile);
      console.log("[Chat] Envoi fichier :", selectedFile);
    }
  }

  formData.append("conversation", activeConversationId);
  if (otherUser?.id) formData.append("receiver_id", otherUser.id);

  try {
    // 🔹 Envoi via API
    const messageFromBackend = await sendMessage({
      conversationId: activeConversationId,
      formData,
    }).unwrap();

    console.log("[Chat] Message créé côté backend :", messageFromBackend);

    // 🔹 Envoi via WebSocket
    sendMessageWS({
      id: messageFromBackend.id,
      content: messageFromBackend.content,
      sender: {
        id: currentUserId,
        name: "Moi",
      },
      timestamp: messageFromBackend.timestamp,
      read: false,
      image: messageFromBackend.image || null,
      file: messageFromBackend.file || null,
    });
    console.log("[Chat] Message envoyé WS :", messageFromBackend);

    // Reset
    setNewMessage("");
    setSelectedFile(null);
    refetchMessages();
  } catch (error) {
    console.error("[Chat] Erreur envoi message :", error);
  }
};


  // ─── Mark messages as read
  useEffect(() => {
    if (!activeConversationId) return;

    allMessages
      .filter((msg) => !msg.read && msg.sender.id !== currentUserId)
      .forEach((msg) => {
        markMessageRead({ messageId: msg.id });
        sendReadReceiptWS(msg.id);
      });
  }, [allMessages, activeConversationId]);

  const normalizedMessages = allMessages.map((msg) => ({
  ...msg,
  fileName: msg.fileName ?? msg.file_name,
  fileSize: msg.fileSize ?? msg.file_size,
}));

  // ─── Typing
  const handleTyping = (text: string) => {
    setNewMessage(text);
    if (activeConversationId) sendTypingWS(text.length > 0, activeConversationId);
  };

  // ─── File selection + preview
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // ─── Render
  return (
    <div className="flex h-[600px] rounded-lg overflow-hidden border bg-white">
      {/* Conversations */}
      <div className="w-1/3 border-r">
        <ConversationList
          conversations={conversations}
          currentUserId={currentUserId}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
        />
      </div>

      {/* Chat */}
      <div className="w-1/3 flex flex-col p-4">
        {activeConversation && otherUser ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 pb-3 border-b">
              <img src={otherUser.avatar || "/default-avatar.jpg"} className="w-12 h-12 rounded-full" />
              <div>
                <p className="font-semibold text-black">{otherUser.name}</p>
                <p className="text-xs text-gray-500">{isUserOnline(otherUser.id) ? "En ligne" : "Hors ligne"}</p>
                {isUserTyping(otherUser.id) && <p className="text-xs text-blue-500">en train d’écrire…</p>}
              </div>
              <button className="ml-auto flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
                <Video size={18} /> Appel vidéo
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {normalizedMessages.map((msg, index) => (
                <ChatMessage
                  key={msg.id}
                  messageId={msg.id}
                  message={msg.content}
                  image={msg.image}
                  file={msg.file}
                  fileName={msg.fileName}
                  fileSize={msg.fileSize}
                  createdAt={msg.timestamp}
                  senderId={msg.sender.id}
                  isOwn={msg.sender.id === currentUserId}
                  read={msg.read}
                  previousSenderId={normalizedMessages[index - 1]?.sender.id}
                />
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Preview selected file */}
            {previewUrl && (
              <div className="mb-2">
                {selectedFile?.type.startsWith("image/") ? (
                  <img src={previewUrl} className="w-32 h-32 object-cover rounded-md" />
                ) : (
                  <div className="px-2 py-1 bg-gray-200 text-black rounded-md">
                    📄 {selectedFile?.name}
                  </div>
                )}
              </div>
            )}

            {/* Input */}
            <div className="flex gap-3 items-center mt-4">
              <input
                type="text"
                placeholder="Écrire un message…"
                value={newMessage}
                onChange={(e) => handleTyping(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 border rounded-lg px-3 py-2"
              />

              <label className="cursor-pointer">
                <FileIcon size={20} />
                <input
                  type="file"
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </label>

              <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded-lg">
                <SendHorizontal />
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Aucune conversation sélectionnée</p>
        )}
      </div>

      {/* File history */}
      <div className="w-1/3 border-l">
        <FileHistory conversationId={activeConversationId} />
      </div>
    </div>
  );
}
