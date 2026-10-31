import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { comparisons, candidates, catalogModels } from '@/drizzle/schema';
import { requireUser } from '@/lib/auth';
import { deleteEvaluationAction } from '@/actions/evaluations';
import { ArrowRight, Plus, Trash2, Award, CheckCircle } from 'lucide-react';

export default async function DashboardPage() {
  const userId = await requireUser();

  const userComparisons = await db
    .select()
    .from(comparisons)
    .where(eq(comparisons.clerkUserId, userId))
    .orderBy(desc(comparisons.createdAt));

  const totalUsed = userComparisons.length;
  const maxLimit = 20;

  return (
    <div className="space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#0C3838]">Evaluation Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Track, compare, and manage right-sized AI recommendations for your products.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-gray-500">Monthly Usage</div>
            <div className="text-sm font-bold text-[#0C3838]">
              {totalUsed} / {maxLimit} evaluations
            </div>
          </div>
          <Link
            href="/c/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0C3838] hover:bg-[#164E4E] transition shadow-sm"
          >
            <Plus className="w-4 h-4" /> New Evaluation
          </Link>
        </div>
      </div>

      {/* Comparisons List */}
      {userComparisons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-[#0C3838] flex items-center justify-center mx-auto">
            <Plus className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-gray-900">No evaluations yet</h3>
            <p className="text-sm text-gray-500">
              Describe your business use case and test candidate models in the automated arena.
            </p>
          </div>
          <Link
            href="/c/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#0C3838] hover:bg-[#164E4E] transition"
          >
            Start Your First Evaluation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {userComparisons.map(async (comp) => {
            // Find recommended candidate if done
            let recommendedCandidate = null;
            if (comp.status === 'done') {
              const [rec] = await db
                .select({
                  modelId: candidates.modelId,
                  monthlyCostUsd: candidates.monthlyCostUsd,
                  avgScore: candidates.avgScore,
                })
                .from(candidates)
                .where(eq(candidates.comparisonId, comp.id));
              recommendedCandidate = rec;
            }

            const getDestination = () => {
              if (comp.status === 'done') return `/c/${comp.id}`;
              if (comp.status === 'analyzed') return `/c/${comp.id}/review`;
              if (comp.status === 'testing' || comp.status === 'judged') return `/c/${comp.id}/arena`;
              return `/c/${comp.id}`;
            };

            return (
              <div
                key={comp.id}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize ${
                        comp.status === 'done'
                          ? 'bg-emerald-100 text-emerald-800'
                          : comp.status === 'testing'
                          ? 'bg-amber-100 text-amber-800 animate-pulse'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {comp.status === 'done' ? 'Completed' : comp.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(comp.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0C3838]">{comp.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-1 max-w-2xl">{comp.description}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
                    <span>{comp.conversationsPerMonth.toLocaleString()} convs/mo</span>
                    <span>•</span>
                    <span className="capitalize">{comp.conversationLength} turns</span>
                    {comp.domainProfile && (
                      <>
                        <span>•</span>
                        <span className="font-medium text-gray-700">{comp.domainProfile.industry}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <form action={deleteEvaluationAction.bind(null, comp.id)}>
                    <button
                      type="submit"
                      className="p-2 text-gray-400 hover:text-red-600 transition rounded-lg hover:bg-gray-50 cursor-pointer"
                      title="Delete evaluation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>

                  <Link
                    href={getDestination()}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-[#0C3838] bg-teal-50 hover:bg-teal-100 transition"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
