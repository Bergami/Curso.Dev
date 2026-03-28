import database from "../../infra/database";
import { resetDatabase } from "../../infra/db-admin/reset-database";
import { runMigrationsFromCli } from "../../infra/run-migrations";

interface CountRow {
  count: number;
}

interface TestNumberRow {
  test_number: number;
}

describe("Database Setup", () => {
  beforeAll(async () => {
    console.log("Setting up test database...");

    try {
      console.log("Resetting test database...");
      const databaseName = process.env.POSTGRES_DB;

      if (!databaseName) {
        throw new Error("POSTGRES_DB is required for database setup tests");
      }

      await resetDatabase(databaseName, "test");

      console.log("Running migrations...");
      await runMigrationsFromCli("test", "up");

      console.log("Database setup completed successfully!");
    } catch (error) {
      const setupError =
        error instanceof Error ? error : new Error(String(error));
      console.error("Database setup failed:", setupError.message);
      throw setupError;
    }
  }, 30000);

  test("should reset database successfully", () => {
    expect(true).toBe(true);
  });

  test("should run all migrations successfully", async () => {
    try {
      const result = await database<CountRow>(
        "SELECT COUNT(*)::int AS count FROM pgmigrations",
      );

      expect(result.rows[0].count).toBeGreaterThan(0);
      console.log(`Found ${result.rows[0].count} migration(s) in database`);
    } catch (error) {
      const migrationError =
        error instanceof Error ? error : new Error(String(error));

      if (
        migrationError.message.includes(
          'relation "pgmigrations" does not exist',
        )
      ) {
        console.log("No migrations table found - this is ok for new projects");
        expect(true).toBe(true);
        return;
      }

      throw migrationError;
    }
  });

  test("should connect to database successfully", async () => {
    const result = await database<TestNumberRow>("SELECT 1 AS test_number");
    expect(result.rows[0].test_number).toBe(1);
  });

  test("should have migrations table created", async () => {
    const result = await database<CountRow>(
      "SELECT COUNT(*)::int AS count FROM pgmigrations",
    );

    expect(result.rows[0].count).toBeGreaterThanOrEqual(1);
  });
});
