const openedConnectionsQuery = `
    SELECT count(*)::int 
    FROM pg_stat_activity 
    WHERE datname = $1
    AND state = 'active'
    AND backend_type = 'client backend'
  `;

const versionQuery = "SELECT version()";

const maxConnectionsQuery = "SHOW max_connections";

module.exports = {
  openedConnectionsQuery,
  versionQuery,
  maxConnectionsQuery,
};
