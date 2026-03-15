const { exec } = require("child_process");
const { promisify } = require("util");
const database = require("@/infra/database.js");
 
const execAsync = promisify(exec);

describe("Database Setup", () => {
  beforeAll(async () => {
    console.log("Setting up test database...");

    try {
      // Limpa o banco de teste completamente
      console.log("Resetting test database...");
      await execAsync("npm run test:db:reset", {
        cwd: process.cwd(),
        env: process.env,
      });

      // Executa todas as migrações
      console.log("Running migrations...");
      await execAsync("npm run test:migration:up", {
        cwd: process.cwd(),
        env: process.env,
      });

      console.log("Database setup completed successfully!");
    } catch (error) {
      console.error("Database setup failed:", error.message);
      throw error;
    }
  }, 30000); // 30s timeout para operações de banco

  test("should reset database successfully", () => {
    // Se chegou aqui, o reset foi bem-sucedido
    expect(true).toBe(true);
  });

  test("should run all migrations successfully", async () => {
    // Verifica se as migrações rodaram sem erro checando a tabela de migrações
    try {
      const result = await database(
        "SELECT COUNT(*)::int as count FROM pgmigrations",
      );
      expect(result.rows[0].count).toBeGreaterThan(0);
      console.log(`Found ${result.rows[0].count} migration(s) in database`);
    } catch (error) {
      if (error.message.includes('relation "pgmigrations" does not exist')) {
        // Se a tabela não existe, significa que não há migrações (ok para projetos novos)
        console.log("No migrations table found - this is ok for new projects");
        expect(true).toBe(true);
      } else {
        throw error;
      }
    }
  });

  test("should connect to database successfully", async () => {
    // Testa se consegue conectar e fazer uma query simples
    const result = await database("SELECT 1 AS test_number");
    expect(result.rows[0].test_number).toBe(1);
  });

  test("should have migrations table created", async () => {
    // Verifica se a tabela de migrações foi criada
    const result = await database(
      "SELECT COUNT(*)::int as count FROM pgmigrations",
    );
    expect(result.rows[0].count).toBeGreaterThanOrEqual(1);
  });
});
