import { execSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";

const WAIT_TIMEOUT_MS = 120000;
const WAIT_INTERVAL_MS = 2000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDockerReady() {
  try {
    execSync("docker info", { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function startDockerDesktopIfNeeded() {
  if (process.platform !== "win32") {
    return;
  }

  const candidates = [
    `${process.env.ProgramFiles}\\Docker\\Docker\\Docker Desktop.exe`,
    `${process.env["ProgramFiles(x86)"]}\\Docker\\Docker\\Docker Desktop.exe`,
    `${process.env.LOCALAPPDATA}\\Docker\\Docker Desktop.exe`,
  ].filter(Boolean);

  const dockerDesktopExe = candidates.find((path) => existsSync(path));

  if (!dockerDesktopExe) {
    throw new Error(
      "Docker Desktop nao foi encontrado. Inicie manualmente e tente novamente.",
    );
  }

  spawn(dockerDesktopExe, [], {
    detached: true,
    stdio: "ignore",
  }).unref();
}

async function ensureDockerReady() {
  if (isDockerReady()) {
    console.log("Docker daemon ja esta pronto.");
    return;
  }

  console.log("Docker daemon nao esta pronto. Tentando iniciar...");
  startDockerDesktopIfNeeded();

  const start = Date.now();
  while (Date.now() - start < WAIT_TIMEOUT_MS) {
    await sleep(WAIT_INTERVAL_MS);
    if (isDockerReady()) {
      console.log("Docker daemon iniciado com sucesso.");
      return;
    }
  }

  throw new Error(
    "Docker daemon nao ficou pronto a tempo. Inicie o Docker manualmente e tente novamente.",
  );
}

ensureDockerReady().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
