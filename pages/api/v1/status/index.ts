import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../../infra/database";
import {
  maxConnectionsQuery,
  openedConnectionsQuery,
  versionQuery,
} from "../../../../scripts/queries_status";

interface VersionRow {
  version: string;
}

interface MaxConnectionsRow {
  max_connections: number;
}

interface OpenedConnectionsRow {
  opened_connections: number;
}

interface StatusResponse {
  status: "ok";
  updatedAt: string;
  dependency: {
    database: {
      version: string;
      max_connections: number;
      opened_connections: number;
    };
  };
}

export default async function statusHandler(
  _request: NextApiRequest,
  response: NextApiResponse<StatusResponse>,
): Promise<void> {
  const updatedAt = new Date().toISOString();

  const [versionResult, maxConnectionsResult, openedConnectionsResult] =
    await Promise.all([
      database<VersionRow>(versionQuery),
      database<MaxConnectionsRow>(maxConnectionsQuery),
      database<OpenedConnectionsRow>(openedConnectionsQuery, [
        process.env.POSTGRES_DB,
      ]),
    ]);

  response.status(200).json({
    status: "ok",
    updatedAt,
    dependency: {
      database: {
        version: versionResult.rows[0].version,
        max_connections: maxConnectionsResult.rows[0].max_connections,
        opened_connections: openedConnectionsResult.rows[0].opened_connections,
      },
    },
  });
}
