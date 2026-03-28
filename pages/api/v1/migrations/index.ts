import type { NextApiRequest, NextApiResponse } from "next";
import {
  runMigrations,
  getMigrationsStatus,
} from "../../../../infra/run-migrations";
import {
  METHOD_NOT_ALLOWED_ERROR,
  MIGRATION_ALREADY_RUNNING_MESSAGE,
  MIGRATION_ERROR_LOG,
  MIGRATION_FAILED_ERROR,
  MIGRATION_LOCKED_ERROR,
  getMethodNotAllowedMessage,
} from "../../../../shared/messages/error-messages";
import {
  MIGRATIONS_EXECUTED_SUCCESSFULLY,
  MIGRATION_STATUS_RETRIEVED_SUCCESSFULLY,
} from "../../../../shared/messages/success-messages";

interface MigrationErrorResponse {
  error: string;
  message: string;
}

interface MigrationSuccessResponse {
  message: string;
  migratedCount: number;
  migrations: unknown[];
  lastRunAt?: string | null;
  lastMigrationName?: string | null;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<MigrationSuccessResponse | MigrationErrorResponse>,
): Promise<void> {
  if (request.method === "GET")
    return await getMigrationsStatusHandler(request, response);

  if (request.method === "POST")
    return await executeMigrations(request, response);

  response.status(405).json({
    error: METHOD_NOT_ALLOWED_ERROR,
    message: getMethodNotAllowedMessage(request.method),
  });
}

async function getMigrationsStatusHandler(
  _request: NextApiRequest,
  response: NextApiResponse<MigrationSuccessResponse | MigrationErrorResponse>,
): Promise<void> {
  try {
    const status = await getMigrationsStatus();
    response.status(200).json({
      message: MIGRATION_STATUS_RETRIEVED_SUCCESSFULLY,
      migratedCount: status.total,
      migrations: [],
      lastRunAt: status.lastRunAt?.toISOString() ?? null,
      lastMigrationName: status.lastMigrationName,
    });
  } catch (error) {
    const migrationError =
      error instanceof Error ? error : new Error(String(error));

    return await setErrorResponse(response, migrationError);
  }
}

async function executeMigrations(
  request: NextApiRequest,
  response: NextApiResponse<MigrationSuccessResponse | MigrationErrorResponse>,
): Promise<void> {
  try {
    const migrations = await runMigrations("up");

    response.status(200).json({
      message: MIGRATIONS_EXECUTED_SUCCESSFULLY,
      migratedCount: migrations.length,
      migrations,
    });
  } catch (error) {
    const migrationError =
      error instanceof Error ? error : new Error(String(error));

    return await setErrorResponse(response, migrationError);
  }
}

async function setErrorResponse(
  response: NextApiResponse<MigrationSuccessResponse | MigrationErrorResponse>,
  error: Error,
) {
  console.error(MIGRATION_ERROR_LOG, error);

  if (error.message === MIGRATION_ALREADY_RUNNING_MESSAGE) {
    return response.status(423).json({
      error: MIGRATION_LOCKED_ERROR,
      message: error.message,
    });
  }

  return response.status(500).json({
    error: MIGRATION_FAILED_ERROR,
    message: error.message,
  });
}
