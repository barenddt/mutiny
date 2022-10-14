import { Patch } from "./patch"
import { Patcher } from "./patcher"
import { ReactNode } from "react"

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

export class QuickAccess {
  tabs: Tab[] = []
  patcher: Patcher = new Patcher()

  constructor() {
    if (window.__MUTINY_QUICK_ACCESS__) {
      window.__MUTINY_QUICK_ACCESS__.unmount()
    }

    window.__MUTINY_QUICK_ACCESS__ = this
    this.mount()
  }

  mount() {
    const patch = new Patch({
      name: "quick-access",
      target: Array.prototype,
      property: "filter",
      handler: {
        apply: (target, thisArg, args) => {
          let result: Tab[] = Reflect.apply(target, thisArg, args)

          if (isTabs(result)) {
            result = result.concat(...this.tabs)
          }

          return result
        },
      },
    })

    this.patcher.addPatch(patch)
  }

  unmount() {
    this.patcher.restoreAll()
  }

  addTab(tab: Tab) {
    const cTab = {
      ...tab,
      key: this.tabs.length + 1,
    }

    this.tabs.push(cTab)
  }
}

const quickAccess = new QuickAccess()

export function createQuickAccessTab(tab: Tab) {
  quickAccess.addTab(tab)
}
