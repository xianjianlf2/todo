'use server'

import { ErrorCode, getErrorMessage } from '@/app/api/errors';
import type { Message } from '@/store/chatStore';
import { auth } from '@clerk/nextjs/server';
import type { BaseMessageLike } from '@langchain/core/messages';
import { AIMessage, HumanMessage, SystemMessage } from '@langchain/core/messages';
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
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
  const { userId } = auth();
  const { messages, modelName, apiKey: passedApiKey, temperature, maxTokens } = await request.json() as {
    messages: Message[];
    modelName: string;
    apiKey?: string;
    temperature?: number;
    maxTokens?: number;
  };
  const headerApiKey = request.headers.get('Authorization')?.split('Bearer ')[1];

  if (!messages || !modelName) {
    return NextResponse.json({ message: 'Missing messages or modelName' }, { status: 400 });
  }

  const apiKey = passedApiKey || headerApiKey || process.env.OPENAI_API_KEY;

  if (!apiKey && !userId) {
    return NextResponse.json({ message: 'API key or authentication required' }, { status: 401 });
  }

  try {
    const model = new ChatOpenAI({
      modelName: modelName,
      temperature: temperature,
      maxTokens: maxTokens,
      openAIApiKey: apiKey,
      streaming: true,
    });

    const processedMessages = processHistoryMessages(messages);

    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage && lastUserMessage.role === 'user' && needsMindMap(lastUserMessage.content)) {
      const mindMapPrompt = createMindMapPrompt(lastUserMessage.content);
      processedMessages.push(new SystemMessage(mindMapPrompt));
    }

    const chain = RunnableSequence.from([
      model,
      new StringOutputParser(),
    ]);

    const stream = await chain.stream(processedMessages);
    const encoder = new TextEncoder();

    return new Response(
      new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of stream) {
              const message = `data: ${JSON.stringify({ content: chunk })}\n\n`;
              controller.enqueue(encoder.encode(message));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          } catch (error) {
            console.error(error);
            let errorCode = ErrorCode.UNKNOWN_ERROR;
            if (error instanceof Error) {
              errorCode = mapErrorToCode(error);
            }
            const errorMessage = getErrorMessage(errorCode);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: errorMessage, code: errorCode })}\n\n`));
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
    if (error instanceof Error && error.message.includes('user quota is not enough')) {
      return NextResponse.json({ message: 'User quota exceeded' }, { status: 403 });
    }
    console.error(error);
    return NextResponse.json({ message: 'Error processing your request' }, { status: 500 });
  }
}

function mapErrorToCode(error: Error): ErrorCode {
  if (error.message.includes('user quota is not enough')) {
    return ErrorCode.QUOTA_EXCEEDED;
  }
  if (error.message.includes('invalid api key')) {
    return ErrorCode.INVALID_API_KEY;
  }
  return ErrorCode.UNKNOWN_ERROR;
}

