import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/drizzle/schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/benchcraft';

// Disable prepared statements for Supabase Transaction Pooler (port 6543)
const client = postgres(connectionString, { prepare: false });
export const db = drizzle(client, { schema });
export * from '@/drizzle/schema';
