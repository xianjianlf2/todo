import { generateId } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import type { Message } from "@/store/mindMapStore";
import { useCallback } from 'react';
import { toast } from "./use-toast";

export const useChatMessages = () => {
    const { messages, isStreaming, addMessage, setIsStreaming, appendAssistantMessage } = useChatStore();

    const sendMessage = useCallback(async (content: string, modelName: string, apiKey?: string, temperature?: number, maxTokens?: number) => {
        if (isStreaming) return;
        const userMessage: Message = { id: generateId(), role: "user", content };
        addMessage(userMessage);
        setIsStreaming(true);

        try {
            const assistantMessage: Message = { id: generateId(), role: "assistant", content: "" };
            addMessage(assistantMessage);

            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
                },
                body: JSON.stringify({
                    messages: [...messages.slice(1), userMessage],
                    modelName,
                    temperature,
                    maxTokens,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;
                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') {
                            break;
                        }
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.content) {
                                appendAssistantMessage(parsed.content);
                            }
                        } catch (e) {
                            console.error('Error parsing JSON:', e);
                        }
                    }
                }
            }
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