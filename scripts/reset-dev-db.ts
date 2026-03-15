import { pathToFileURL } from "node:url";
import { getRequiredEnv, loadEnvIfNeeded } from "../infra/env-loader";
import { resetDatabase } from "./reset-database";

loadEnvIfNeeded();

export default async function resetDevelopmentDatabase(): Promise<void> {
  await resetDatabase(getRequiredEnv("POSTGRES_DB"), "development");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  resetDevelopmentDatabase().catch((error) => {
    console.error("Failed to reset development database:", error);
    process.exit(1);
  });
}
