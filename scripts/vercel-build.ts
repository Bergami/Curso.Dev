#!/usr/bin/env node
import { exec } from "node:child_process";
import { promisify } from "node:util";
import { loadEnvIfNeeded } from "../infra/env-loader";

const execAsync = promisify(exec);

async function vercelBuild(): Promise<void> {
  console.log("🔧 Starting Vercel build process...\n");

  // Load environment and build DATABASE_URL from POSTGRES_* variables
  console.log("📋 Loading environment variables...");
  loadEnvIfNeeded();

  // Check if database credentials were loaded (POSTGRES_* variables)
  if (process.env.POSTGRES_DB) {
    console.log("✅ Database credentials loaded\n");

    // Run migrations (node-pg-migrate skips already-run migrations automatically)
    console.log("🗄️  Running database migrations...");
    const migrateCommand = "tsx scripts/run-migrations.ts up";

    try {
      const { stdout, stderr } = await execAsync(migrateCommand, {
        cwd: process.cwd(),
        env: process.env,
      });

      if (stdout) console.log(stdout);
      if (stderr && !stderr.includes("warn")) console.error(stderr);
      console.log("✅ Migrations completed\n");
    } catch (migrationError) {
      const execError = migrationError as {
        stderr: string;
        stdout: string;
        code: number;
      };
      console.error("❌ Migration failed (aborting build):");
      console.error(execError.stderr || execError.stdout);
      process.exit(execError.code || 1);
    }
  } else {
    console.warn(
      "⚠️  No database credentials found (expected for preview/local builds)",
    );
    console.log("✅ Proceeding with build...\n");
  }

  // Run Next.js build
  console.log("🏗️  Building Next.js application...");
  try {
    const { stdout, stderr } = await execAsync("next build", {
      cwd: process.cwd(),
      env: process.env,
    });

    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log("✅ Build completed successfully!\n");
  } catch (buildError) {
    const execError = buildError as {
      stderr: string;
      stdout: string;
      code: number;
    };
    console.error("❌ Build failed:");
    console.error(execError.stderr || execError.stdout);
    process.exit(execError.code || 1);
  }
}

vercelBuild().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
