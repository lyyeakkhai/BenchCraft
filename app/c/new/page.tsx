import { redirect } from 'next/navigation';

export default function LegacyNewEvaluationRedirect() {
  redirect('/dashboard/evaluations/new');
}
