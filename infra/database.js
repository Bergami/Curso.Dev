const { Client } = require("pg");

async function query(text, params) {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl:
      process.env.NODE_ENV === "development"
        ? { rejectUnauthorized: false }
        : true,
  });

  await client.connect();

  try {
    const response = await client.query(text, params);
    return response;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

module.exports = query;
