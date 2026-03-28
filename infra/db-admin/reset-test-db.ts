import { pathToFileURL } from "node:url";
import { getRequiredEnv, loadEnvIfNeeded } from "../env-loader";
import { getResetDatabaseFailureLog } from "../../shared/messages/error-messages";
import { resetDatabase } from "./reset-database";

loadEnvIfNeeded();

export default async function resetTestDatabase(): Promise<void> {
  await resetDatabase(getRequiredEnv("POSTGRES_DB"), "test");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  resetTestDatabase().catch((error) => {
    console.error(getResetDatabaseFailureLog("test"), error);
    process.exit(1);
  });
}
