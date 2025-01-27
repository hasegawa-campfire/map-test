type DebounceFn = { start: () => void; end: () => void } | (() => void)

export function debounce(fn: DebounceFn, wait = 200): () => void {
  let timerId = 0

  const onTimeout = () => {
    timerId = 0
    if ('end' in fn) fn.end()
    else fn()
  }

  return () => {
    if (!timerId && 'start' in fn) fn.start()
    window.clearTimeout(timerId)
    timerId = window.setTimeout(onTimeout, wait)
  }
}
