const database = require("@/infra/database.js");

test("Get to /api/v1/status should return status ok", async () => {
  const res = await fetch("http://localhost:3001/api/v1/status");
  const data = await res.json();
  const updatedAt = new Date(data.updatedAt);

  console.log(data.dependency.database);

  expect(data.updatedAt).toBeDefined();
  expect(data.status).toBe("ok");

  expect(updatedAt instanceof Date && !isNaN(updatedAt)).toBe(true);
  expect(data.dependency.database.version).toMatch(/PostgreSQL/);
  expect(data.dependency.database.max_connections).toBe(100);
  expect(data.dependency.database.opened_connections).toBe(1);
});

test("Database connection should be successful", async () => {
  const result = await database("SELECT 1 AS number");
  expect(result.rows[0].number).toBe(1);
});
