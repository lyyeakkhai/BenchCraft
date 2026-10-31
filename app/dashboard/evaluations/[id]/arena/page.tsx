import { notFound, redirect } from 'next/navigation';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { ArenaClient } from './arena-client';
import { Stepper } from '@/components/brand/stepper';

export default async function ArenaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await requireUser();

  const [comp] = await db
    .select()
    .from(comparisons)
    .where(and(eq(comparisons.id, id), eq(comparisons.clerkUserId, userId)));

  if (!comp) notFound();

  if (comp.status === 'done') {
    redirect(`/dashboard/evaluations/${id}`);
  }

  const compCandidates = await db
    .select({
      id: candidates.id,
      modelId: candidates.modelId,
      tier: candidates.tier,
      name: catalogModels.name,
      provider: catalogModels.provider,
    })
    .from(candidates)
    .leftJoin(catalogModels, eq(candidates.modelId, catalogModels.id))
    .where(eq(candidates.comparisonId, id));

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="rounded-card overflow-hidden border border-rule">
        <Stepper currentStep={2} businessTitle={comp.title} />
      </div>

      <ArenaClient comparisonId={id} candidates={compCandidates} />
    </div>
  );
}
