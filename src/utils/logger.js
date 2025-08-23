import chalk from "chalk";

export const log = {
  info: (msg) => console.log(chalk.blue("ℹ"), msg),
  success: (msg) => console.log(chalk.green("✅"), msg),
  warning: (msg) => console.log(chalk.yellow("⚠"), msg),
  error: (msg) => console.log(chalk.red("❌"), msg),
  step: (msg) => console.log(chalk.cyan("🔄"), msg),
  highlight: (msg) => console.log(chalk.magenta("🎯"), msg)
};
