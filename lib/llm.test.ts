import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { callOpenRouter, resolveOpenRouterModelId } from './llm';

describe('OpenRouter LLM Gateway (lib/llm)', () => {
  const originalEnv = process.env.OPENROUTER_API_KEY;

  beforeEach(() => {
    process.env.OPENROUTER_API_KEY = 'test-openrouter-key';
  });

  afterEach(() => {
    process.env.OPENROUTER_API_KEY = originalEnv;
    vi.restoreAllMocks();
  });

  it('does not set strict zdr: true by default so standard OpenRouter endpoints do not return 404', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          choices: [{ message: { content: 'Test response' } }],
          usage: { prompt_tokens: 10, completion_tokens: 5 },
        }),
        { status: 200 }
      )
    );

    const res = await callOpenRouter({
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(res.content).toBe('Test response');
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchSpy.mock.calls[0];
    const parsedBody = JSON.parse(requestInit?.body as string);
    expect(parsedBody.provider?.zdr).toBeUndefined();
    expect(parsedBody.provider?.data_collection).toBe('deny');
    expect(parsedBody.max_tokens).toBe(1500);
  });

  it('falls back to omitting provider restrictions if OpenRouter returns 404 for data policy', async () => {
    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            error: {
              message: 'No endpoints found matching your data policy (Zero data retention).',
              code: 404,
            },
          }),
          { status: 404 }
        )
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            choices: [{ message: { content: 'Recovered after data policy fallback' } }],
            usage: { prompt_tokens: 12, completion_tokens: 6 },
          }),
          { status: 200 }
        )
      );

    const res = await callOpenRouter({
      model: 'google/gemini-2.5-flash-lite',
      messages: [{ role: 'user', content: 'Hello' }],
    });

    expect(res.content).toBe('Recovered after data policy fallback');
    expect(fetchSpy).toHaveBeenCalledTimes(2);

    const secondBody = JSON.parse(fetchSpy.mock.calls[1][1]?.body as string);
    expect(secondBody.provider).toBeUndefined();
  });

  it('maps retired OpenRouter model slugs to active equivalents', () => {
    expect(resolveOpenRouterModelId('anthropic/claude-3.5-haiku')).toBe('anthropic/claude-haiku-4.5');
    expect(resolveOpenRouterModelId('anthropic/claude-3.5-sonnet')).toBe('anthropic/claude-sonnet-4.5');
    expect(resolveOpenRouterModelId('google/gemini-1.5-pro')).toBe('google/gemini-2.5-pro');
    expect(resolveOpenRouterModelId('google/gemini-2.5-flash')).toBe('google/gemini-2.5-flash');
  });
});
