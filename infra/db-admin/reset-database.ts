import { Client, type ClientConfig } from "pg";
import { getRequiredEnv, loadEnvIfNeeded } from "../env-loader";
import {
  CONNECTED_TO_POSTGRES_LOG,
  TERMINATED_ACTIVE_CONNECTIONS_LOG,
  getInvalidDatabaseNameMessage,
  getResetDatabaseErrorLog,
} from "../../shared/messages/error-messages";
import {
  getCreatedDatabaseLog,
  getDatabaseResetCompletedLog,
  getDroppedDatabaseLog,
  getStartingDatabaseResetLog,
} from "../../shared/messages/success-messages";

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
    throw new Error(getInvalidDatabaseNameMessage(databaseName));
  }

  return databaseName;
}

export async function resetDatabase(
  databaseName: string,
  label: string,
): Promise<void> {
  const safeDatabaseName = assertSafeDatabaseName(databaseName);
  const client = new Client(createAdminClientConfig());

  console.log(getStartingDatabaseResetLog(label));

  try {
    await client.connect();
    console.log(CONNECTED_TO_POSTGRES_LOG);

    await client.query(
      `
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = $1
          AND pid <> pg_backend_pid()
      `,
      [safeDatabaseName],
    );
    console.log(TERMINATED_ACTIVE_CONNECTIONS_LOG);

    await client.query(`DROP DATABASE IF EXISTS "${safeDatabaseName}"`);
    console.log(getDroppedDatabaseLog(safeDatabaseName));

    await client.query(`CREATE DATABASE "${safeDatabaseName}"`);
    console.log(getCreatedDatabaseLog(safeDatabaseName));

    console.log(getDatabaseResetCompletedLog(label));
  } catch (error) {
    console.error(getResetDatabaseErrorLog(label), error);
    throw error;
  } finally {
    await client.end();
  }
}
