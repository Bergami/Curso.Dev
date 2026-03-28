import dotenv from "dotenv";

const DEFAULT_ENV = "development";

function buildDatabaseUrlFromPostgresEnv(): string | null {
  const host = process.env.POSTGRES_HOST;
  const port = process.env.POSTGRES_PORT;
  const user = process.env.POSTGRES_USER;
  const password = process.env.POSTGRES_PASSWORD;
  const database = process.env.POSTGRES_DB;

  if (!host || !port || !user || !password || !database) {
    return null;
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);

  return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`;
}

function ensureDatabaseUrlFromPostgresEnv(): void {
  if (process.env.DATABASE_URL) {
    return;
  }

  // Keep interpolation logic in code to avoid adding dotenv-expand while its
  // dependency range is behind our dotenv major and could introduce ambiguity.
  // TODO: Reevaluate dotenv-expand adoption when compatibility matrix is aligned.
  const databaseUrl = buildDatabaseUrlFromPostgresEnv();

  if (databaseUrl) {
    process.env.DATABASE_URL = databaseUrl;
  }
}

export function loadEnvIfNeeded(): void {
  if (process.env.POSTGRES_DB || process.env.DATABASE_URL) {
    ensureDatabaseUrlFromPostgresEnv();
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

  ensureDatabaseUrlFromPostgresEnv();
}

export function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
