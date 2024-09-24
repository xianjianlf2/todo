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
## 运动的好处

### 1. 提高心肺功能
- 运动可以增强心脏和肺部的健康，改善血液循环，增加氧气的输送。
- 有助于预防和控制心血管疾病，如高血压、冠心病等。

### 2. 增强肌肉和骨骼
- 有规律的力量训练和有氧运动有助于增强肌肉力量。
- 运动还可以增加骨密度，降低骨质疏松的风险，尤其是对于老年人。

### 3. 促进心理健康
- 运动能够释放**内啡肽**，减少压力、焦虑和抑郁。
- 经常运动的人通常情绪更加积极、精神更加集中。

### 4. 改善免疫系统
- 适量运动有助于增强免疫系统的功能，使身体更好地抵御疾病。
- 经常运动的人群在面对普通感冒等疾病时，症状通常较为轻微。

### 5. 控制体重
- 运动可以帮助消耗多余的能量，促进脂肪的燃烧，达到减肥的效果。
- 结合健康饮食，保持运动能够有效维持理想体重。

### 6. 提升睡眠质量
- 运动尤其是有氧运动能帮助调节生物钟，改善睡眠质量。
- 适当运动可以减少入睡困难和夜间醒来的频率，帮助深度睡眠。

### 7. 提高自信心
- 经常运动有助于塑造良好的体态，提升个人形象。
- 随着身体素质的提升，个人成就感增加，增强自信心。

### 8. 延缓衰老
- 运动可以促进新陈代谢，保持身体机能的年轻化。
- 长期坚持运动的人通常显得比实际年龄更加年轻。

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