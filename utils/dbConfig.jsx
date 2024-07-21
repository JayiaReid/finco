import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema.jsx'
const sql = neon('postgresql://expensesdb_owner:F4IbVNgiU2nr@ep-steep-salad-a5icmjni.us-east-2.aws.neon.tech/expensesdb?sslmode=require');
export const db = drizzle(sql, {schema});

