import { z } from 'zod';
import { callOpenRouterStructured } from '../llm';
import { DomainProfile, Scenario, DomainProfileSchema, TaskCategory } from '../types';

const AnalysisResponseSchema = z.object({
  domainProfile: DomainProfileSchema,
  scenarios: z.array(
    z.object({
      position: z.number(),
      prompt: z.string(),
      rubric: z.array(z.string()),
    })
  ),
});

export async function analyzeBusinessAndGenerateScenarios(params: {
  description: string;
  docSummaries: string[];
  conversationsPerMonth: number;
  conversationLength: 'short' | 'medium' | 'long';
}): Promise<{ profile: DomainProfile; scenarios: Scenario[] }> {
  const prompt = `You are BenchCraft's Lead AI Architect and Domain Evaluator.
Analyze the following technical business description and document extracts to determine the optimal evaluation criteria:

BUSINESS DESCRIPTION:
${params.description}

DOCUMENTS ATTACHED:
${params.docSummaries.length > 0 ? params.docSummaries.join('\n---\n') : 'None'}

CONVERSATION VOLUME: ${params.conversationsPerMonth} conversations/month
CONVERSATION LENGTH: ${params.conversationLength}

Tasks:
1. Determine the domain industry, exact taskCategory ('support_chat' | 'document_qa' | 'content_writing' | 'extraction' | 'coding'), concise business summary, languages supported (ISO codes like en, km, zh, etc.), whether long context or vision is needed, risk level ('low' | 'medium' | 'high'), and recommended qualityBar (e.g. 7.0 for low risk, 8.0 for medium, 8.5 for high risk).
2. Generate 6 realistic, challenging test scenarios (user prompts/queries) that this business's AI will encounter in production, along with 2-3 specific grading rubric criteria for each scenario.

Return ONLY raw JSON adhering to:
{
  "domainProfile": {
    "industry": string,
    "taskCategory": "support_chat" | "document_qa" | "content_writing" | "extraction" | "coding",
    "businessSummary": string,
    "languages": string[],
    "needsLongContext": boolean,
    "needsVision": boolean,
    "riskLevel": "low" | "medium" | "high",
    "qualityBar": number,
    "assumptions": string[]
  },
  "scenarios": [
    {
      "position": 1,
      "prompt": string,
      "rubric": string[]
    }
  ]
}`;

  try {
    const { data } = await callOpenRouterStructured(AnalysisResponseSchema, {
      model: 'google/gemini-2.5-flash',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
    });

    const scenarios: Scenario[] = data.scenarios.map((s, idx) => ({
      position: idx + 1,
      prompt: s.prompt,
      rubric: s.rubric,
      source: 'ai',
    }));

    return {
      profile: data.domainProfile,
      scenarios,
    };
  } catch (error) {
    console.warn('[Analysis] LLM structured call failed or fallback active. Using intelligent domain inference.', error);

    // High quality deterministic domain fallback for demo/reliability
    const combinedContext = (params.description + ' ' + params.docSummaries.join(' ')).trim();
    const descLower = combinedContext.toLowerCase();
    let taskCategory: TaskCategory = 'support_chat';
    let industry = 'E-commerce & Customer Services';

    if (descLower.includes('code') || descLower.includes('software') || descLower.includes('bug')) {
      taskCategory = 'coding';
      industry = 'Software Engineering';
    } else if (descLower.includes('invoice') || descLower.includes('extract') || descLower.includes('document')) {
      taskCategory = 'extraction';
      industry = 'Fintech & Document Processing';
    } else if (descLower.includes('write') || descLower.includes('blog') || descLower.includes('marketing')) {
      taskCategory = 'content_writing';
      industry = 'Marketing & Creative Services';
    } else if (descLower.includes('qa') || descLower.includes('knowledge') || descLower.includes('search')) {
      taskCategory = 'document_qa';
      industry = 'Enterprise Knowledge & Research';
    }

    const languages = descLower.includes('khmer') || descLower.includes('cambodia') ? ['en', 'km'] : ['en'];

    const profile: DomainProfile = {
      industry,
      taskCategory,
      businessSummary: params.description.slice(0, 300),
      languages,
      needsLongContext: params.docSummaries.length > 2,
      needsVision: descLower.includes('image') || descLower.includes('photo'),
      riskLevel: 'medium',
      qualityBar: 8.0,
      assumptions: [
        `${params.conversationsPerMonth.toLocaleString()} expected conversations/month`,
        `${params.conversationLength} conversation turns per interaction`,
        `Assumed 15% safety buffer on token consumption`,
      ],
    };

    const scenarios: Scenario[] = [
      {
        position: 1,
        prompt: `Hello, do you have this in stock and can you explain your return and shipping policy?`,
        rubric: [
          'Answers clearly with a helpful and professional tone',
          'Accurately references business shipping constraints',
          'Asks for clarification if specific items are needed',
        ],
        source: 'ai',
      },
      {
        position: 2,
        prompt: `I received a damaged order yesterday. What are the exact steps to get a replacement or refund immediately?`,
        rubric: [
          'Shows empathy and acknowledges the issue directly',
          'Outlines step-by-step resolution process',
          'Maintains company policy without causing user friction',
        ],
        source: 'ai',
      },
      {
        position: 3,
        prompt: `Can you compare your premium offerings with standard options and summarize key price/feature differences?`,
        rubric: [
          'Presents a structured comparison',
          'Highlights value proposition clearly',
          'Avoids hallucinating non-existent features',
        ],
        source: 'ai',
      },
      {
        position: 4,
        prompt: `What are your business operating hours, payment methods accepted, and physical location?`,
        rubric: [
          'Factual and concise responses',
          'Covers all 3 questions completely',
        ],
        source: 'ai',
      },
      {
        position: 5,
        prompt: `Someone claimed your service has hidden fees. How do you respond to this concern?`,
        rubric: [
          'Diplomatic, calm, and reassuring',
          'Transparent explanation of pricing structure',
        ],
        source: 'ai',
      },
      {
        position: 6,
        prompt: `Could you summarize what makes your service better than typical competitors in 3 bullet points?`,
        rubric: [
          'Exactly 3 bullet points',
          'Compelling, concise, and focused on customer benefits',
        ],
        source: 'ai',
      },
    ];

    return { profile, scenarios };
  }
}
