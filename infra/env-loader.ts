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

  const url = new URL(
    `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${database}`,
  );

  // Add SSL parameters (production defaults: require SSL, dev/test: disable SSL)
  const isProduction = process.env.NODE_ENV === "production";
  const sslMode =
    process.env.POSTGRES_SSL_MODE ?? (isProduction ? "require" : "disable");
  const channelBinding =
    process.env.POSTGRES_CHANNEL_BINDING ??
    (isProduction ? "require" : undefined);

  url.searchParams.set("sslmode", sslMode);
  if (channelBinding) {
    url.searchParams.set("channel_binding", channelBinding);
  }

  return url.toString();
}

function ensureDatabaseUrlFromPostgresEnv(): void {
  // Always build DATABASE_URL from POSTGRES_* environment variables.
  // This ensures the URL is constructed with proper SSL and channel binding parameters.
  // Keep interpolation logic in code to avoid adding dotenv-expand while its
  // dependency range is behind our dotenv major and could introduce ambiguity.
  // TODO: Reevaluate dotenv-expand adoption when compatibility matrix is aligned.
  const databaseUrl = buildDatabaseUrlFromPostgresEnv();

  if (databaseUrl) {
    process.env.DATABASE_URL = databaseUrl;
  }
}

export function loadEnvIfNeeded(): void {
  if (process.env.POSTGRES_DB) {
    ensureDatabaseUrlFromPostgresEnv();
    return;
  }

  if (process.env.JEST_WORKER_ID) {
    return;
  }

  const environment = process.env.NODE_ENV ?? DEFAULT_ENV;
  const envFile = `.env.${environment}`;

  dotenv.config({ path: envFile });

  if (!process.env.POSTGRES_DB) {
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
