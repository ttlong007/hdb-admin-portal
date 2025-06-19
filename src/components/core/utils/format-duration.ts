export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  const parts = []
  // @ts-ignore
  if (hours > 0) parts.push(`${hours}h`)
  // @ts-ignore
  if (minutes > 0) parts.push(`${minutes}m`)
  // @ts-ignore
  if (secs > 0 || parts.length === 0) parts.push(`${secs}s`)
  return parts.join(' ')
}
