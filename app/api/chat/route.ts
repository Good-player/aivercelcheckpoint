import { NextRequest, NextResponse } from 'next/server';
import { runWorkflow } from '@/lib/agent';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      );
    }

    const result = await runWorkflow({ input_as_text: message });

    // Check if this is a guardrail failure (has 'jailbreak' property)
    if ('jailbreak' in result) {
      return NextResponse.json({
        success: false,
        error: 'Input blocked by safety guardrails',
        details: result
      }, { status: 400 });
    }

    // Success case - return the parsed output
    return NextResponse.json({
      success: true,
      result: (result as any).output_parsed || result
    });
  } catch (error) {
    console.error('Error processing chat:', error);
    return NextResponse.json(
      { error: 'Failed to process message', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const runtime = 'nodejs';
