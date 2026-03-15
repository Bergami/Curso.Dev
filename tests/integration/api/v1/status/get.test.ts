import database from "../../../../../infra/database";

interface StatusResponse {
  status: string;
  updatedAt: string;
  dependency: {
    database: {
      version: string;
      max_connections: number;
      opened_connections: number;
    };
  };
}

interface NumberRow {
  number: number;
}

test("Get to /api/v1/status should return status ok", async () => {
  const response = await fetch("http://localhost:3001/api/v1/status");
  const data = (await response.json()) as StatusResponse;
  const updatedAt = new Date(data.updatedAt);

  expect(data.updatedAt).toBeDefined();
  expect(data.status).toBe("ok");
  expect(updatedAt instanceof Date && !Number.isNaN(updatedAt.getTime())).toBe(
    true,
  );
  expect(data.dependency.database.version).toMatch(/PostgreSQL/);
  expect(data.dependency.database.max_connections).toBe(100);
  expect(data.dependency.database.opened_connections).toBe(1);
});

test("Database connection should be successful", async () => {
  const result = await database<NumberRow>("SELECT 1 AS number");
  expect(result.rows[0].number).toBe(1);
});
