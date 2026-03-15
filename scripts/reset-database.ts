import { Client, type ClientConfig } from "pg";
import { getRequiredEnv, loadEnvIfNeeded } from "../infra/env-loader";

loadEnvIfNeeded();

const DATABASE_NAME_PATTERN = /^[a-zA-Z0-9_]+$/;

function createAdminClientConfig(): ClientConfig {
  return {
    host: getRequiredEnv("POSTGRES_HOST"),
    port: Number(getRequiredEnv("POSTGRES_PORT")),
    user: getRequiredEnv("POSTGRES_USER"),
    password: getRequiredEnv("POSTGRES_PASSWORD"),
    database: "postgres",
    ssl: process.env.NODE_ENV === "production",
  };
}

function assertSafeDatabaseName(databaseName: string): string {
  if (!DATABASE_NAME_PATTERN.test(databaseName)) {
    throw new Error(`Invalid database name: ${databaseName}`);
  }

  return databaseName;
}

export async function resetDatabase(
  databaseName: string,
  label: string,
): Promise<void> {
  const safeDatabaseName = assertSafeDatabaseName(databaseName);
  const client = new Client(createAdminClientConfig());

  console.log(`Starting ${label} database reset...`);

  try {
    await client.connect();
    console.log("Connected to PostgreSQL server");

    await client.query(
      `
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1
          AND pid <> pg_backend_pid()
      `,
      [safeDatabaseName],
    );
    console.log("Terminated active connections");

    await client.query(`DROP DATABASE IF EXISTS "${safeDatabaseName}"`);
    console.log(`Dropped database: ${safeDatabaseName}`);

    await client.query(`CREATE DATABASE "${safeDatabaseName}"`);
    console.log(`Created database: ${safeDatabaseName}`);

    console.log(`${label} database reset completed successfully!`);
  } catch (error) {
    console.error(`Error resetting ${label} database:`, error);
    throw error;
  } finally {
    await client.end();
  }
}
