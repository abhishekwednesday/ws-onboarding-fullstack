/**
 * Formats duration in milliseconds to m:ss format.
 */
export function formatDuration(ms: number): string {
  const m = Math.floor(ms / 1000 / 60)
  const s = Math.floor((ms / 1000) % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * Formats seconds to m:ss format.
 */
export function formatSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}
