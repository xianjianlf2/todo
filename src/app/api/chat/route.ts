'use server'

import type { ModelType } from '@/lib/langchain';
import { models } from '@/lib/langchain';
import type { Message } from '@/store/chatStore';
import type { BaseMessageLike } from '@langchain/core/messages';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { NextResponse } from 'next/server';

function processHistoryMessages(messages: Message[]): BaseMessageLike[] {
  return messages.map(msg => {
    switch (msg.role) {
      case 'user':
        return new HumanMessage(msg.content);
      case 'assistant':
        return new AIMessage(msg.content);
      default:
        throw new Error(`Unknown message role: ${msg.role as string}`);
    }
  });
}

function needsMindMap(content: string): boolean {
  const keywords = ["思维导图", "脑图", "概念图", "mind map", "road map", "guide line", "mindmap", "roadmap"];
  return keywords.some(keyword => content.toLowerCase().includes(keyword));
}

function createMindMapPrompt(content: string): string {
  return `Create a concise mind map for the following topic: ${content}

Requirements:
1. Use markdown format
2. Prefer short, concise language
3. Structure the mind map with 3 levels:
   - Main topic
   - Key concepts (usually 3-5)
   - Important details for each concept

Please describe the structure of the mind map using markdown headings and bullet points.`;
}

export async function POST(request: Request) {
  const { messages, modelType } = await request.json() as { messages: Message[]; modelType: string };
  const apiKey = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!messages || !modelType) {
    return NextResponse.json({ message: 'Missing messages or modelType' }, { status: 400 });
  }

  const key = apiKey ?? process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json({ message: 'API key is required but not provided' }, { status: 401 });
  }

  try {
    const model = models[modelType as ModelType];
    model.apiKey = key;
    let processedMessages = processHistoryMessages(messages);

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user' && needsMindMap(lastUserMessage.content)) {
      const mindMapPrompt = createMindMapPrompt(lastUserMessage.content);
      processedMessages.push(new SystemMessage(mindMapPrompt));
    }

    const stream = await model.stream(processedMessages);
    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const message = `data: ${JSON.stringify({ content: chunk.content })}\n\n`;
              controller.enqueue(encoder.encode(message));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch (error) {
            console.error(error);
          } finally {
            controller.close();
          }
        },
      }),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error processing your request' }, { status: 500 });
  }
}