import { Patch } from "./patch"

export class Patcher {
  public patches: Set<Patch>

  constructor() {
    this.patches = new Set([])
  }

  public addPatch(patch: Patch) {
    patch.apply()
    this.patches.add(patch)
  }

  public addPatches(patches: Patch[]) {
    patches.forEach((patch) => {
      patch.apply()
      this.patches.add(patch)
    })
  }

  public removePatch(patch: Patch) {
    patch.revert()
    this.patches.delete(patch)
  }

  public restoreAll() {
    this.patches.forEach((patch) => {
      patch.revert()
    })

    this.patches.clear()
  }
}
