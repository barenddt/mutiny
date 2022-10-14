#!/usr/bin/env node

import { Command } from "commander"
import { build } from "./build"
import pkg from "../package.json"
import { startDevService } from "./service"

export const program = new Command()

program.name("mutiny").version(pkg.version)

program
  .command("build")
  .description("Builds the app")
  .option("-w, --watch", "Watch for changes")
  .option("--scope <app | server>", "Build scope")
  .action(build)

program
  .command("dev")
  .description("Starts the app in development mode")
  .option("-w, --watch", "Watch for changes")
  .option("--scope <app | server>", "Development scope")
  .action(startDevService)

program.parse()
