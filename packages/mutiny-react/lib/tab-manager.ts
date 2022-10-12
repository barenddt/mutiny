import { Fiber } from "react-reconciler"
import { ReactNode } from "react"
import { isProxy } from "is-proxy"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isTabs = (arr: any[]) =>
  arr.reduce((_, c) => {
    if (c.key && c.title && c.tab && c.panel) {
      return true
    }

    return false
  }, false)

export interface Tab {
  key?: number
  title: ReactNode
  tab: ReactNode
  panel: ReactNode
}

export class TabManager {
  root: Fiber
  tabs: Tab[]

  constructor(root: Fiber, initialTabs?: Tab[]) {
    this.root = root
    this.tabs = initialTabs ?? []
  }

  mount() {
    if (!isProxy(Array.prototype.filter)) {
      Array.prototype.filter = new Proxy(Array.prototype.filter, {
        apply: (target, thisArg, args) => {
          let result: Tab[] = Reflect.apply(target, thisArg, args)

          if (isTabs(result)) {
            result = result.concat(...this.tabs)
          }

          return result
        },
      })
    }

    console.debug("Mounted")

    return this
  }

  unmount() {
    console.debug("Unmounted")

    return this
  }

  addTab(tab: Tab): Tab {
    const cTab = {
      ...tab,
      key: this.tabs.length + 1,
    }

    this.tabs.push(cTab)

    console.debug("added new tab")
    return cTab
  }

  removeTab(): void {
    console.debug("removing tab")
  }
}
