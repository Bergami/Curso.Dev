import dotenv from "dotenv";

const DEFAULT_ENV = "development";

export function loadEnvIfNeeded(): void {
  if (process.env.POSTGRES_DB || process.env.DATABASE_URL) {
    return;
  }

  if (process.env.JEST_WORKER_ID) {
    return;
  }

  const environment = process.env.NODE_ENV ?? DEFAULT_ENV;
  const envFile = `.env.${environment}`;

  dotenv.config({ path: envFile });

  if (!process.env.POSTGRES_DB && !process.env.DATABASE_URL) {
    dotenv.config({ path: ".env" });
  }
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
