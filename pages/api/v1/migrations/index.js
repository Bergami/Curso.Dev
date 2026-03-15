import migrationRunner from "node-pg-migrate";
import { join } from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: `Method "${req.method}" not allowed`,
    });
  }

  try {
    const migrations = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      migrationsTable: "pgmigrations",
      direction: "up",
      dir: join("infra", "migrations"),
      verbose: true,
      dryRun: false,
    });

    return res.status(200).json(migrations);
  } catch (error) {
    console.error("Migration error:", error);
    return res.status(500).json({
      error: "Migration failed",
      message: error.message,
    });
  }
}
