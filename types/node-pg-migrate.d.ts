declare module "node-pg-migrate" {
  export type MigrationDirection = "up" | "down";

  export interface RunMigration {
    path: string;
    name: string;
    timestamp: number;
  }

  export interface RunnerOptions {
    databaseUrl: string;
    migrationsTable: string;
    dir: string | string[];
    direction: MigrationDirection;
    schema?: string | string[];
    verbose?: boolean;
    dryRun?: boolean;
  }

  export function runner(options: RunnerOptions): Promise<RunMigration[]>;
}
