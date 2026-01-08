const database = require("@/infra/database.js");
const scripts = require("@/scripts/queries_status.js");
const dataBaseName = process.env.POSTGRES_DB;

async function statusHandler(req, res) {
  const updatedAt = new Date().toISOString();
  const databaseVersion = await getVersionDataBase();
  const databaseMaxConnections = await getMaxConnections();
  const openedConnectionsValue = await getOpenedConnectionsValue();

  res.status(200).json({
    status: "ok",
    updatedAt,
    dependency: {
      database: {
        version: databaseVersion,
        max_connections: parseInt(databaseMaxConnections),
        opened_connections: openedConnectionsValue,
      },
    },
  });
}

function getVersionDataBase() {
  return database(scripts.versionQuery).then(
    (result) => result.rows[0].version,
  );
}

function getMaxConnections() {
  return database(scripts.maxConnectionsQuery).then(
    (result) => result.rows[0].max_connections,
  );
}

function getOpenedConnectionsValue() {
  return database(scripts.openedConnectionsQuery, [
    process.env.POSTGRES_DB,
  ]).then((result) => result.rows[0].count);
}

export default statusHandler;
