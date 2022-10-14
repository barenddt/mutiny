import * as trpcExpress from "@trpc/server/adapters/express"

import { inferAsyncReturnType, initTRPC } from "@trpc/server"

import cors from "cors"
import express from "express"
import os from "os"

const { PORT } = process.env

const createContext = () => ({})

type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

const appRouter = t.router({
  osInfo: t.procedure.query(() => {
    return {
      type: os.type(),
      arch: os.arch(),
      release: os.release(),
    }
  }),
})

const app = express()

app.use(cors())

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
)

app.listen(PORT)

export type AppRouter = typeof appRouter
