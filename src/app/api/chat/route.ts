'use server'

import type { ModelType } from '@/lib/langchain';
import { models } from '@/lib/langchain';
import type { Message } from '@/store/chatStore';
import type { BaseMessageLike } from '@langchain/core/messages';
import { AIMessage, HumanMessage } from '@langchain/core/messages';
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
    const processedMessages = processHistoryMessages(messages);
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