"use client";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useSidebarResize } from "@/hooks/useSidebarResize";
import { useChatStore } from "@/store/chatStore";
import { Trash2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";

interface ChatSidebarProps {
  isSidebarOpen: boolean;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ isSidebarOpen }) => {
  const { messages, isStreaming, clearMessages } = useChatStore();
  const { sendMessage } = useChatMessages();
  const { sidebarWidth, handleMouseDown } = useSidebarResize();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isSidebarOpen) return null;

  return (
    <div
      className="relative flex flex-col border-l p-4"
      style={{ width: `${sidebarWidth}px` }}
    >
      <div
        className="absolute bottom-0 left-0 top-0 w-1 cursor-ew-resize bg-gray-300 transition-colors hover:bg-gray-400"
        onMouseDown={handleMouseDown}
      />
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Chat & Edit</h2>
        <Button
          onClick={clearMessages}
          variant="ghost"
          size="icon"
          title="clear chat"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
      <ScrollArea className="mb-4 flex-grow space-y-4">
        {isMounted && (
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-4"
              >
                {messages.map((message, index) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    index={index}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        )}
        <div ref={messagesEndRef} />
      </ScrollArea>
      <ChatInput onSendMessage={sendMessage} isStreaming={isStreaming} />
    </div>
  );
};

export default ChatSidebar;
