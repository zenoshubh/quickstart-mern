#!/usr/bin/env node

import { input, confirm } from "@inquirer/prompts";

import { execa } from "execa";
import fs from "fs";
import path from "path";
import ora from "ora";
import chalk from "chalk";

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
}

main().catch((err) => {
  console.error(chalk.red("❌ Error:"), err);
  process.exit(1);
});
