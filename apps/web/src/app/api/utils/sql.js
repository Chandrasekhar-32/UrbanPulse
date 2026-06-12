import { neon } from '@neondatabase/serverless';

export const hasDatabase = Boolean(process.env.DATABASE_URL);

const NullishQueryFunction = () => {
  throw new Error(
    'No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set'
  );
};
NullishQueryFunction.transaction = () => {
  throw new Error(
    'No database connection string was provided to `neon()`. Perhaps process.env.DATABASE_URL has not been set'
  );
};
const sql = hasDatabase ? neon(process.env.DATABASE_URL) : NullishQueryFunction;

export default sql;
