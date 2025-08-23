#!/usr/bin/env node

import { input, confirm, select } from "@inquirer/prompts";
import { fileURLToPath } from "url";
import { execa } from "execa";
import fs from "fs";
import path from "path";
import ora from "ora";
import chalk from "chalk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    // Skip node_modules and .env
    if (entry.name === "node_modules" || entry.name === ".env") {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function openEnvInVSCode(envPath) {
  // Try to open the file in the same VSCode window
  try {
    await execa("code", ["-r", envPath]);
  } catch (e) {
    console.log(chalk.yellow("Could not open VSCode automatically. Please open server/.env manually."));
  }
}

function isMongoUriValid(envContent) {
  // Improved validation: handles quotes, whitespace, and checks for a real URI
  const match = envContent.match(/MONGODB_URI\s*=\s*["']?(.*?)["']?\s*(?:\n|$)/);
  if (!match) return false;
  const uri = match[1].trim();
  // Check for non-empty, not default, and starts with mongodb:// or mongodb+srv://
  return (
    uri &&
    uri !== "enter_yours" &&
    (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"))
  );
}

function getVitePortFromEnv(clientEnvPath) {
  try {
    const envContent = fs.readFileSync(clientEnvPath, "utf-8");
    const match = envContent.match(/VITE_PORT\s*=\s*(\d+)/);
    if (match) return match[1];
  } catch {}
  return "5173";
}

async function isConcurrentlyInstalled() {
  try {
    const { stdout } = await execa("npm", ["ls", "-g", "concurrently"]);
    return stdout.includes("concurrently@");
  } catch {
    return false;
  }
}

async function setupProject() {
  const spinner = ora("Copying template files...").start();

  const templateBase = path.resolve(__dirname, "templates/javascript");
  const clientSrc = path.join(templateBase, "client");
  const serverSrc = path.join(templateBase, "server");
  const clientDest = path.resolve("client");
  const serverDest = path.resolve("server");

  await copyDir(clientSrc, clientDest);
  await copyDir(serverSrc, serverDest);

  spinner.succeed("Templates copied!");

  // Ask user about MongoDB connection (arrow key selection)
  const wantMongo = await select({
    message: "Do you want to connect to MongoDb and have a valid connection string?",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false }
    ],
    default: 0
  });

  let mongoUriValue = wantMongo ? "enter_yours" : "";
  let backendPort = 8000;
  let frontendPort = 5173;
  const clientEnvPath = path.join(clientDest, ".env");
  const serverEnvPath = path.join(serverDest, ".env");

  // Write initial .env files based on MongoDB choice
  fs.writeFileSync(
    clientEnvPath,
    `VITE_REACT_APP_API_URL=http://localhost:${backendPort}\nVITE_PORT=${frontendPort}\n`
  );
  fs.writeFileSync(
    serverEnvPath,
    `CORS_ORIGIN="http://localhost:${frontendPort}"\nMONGODB_URI="${mongoUriValue}"\nPORT=${backendPort}\n`
  );

  // If user wants to connect to MongoDB, prompt for URI
  if (wantMongo) {
    await openEnvInVSCode(serverEnvPath);

    // Prompt user to enter MongoDB URI (arrow key selection)
    let uriValid = false;
    while (!uriValid) {
      console.log(
        chalk.yellow(
          "\nEnter your MongoDB URI to continue, choose Yes if done."
        )
      );
      const ready = await select({
        message: "Have you updated server/.env with your MongoDB URI?",
        choices: [
          { name: "Yes", value: true },
          { name: "No", value: false }
        ],
        default: 0
      });

      // Read and validate .env
      const envContent = fs.readFileSync(serverEnvPath, "utf-8");
      uriValid = isMongoUriValid(envContent);

      if (!ready || !uriValid) {
        console.log(
          chalk.red(
            "❌ MongoDB URI not detected or not updated. Please update server/.env and try again."
          )
        );
      }
    }
  }

  // Prompt user for dependency installation choice (arrow key selection)
  const installNow = await select({
    message: "Do you want to install dependencies now (recommended)?",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false }
    ],
    default: 0
  });

  if (!installNow) {
    console.log(chalk.yellow("\nYou chose to install dependencies manually."));
    console.log(chalk.cyan("Run the following commands:"));
    console.log(chalk.green(`
cd client
npm install

cd ../server
npm install
    `));
    console.log(chalk.cyan("After installing, update server/.env with your MongoDB URI and run:\n"));
    console.log(chalk.green("npm run dev"));
    console.log(chalk.cyan("\nSetup finished. You can continue manually."));
    return;
  }

  // Check and install concurrently globally if needed
  const concurrentlyInstalled = await isConcurrentlyInstalled();
  if (!concurrentlyInstalled) {
    console.log(chalk.cyan("Installing 'concurrently' globally..."));
    await execa("npm", ["install", "-g", "concurrently"], { stdio: "inherit" });
  } else {
    console.log(chalk.green("'concurrently' is already installed globally."));
  }

  // Ask user about running the project and port selection (arrow key selection)
  const runNow = await select({
    message: "Do you want to run the project now on default ports (frontend: 5173, backend: 8000)?",
    choices: [
      { name: "Yes", value: true },
      { name: "No", value: false }
    ],
    default: 0
  });

  if (!runNow) {
    const choosePorts = await select({
      message: "Do you want to choose custom ports?",
      choices: [
        { name: "Yes", value: true },
        { name: "No", value: false }
      ],
      default: 0
    });
    if (choosePorts) {
      // Prompt for frontend port
      const frontendPortInput = await input({
        message: "Enter frontend port (default 5173):",
        default: "5173",
      });
      frontendPort = parseInt(frontendPortInput, 10) || 5173;

      // Prompt for backend port
      const backendPortInput = await input({
        message: "Enter backend port (default 8000):",
        default: "8000",
      });
      backendPort = parseInt(backendPortInput, 10) || 8000;

      // Update .env files with chosen ports
      fs.writeFileSync(
        clientEnvPath,
        `VITE_REACT_APP_API_URL=http://localhost:${backendPort}\nVITE_PORT=${frontendPort}\n`
      );
      let serverEnvContent = fs.readFileSync(serverEnvPath, "utf-8");
      serverEnvContent = serverEnvContent.replace(
        /CORS_ORIGIN\s*=\s*["']?http:\/\/localhost:\d+["']?/,
        `CORS_ORIGIN="http://localhost:${frontendPort}"`
      );
      serverEnvContent = serverEnvContent.replace(
        /PORT\s*=\s*\d+/,
        `PORT=${backendPort}`
      );
      fs.writeFileSync(serverEnvPath, serverEnvContent);
    } else {
      console.log(chalk.cyan("You can run the project later using:\n"));
      console.log(chalk.green("npm run dev"));
      console.log(chalk.cyan("\nSetup finished."));
      return;
    }
  }

  // Always create root package.json after port selection
  const rootPkg = {
    name: "quickstart-mern-root",
    version: "1.0.0",
    scripts: {
      "setup": "npm run install-client && npm run install-server",
      "install-client": "cd client && npm install",
      "install-server": "cd server && npm install",
      "dev": "concurrently \"npm run dev-client\" \"npm run dev-server\"",
      "dev-client": `cd client && npm run dev -- --port ${frontendPort}`,
      "dev-server": "cd server && npm run dev"
    }
  };
  fs.writeFileSync(
    path.resolve("package.json"),
    JSON.stringify(rootPkg, null, 2)
  );

  // Run npm install after all .env and package.json changes (only once)
  console.log(chalk.cyan("Running setup scripts (npm install)..."));
  await execa("npm", ["run", "setup"], { stdio: "inherit" });

  console.log(chalk.cyan(`Starting dev servers on frontend:${frontendPort} and backend:${backendPort}...`));
  await execa("npm", ["run", "dev"], { stdio: "inherit" });
  console.log(chalk.green("✅ Setup complete!"));
}

async function main() {
  // Ask project name
  const projectName = await input({
    message: "Project name:",
    default: "my-mern-app",
  });

  // Ask if TS should be used
  const useTS = await confirm({
    message: "Do you want to use TypeScript?",
    default: true,
  });

  console.log(chalk.green(`\n🚀 Creating ${projectName} (TS=${useTS})...\n`));

  await setupProject();
}

main().catch((err) => {
  console.error(chalk.red("❌ Error:"), err);
  process.exit(1);
});
