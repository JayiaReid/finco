/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    dbCredentials: {
      url:"postgresql://expensesdb_owner:F4IbVNgiU2nr@ep-steep-salad-a5icmjni.us-east-2.aws.neon.tech/expensesdb?sslmode=require",
    }
  };
  