import { generateId } from "@/lib/utils";
import { create } from "zustand";

export interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
}

export interface ChatStore {
    messages: Message[];
    isStreaming: boolean;
    createMessage: (content: string, role: Message["role"]) => Message;
    addMessage: (message: Message) => void;
    removeMessage: (id: string) => void;
    updateMessage: (id: string, content: string) => void;
    setIsStreaming: (isStreaming: boolean) => void;
    appendAssistantMessage: (content: string) => void;
}

const markdownExample = `
# Header 1

content 1

## Header 2

content 2

### Header 3

content 3

#### Header 4

content 4

##### Header 5

content 5

###### Header 6

content 6

This is a paragraph.
`
export const useChatStore = create<ChatStore>((set) => ({
    messages: [
        {
            id: generateId(),
            content: markdownExample,
            role: "assistant",
        },
    ],
    isStreaming: false,
    createMessage: (content, role) => ({ id: generateId(), content, role }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    removeMessage: (id) => set((state) => ({ messages: state.messages.filter((message) => message.id !== id) })),
    updateMessage: (id, content) => set((state) => ({ messages: state.messages.map((message) => message.id === id ? { ...message, content } : message) })),
    setIsStreaming: (isStreaming) => set({ isStreaming }),
    appendAssistantMessage: (content) => set((state) => {
        const lastMessage = state.messages[state.messages.length - 1];
        if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += content;
            return { messages: [...state.messages.slice(0, -1), lastMessage] };
        }
        return state;
    }),
}));