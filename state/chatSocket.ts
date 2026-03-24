let socket: WebSocket | null = null;

export const connectChatSocket = (token: string, conversationId: string) => {
  socket = new WebSocket(
    `${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/chat/${conversationId}/?token=${token}`
  );
};

// Envoi d'un message
export const sendMessage = (data: { content: string; receiverId?: string }) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(
      JSON.stringify({
        type: "chat_message",
        message: data.content,
        receiver_id: data.receiverId,
      })
    );
  }
};

// Envoi d'une notification de lecture
export const sendReadReceipt = (messageId: string) => {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: "read_receipt", message_id: messageId }));
  }
};

// Écoute messages entrants
export const onNewMessage = (callback: (msg: any) => void) => {
  if (!socket) return;

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "chat_message") {
      callback(data.data);
    }
    if (data.type === "read_receipt") {
      callback({ type: "read_receipt", message_id: data.message_id });
    }
  };
};

// Déconnexion
export const disconnectChatSocket = () => {
  socket?.close();
};
