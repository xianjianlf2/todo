"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useSidebarResize } from "@/hooks/useSidebarResize";
import React, { useEffect, useRef } from "react";
import { StrictModeDroppable } from "../StrictModeDroppable";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { useChatStore } from "@/store/chatStore";

interface ChatSidebarProps {
  isSidebarOpen: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isSidebarOpen }) => {
  if (!isSidebarOpen) return null;

  const { messages, isStreaming, addMessage, removeMessage, updateMessage, setIsStreaming } = useChatStore();
  const { sendMessage } = useChatMessages();
  const { sidebarWidth, handleMouseDown } = useSidebarResize();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="relative flex flex-col border-l p-4"
      style={{ width: `${sidebarWidth}px` }}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-1 cursor-ew-resize bg-gray-300 transition-colors hover:bg-gray-400"
        onMouseDown={handleMouseDown}
      />
      <h2 className="mb-4 text-lg font-semibold">Chat & Edit</h2>
      <ScrollArea className="mb-4 flex-grow space-y-4">
        <StrictModeDroppable droppableId="droppable">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-4"
            >
              {messages.map((message, index) => (
                <ChatMessage key={message.id} message={message} index={index} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </StrictModeDroppable>
        <div ref={messagesEndRef} />
      </ScrollArea>
      <ChatInput onSendMessage={sendMessage} isStreaming={isStreaming} />
    </div>
  );
};

export default ChatSidebar;
