import { sendChatMessage } from "@/actions/chat";
import { generateId } from "@/lib/utils";
import { useChatStore } from "@/store/chatStore";
import { Message } from "@/store/mindMapStore";
import { useCallback } from 'react';

export const useChatMessages = () => {
    const { messages, isStreaming, addMessage, setIsStreaming, appendAssistantMessage } = useChatStore();

    const sendMessage = useCallback(async (content: string, modelType: string) => {
        if (isStreaming) return;
        const userMessage: Message = { id: generateId(), role: "user", content };
        addMessage(userMessage);
        setIsStreaming(true);

        try {
            let assistantMessage: Message = { id: generateId(), role: "assistant", content: "" };
            addMessage(assistantMessage);

            await sendChatMessage(
                [...messages.slice(1), userMessage],
                modelType,
                (chunk) => {
                    const data = JSON.parse(chunk);
                    appendAssistantMessage(data.content);
                },
            );
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
            addMessage({
                id: generateId(),
                role: "assistant",
                content: `Error: ${errorMessage}`,
            });
        } finally {
            setIsStreaming(false);
        }
    }, [messages, addMessage, isStreaming, appendAssistantMessage]);

    return { messages, isStreaming, sendMessage };
};