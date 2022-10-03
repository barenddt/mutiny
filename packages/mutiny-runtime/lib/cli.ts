#!/usr/bin/env node

import { Command } from "commander";
import { loadMutinyConfig } from "./utils";

const program = new Command();

program.name("mutiny").description("").version("0.0.0");

program
  .command("start")
  .description("Starts the project")
  .action(handleStartMutiny);

program.parse();

function handleStartMutiny() {
  const mutinyConfig = loadMutinyConfig();

  console.dir(mutinyConfig);
}
