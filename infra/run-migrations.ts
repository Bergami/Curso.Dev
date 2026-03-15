import { exec } from "node:child_process";
import { join } from "node:path";
import { promisify } from "node:util";
import type { MigrationDirection, RunMigration } from "node-pg-migrate";
import { getRequiredEnv, loadEnvIfNeeded } from "./env-loader";

loadEnvIfNeeded();

const execAsync = promisify(exec);

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
