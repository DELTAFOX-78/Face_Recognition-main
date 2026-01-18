import React, { useEffect, useRef } from "react";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import LoadingSpinner from "../common/LoadingSpinner";
import { showToast } from "../../utils/toast";

interface ChatSectionProps {
  receiverId: string;
}

const ChatSection: React.FC<ChatSectionProps> = ({ receiverId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { messages, error, isConnecting, sendMessage } = useChat(
    user?.id || "",
    receiverId
  );

  useEffect(() => {
    if (error) {
      showToast.error(error);
    }
  }, [error]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
            isOwnMessage={message.sender === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t border-gray-200 bg-white">
        <ChatInput onSendMessage={sendMessage} disabled={isConnecting} />
      </div>
    </div>
  );
};

export default ChatSection;
