import type { NextApiRequest, NextApiResponse } from "next";
import handler from "../../../../../pages/api/v1/migrations";
import { runMigrations } from "../../../../../infra/run-migrations";

jest.mock("../../../../../infra/run-migrations", () => ({
  runMigrations: jest.fn(),
  getMigrationsStatus: jest.fn(),
}));

interface MigrationsPostResponse {
  message: string;
  migratedCount: number;
  migrations: unknown[];
}

interface MigrationErrorResponse {
  error: string;
  message: string;
}

const mockedRunMigrations = runMigrations as jest.MockedFunction<
  typeof runMigrations
>;

test("Post to /api/v1/migrations should execute pending migrations", async () => {
  const response = await fetch("http://localhost:3001/api/v1/migrations", {
    method: "POST",
  });
  const data = (await response.json()) as MigrationsPostResponse;

  expect(response.status).toBe(200);
  expect(data.message).toBe("Migrations executed successfully");
  expect(typeof data.migratedCount).toBe("number");
  expect(Array.isArray(data.migrations)).toBe(true);
  expect(data.migratedCount).toBeGreaterThanOrEqual(0);
});

test("Put to /api/v1/migrations should return method not allowed", async () => {
  const response = await fetch("http://localhost:3001/api/v1/migrations", {
    method: "PUT",
  });
  const data = (await response.json()) as MigrationErrorResponse;

  expect(response.status).toBe(405);
  expect(data.error).toBe("Method not allowed");
  expect(data.message).toContain("PUT");
});

test("Post to /api/v1/migrations should return 500 when migration fails", async () => {
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  mockedRunMigrations.mockRejectedValueOnce(new Error("forced failure"));

  const request = { method: "POST" } as NextApiRequest;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as NextApiResponse<
    MigrationsPostResponse | MigrationErrorResponse
  >;

  await handler(request, response);

  consoleErrorSpy.mockRestore();

  expect(response.status).toHaveBeenCalledWith(500);
  expect(response.json).toHaveBeenCalledWith({
    error: "Migration failed",
    message: "forced failure",
  });
});

test("Post to /api/v1/migrations should return 423 when another migration is running", async () => {
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  mockedRunMigrations.mockRejectedValueOnce(
    new Error("Another migration is already running"),
  );

  const request = { method: "POST" } as NextApiRequest;
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as NextApiResponse<
    MigrationsPostResponse | MigrationErrorResponse
  >;

  await handler(request, response);

  consoleErrorSpy.mockRestore();

  expect(response.status).toHaveBeenCalledWith(423);
  expect(response.json).toHaveBeenCalledWith({
    error: "Migration locked",
    message: "Another migration is already running",
  });
});
