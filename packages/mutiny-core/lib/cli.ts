#!/usr/bin/env node

import { Command } from "commander"
import { buildApp } from "./build"
import { loadMutinyConfig } from "./utils"
import { startService } from "./service"

export const program = new Command()

program.name("mutiny").description("").version("0.0.0")

program
  .command("build")
  .description("Builds the app")
  .action(() => {
    const { app } = loadMutinyConfig()
    buildApp(app, { watch: false })
  })

program
  .command("dev")
  .description("Starts the app in development mode")
  .action(() => startService({ watch: true }))

program.parse()
