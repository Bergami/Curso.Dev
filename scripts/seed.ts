import { pathToFileURL } from "node:url";

export default async function seedDatabase(): Promise<void> {
  console.log("No seed routine configured yet.");
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  seedDatabase().catch((error) => {
    console.error("Seed execution failed:", error);
    process.exit(1);
  });
}
