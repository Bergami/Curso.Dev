const { Client } = require("pg");

async function resetDevDatabase() {
  console.log("Starting development database reset...");

  // Conecta no banco padrão 'postgres'
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: "postgres", // conecta no banco padrão
    ssl: process.env.NODE_ENV === "production" ? true : false,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL server");

    // Termina todas as conexões ativas no banco de desenvolvimento
    const terminateQuery = `
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = $1
      AND pid <> pg_backend_pid()
    `;

    await client.query(terminateQuery, [process.env.POSTGRES_DB]);
    console.log("Terminated active connections");

    // Drop e recria o banco de desenvolvimento
    await client.query(`DROP DATABASE IF EXISTS "${process.env.POSTGRES_DB}"`);
    console.log(`Dropped database: ${process.env.POSTGRES_DB}`);

    await client.query(`CREATE DATABASE "${process.env.POSTGRES_DB}"`);
    console.log(`Created database: ${process.env.POSTGRES_DB}`);

    console.log("Development database reset completed successfully!");
  } catch (error) {
    console.error("Error resetting development database:", error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Executa se chamado diretamente
if (require.main === module) {
  resetDevDatabase().catch((error) => {
    console.error("Failed to reset development database:", error);
    process.exit(1);
  });
}

module.exports = resetDevDatabase;
