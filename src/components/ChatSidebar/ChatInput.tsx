import LoginDialog from "@/components/LoginDialog";
import { toast } from "@/hooks/use-toast";
import { useSettingsDialog } from "@/hooks/useSettingsDialog";
import { useSettingsStore } from "@/store/settingsStore";
import { useClerk, useUser } from "@clerk/nextjs";
import { RefreshCw } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
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

interface ModelOption {
  value: string;
  label: string;
}

interface ChatInputProps {
  onSendMessage: (content: string, modelType: string) => void;
  isStreaming: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isStreaming,
}) => {
  const { isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const { openSettings } = useSettingsDialog();
  const { settings } = useSettingsStore();
  const [inputMessage, setInputMessage] = useState("");
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("");

  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const fetchModels = async () => {
    setIsLoadingModels(true);
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (settings.apiKey) {
        headers['Authorization'] = `Bearer ${settings.apiKey}`;
      }

      if (settings.baseURL) {
        headers['X-Base-URL'] = settings.baseURL;
      }

      const response = await fetch("/api/models", { headers });
      const data = await response.json();
      if (Array.isArray(data.models)) {
        setModelOptions(data.models);
        setSelectedModel(data.models[0]?.value || "");
      }
    } catch (error) {
      console.error("Error fetching models:", error);
      toast({
        title: "Error",
        description: "Failed to fetch models. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingModels(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSendMessage = async () => {
    if (!isSignedIn && settings.apiKey === "") {
      setShowLoginDialog(true);
      return;
    }

    if (inputMessage.trim()) {
      try {
        await onSendMessage(inputMessage, selectedModel);
        setInputMessage("");
      } catch (error) {
        const errorMessage =
          error instanceof Error && error.message === "Usage limit exceeded"
            ? "You have reached your usage limit for today."
            : "An error occurred while sending your message.";

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      }
    }
  };

  const handleOpenSettings = useCallback(() => {
    setShowLoginDialog(false);
    openSettings();
  }, [openSettings]);

  return (
    <div className="space-y-2">
      <Input
        placeholder="Type your message..."
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
      />
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Select
            value={selectedModel}
            onValueChange={(value) => setSelectedModel(value)}
          >
            <SelectTrigger className="w-full pr-8">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {modelOptions.length > 0 ? (
                modelOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="empty" disabled>
                  No models available
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={fetchModels}
            disabled={isLoadingModels}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoadingModels ? "animate-spin" : ""}`}
            />
          </Button>
        </div>

        <Button onClick={handleSendMessage} disabled={isStreaming}>
          {isStreaming && <Spinner className="mr-2 h-4 w-4" />}
          Send
        </Button>
      </div>
      {modelOptions.length === 0 && !isLoadingModels && (
        <p className="text-sm text-muted-foreground">
          Tip: If no models are available, try refreshing the list or check your
          API key settings.
        </p>
      )}
      <LoginDialog
        isOpen={showLoginDialog}
        onClose={() => setShowLoginDialog(false)}
        onLogin={openSignIn}
        onOpenSettings={handleOpenSettings}
      />
    </div>
  );
};
