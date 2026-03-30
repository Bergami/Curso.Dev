#!/usr/bin/env node
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { loadEnvIfNeeded } from "../infra/env-loader";

const execAsync = promisify(exec);

async function runMigrations(): Promise<void> {
  // Load environment variables and build DATABASE_URL from POSTGRES_* env vars
  loadEnvIfNeeded();

  if (!process.env.POSTGRES_DB) {
    console.warn("No database credentials found, skipping migrations.");
    return;
  }

  // Extract command from process.argv (e.g., 'up', 'down', 'status')
  const direction = process.argv[2] || "up";

  // Run node-pg-migrate with the built DATABASE_URL
  const command = `node-pg-migrate ${direction} --config-file .migrations-config.json`;

  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: process.cwd(),
      env: process.env,
    });

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error) {
    const execError = error as { stderr: string; stdout: string; code: number };
    console.error("Migration failed:", execError.stderr || execError.stdout);
    process.exit(execError.code || 1);
  }
}

runMigrations().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
