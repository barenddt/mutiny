import chalk, { Color } from "chalk"

export interface LoggerOptions {
  scope: string
  color: Color
}

export function logger(opts: LoggerOptions) {
  return function (message: string) {
    console.log(chalk[opts.color](`[${opts.scope}] ${chalk.bold(message)}`))
  }
}
