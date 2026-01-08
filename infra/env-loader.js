const dotenv = require("dotenv");

function loadEnvIfNeeded() {
  // Se já tem as vars (Next.js ou produção), não fazer nada
  if (process.env.POSTGRES_DB) {
    console.log("✅ Environment variables already loaded");
    return;
  }

  // Se estiver rodando Jest, também não fazer nada (Jest já carregou)
  if (process.env.JEST_WORKER_ID) {
    console.log("🧪 Jest environment detected - skipping dotenv load");
    return;
  }

  // Carregar para scripts standalone
  const env = process.env.NODE_ENV || "development";
  const envFile = `.env.${env}`;

  try {
    dotenv.config({ path: envFile });
    console.log(`📁 Loaded ${envFile} for standalone script`);

    // Verificar se carregou corretamente
    if (!process.env.POSTGRES_DB) {
      console.warn(`⚠️  Warning: ${envFile} may not contain POSTGRES_DB`);
      // Fallback para .env padrão
      dotenv.config({ path: ".env" });
      console.log("📁 Fallback to .env file");
    }
  } catch (error) {
    console.error(`❌ Error loading ${envFile}:`, error.message);
    // Tentar carregar .env padrão como fallback
    try {
      dotenv.config({ path: ".env" });
      console.log("📁 Fallback to .env file");
    } catch (fallbackError) {
      console.error(
        "❌ Could not load any environment file:",
        fallbackError.message,
      );
    }
  }
}

module.exports = { loadEnvIfNeeded };
