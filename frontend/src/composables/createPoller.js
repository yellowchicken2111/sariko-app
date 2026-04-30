const DEFAULT_INTERVAL_MS = 10_000

/**
 * Creates a visibility-aware polling loop.
 *   - Skips ticks while tab is hidden (battery + cost saver)
 *   - Immediate refetch when tab becomes visible again
 *   - Prevents overlapping fetches if a tick is still in flight
 *
 * @param {Object} opts
 * @param {string} opts.name        Logical name for logs
 * @param {number} [opts.intervalMs]  Polling interval (default 10s)
 * @param {() => Promise<void> | void} opts.fetch  Fetch function called on each tick
 *
 * @returns {{ start: () => void, stop: () => void, tick: () => Promise<void> }}
 */
export function createPoller({ name, intervalMs = DEFAULT_INTERVAL_MS, fetch }) {
    let timer = null
    let visibilityHandler = null
    let inFlight = false

    const log = (...args) => console.log(`[poll:${name}]`, ...args)

    async function tick() {
        if (inFlight) return
        if (typeof document !== 'undefined' && document.visibilityState !== 'visible') return
        inFlight = true
        try {
            await fetch()
        } catch (e) {
            console.error(`[poll:${name}] fetch error`, e)
        } finally {
            inFlight = false
        }
    }

    function start() {
        if (timer) return
        log('start', `${intervalMs}ms`)
        tick()
        timer = setInterval(tick, intervalMs)
        visibilityHandler = () => {
            if (document.visibilityState === 'visible') tick()
        }
        document.addEventListener('visibilitychange', visibilityHandler)
    }

    function stop() {
        if (timer) {
            clearInterval(timer)
            timer = null
        }
        if (visibilityHandler) {
            document.removeEventListener('visibilitychange', visibilityHandler)
            visibilityHandler = null
        }
        log('stop')
    }

    return { start, stop, tick }
}
