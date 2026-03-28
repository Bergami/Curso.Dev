export const getMigrationsStatusQuery = `
    SELECT
      COUNT(*)::int AS total,
      MAX(run_on) AS last_run_at,
      (
        SELECT name
        FROM pgmigrations
        ORDER BY run_on DESC
        LIMIT 1
      ) AS last_migration_name
    FROM pgmigrations
  `;
