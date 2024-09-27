'use client'
import type { Message } from "@/store/mindMapStore";

export const sendChatMessage = async (
    messages: Message[],
    modelType: string,
    apiKey: string,
    onChunk: (chunk: string) => void
) => {
    const response = await fetch("/api/chat", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({ messages, modelType }),
    });

    if (!response.ok) {
        const errorData = await response.json() as { message?: string };
        throw new Error(errorData.message ?? "An error occurred");
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (reader) {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n\n');

            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') {
                        return;
                    }
                    onChunk(data);
                } else if (line === 'event: close') {
                    return;
                }
            }
        }
    }
};