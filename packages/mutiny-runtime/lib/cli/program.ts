import { Command } from "commander"

import { startService } from "../service"
import { build } from "./build"

export const program = new Command()

program.name("mutiny").description("").version("0.0.0")

program
  .command("build")
  .description("Builds the app")
  .action(() => build())
program
  .command("dev")
  .description("Starts the app in development mode")
  .action(() => startService({ watch: true }))

program.parse()
