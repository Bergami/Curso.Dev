export const DATABASE_QUERY_ERROR_LOG = "Database query error:";
export const MIGRATION_ERROR_LOG = "Migration error:";
export const METHOD_NOT_ALLOWED_ERROR = "Method not allowed";
export const MIGRATION_FAILED_ERROR = "Migration failed";
export const MIGRATION_LOCKED_ERROR = "Migration locked";
export const MIGRATION_ALREADY_RUNNING_MESSAGE =
  "Another migration is already running";
export const CONNECTED_TO_POSTGRES_LOG = "Connected to PostgreSQL server";
export const TERMINATED_ACTIVE_CONNECTIONS_LOG =
  "Terminated active connections";

export function getMethodNotAllowedMessage(method?: string): string {
  return `Method \"${method}\" not allowed`;
}

export function getInvalidDatabaseNameMessage(databaseName: string): string {
  return `Invalid database name: ${databaseName}`;
}

export function getResetDatabaseErrorLog(label: string): string {
  return `Error resetting ${label} database:`;
}

export function getResetDatabaseFailureLog(label: string): string {
  return `Failed to reset ${label} database:`;
}
