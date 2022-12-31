type Options = {
  class?: string | string[]
  children?: HTMLElement[]
  id?: string
  innerText?: string
  innerHTML?: string
  onClick?: (e: MouseEvent) => void
  title?: string
  dataset?: Record<string, string | false | null>
}

export function createElement<T extends keyof HTMLElementTagNameMap = 'div'>({
  tag = 'div' as T,
  class: className,
  children,
  id,
  innerText,
  innerHTML,
  onClick,
  dataset,
  title,
}: Options & { tag?: T } = {}): HTMLElementTagNameMap[T] {
  const element = document.createElement(tag)

  if (className) {
    element.classList.add(
      ...(Array.isArray(className) ? className : className.split(' ')),
    )
  }

  if (children) {
    for (const child of children) {
      element.appendChild(child)
    }
  }

  if (id) {
    element.id = id
  }

  if (innerText) {
    element.innerText = innerText
  }

  if (innerHTML) {
    element.innerHTML = innerHTML
  }

  if (onClick) {
    element.onclick = onClick
  }

  if (dataset) {
    for (const [key, value] of Object.entries(dataset)) {
      if (value) {
        element.dataset[key] = value
      }
    }
  }

  if (title) {
    element.title = title
  }

  return element
}

type StateProp<T, S> = T | ((state: S) => T)

export function createElementWithState<
  S,
  T extends keyof HTMLElementTagNameMap = 'div',
>(
  options: Omit<
    Options,
    'class' | 'innerText' | 'innerHTML' | 'tag' | 'onClick'
  > & {
    initialState: S
    syncState?: (callback: (state: S) => void) => void
    tag?: T
    class?: StateProp<string | string[], S>
    innerText?: StateProp<string, S>
    innerHTML?: StateProp<string, S>
    onClick?: (e: MouseEvent, setState: (state: S) => void, state: S) => void
  },
): {
  element: HTMLElementTagNameMap[T]
  setState: (state: S | ((current: S) => S)) => void
  onStateChange: (callback: (state: S) => void) => void
  state: S
} {
  const {
    initialState: _state,
    class: className,
    innerText,
    innerHTML,
    onClick,
    syncState,
    ...rest
  } = options
  const element = createElement(rest)

  const internalState = { state: _state }

  function setStateProps() {
    if (className) {
      const classes =
        className instanceof Function
          ? className(internalState.state)
          : className
      const classesSet = new Set(
        Array.isArray(classes) ? classes : classes.split(' '),
      )

      element.classList.forEach((c) => {
        if (!classesSet.has(c)) {
          element.classList.remove(c)
        } else {
          classesSet.delete(c)
        }
      })

      for (const c of classesSet) {
        element.classList.add(c)
      }
    }

    if (innerText) {
      element.innerText =
        innerText instanceof Function
          ? innerText(internalState.state)
          : innerText
    }

    if (innerHTML) {
      element.innerHTML =
        innerHTML instanceof Function
          ? innerHTML(internalState.state)
          : innerHTML
    }
  }

  if (onClick) {
    element.onclick = (e) => {
      onClick(e, setState, internalState.state)
    }
  }

  if (syncState) {
    syncState(setState)
  }

  setStateProps()

  const onStateChangeCallbacks = new Set<(state: S) => void>()

  function onStateChange(callback: (state: S) => void) {
    onStateChangeCallbacks.add(callback)

    return () => {
      onStateChangeCallbacks.delete(callback)
    }
  }

  function setState(newState: S | ((current: S) => S)) {
    internalState.state =
      newState instanceof Function ? newState(internalState.state) : newState
    setStateProps()

    for (const callback of onStateChangeCallbacks) {
      callback(internalState.state)
    }
  }

  return {
    element,
    setState,
    get state() {
      return internalState.state
    },
    onStateChange,
  }
}
