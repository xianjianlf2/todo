import { sendChatMessage } from "@/actions/chat";
import { generateId } from "@/lib/utils";
import { Message, useMindMapStore } from "@/store/mindMapStore";
import { useCallback, useState } from 'react';

export const useChatMessages = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: generateId(),
            role: "assistant",
            content: "Hello! How can I assist you today?",
        },
    ]);
    const { isStreaming, setIsStreaming } = useMindMapStore();

    const addMessage = useCallback((message: Message) => {
        setMessages(prevMessages => [...prevMessages, message]);
    }, []);

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
                    assistantMessage.content += data.content;
                    setMessages(prevMessages => [
                        ...prevMessages.slice(0, -1),
                        { ...assistantMessage },
                    ]);
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
    }, [messages, addMessage, isStreaming]);

  return { messages, isStreaming, sendMessage };
};