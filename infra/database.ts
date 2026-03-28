import {
  Client,
  type ClientConfig,
  type QueryResult,
  type QueryResultRow,
} from "pg";
import { getRequiredEnv, loadEnvIfNeeded } from "./env-loader";
import { DATABASE_QUERY_ERROR_LOG } from "../shared/messages/error-messages";

loadEnvIfNeeded();

type QueryParams = unknown[] | undefined;

function createClientConfig(): ClientConfig {
  return {
    host: getRequiredEnv("POSTGRES_HOST"),
    port: Number(getRequiredEnv("POSTGRES_PORT")),
    user: getRequiredEnv("POSTGRES_USER"),
    password: getRequiredEnv("POSTGRES_PASSWORD"),
    database: getRequiredEnv("POSTGRES_DB"),
    ssl: process.env.NODE_ENV === "production",
  };
}

export default async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: QueryParams,
): Promise<QueryResult<T>> {
  const client = new Client(createClientConfig());

  await client.connect();

  try {
    return await client.query<T>(text, params);
  } catch (error) {
    console.error(DATABASE_QUERY_ERROR_LOG, error);
    throw error;
  } finally {
    await client.end();
  }
}
