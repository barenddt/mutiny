import { isProxy } from "is-proxy"

export interface PatchArgs {
  name: string
  target: any
  property: string
  handler: ProxyHandler<any>
}

export class Patch {
  name: string
  target: any
  property: string
  original: any
  handler: ProxyHandler<any>

  constructor(args: PatchArgs) {
    this.name = args.name
    this.target = args.target
    this.property = args.property
    this.handler = args.handler
  }

  apply() {
    if (isProxy(this.target[this.property])) {
      console.debug(`Target ${this.name} is already a proxy, skipping`)
      return
    }

    this.original = this.target[this.property]

    this.target[this.property] = new Proxy(
      this.target[this.property],
      this.handler
    )

    console.debug(`Applied patch ${this.name}`)

    return this
  }

  revert() {
    this.target[this.property] = this.original

    console.debug(`Reverted patch ${this.name}`)

    return this
  }
}
