import { auth } from '@clerk/nextjs/server';

export async function requireUser(): Promise<string> {
  const { userId } = await auth.protect();
  if (!userId) {
    throw new Error('Unauthorized');
  }
  return userId;
}

export async function getOptionalUser(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}
