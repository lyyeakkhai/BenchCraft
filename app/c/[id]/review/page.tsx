import { notFound } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, scenarios, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { ReviewForm } from './review-form';
import { Stepper } from '@/components/brand/stepper';

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
    <div className="space-y-6">
      {/* Step Progress Bar */}
      <div className="rounded-xl overflow-hidden border border-[#D3DDD8] shadow-xs">
        <Stepper currentStep={2} businessTitle={comp.title} />
      </div>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.01em] text-[#0A2E2B]">
            Review Domain Understanding & Test Scenarios
          </h1>
          <p className="text-sm text-[#4B605C] mt-1">
            We formulated {compScenarios.length} grounded scenarios from your description and documents.
            Review the questions and grading rubrics before the blinded arena comparison.
          </p>
        </div>

        <ReviewForm
          comparisonId={id}
          initialProfile={comp.domainProfile!}
          initialScenarios={compScenarios}
          candidates={compCandidates}
        />
      </div>
    </div>
  );
}
