import type { NextApiRequest, NextApiResponse } from "next";
import { runMigrations } from "../../../../infra/run-migrations";

interface MigrationErrorResponse {
  error: string;
  message: string;
}

interface MigrationSuccessResponse {
  message: string;
  migratedCount: number;
  migrations: unknown[];
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse<MigrationSuccessResponse | MigrationErrorResponse>,
): Promise<void> {
  if (request.method !== "POST") {
    response.status(405).json({
      error: "Method not allowed",
      message: `Method \"${request.method}\" not allowed`,
    });
    return;
  }

  try {
    const migrations = await runMigrations("up");

    response.status(200).json({
      message: "Migrations executed successfully",
      migratedCount: migrations.length,
      migrations,
    });
  } catch (error) {
    const migrationError =
      error instanceof Error ? error : new Error(String(error));

    console.error("Migration error:", migrationError);
    response.status(500).json({
      error: "Migration failed",
      message: migrationError.message,
    });
  }
}
