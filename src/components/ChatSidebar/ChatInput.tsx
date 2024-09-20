import { MODEL_OPTIONS } from "@/lib/const";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

interface ChatInputProps {
  onSendMessage: (content: string, modelType: string) => void;
  isStreaming: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
}) => {
  const [inputMessage, setInputMessage] = useState("");
  const [modelType, setModelType] = useState("gpt-3.5-turbo");

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage, modelType);
      setInputMessage("");
    }
  };

  return (
    <div className="space-y-2">
      <Input
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <div className="flex items-center space-x-2">
        <Select value={modelType} onValueChange={setModelType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {MODEL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleSendMessage} disabled={isStreaming}>
          {isStreaming ? <Spinner className="mr-2 h-4 w-4" /> : null}
          Send
        </Button>
      </div>
    </div>
  );
};
