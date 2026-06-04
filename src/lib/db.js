import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_Cjfs1BXzM3HQ@ep-raspy-cell-anx1137h-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require';

const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1, // Next.js serverless safe connection limit
});

export default sql;
