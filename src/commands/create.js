import { select } from "@inquirer/prompts";
import chalk from "chalk";
import { log } from "../utils/logger.js";
import { validateProjectName } from "../utils/validators.js";
import { ProjectSetupService } from "../services/ProjectSetupService.js";
import { promptProjectName, promptLanguage } from "../utils/prompts.js";

export async function createCommand() {
  console.log();
  console.log(chalk.bold.cyan("🚀 MERN Stack Project Generator"));
  console.log(chalk.gray("Create a full-stack JavaScript or TypeScript application"));
  console.log();

  // Get project name with validation
  const projectName = await promptProjectName();
  
  // Get language preference
  const useTypeScript = await promptLanguage();

  console.log();
  log.highlight(`Creating ${chalk.bold(projectName)} with ${useTypeScript ? "TypeScript" : "JavaScript"}...`);
  console.log();

  // Initialize and run project setup
  const setupService = new ProjectSetupService(projectName, useTypeScript);
  await setupService.run();
}
