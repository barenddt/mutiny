import { findNode, findNodeAsync, getRootNode } from "./utils/fiber"

import { Fiber } from "react-reconciler"
import { Patch } from "./patch"
import { Patcher } from "./patcher"
import { ReactElement } from "react"
import { Route } from "./components"

export interface TRoute {
  path: string
  render: ReactElement
}

export class Router {
  routerNode: Fiber | null = null
  patcher: Patcher | null = null
  routes: TRoute[] = []

  constructor() {
    if (window.__MUTINY_ROUTER__) {
      window.__MUTINY_ROUTER__.unmount()
    }

    window.__MUTINY_ROUTER__ = this
  }

  async mount() {
    if (this.patcher) {
      this.patcher.restoreAll()
      this.patcher = null
    }

    this.patcher = new Patcher()

    this.routerNode = findNode(await getRootNode(), (f: Fiber) => f.type?.computeRootMatch)

    const childNode = this.routerNode
      ? await findNodeAsync(
          this.routerNode,
          (f: Fiber) => f.memoizedProps?.children?.length === 24 + (this.patcher?.patches.size ?? 0)
        )
      : null

    if (childNode) {
      const routePatch = new Patch({
        name: "add-routes",
        target: childNode.memoizedProps,
        property: "children",
        handler: {
          get: (target, prop) => {
            target = [
              ...this.routes.map((route) => (
                <Route key={route.path} path={route.path}>
                  {route.render}
                </Route>
              )),
              ...target,
            ]

            return target[prop]
          },
        },
      })

      this.patcher.addPatch(routePatch)

      this.forceUpdate()
    }

    console.debug("Mounted")
  }

  unmount() {
    if (this.patcher) {
      this.patcher.restoreAll()
    }
    console.debug("Unmounted")
  }

  addRoute(route: TRoute) {
    this.routes.push(route)

    console.debug(`Added route ${route.path}`)
  }

  public forceUpdate() {
    if (!this.routerNode) return console.debug("Router not mounted")
    this.routerNode.stateNode.forceUpdate()
  }
}

export function createRoute(path: string, render: ReactElement) {
  const router = new Router()
  router.addRoute({ path, render })
  router.mount()
}
