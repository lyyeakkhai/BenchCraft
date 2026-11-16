import React from 'react';

export type ProviderKey =
  | 'anthropic'
  | 'openai'
  | 'google'
  | 'meta'
  | 'deepseek'
  | 'mistral'
  | 'aws'
  | 'azure'
  | 'groq'
  | 'openrouter'
  | 'alibaba'
  | 'cohere'
  | 'huggingface'
  | 'perplexity'
  | 'ollama'
  | 'nvidia'
  | 'nextjs'
  | 'react'
  | 'typescript'
  | 'tailwind'
  | 'postgres'
  | 'drizzle'
  | 'clerk'
  | 'vercel';

export function resolveProviderKey(nameOrProvider?: string | null): ProviderKey {
  const s = (nameOrProvider || '').toLowerCase().trim();
  if (!s) return 'openrouter';

  // 1. Cloud & Procurement Platforms
  if (s.includes('azure') || (s.includes('microsoft') && !s.includes('google'))) {
    return 'azure';
  }
  if (s.includes('alibaba') || s.includes('qwen') || s.includes('model studio')) {
    return 'alibaba';
  }
  if (s.includes('bedrock') || s.includes('aws') || s.includes('amazon')) {
    return 'aws';
  }
  if (s.includes('cohere') || s.includes('command-r') || s.includes('aya')) {
    return 'cohere';
  }
  if (s.includes('hugging') || s.includes('huggingface') || s === 'hf') {
    return 'huggingface';
  }
  if (s.includes('perplexity') || s.includes('sonar')) {
    return 'perplexity';
  }
  if (s.includes('ollama')) {
    return 'ollama';
  }
  if (s.includes('nvidia') || s.includes('nemotron')) {
    return 'nvidia';
  }

  // 2. Foundation Model Providers & Labs
  if (
    s.includes('anthropic') ||
    s.includes('claude') ||
    s.includes('haiku') ||
    s.includes('sonnet') ||
    s.includes('opus') ||
    s.includes('fable')
  ) {
    return 'anthropic';
  }
  if (
    s.includes('openai') ||
    s.includes('gpt') ||
    s.includes('chatgpt') ||
    s.includes('o1') ||
    s.includes('o3')
  ) {
    return 'openai';
  }
  if (
    s.includes('google') ||
    s.includes('gemini') ||
    s.includes('vertex') ||
    s.includes('ai studio') ||
    s.includes('gemma') ||
    s.includes('deepmind')
  ) {
    return 'google';
  }
  if (s.includes('meta') || s.includes('llama')) {
    return 'meta';
  }
  if (s.includes('deepseek')) {
    return 'deepseek';
  }
  if (
    s.includes('mistral') ||
    s.includes('mixtral') ||
    s.includes('codestral') ||
    s.includes('pixtral') ||
    s.includes('la plateforme')
  ) {
    return 'mistral';
  }
  if (s.includes('groq')) {
    return 'groq';
  }

  // 3. Technologies & Open Web Stack
  if (s.includes('next') || s.includes('nextjs') || s.includes('next.js')) {
    return 'nextjs';
  }
  if (s.includes('react')) {
    return 'react';
  }
  if (s.includes('typescript') || s === 'ts') {
    return 'typescript';
  }
  if (s.includes('tailwind')) {
    return 'tailwind';
  }
  if (s.includes('postgres') || s.includes('postgresql')) {
    return 'postgres';
  }
  if (s.includes('drizzle')) {
    return 'drizzle';
  }
  if (s.includes('clerk')) {
    return 'clerk';
  }
  if (s.includes('vercel')) {
    return 'vercel';
  }

  if (s.includes('openrouter') || s.includes('zdr') || s.includes('gateway')) {
    return 'openrouter';
  }

  return 'openrouter';
}

export function getProviderIconPath(nameOrProvider?: string | null): string {
  const s = (nameOrProvider || '').toLowerCase().trim();
  if (s.includes('bedrock')) return '/brands/bedrock.svg';
  if (s.includes('claude') || s.includes('haiku') || s.includes('sonnet') || s.includes('opus') || s.includes('fable')) {
    return '/brands/claude.svg';
  }
  if (s.includes('gemini')) return '/brands/gemini.svg';
  if (s.includes('vertex') || (s.includes('google') && !s.includes('gemini'))) {
    return '/brands/google.svg';
  }
  if (s.includes('qwen')) return '/brands/qwen.svg';
  if (s.includes('alibabacloud') || (s.includes('alibaba') && !s.includes('qwen'))) {
    return '/brands/alibabacloud.svg';
  }
  const key = resolveProviderKey(nameOrProvider);
  return `/brands/${key}.svg`;
}

const PROVIDER_META: Record<
  ProviderKey,
  { label: string; color: string; bgGlow: string; borderTint: string }
> = {
  anthropic: {
    label: 'Anthropic Claude',
    color: '#D97757',
    bgGlow: 'rgba(217, 119, 87, 0.16)',
    borderTint: 'rgba(217, 119, 87, 0.38)',
  },
  openai: {
    label: 'OpenAI',
    color: '#10A37F',
    bgGlow: 'rgba(16, 163, 127, 0.16)',
    borderTint: 'rgba(16, 163, 127, 0.38)',
  },
  google: {
    label: 'Google Gemini',
    color: '#4E86F5',
    bgGlow: 'rgba(78, 134, 245, 0.16)',
    borderTint: 'rgba(78, 134, 245, 0.38)',
  },
  meta: {
    label: 'Meta Llama',
    color: '#0668E1',
    bgGlow: 'rgba(6, 104, 225, 0.16)',
    borderTint: 'rgba(6, 104, 225, 0.38)',
  },
  deepseek: {
    label: 'DeepSeek',
    color: '#4D6BFE',
    bgGlow: 'rgba(77, 107, 254, 0.16)',
    borderTint: 'rgba(77, 107, 254, 0.38)',
  },
  mistral: {
    label: 'Mistral AI',
    color: '#F97316',
    bgGlow: 'rgba(249, 115, 22, 0.16)',
    borderTint: 'rgba(249, 115, 22, 0.38)',
  },
  aws: {
    label: 'AWS Bedrock',
    color: '#FF9900',
    bgGlow: 'rgba(255, 153, 0, 0.16)',
    borderTint: 'rgba(255, 153, 0, 0.38)',
  },
  azure: {
    label: 'Microsoft Azure',
    color: '#0089D6',
    bgGlow: 'rgba(0, 137, 214, 0.16)',
    borderTint: 'rgba(0, 137, 214, 0.38)',
  },
  groq: {
    label: 'Groq LPU',
    color: '#F55036',
    bgGlow: 'rgba(245, 80, 54, 0.16)',
    borderTint: 'rgba(245, 80, 54, 0.38)',
  },
  openrouter: {
    label: 'OpenRouter ZDR',
    color: '#10B981',
    bgGlow: 'rgba(16, 185, 129, 0.16)',
    borderTint: 'rgba(16, 185, 129, 0.38)',
  },
  alibaba: {
    label: 'Alibaba Cloud (Qwen)',
    color: '#FF6A00',
    bgGlow: 'rgba(255, 106, 0, 0.16)',
    borderTint: 'rgba(255, 106, 0, 0.38)',
  },
  cohere: {
    label: 'Cohere',
    color: '#D47059',
    bgGlow: 'rgba(212, 112, 89, 0.16)',
    borderTint: 'rgba(212, 112, 89, 0.38)',
  },
  huggingface: {
    label: 'Hugging Face',
    color: '#FFD21E',
    bgGlow: 'rgba(255, 210, 30, 0.16)',
    borderTint: 'rgba(255, 210, 30, 0.38)',
  },
  perplexity: {
    label: 'Perplexity AI',
    color: '#20B2AA',
    bgGlow: 'rgba(32, 178, 170, 0.16)',
    borderTint: 'rgba(32, 178, 170, 0.38)',
  },
  ollama: {
    label: 'Ollama',
    color: '#9CA3AF',
    bgGlow: 'rgba(156, 163, 175, 0.16)',
    borderTint: 'rgba(156, 163, 175, 0.38)',
  },
  nvidia: {
    label: 'NVIDIA AI',
    color: '#76B900',
    bgGlow: 'rgba(118, 185, 0, 0.16)',
    borderTint: 'rgba(118, 185, 0, 0.38)',
  },
  nextjs: {
    label: 'Next.js',
    color: '#E5E7EB',
    bgGlow: 'rgba(255, 255, 255, 0.12)',
    borderTint: 'rgba(255, 255, 255, 0.25)',
  },
  react: {
    label: 'React',
    color: '#61DAFB',
    bgGlow: 'rgba(97, 218, 251, 0.16)',
    borderTint: 'rgba(97, 218, 251, 0.38)',
  },
  typescript: {
    label: 'TypeScript',
    color: '#3178C6',
    bgGlow: 'rgba(49, 120, 198, 0.16)',
    borderTint: 'rgba(49, 120, 198, 0.38)',
  },
  tailwind: {
    label: 'Tailwind CSS',
    color: '#06B6D4',
    bgGlow: 'rgba(6, 182, 212, 0.16)',
    borderTint: 'rgba(6, 182, 212, 0.38)',
  },
  postgres: {
    label: 'PostgreSQL',
    color: '#336791',
    bgGlow: 'rgba(51, 103, 145, 0.16)',
    borderTint: 'rgba(51, 103, 145, 0.38)',
  },
  drizzle: {
    label: 'Drizzle ORM',
    color: '#C5F74F',
    bgGlow: 'rgba(197, 247, 79, 0.16)',
    borderTint: 'rgba(197, 247, 79, 0.38)',
  },
  clerk: {
    label: 'Clerk Auth',
    color: '#6C47FF',
    bgGlow: 'rgba(108, 71, 255, 0.16)',
    borderTint: 'rgba(108, 71, 255, 0.38)',
  },
  vercel: {
    label: 'Vercel',
    color: '#FFFFFF',
    bgGlow: 'rgba(255, 255, 255, 0.12)',
    borderTint: 'rgba(255, 255, 255, 0.25)',
  },
};

export function getProviderMeta(nameOrProvider?: string | null) {
  const key = resolveProviderKey(nameOrProvider);
  return { key, ...PROVIDER_META[key] };
}

export interface ProviderLogoProps {
  provider?: string | null;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  title?: string;
}

/**
 * Authentic AI model and technology brand logo.
 * Sourced directly from @lobehub/icons-static-svg and @icons-pack/react-simple-icons.
 */
export function ProviderLogo({ provider, size = 'md', className = '', title }: ProviderLogoProps) {
  const key = resolveProviderKey(provider);
  const meta = PROVIDER_META[key];
  const iconSrc = getProviderIconPath(provider);

  const dims =
    size === 'xs'
      ? 'w-5 h-5 rounded'
      : size === 'sm'
      ? 'w-7 h-7 rounded-md'
      : size === 'lg'
      ? 'w-11 h-11 rounded-xl'
      : size === 'xl'
      ? 'w-14 h-14 rounded-2xl'
      : 'w-9 h-9 rounded-lg';

  const iconPadding =
    size === 'xs'
      ? 'p-0.5'
      : size === 'sm'
      ? 'p-1'
      : size === 'lg'
      ? 'p-2'
      : size === 'xl'
      ? 'p-2.5'
      : 'p-1.5';

  return (
    <span
      className={`inline-flex items-center justify-center flex-shrink-0 relative overflow-hidden transition-all duration-200 ${dims} ${className}`}
      style={{
        background: meta.bgGlow,
        border: `1px solid ${meta.borderTint}`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 12px -2px ${meta.bgGlow}`,
      }}
      title={title || meta.label}
    >
      <img
        src={iconSrc}
        alt={title || meta.label}
        className={`w-full h-full object-contain pointer-events-none select-none transition-transform duration-200 ${iconPadding}`}
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

// Aliases for intuitive semantic usage
export const ModelLogo = ProviderLogo;
export const TechLogo = ProviderLogo;

/**
 * High-utility chip badge displaying both the real official logo and label.
 */
export function ModelBadge({
  name,
  provider,
  size = 'sm',
  className = '',
}: {
  name: string;
  provider?: string | null;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}) {
  const effectiveProvider = provider || name;
  const meta = getProviderMeta(effectiveProvider);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-input border text-xs font-semibold whitespace-nowrap ${className}`}
      style={{
        background: meta.bgGlow,
        borderColor: meta.borderTint,
        color: 'inherit',
      }}
    >
      <ProviderLogo provider={effectiveProvider} size="xs" />
      <span>{name}</span>
    </span>
  );
}
