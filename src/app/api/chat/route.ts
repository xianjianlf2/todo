import { models, ModelType } from '@/lib/langchain';
import { AIMessage, BaseMessageLike, HumanMessage } from '@langchain/core/messages';
import { NextResponse } from 'next/server';

function processHistoryMessages(messages: any[]): BaseMessageLike[] {
  return messages.map(msg => {
    if (msg.role === 'user') {
      return new HumanMessage(msg.content);
    } else if (msg.role === 'assistant') {
      return new AIMessage(msg.content);
    }
    return msg;
  });
}
export async function POST(request: Request) {
  const { messages, modelType } = await request.json();

  if (!messages || !modelType) {
    return NextResponse.json({ message: 'Missing messages or modelType' }, { status: 400 });
  }

  try {
    const model = models[modelType as ModelType];
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
