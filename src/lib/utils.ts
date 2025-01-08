export function debounce<T extends unknown[]>(fn: (...args: T) => void, wait = 200): (...args: T) => void {
  let timeout: number = 0

  return (...args: T) => {
    if (timeout) window.clearTimeout(timeout)
    timeout = window.setTimeout(() => fn(...args), wait)
  }
}
