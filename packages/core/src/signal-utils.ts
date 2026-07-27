import type { Signal } from 'trellis/browser'

export function bindText(
  signal: Signal<string>,
  element: HTMLElement,
): () => void {
  const update = () => { element.textContent = signal.value }
  update()
  return signal.subscribe(() => update())
}

export function bindClass(
  signal: Signal<string>,
  element: HTMLElement,
  map: Record<string, string>,
): () => void {
  const update = () => {
    for (const [key, className] of Object.entries(map)) {
      element.classList.toggle(className, signal.value === key)
    }
  }
  update()
  return signal.subscribe(() => update())
}

export function bindAttr(
  signal: Signal<boolean>,
  element: HTMLElement,
  name: string,
): () => void {
  const update = () => {
    if (signal.value) {
      element.setAttribute(name, '')
    } else {
      element.removeAttribute(name)
    }
  }
  update()
  return signal.subscribe(() => update())
}

export function bindVisible(
  signal: Signal<boolean>,
  element: HTMLElement,
): () => void {
  const update = () => {
    element.style.display = signal.value ? '' : 'none'
  }
  update()
  return signal.subscribe(() => update())
}

export function bindList<T>(
  signal: Signal<T[]>,
  container: HTMLElement,
  renderItem: (item: T, index: number) => string,
): () => void {
  const update = () => {
    container.innerHTML = signal.value.map(renderItem).join('')
  }
  update()
  return signal.subscribe(() => update())
}