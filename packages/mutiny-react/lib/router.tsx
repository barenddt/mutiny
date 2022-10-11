import { findNode, findNodeAsync } from "./utils/fiber"

import { Fiber } from "react-reconciler"
import { Patch } from "./patch"
import { Patcher } from "./patcher"
import { ReactElement } from "react"
import { Route } from "./components"

export interface Route {
  path: string
  render: ReactElement
}

export class Router {
  root: Fiber
  routerNode: Fiber | null = null
  patcher: Patcher | null = null
  routes: Route[] = []

  constructor(root: Fiber) {
    this.root = root
  }

  async mount() {
    if (this.patcher) {
      this.patcher.restoreAll()
      this.patcher = null
    }

    this.patcher = new Patcher()

    this.routerNode = findNode(this.root, (f: Fiber) => f.type?.computeRootMatch)

    const childNode = await findNodeAsync(
      this.routerNode!,
      (f: Fiber) => f.memoizedProps?.children?.length === 24 + (this.patcher?.patches.size ?? 0)
    )

    if (childNode) {
      const routePatch = new Patch({
        name: "add-homebrew-route",
        target: childNode.memoizedProps,
        property: "children",
        handler: {
          get: (target, prop) => {
            target = [
              ...this.routes.map((route) => <Route path={route.path}>{route.render}</Route>),
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
      this.patcher = null
    }

    this.routerNode = null
    console.debug("Unmounted")
  }

  addRoute(route: Route) {
    this.routes.push(route)

    console.debug(`Added route ${route.path}`)
  }

  public forceUpdate() {
    if (!this.routerNode) return console.debug("Router not mounted")
    this.routerNode.stateNode.forceUpdate()
  }
}
