import { redirect } from 'next/navigation';

export default async function LegacyReportRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/evaluations/${id}/report`);
}
