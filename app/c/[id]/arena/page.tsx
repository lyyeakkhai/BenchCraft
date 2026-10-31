import { redirect } from 'next/navigation';

export default async function LegacyArenaRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/dashboard/evaluations/${id}/arena`);
}
