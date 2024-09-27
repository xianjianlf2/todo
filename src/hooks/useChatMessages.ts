import { sendChatMessage } from "@/actions/chat";
import { generateId } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import type { Message } from "@/store/mindMapStore";
import { useCallback } from 'react';
import { toast } from "./use-toast";

export const useChatMessages = () => {
    const { messages, isStreaming, addMessage, setIsStreaming, appendAssistantMessage } = useChatStore();

    const sendMessage = useCallback(async (content: string, modelType: string, apiKey: string) => {
        if (isStreaming) return;
        const userMessage: Message = { id: generateId(), role: "user", content };
        addMessage(userMessage);
        setIsStreaming(true);

        try {
            const assistantMessage: Message = { id: generateId(), role: "assistant", content: "" };
            addMessage(assistantMessage);

            await sendChatMessage(
                [...messages.slice(1), userMessage],
                modelType,
                apiKey,
                (chunk: string) => {
                    const data = JSON.parse(chunk) as { content: string };
                    appendAssistantMessage(data.content);
                },
            );
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        } finally {
            setIsStreaming(false);
        }
    }, [messages, addMessage, isStreaming, appendAssistantMessage, setIsStreaming]);

    return { messages, isStreaming, sendMessage };
};