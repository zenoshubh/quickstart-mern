import { input, select } from "@inquirer/prompts";
import { log } from "./logger.js";
import { validateProjectName, validatePortNumber } from "./validators.js";

export async function promptProjectName() {
  let projectName;
  let nameValid = false;
  
  while (!nameValid) {
    projectName = await input({
      message: "Project name:",
      default: "my-mern-app",
    });
    
    const validation = validateProjectName(projectName);
    if (validation.valid) {
      nameValid = true;
      log.success(`Project name: ${projectName}`);
    } else {
      log.error(validation.error);
    }
  }
  
  return projectName;
}

export async function promptLanguage() {
  return await select({
    message: "Choose your preferred language:",
    choices: [
      { name: "TypeScript (recommended for larger projects)", value: true },
      { name: "JavaScript (simpler setup)", value: false }
    ],
    default: 0
  });
}

export async function promptDatabaseSetup() {
  log.highlight("Database Configuration");
  return await select({
    message: "Do you want to connect to MongoDB and have a valid connection string?",
    choices: [
      { name: "Yes, I have a MongoDB connection string", value: true },
      { name: "No, skip database setup for now", value: false }
    ],
    default: 0
  });
}

export async function promptMongoUriReady() {
  return await select({
    message: "Have you updated server/.env with your MongoDB URI?",
    choices: [
      { name: "Yes, I've updated the MongoDB URI", value: true },
      { name: "No, I need more time", value: false },
      { name: "Skip MongoDB setup for now", value: "skip" }
    ],
    default: 0
  });
}

export async function promptDependencyInstallation() {
  console.log();
  log.highlight("Dependency Installation");
  return await select({
    message: "Do you want to install dependencies now?",
    choices: [
      { name: "Yes, install dependencies automatically (recommended)", value: true },
      { name: "No, I'll install them manually later", value: false }
    ],
    default: 0
  });
}

export async function promptProjectLaunch() {
  console.log();
  log.highlight("Project Launch Configuration");
  return await select({
    message: "How would you like to proceed?",
    choices: [
      { name: "Install dependencies and run on default ports (frontend: 5173, backend: 8000)", value: "default" },
      { name: "Install dependencies with custom ports", value: "custom" },
      { name: "Just install dependencies (don't run yet)", value: "install-only" }
    ],
    default: 0
  });
}

export async function promptCustomPorts() {
  log.step("Configuring custom ports...");
  
  // Prompt for frontend port
  let frontendPort;
  let frontendValid = false;
  while (!frontendValid) {
    const frontendPortInput = await input({
      message: "Enter frontend port:",
      default: "5173",
    });
    
    const frontendValidation = validatePortNumber(frontendPortInput, "Frontend");
    if (frontendValidation.valid) {
      frontendPort = frontendValidation.port;
      frontendValid = true;
      log.success(`Frontend port set to: ${frontendPort}`);
    } else {
      log.error(frontendValidation.error);
    }
  }

  // Prompt for backend port
  let backendPort;
  let backendValid = false;
  while (!backendValid) {
    const backendPortInput = await input({
      message: "Enter backend port:",
      default: "8000",
    });
    
    const backendValidation = validatePortNumber(backendPortInput, "Backend");
    if (backendValidation.valid) {
      if (backendValidation.port === frontendPort) {
        log.error("Backend port cannot be the same as frontend port");
        continue;
      }
      backendPort = backendValidation.port;
      backendValid = true;
      log.success(`Backend port set to: ${backendPort}`);
    } else {
      log.error(backendValidation.error);
    }
  }

  return { frontendPort, backendPort };
}
