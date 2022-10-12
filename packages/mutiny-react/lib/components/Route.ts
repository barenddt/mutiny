import { FC, ReactNode } from "react"

import { findModuleChild } from "../utils/webpack"

interface RouteProps {
  path: string
  exact?: boolean
  noTransitionZoom?: boolean
  children: ReactNode
}

export const Route: FC<RouteProps> = findModuleChild((m) => {
  if (typeof m !== "object") return undefined
  for (const prop in m) {
    if (m[prop].toString().includes("{routePath:e.match.path}")) return m[prop]
  }
}) as FC<RouteProps>
