import { spawn } from "node:child_process";

const SERVER_URL = "http://127.0.0.1:3001/api/v1/status";
const SERVER_START_TIMEOUT_MS = 120000;
const SERVER_POLL_INTERVAL_MS = 1500;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runCommand(command) {
  return new Promise((resolve) => {
    const child = spawn(command, {
      shell: true,
      stdio: "inherit",
      windowsHide: true,
    });

    child.on("close", (code) => {
      resolve(code ?? 1);
    });

    child.on("error", () => {
      resolve(1);
    });
  });
}

async function isServerReady() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 1200);

  try {
    const response = await fetch(SERVER_URL, {
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForServerReady() {
  const start = Date.now();

  while (Date.now() - start < SERVER_START_TIMEOUT_MS) {
    if (await isServerReady()) {
      return true;
    }

    await sleep(SERVER_POLL_INTERVAL_MS);
  }

  return false;
}

function startTestServer() {
  return spawn("npx dotenv -e .env.test -- next dev -p 3001", {
    shell: true,
    stdio: "inherit",
    windowsHide: true,
  });
}

function stopServer(serverProcess) {
  return new Promise((resolve) => {
    if (!serverProcess || serverProcess.killed || !serverProcess.pid) {
      resolve();
      return;
    }

    let resolved = false;
    const finish = () => {
      if (!resolved) {
        resolved = true;
        resolve();
      }
    };

    serverProcess.once("close", finish);
    serverProcess.kill("SIGTERM");

    setTimeout(() => {
      if (resolved) {
        return;
      }

      const killer = spawn(
        "taskkill",
        ["/PID", String(serverProcess.pid), "/T", "/F"],
        {
          stdio: "ignore",
          windowsHide: true,
        },
      );

      killer.once("close", finish);
      killer.once("error", finish);
    }, 5000);
  });
}

async function main() {
  const servicesUpCode = await runCommand("npm run services:test:up");
  if (servicesUpCode !== 0) {
    process.exit(servicesUpCode);
  }

  let serverProcess;
  const serverAlreadyRunning = await isServerReady();

  if (serverAlreadyRunning) {
    console.log("Servidor de teste ja esta em execucao na porta 3001.");
  } else {
    console.log("Iniciando servidor Next.js para testes...");
    serverProcess = startTestServer();

    const ready = await waitForServerReady();
    if (!ready) {
      console.error("Servidor de teste nao ficou pronto em tempo habil.");
      await stopServer(serverProcess);
      process.exit(1);
    }

    console.log("Servidor de teste pronto. Executando suite completa...");
  }

  try {
    const testsCode = await runCommand("npm run test");
    process.exit(testsCode);
  } finally {
    if (serverProcess) {
      await stopServer(serverProcess);
    }
  }
}

main().catch(async (error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
