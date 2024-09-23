"use client";
import { toast } from "@/hooks/use-toast";
import { Message } from "@/store/mindMapStore";
import { Copy } from "lucide-react";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import Markdown from "react-markdown";
import remarkGfm from 'remark-gfm';


interface ChatMessageProps {
  message: Message;
  index: number;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    toast({
      description: "Message copied to clipboard!",
      duration: 1000,
    });
  };

  return (
    <Draggable draggableId={message.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          style={{
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.5 : 1,
          }}
        >
          <div
            className={`max-w-[80%] rounded-lg px-3 py-2 ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <div className="mb-1 flex items-center justify-end">
              <Copy
                className="h-4 w-4 cursor-pointer"
                onClick={handleCopyMessage}
              />
            </div>
            <hr className="mb-2 border-t border-gray-300 dark:border-gray-600" />
            <Markdown remarkPlugins={[remarkGfm]}>{message.content}</Markdown>
          </div>
        </div>
      )}
    </Draggable>
  );
};
