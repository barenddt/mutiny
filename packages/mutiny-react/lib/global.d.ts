import React from "react"
import ReactDOM from "react-dom"
import { Patcher } from "./patcher"
import { Router } from "./router"

declare global {
  interface Window {
    SP_REACT: typeof React
    SP_REACTDOM: typeof ReactDOM
    __MUTINY_ROUTER__: Router
    __MUTINY_PATCHER__: Patcher
  }
}
