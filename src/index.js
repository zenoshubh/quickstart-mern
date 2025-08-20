#!/usr/bin/env node

import { input, confirm } from "@inquirer/prompts";
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

  // Create .env files
  fs.writeFileSync(
    path.join(clientDest, ".env"),
    "VITE_REACT_APP_API_URL=http://localhost:8000\n"
  );
  fs.writeFileSync(
    path.join(serverDest, ".env"),
    `CORS_ORIGIN="http://localhost:5173"\nMONGODB_URI="enter_yours"\nPORT=8000\n`
  );

  // Install concurrently globally
  console.log(chalk.cyan("Installing 'concurrently' globally..."));
  await execa("npm", ["install", "-g", "concurrently"], { stdio: "inherit" });

  // Create root package.json with scripts
  const rootPkg = {
    name: "quickstart-mern-root",
    version: "1.0.0",
    scripts: {
      "setup": "npm run install-client && npm run install-server",
      "install-client": "cd client && npm install",
      "install-server": "cd server && npm install",
      "dev": "concurrently \"npm run dev-client\" \"npm run dev-server\"",
      "dev-client": "cd client && npm run dev",
      "dev-server": "cd server && npm run dev"
    }
  };
  fs.writeFileSync(
    path.resolve("package.json"),
    JSON.stringify(rootPkg, null, 2)
  );

  console.log(chalk.cyan("Running setup scripts (npm install)..."));
  await execa("npm", ["run", "setup"], { stdio: "inherit" });

  // Prompt user to update server/.env
  console.log(
    chalk.yellow(
      "\nPlease update server/.env with your MongoDB connection string before starting the dev servers."
    )
  );
  const ready = await confirm({
    message: "Have you updated server/.env with your MongoDB URI?",
    default: false,
  });

  if (ready) {
    console.log(chalk.cyan("Starting dev servers..."));
    await execa("npm", ["run", "dev"], { stdio: "inherit" });
    console.log(chalk.green("✅ Setup complete!"));
  } else {
    console.log(
      chalk.red(
        "❌ Please update server/.env and run 'npm run dev' manually when ready."
      )
    );
  }
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
