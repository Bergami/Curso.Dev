export const openedConnectionsQuery = `
  SELECT count(*)::int AS opened_connections
  FROM pg_stat_activity
  WHERE datname = $1
    AND state = 'active'
    AND backend_type = 'client backend'
`;

export const versionQuery = "SELECT version() AS version";

export const maxConnectionsQuery = `
  SELECT setting::int AS max_connections
  FROM pg_settings
  WHERE name = 'max_connections'
`;
