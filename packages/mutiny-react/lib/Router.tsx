import { findNode, findNodeAsync, getRootNode } from "./utils/fiber"

import { Fiber } from "react-reconciler"
import { Patch } from "./Patch"
import { Patcher } from "./Patcher"
import { ReactElement } from "react"
import { Route } from "./extracted"

export interface TRoute {
  path: string
  render: ReactElement
}

export class Router extends Patcher {
  routerNode: Fiber | null = null
  routes: TRoute[] = []

  constructor() {
    super()

    if (window.__MUTINY_ROUTER__) {
      window.__MUTINY_ROUTER__.unmount()
    }

    window.__MUTINY_ROUTER__ = this
    this.mount()
  }

  async mount() {
    const rootNode = await getRootNode()
    this.routerNode = findNode(rootNode, (f: Fiber) => f.type?.computeRootMatch)

    const childNode = this.routerNode
      ? await findNodeAsync(
          this.routerNode,
          (f: Fiber) => f.memoizedProps?.children?.length === 24 + (this.patches.size ?? 0)
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

      this.addPatch(routePatch)

      this.forceUpdate()
    }
  }

  unmount() {
    this.restoreAll()
  }

  addRoute(route: TRoute) {
    this.routes.push(route)
  }

  public forceUpdate() {
    if (!this.routerNode) return
    this.routerNode.stateNode.forceUpdate()
  }
}

const router = new Router()

export function createRoute(path: string, render: ReactElement) {
  router.addRoute({ path, render })
}
