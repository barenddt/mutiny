import { Fiber } from "react-reconciler"

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const findFiberNodeById = (fibre: Fiber, id: string): Fiber | null => {
  if (fibre.stateNode?.id === id) {
    return fibre
  }

  if (fibre.child) {
    const child = findFiberNodeById(fibre.child, id)
    if (child) {
      return child
    }
  }

  if (fibre.sibling) {
    const sibling = findFiberNodeById(fibre.sibling, id)
    if (sibling) {
      return sibling
    }
  }

  return null
}

const findFiberNodeByClass = (
  fibre: Fiber,
  className: string
): Fiber | null => {
  if (fibre.stateNode?.className === className) {
    return fibre
  }

  if (fibre.child) {
    const child = findFiberNodeByClass(fibre.child, className)
    if (child) {
      return child
    }
  }

  if (fibre.sibling) {
    const sibling = findFiberNodeByClass(fibre.sibling, className)
    if (sibling) {
      return sibling
    }
  }

  return null
}

const findStateNode = (fibre: Fiber): Fiber | null => {
  if (fibre.stateNode) {
    return fibre
  }

  if (fibre.child) {
    const child = findStateNode(fibre.child)
    if (child) {
      return child
    }
  }

  if (fibre.sibling) {
    const sibling = findStateNode(fibre.sibling)
    if (sibling) {
      return sibling
    }
  }

  return null
}

const findNode = (
  fibre: Fiber,
  filter: (fibre: Fiber) => boolean
): Fiber | null => {
  if (filter(fibre)) {
    return fibre
  }

  if (fibre.child) {
    const child = findNode(fibre.child, filter)
    if (child) {
      return child
    }
  }

  if (fibre.sibling) {
    const sibling = findNode(fibre.sibling, filter)
    if (sibling) {
      return sibling
    }
  }

  return null
}

const findNodeAsync = async (
  fibre: Fiber,
  filter: (fibre: Fiber) => boolean,
  options?: { maxRetries?: number; retryDelay?: number }
): Promise<Fiber | null> => {
  const { maxRetries = 20, retryDelay = 100 } = options || {}

  for (let i = 0; i < maxRetries; i++) {
    const node = findNode(fibre, filter)

    if (node) {
      return node
    }

    await sleep(retryDelay)
  }

  return null
}

const findParentNode = (
  fibre: Fiber,
  filter: (fibre: Fiber) => boolean
): Fiber => {
  let parent = fibre.return

  while (parent) {
    if (filter(parent)) {
      return parent
    }

    parent = parent.return
  }

  throw new Error("Could not find parent node")
}

const waitForNode = (
  fibre: Fiber,
  filter: (fibre: Fiber) => boolean
): Promise<Fiber> => {
  return new Promise((resolve) => {
    const node = findNode(fibre, filter)

    if (node) {
      resolve(node)
    } else {
      setTimeout(() => {
        resolve(waitForNode(fibre, filter))
      }, 100)
    }
  })
}

export {
  findFiberNodeById,
  findFiberNodeByClass,
  findStateNode,
  findNode,
  findNodeAsync,
  findParentNode,
}
