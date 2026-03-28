interface MigrationsGetResponse {
  message: string;
  migratedCount: number;
  migrations: unknown[];
  lastRunAt: string | null;
  lastMigrationName: string | null;
}

test("Get to /api/v1/migrations should return migration status", async () => {
  const response = await fetch("http://localhost:3001/api/v1/migrations");
  const data = (await response.json()) as MigrationsGetResponse;

  expect(response.status).toBe(200);
  expect(data.message).toBe("Migration status retrieved successfully");
  expect(typeof data.migratedCount).toBe("number");
  expect(Array.isArray(data.migrations)).toBe(true);

  if (data.migratedCount > 0) {
    expect(data.lastRunAt).toBeTruthy();
    expect(data.lastMigrationName).toBeTruthy();
    expect(data.migratedCount).toBeGreaterThan(0);

    const parsedDate = new Date(data.lastRunAt as string);
    expect(Number.isNaN(parsedDate.getTime())).toBe(false);
  } else {
    expect(data.lastRunAt).toBeNull();
    expect(data.lastMigrationName).toBeNull();
    expect(data.migratedCount).toBe(0);
  }
});
