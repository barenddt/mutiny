import React from "react"
import ReactDOM from "react-dom"
import { Patcher } from "../Patcher"
import { QuickAccess } from "../QuickAccess"
import { Router } from "../Router"

declare global {
  interface Window {
    SP_REACT: typeof React
    SP_REACTDOM: typeof ReactDOM
    __MUTINY_ROUTER__: Router
    __MUTINY_QUICK_ACCESS__: QuickAccess
    __MUTINY_PATCHER__: Patcher
  }
}
