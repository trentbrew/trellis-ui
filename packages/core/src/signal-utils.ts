export function bindText(
  signal: { value: string },
  element: HTMLElement,
): () => void {
  const update = () => { element.textContent = signal.value }
  update()
  return () => {} // cleanup subscription (consumer manages signal lifecycle)
}

export function bindClass(
  signal: { value: string },
  element: HTMLElement,
  map: Record<string, string>,
): () => void {
  const update = () => {
    for (const [key, className] of Object.entries(map)) {
      element.classList.toggle(className, signal.value === key)
    }
  }
  update()
  return () => {}
}

export function bindAttr(
  signal: { value: boolean },
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
  return () => {}
}

export function bindVisible(
  signal: { value: boolean },
  element: HTMLElement,
): () => void {
  const update = () => {
    element.style.display = signal.value ? '' : 'none'
  }
  update()
  return () => {}
}

export function bindList<T>(
  signal: { value: T[] },
  container: HTMLElement,
  renderItem: (item: T, index: number) => string,
): () => void {
  const update = () => {
    container.innerHTML = signal.value.map(renderItem).join('')
  }
  update()
  return () => {}
}
