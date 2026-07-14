import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `Kamu adalah Mari, asisten virtual dan maskot yang ramah dari platform Kidscenter.id. 
Gunakan bahasa Indonesia yang santai, ceria, ramah, dan mudah dipahami. 
Tugas utamamu adalah membantu pengguna menavigasi platform, dan secara proaktif membimbing klien untuk mencari ide serta merancang konsep animasi edukatif.
Berikan saran yang kreatif, interaktif, dan mendidik saat ditanya tentang ide animasi. 
PENTING: Jawablah dengan singkat, padat, dan jelas (maksimal 2-3 paragraf). Jangan bertele-tele.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Prepare messages for Cerebras API
    const cerebrasMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      })),
    ];

    const response = await fetch('https://api.cerebras.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CEREBRAS_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gemma-4-31b', // Supported model on this API key
        messages: cerebrasMessages,
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Cerebras API Error:', errorText);
      return NextResponse.json({ error: 'Failed to communicate with Cerebras API' }, { status: response.status });
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
