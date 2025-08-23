#!/usr/bin/env node

import { createCommand } from "./commands/create.js";

async function main() {
  try {
    await createCommand();
  } catch (error) {
    console.error("CLI Error:", error.message);
    process.exit(1);
  }
}

main();

