export * from "./loader"
export * from "./patcher"
export * from "./patch"
export * from "./router"
export * from "./tab-manager"
export * from "./utils"
export * from "./patches"

import * as React from "react"
import * as ReactDOM from "react-dom"

import { Route, Router } from "./router"

import { Fiber } from "react-reconciler"
import { Patcher } from "./patcher"

declare global {
  interface Window {
    SP_REACT: typeof React
    SP_REACTDOM: typeof ReactDOM
    __MUTINY_ROUTER__: Router
    __MUTINY_PATCHER__: Patcher
  }
}

export async function createRoute(route: Route) {
  const rootNode = await getRootNode()

  if (window.__MUTINY_ROUTER__) {
    window.__MUTINY_ROUTER__.unmount()
  }

  window.__MUTINY_ROUTER__ = new Router(rootNode)
  window.__MUTINY_ROUTER__.addRoute(route)
  window.__MUTINY_ROUTER__.mount()
}

export async function getRootNode(): Promise<Fiber> {
  while (!(document.getElementById("root") as any)._reactRootContainer?._internalRoot?.current) {
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  const rootNode = (document.getElementById("root") as any)._reactRootContainer._internalRoot
    .current as Fiber

  return rootNode
}

class Mutiny {
  static async createRoute(route: Route) {
    await createRoute(route)
  }

  static async getRootNode() {
    return await getRootNode()
  }
}

export default Mutiny
