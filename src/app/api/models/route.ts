'use server'

import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { userId } = auth();
    const apiKey = request.headers.get('Authorization')?.split('Bearer ')[1];
    const baseUrl = request.headers.get('X-Base-URL') || process.env.BASE_API_URL;

    if (!apiKey && !userId) {
        return NextResponse.json({ message: 'API key or authentication required' }, { status: 401 });
    }

    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (apiKey) {
            headers['Authorization'] = `Bearer ${apiKey}`;
        } else {
            headers['Authorization'] = `Bearer ${process.env.OPENAI_API_KEY}`;
        }

        const response = await fetch(`${baseUrl}/models`, { headers });
        const data = await response.json();
        const availableModels = data.data.map((model: { id: string }) => ({
            value: model.id,
            label: model.id,
        }));
        return NextResponse.json({ models: availableModels });
    } catch (error) {
        console.error('Error fetching model list:', error);
        return NextResponse.json({ message: 'Error fetching model list' }, { status: 500 });
    }
}