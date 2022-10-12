/* eslint-disable @typescript-eslint/no-explicit-any */

declare global {
  interface Window {
    webpackChunksteamui: any
    mWebpackCache: Record<string, { __esModule?: boolean; default?: any }>
  }
}

if (!window.mWebpackCache) {
  window.mWebpackCache = {}

  let initRequire: any

  window.webpackChunksteamui.push([
    [Math.random()],
    {},
    (r: any) => {
      initRequire = r
    },
  ])

  for (const i of Object.keys(initRequire.m)) {
    window.mWebpackCache[i] = initRequire(i)
  }
}

export function findFunction(predicate: (fn: any) => boolean) {
  for (const i of Object.values(window.mWebpackCache).filter((x) => x)) {
    const mod = i.default || i

    if (mod) {
      for (const fn in mod) {
        if (predicate(mod[fn])) return mod[fn]
      }
    }
  }
}
