import { FaMugHot } from "react-icons/fa"
import { Patch } from "../patch"
import React from "react"

export const arrayInsertAfter = (array: any[], index: number, item: any) => {
  return [...array.slice(0, index + 1), item, ...array.slice(index + 1)]
}

export const createElementPatch = new Patch({
  name: "create-element",
  target: React,
  property: "createElement",
  handler: {
    apply: (target, thisArg, args) => {
      const result = Reflect.apply(target, thisArg, args)

      if (result?.props?.children?.length === 15) {
        if (result.props.children[4]?.props?.route === "/library") {
          result.props.children = arrayInsertAfter(
            result.props.children,
            5,
            React.cloneElement(
              result.props.children[4],
              {
                label: "Homebrew",
                route: "/homebrew",
                exactRouteMatch: false,
              },
              <FaMugHot />
            )
          )
        }
      }

      return result
    },
  },
})
