import { notFound } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, scenarios, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { ReviewForm } from './review-form';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();

  const [comp] = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.id, id), eq(comparisons.clerkUserId, userId)));

  if (!comp) notFound();

  const compScenarios = await db
    .select()
    .from(scenarios)
    .where(eq(scenarios.comparisonId, id))
    .orderBy(scenarios.position);

  const compCandidates = await db
    .select({
      id: candidates.id,
      modelId: candidates.modelId,
      tier: candidates.tier,
      name: catalogModels.name,
      provider: catalogModels.provider,
      inputPrice: candidates.inputPriceSnapshot,
      outputPrice: candidates.outputPriceSnapshot,
    })
    .from(candidates)
    .leftJoin(catalogModels, eq(candidates.modelId, catalogModels.id))
    .where(eq(candidates.comparisonId, id));

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-2">
      {/* Header */}
      <div className="space-y-2 border-b border-gray-200 pb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-[#D97706]">Step 2 of 3</span>
        <h1 className="text-3xl font-extrabold text-[#0C3838]">Review Domain Understanding & Test Scenarios</h1>
        <p className="text-sm text-gray-600">
          We analyzed your business context and formulated {compScenarios.length} test scenarios.
          You can refine any query or grading criteria before running the arena.
        </p>
      </div>

      <ReviewForm
        comparisonId={id}
        initialProfile={comp.domainProfile!}
        initialScenarios={compScenarios}
        candidates={compCandidates}
      />
    </div>
  );
}
