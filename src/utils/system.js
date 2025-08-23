import { execa } from "execa";
import ora from "ora";
import { log } from "./logger.js";

export async function openEnvInVSCode(envPath) {
  // Try to open the file in the same VSCode window
  try {
    await execa("code", ["-r", envPath]);
    log.success("Opened .env file in VSCode for editing");
  } catch (error) {
    log.warning("Could not open VSCode automatically. Please open server/.env manually to configure your MongoDB URI.");
    log.info(`File location: ${envPath}`);
  }
}

export async function isConcurrentlyInstalled() {
  try {
    const { stdout } = await execa("npm", ["ls", "-g", "concurrently"], { 
      stdio: ['ignore', 'pipe', 'ignore'] 
    });
    return stdout.includes("concurrently@");
  } catch {
    // Also check if concurrently is available in PATH
    try {
      await execa("concurrently", ["--version"], { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
}

export async function installConcurrently() {
  const spinner = ora("Installing 'concurrently' globally...").start();
  try {
    await execa("npm", ["install", "-g", "concurrently"], { stdio: ['ignore', 'pipe', 'pipe'] });
    spinner.succeed("Successfully installed 'concurrently' globally");
    return true;
  } catch (error) {
    spinner.fail("Failed to install 'concurrently' globally");
    log.error(`Installation failed: ${error.message}`);
    log.warning("You can install it manually with: npm install -g concurrently");
    return false;
  }
}

export async function installDependencies() {
  const installSpinner = ora("Running npm install for client and server...").start();
  
  try {
    await execa("npm", ["run", "setup"], { stdio: ["ignore", "pipe", "pipe"] });
    installSpinner.succeed("Dependencies installed successfully!");
    return true;
  } catch (error) {
    installSpinner.fail("Failed to install dependencies");
    log.error(`Installation error: ${error.message}`);
    log.warning("You can try installing manually:");
    log.info("cd client && npm install && cd ../server && npm install");
    return false;
  }
}

export async function startDevelopmentServers(ports) {
  const { frontend, backend } = ports;
  
  console.log();
  log.highlight(`Starting development servers...`);
  log.info(`Frontend: http://localhost:${frontend}`);
  log.info(`Backend: http://localhost:${backend}`);
  log.warning("Press Ctrl+C to stop both servers");
  
  try {
    await execa("npm", ["run", "dev"], { stdio: "inherit" });
  } catch (error) {
    if (error.signal === "SIGINT") {
      log.info("Development servers stopped by user");
    } else {
      log.error(`Failed to start development servers: ${error.message}`);
    }
  }
}
