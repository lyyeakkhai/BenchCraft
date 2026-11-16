import { callOpenRouter } from '../llm';
import { CatalogModel, Scenario } from '../types';

export interface ModelScenarioAnswer {
  modelId: string;
  scenarioId: string;
  scenarioPosition: number;
  answer: string;
  inputTokens: number;
  outputTokens: number;
  latencyMs: number;
  status: 'done' | 'failed';
}

export async function runCandidateScenario(params: {
  candidate: CatalogModel;
  scenario: Scenario;
  businessSummary: string;
  conversationLength: 'short' | 'medium' | 'long';
}): Promise<ModelScenarioAnswer> {
  const maxTokens = {
    short: 300,
    medium: 600,
    long: 1200,
  }[params.conversationLength];

  const systemPrompt = `You are the official AI assistant representing this business.
BUSINESS CONTEXT:
${params.businessSummary}

Please respond professionally and accurately to the user query according to your company context.`;

  try {
    const result = await callOpenRouter({
      model: params.candidate.id,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: params.scenario.prompt },
      ],
      temperature: 0.3,
      maxTokens,
    });

    return {
      modelId: params.candidate.id,
      scenarioId: params.scenario.id || `sc_${params.scenario.position}`,
      scenarioPosition: params.scenario.position,
      answer: result.content,
      inputTokens: result.inputTokens,
      outputTokens: result.outputTokens,
      latencyMs: result.latencyMs,
      status: 'done',
    };
  } catch (err) {
    console.warn(`[Arena] Model ${params.candidate.id} failed scenario ${params.scenario.position}:`, err);
    return {
      modelId: params.candidate.id,
      scenarioId: params.scenario.id || `sc_${params.scenario.position}`,
      scenarioPosition: params.scenario.position,
      answer: `[Response failed due to model timeout or provider limitation]`,
      inputTokens: 100,
      outputTokens: 0,
      latencyMs: 1500,
      status: 'failed',
    };
  }
}
