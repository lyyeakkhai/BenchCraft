import { z } from 'zod';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CallLlmOptions {
  model?: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  maxTokens?: number;
  responseFormat?: { type: string };
}

export interface LlmResult {
  content: string;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
  latencyMs: number;
}

// Fallback pricing table per 1M tokens (input / output)
const MODEL_PRICING: Record<string, { in: number; out: number }> = {
  'google/gemini-2.5-flash': { in: 0.075, out: 0.30 },
  'google/gemini-2.5-flash-lite': { in: 0.0375, out: 0.15 },
  'openai/gpt-4o-mini': { in: 0.15, out: 0.60 },
  'openai/gpt-4o': { in: 2.50, out: 10.00 },
  'anthropic/claude-3.5-haiku': { in: 0.80, out: 4.00 },
  'anthropic/claude-3.5-sonnet': { in: 3.00, out: 15.00 },
  'deepseek/deepseek-chat': { in: 0.14, out: 0.28 },
  'meta-llama/llama-3.3-70b-instruct': { in: 0.30, out: 0.40 },
};

export function estimateLlmCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model] || { in: 0.5, out: 1.5 };
  return (inputTokens * pricing.in + outputTokens * pricing.out) / 1_000_000;
}

export async function callOpenRouter(opts: CallLlmOptions): Promise<LlmResult> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = opts.model || 'google/gemini-2.5-flash';
  const startTime = Date.now();

  // If no API key is configured (e.g. local dev / demo), provide a safe mock fallback so app never crashes
  if (!apiKey) {
    console.warn('[OpenRouter] No OPENROUTER_API_KEY found. Using mock response.');
    return {
      content: 'BenchCraft AI Evaluation result mock response.',
      inputTokens: 150,
      outputTokens: 80,
      costUsd: 0.0001,
      latencyMs: Date.now() - startTime,
    };
  }

  const payload = {
    model,
    messages: opts.messages,
    temperature: opts.temperature ?? 0.3,
    max_tokens: opts.maxTokens,
    response_format: opts.responseFormat,
    provider: {
      data_collection: 'deny',
      zdr: true,
    },
  };

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://benchcraft.ai',
          'X-Title': 'BenchCraft Evaluation',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';
      const inputTokens = data.usage?.prompt_tokens ?? 0;
      const outputTokens = data.usage?.completion_tokens ?? 0;
      const costUsd = estimateLlmCost(model, inputTokens, outputTokens);

      return {
        content,
        inputTokens,
        outputTokens,
        costUsd,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      attempts++;
      if (attempts >= maxAttempts) throw err;
      await new Promise((resolve) => setTimeout(resolve, attempts * 1000));
    }
  }

  throw new Error('Failed to communicate with OpenRouter after retries');
}

export async function callOpenRouterStructured<T>(
  schema: z.ZodType<T>,
  opts: Omit<CallLlmOptions, 'responseFormat'>
): Promise<{ data: T; usage: LlmResult }> {
  const systemPrompt = `You must output ONLY valid, raw JSON adhering strictly to the required schema. Do not wrap in markdown or backticks.`;

  const messagesWithSystem: OpenRouterMessage[] = [
    { role: 'system', content: systemPrompt },
    ...opts.messages,
  ];

  const result = await callOpenRouter({
    ...opts,
    messages: messagesWithSystem,
    responseFormat: { type: 'json_object' },
  });

  try {
    let cleanJson = result.content.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const parsed = JSON.parse(cleanJson);
    const validated = schema.parse(parsed);
    return { data: validated, usage: result };
  } catch (parseError) {
    console.error('Failed to parse structured JSON from LLM:', result.content, parseError);
    throw new Error('LLM output could not be parsed into the expected domain schema.');
  }
}
