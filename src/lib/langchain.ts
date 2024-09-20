import { ChatOpenAI } from "@langchain/openai";

export const models = {
    "gpt-3.5-turbo": new ChatOpenAI({ modelName: "gpt-3.5-turbo", configuration: { baseURL: process.env.BASE_API_URL } }),
    "gpt-4": new ChatOpenAI({ modelName: "gpt-4", configuration: { baseURL: process.env.BASE_API_URL } }),
    "claude-3-sonnet-20240229": new ChatOpenAI({
        model: "claude-3-sonnet-20240229",
        configuration: { baseURL: process.env.BASE_API_URL }
        // ACCORDING TO YOUR PROXY SUPPLIER CONFIG
        // anthropicApiUrl: process.env.ANTHROPIC_API_URL,
        // apiKey: process.env.ANTHROPIC_API_KEY,
    }),
};

export type ModelType = keyof typeof models;