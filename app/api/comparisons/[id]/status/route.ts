import { NextResponse } from 'next/server';
import { eq, and } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates } from '@/drizzle/schema';
import { getOptionalUser } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const userId = await getOptionalUser();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [comp] = await db
    .select({
      id: comparisons.id,
      status: comparisons.status,
      error: comparisons.error,
    })
    .from(comparisons)
    .where(and(eq(comparisons.id, id), eq(comparisons.clerkUserId, userId)));

  if (!comp) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const compCandidates = await db
    .select({
      id: candidates.id,
      modelId: candidates.modelId,
      status: candidates.status,
    })
    .from(candidates)
    .where(eq(candidates.comparisonId, id));

  const doneCount = compCandidates.filter((c) => c.status === 'done').length;
  const total = compCandidates.length || 1;
  const progressPercent = Math.round((doneCount / total) * 100);

  return NextResponse.json({
    id: comp.id,
    status: comp.status,
    totalCandidates: compCandidates.length,
    doneCandidates: doneCount,
    progressPercent,
    error: comp.error,
  });
}
