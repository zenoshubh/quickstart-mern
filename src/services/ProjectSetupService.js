import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { confirm } from "@inquirer/prompts";
import chalk from "chalk";
import ora from "ora";

import { log } from "../utils/logger.js";
import { validateTemplateExists, isMongoUriValid } from "../utils/validators.js";
import { 
  promptDatabaseSetup, 
  promptMongoUriReady, 
  promptDependencyInstallation, 
  promptProjectLaunch, 
  promptCustomPorts 
} from "../utils/prompts.js";
import { 
  copyDir, 
  checkIfDirectoryExists, 
  createEnvFiles, 
  updateEnvFiles, 
  createRootPackageJson 
} from "../utils/fileSystem.js";
import { 
  openEnvInVSCode, 
  isConcurrentlyInstalled, 
  installConcurrently, 
  installDependencies, 
  startDevelopmentServers 
} from "../utils/system.js";
import { DEFAULT_PORTS, VALIDATION_CONFIG } from "../config/constants.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class ProjectSetupService {
  constructor(projectName, useTypeScript) {
    this.projectName = projectName;
    this.useTypeScript = useTypeScript;
    this.language = useTypeScript ? "typescript" : "javascript";
    this.ports = { ...DEFAULT_PORTS };
    this.templatesDir = path.resolve(__dirname, "../templates");
    this.projectDir = path.resolve(projectName);
    this.clientDest = path.join(this.projectDir, "client");
    this.serverDest = path.join(this.projectDir, "server");
  }

  async run() {
    try {
      await this.validateAndSetupTemplates();
      await this.handleExistingDirectory();
      await this.copyTemplateFiles();
      await this.setupDatabase();
      await this.handleDependencies();
      
      log.success("✨ All done! Happy coding!");
    } catch (error) {
      log.error(`Setup failed: ${error.message}`);
      process.exit(1);
    }
  }

  async validateAndSetupTemplates() {
    log.step(`Setting up ${this.useTypeScript ? "TypeScript" : "JavaScript"} project: ${this.projectName}`);
    
    try {
      this.templatePaths = await validateTemplateExists(this.language, this.templatesDir);
    } catch (error) {
      log.error(error.message);
      process.exit(1);
    }
  }

  async handleExistingDirectory() {
    if (await checkIfDirectoryExists(this.projectDir)) {
      log.warning(`Directory '${this.projectName}' already exists!`);
      const overwrite = await confirm({
        message: "Do you want to overwrite the existing directory?",
        default: false,
      });
      
      if (!overwrite) {
        log.info("Setup cancelled by user");
        process.exit(0);
      }
      
      try {
        fs.rmSync(this.projectDir, { recursive: true, force: true });
        log.success("Existing directory removed");
      } catch (error) {
        log.error(`Failed to remove existing directory: ${error.message}`);
        process.exit(1);
      }
    }
  }

  async copyTemplateFiles() {
    const spinner = ora("Copying template files...").start();
    
    try {
      fs.mkdirSync(this.projectDir, { recursive: true });
      await copyDir(this.templatePaths.clientPath, this.clientDest);
      await copyDir(this.templatePaths.serverPath, this.serverDest);
      
      spinner.succeed(`${this.useTypeScript ? "TypeScript" : "JavaScript"} templates copied successfully!`);
      log.success(`Created project structure in: ${this.projectDir}`);
    } catch (error) {
      spinner.fail("Failed to copy template files");
      throw error;
    }
  }

  async setupDatabase() {
    const wantMongo = await promptDatabaseSetup();
    const mongoUri = wantMongo ? "enter_yours" : "";
    
    const clientEnvPath = path.join(this.clientDest, ".env");
    const serverEnvPath = path.join(this.serverDest, ".env");

    try {
      createEnvFiles(clientEnvPath, serverEnvPath, {
        frontendPort: this.ports.frontend,
        backendPort: this.ports.backend,
        mongoUri
      });
      log.success("Environment files created");
    } catch (error) {
      log.error(`Failed to create environment files: ${error.message}`);
      process.exit(1);
    }

    if (wantMongo) {
      await this.configureMongoDB(serverEnvPath);
    } else {
      log.info("Skipping MongoDB configuration as requested");
    }
  }

  async configureMongoDB(serverEnvPath) {
    log.step("Opening server/.env file for MongoDB configuration...");
    await openEnvInVSCode(serverEnvPath);

    let uriValid = false;
    let attempts = 0;
    const maxAttempts = VALIDATION_CONFIG.maxAttempts;
    
    while (!uriValid && attempts < maxAttempts) {
      attempts++;
      console.log();
      log.info("Please update the MONGODB_URI in server/.env with your actual MongoDB connection string");
      log.warning(`Attempt ${attempts}/${maxAttempts}`);
      
      const ready = await promptMongoUriReady();

      if (ready === "skip") {
        log.info("Skipping MongoDB setup. You can configure it later in server/.env");
        this.updateMongoUri(serverEnvPath, "");
        break;
      }

      if (!ready) {
        log.info("Take your time. The setup will wait for you to configure MongoDB.");
        continue;
      }

      try {
        const envContent = fs.readFileSync(serverEnvPath, "utf-8");
        uriValid = isMongoUriValid(envContent);

        if (!uriValid) {
          log.error("❌ MongoDB URI not detected or invalid format");
          log.info("Expected format: mongodb://... or mongodb+srv://...");
          log.warning("Make sure you've replaced 'enter_yours' with your actual MongoDB URI");
        } else {
          log.success("✅ Valid MongoDB URI detected!");
        }
      } catch (error) {
        log.error(`Failed to read .env file: ${error.message}`);
      }
    }

    if (!uriValid && attempts >= maxAttempts) {
      log.warning(`Maximum attempts (${maxAttempts}) reached. Continuing with empty MongoDB URI.`);
      log.info("You can configure MongoDB later in server/.env");
    }
  }

  updateMongoUri(serverEnvPath, uri) {
    const currentEnv = fs.readFileSync(serverEnvPath, "utf-8");
    const updatedEnv = currentEnv.replace(
      /MONGODB_URI\s*=\s*["']?.*?["']?/,
      `MONGODB_URI="${uri}"`
    );
    fs.writeFileSync(serverEnvPath, updatedEnv);
  }

  async handleDependencies() {
    const installNow = await promptDependencyInstallation();

    if (!installNow) {
      this.showManualInstructions();
      return;
    }

    this.concurrentlyReady = await this.setupConcurrently();
    await this.configurePorts();
    await this.createProjectFiles();
    await this.installAndRun();
  }

  showManualInstructions() {
    log.info("You chose to install dependencies manually.");
    console.log();
    log.step("Manual installation instructions:");
    console.log(chalk.cyan("1. Navigate to your project:"));
    console.log(chalk.green(`   cd ${this.projectName}`));
    console.log();
    console.log(chalk.cyan("2. Install client dependencies:"));
    console.log(chalk.green("   cd client"));
    console.log(chalk.green("   npm install"));
    console.log();
    console.log(chalk.cyan("3. Install server dependencies:"));
    console.log(chalk.green("   cd ../server"));
    console.log(chalk.green("   npm install"));
    console.log();
    console.log(chalk.cyan("4. Start development:"));
    console.log(chalk.green("   cd .. (back to project root)"));
    console.log(chalk.green("   npm run dev"));
    console.log();
    log.success("Setup finished. Follow the instructions above to continue.");
  }

  async setupConcurrently() {
    log.step("Checking for 'concurrently' package...");
    const concurrentlyInstalled = await isConcurrentlyInstalled();
    
    if (!concurrentlyInstalled) {
      log.warning("'concurrently' is not installed globally");
      const shouldInstall = await confirm({
        message: "Install 'concurrently' globally? (Required to run both client and server)",
        default: true,
      });
      
      if (shouldInstall) {
        const success = await installConcurrently();
        if (!success) {
          log.error("Failed to install concurrently. You may need to install it manually or run client and server separately.");
          return false;
        }
      } else {
        log.warning("Skipping 'concurrently' installation. You'll need to run client and server separately.");
        return false;
      }
    } else {
      log.success("'concurrently' is already available");
    }
    return true;
  }

  async configurePorts() {
    const runChoice = await promptProjectLaunch();
    
    this.shouldRun = runChoice !== "install-only";
    
    if (runChoice === "custom") {
      const customPorts = await promptCustomPorts();
      this.ports.frontend = customPorts.frontendPort;
      this.ports.backend = customPorts.backendPort;
      
      const clientEnvPath = path.join(this.clientDest, ".env");
      const serverEnvPath = path.join(this.serverDest, ".env");
      
      try {
        updateEnvFiles(clientEnvPath, serverEnvPath, this.ports);
        log.success("Environment files updated with custom ports");
        log.info("Backend port is set in server/.env (PORT); frontend port is used by the dev script.");
      } catch (error) {
        log.error(`Failed to update environment files: ${error.message}`);
        process.exit(1);
      }
    }
  }

  async createProjectFiles() {
    log.step("Creating root package.json...");
    try {
      createRootPackageJson(this.projectDir, this.projectName, this.useTypeScript, this.ports);
      log.success("Root package.json created");
    } catch (error) {
      log.error(`Failed to create root package.json: ${error.message}`);
      process.exit(1);
    }
  }

  async installAndRun() {
    // Navigate to project directory
    process.chdir(this.projectDir);
    log.info(`Changed working directory to: ${this.projectDir}`);

    // Install dependencies
    console.log();
    log.step("Installing dependencies... This may take a few minutes.");
    const installSuccess = await installDependencies();
    
    if (!installSuccess) {
      return;
    }

    if (this.shouldRun && this.concurrentlyReady) {
      await startDevelopmentServers(this.ports);
    } else if (this.shouldRun && !this.concurrentlyReady) {
      console.log();
      log.warning("Skipping auto-start because 'concurrently' is not available.");
      log.step("To run client and server together, install concurrently then run:");
      console.log(chalk.green("  npm install -g concurrently"));
      console.log(chalk.green(`  cd ${this.projectName}`));
      console.log(chalk.green("  npm run dev"));
      console.log();
      log.info("Or run client and server in separate terminals:");
      console.log(chalk.green("  cd client && npm run dev"));
      console.log(chalk.green("  cd server && npm run dev"));
    } else {
      console.log();
      log.success("Setup completed successfully!");
      log.step("To start development servers:");
      console.log(chalk.green(`  cd ${this.projectName}`));
      console.log(chalk.green("  npm run dev"));
      console.log();
      log.info(`Frontend will be available at: http://localhost:${this.ports.frontend}`);
      log.info(`Backend will be available at: http://localhost:${this.ports.backend}`);
    }
  }
}
