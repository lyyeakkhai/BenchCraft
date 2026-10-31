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
  'google/gemini-2.5-pro': { in: 1.25, out: 5.00 },
  'google/gemini-1.5-pro': { in: 1.25, out: 5.00 },
  'openai/gpt-4o-mini': { in: 0.15, out: 0.60 },
  'openai/gpt-4o': { in: 2.50, out: 10.00 },
  'anthropic/claude-3.5-haiku': { in: 0.80, out: 4.00 },
  'anthropic/claude-haiku-4.5': { in: 0.80, out: 4.00 },
  'anthropic/claude-3.5-sonnet': { in: 3.00, out: 15.00 },
  'anthropic/claude-sonnet-4.5': { in: 3.00, out: 15.00 },
  'deepseek/deepseek-chat': { in: 0.14, out: 0.28 },
  'meta-llama/llama-3.3-70b-instruct': { in: 0.30, out: 0.40 },
  // NVIDIA models
  'nvidia/llama-3.1-nemotron-70b-instruct': { in: 0.35, out: 0.40 },
  'nvidia/llama3-chatqa-1.5-70b': { in: 0.35, out: 0.40 },
  'nvidia/nemotron-4-340b-instruct': { in: 1.20, out: 2.40 },
  'nvidia/nemotron-3.5-lightning': { in: 0.20, out: 0.30 },
  'nvidia/nemotron-3.5-super-vl': { in: 0.35, out: 0.45 },
  'nvidia/nemotron-nano-3-30b-a3b': { in: 0.08, out: 0.16 },
  'nvidia/mistral-nemo-minitron-8b-8k-instruct': { in: 0.06, out: 0.06 },
  'nvidia/llama-3.1-nemoguard-8b-content-safety': { in: 0.05, out: 0.05 },
  'nvidia/nemotron-3-ultra-550b-a55b': { in: 1.80, out: 3.60 },
  'meta/llama-guard-4-12b': { in: 0.05, out: 0.05 },
  'mistralai/mistral-large-4-1t-a52b': { in: 2.00, out: 6.00 },
};

// Map retired OpenRouter model IDs to their active equivalents
const MODEL_ID_ALIASES: Record<string, string> = {
  'anthropic/claude-3.5-haiku': 'anthropic/claude-haiku-4.5',
  'anthropic/claude-3.5-sonnet': 'anthropic/claude-sonnet-4.5',
  'google/gemini-1.5-pro': 'google/gemini-2.5-pro',
  'nvidia/llama-3.1-nemotron-70b-instruct': 'nvidia/nemotron-3.5-lightning',
  'nvidia/nemotron-nano-3-30b-a3b': 'nvidia/nemotron-3-nano-30b-a3b',
  'nvidia/llama-3.1-nemoguard-8b-content-safety': 'nvidia/nemotron-3.5-content-safety',
};

// Models verified active on NVIDIA NIM integrate API
const NVIDIA_VERIFIED_MODELS = new Set([
  'meta/llama-guard-4-12b',
  'mistralai/mistral-large-4-1t-a52b',
  'nvidia/nemotron-3.5-lightning-30b-a3b',
  'nvidia/nemotron-3.5-super-vl-120b-a12b',
  'nvidia/nemotron-3-ultra-550b-a55b',
]);

export function resolveOpenRouterModelId(model: string): string {
  return MODEL_ID_ALIASES[model] || model;
}

export function estimateLlmCost(model: string, inputTokens: number, outputTokens: number): number {
  const pricing = MODEL_PRICING[model] || { in: 0.5, out: 1.5 };
  return (inputTokens * pricing.in + outputTokens * pricing.out) / 1_000_000;
}

export async function callNvidiaNim(opts: CallLlmOptions): Promise<LlmResult> {
  const apiKey = process.env.NVIDIA_API_KEY;
  if (!apiKey) throw new Error('No NVIDIA_API_KEY found');
  const requestedModel = opts.model || 'nvidia/nemotron-3.5-lightning-30b-a3b';
  const startTime = Date.now();

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: requestedModel,
      messages: opts.messages,
      temperature: opts.temperature ?? 0.3,
      max_tokens: opts.maxTokens ?? 1500,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NVIDIA NIM error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0]?.message;
  const content = choice?.content || choice?.reasoning_content || choice?.reasoning || '';
  const inputTokens = data.usage?.prompt_tokens ?? 0;
  const outputTokens = data.usage?.completion_tokens ?? 0;
  const costUsd = estimateLlmCost(requestedModel, inputTokens, outputTokens);

  return {
    content,
    inputTokens,
    outputTokens,
    costUsd,
    latencyMs: Date.now() - startTime,
  };
}

export async function callOpenRouter(opts: CallLlmOptions): Promise<LlmResult> {
  const requestedModel = opts.model || 'google/gemini-2.5-flash';

  // If this model is verified on NVIDIA NIM and NVIDIA_API_KEY is available, route to NVIDIA NIM first
  if (process.env.NVIDIA_API_KEY && (NVIDIA_VERIFIED_MODELS.has(requestedModel) || requestedModel.startsWith('nvidia/'))) {
    try {
      return await callNvidiaNim(opts);
    } catch (nimErr) {
      console.warn(`[NVIDIA NIM] Direct call failed for ${requestedModel}, falling back to OpenRouter:`, (nimErr as Error).message);
    }
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  const model = resolveOpenRouterModelId(requestedModel);
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

  let omitProviderPolicy = false;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const payload: Record<string, unknown> = {
        model,
        messages: opts.messages,
        temperature: opts.temperature ?? 0.3,
        max_tokens: opts.maxTokens ?? 1500,
        response_format: opts.responseFormat,
      };

      if (!omitProviderPolicy) {
        payload.provider = {
          data_collection: 'deny',
        };
      }

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
        // If OpenRouter rejects the request due to data policy / routing filter (404),
        // retry immediately without custom provider routing restrictions.
        if (response.status === 404 && !omitProviderPolicy && errorText.includes('data policy')) {
          omitProviderPolicy = true;
          attempts++;
          continue;
        }
        throw new Error(`OpenRouter error (${response.status}): ${errorText}`);
      }

      const data = await response.json();
      const choice = data.choices?.[0]?.message;
      const content = choice?.content || choice?.reasoning_content || choice?.reasoning || '';
      const inputTokens = data.usage?.prompt_tokens ?? 0;
      const outputTokens = data.usage?.completion_tokens ?? 0;
      const costUsd = estimateLlmCost(requestedModel, inputTokens, outputTokens);

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
