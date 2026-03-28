export const STATUS_OK = "ok";
export const MIGRATION_STATUS_RETRIEVED_SUCCESSFULLY =
  "Migration status retrieved successfully";
export const MIGRATIONS_EXECUTED_SUCCESSFULLY =
  "Migrations executed successfully";

export function getStartingDatabaseResetLog(label: string): string {
  return `Starting ${label} database reset...`;
}

export function getDroppedDatabaseLog(databaseName: string): string {
  return `Dropped database: ${databaseName}`;
}

export function getCreatedDatabaseLog(databaseName: string): string {
  return `Created database: ${databaseName}`;
}

export function getDatabaseResetCompletedLog(label: string): string {
  return `${label} database reset completed successfully!`;
}
