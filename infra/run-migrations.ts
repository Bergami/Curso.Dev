import { exec } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import type { MigrationDirection, RunMigration } from "node-pg-migrate";
import { getRequiredEnv, loadEnvIfNeeded } from "./env-loader";
import database from "./database";
import { getMigrationsStatusQuery } from "../scripts/queries_migrations";

loadEnvIfNeeded();

const execAsync = promisify(exec);

type MigrationStatusRow = {
  total: number;
  last_run_at: Date | null;
  last_migration_name: string | null;
};

export type MigrationStatus = {
  total: number;
  lastRunAt: Date | null;
  lastMigrationName: string | null;
};

export async function runMigrations(
  direction: MigrationDirection = "up",
): Promise<RunMigration[]> {
  const { runner } = await import("node-pg-migrate");

  return runner({
    databaseUrl: getRequiredEnv("DATABASE_URL"),
    migrationsTable: "pgmigrations",
    dir: join(process.cwd(), "infra", "migrations"),
    direction,
    schema: "public",
    verbose: true,
    dryRun: false,
  });
}

type MigrationEnvironment = "test" | "development";

export async function runMigrationsFromCli(
  environment: MigrationEnvironment,
  direction: MigrationDirection = "up",
): Promise<void> {
  const command =
    environment === "test"
      ? `npm run test:migration:${direction}`
      : `npm run dev:migration:${direction}`;

  await execAsync(command, {
    cwd: process.cwd(),
    env: process.env,
  });
}

export async function getMigrationsStatus(): Promise<MigrationStatus> {
  const result = await database<MigrationStatusRow>(getMigrationsStatusQuery);
  const row = result.rows[0];

  return {
    total: row.total,
    lastRunAt: row.last_run_at,
    lastMigrationName: row.last_migration_name,
  };
}
