import { Fiber } from "react-reconciler"
import { Patcher } from "./patcher"
import { Router } from "./router"
import { createElementPatch } from "./patches"
import { findNode } from "./utils/fiber"

export class Loader {
  root: Fiber
  patcher: Patcher
  router: Router
  findNode: (filter: (fibre: Fiber) => boolean) => Fiber | null

  constructor(root: Fiber) {
    this.root = root
    this.patcher = new Patcher()
    this.router = new Router(root)
    this.findNode = (filter: (fibre: Fiber) => boolean) => findNode(root, filter)
  }

  mount() {
    this.patcher.addPatch(createElementPatch)

    this.router.mount()

    this.router.addRoute({
      path: "/homebrew",
      //   element: <App />,
      render: <div>hello</div>,
    })

    console.debug("Mounted")
  }

  unmount() {
    this.patcher.restoreAll()

    this.router.unmount()

    console.debug("Unmounted")
  }
}
