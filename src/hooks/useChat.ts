import { useState, useEffect, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Message } from "../components/chat/types";
import api from "../utils/api";

export const useChat = (userId: string, receiverId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // Fetch existing messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`/chat/messages/${receiverId}`);
        setMessages(response.data);
      } catch (err) {
        setError("Failed to load messages");
      }
    };
    fetchMessages();
  }, [receiverId]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000", {
      query: { userId },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setIsConnecting(false);
      setError(null);
    });

    newSocket.on("connect_error", () => {
      setError("Failed to connect to chat server");
      setIsConnecting(false);
    });

    newSocket.on("receive_message", (message: Message) => {
      setMessages((prev) => {
        if (prev.find((msg) => msg.id === message.id)) {
          return prev;
        }
        return [...prev, message];
      });
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [userId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!socket || !content.trim()) return;

      try {
        // Send message to server
        const response = await api.post("/chat/messages", {
          receiverId,
          content,
        });

        // Add message to local state if it doesn't already exist
        setMessages((prev) => {
          if (prev.find((msg) => msg.id === response.data.id)) {
            return prev;
          }
          return [...prev, response.data];
        });
      } catch (err) {
        setError("Failed to send message");
      }
    },
    [socket, receiverId]
  );

  return {
    messages,
    error,
    isConnecting,
    sendMessage,
  };
};
