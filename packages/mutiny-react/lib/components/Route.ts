import { FC, ReactNode } from "react"

import { findFunction } from "@mutiny/utils"

interface RouteProps {
  path: string
  exact?: boolean
  noTransitionZoom?: boolean
  children: ReactNode
}

export const Route: FC<RouteProps> = findFunction((fn) =>
  fn.toString()?.includes("{routePath:e.match.path}")
)
