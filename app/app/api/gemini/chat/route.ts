
import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build context from history
    const contextMessages = history?.slice(-5).map((msg: any) => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n') || '';

    const prompt = `You are an expert AI assistant for an asphalt paving business management system called "Asphalt OS - Overwatch Systems". You help with:

1. Job estimates and material calculations
2. Sealcoating, crack repair, line striping, and paving
3. Scheduling and weather considerations
4. Equipment and fleet management
5. Employee management and safety
6. Business operations and best practices

Previous conversation:
${contextMessages}

Current question: ${message}

Provide helpful, accurate, and professional advice. Keep responses concise but informative.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    return NextResponse.json({ response: text });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
