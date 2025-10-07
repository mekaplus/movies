// Simplified utility without external deps for now
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours > 0) {
    return `${hours}h ${mins}m`
  }
  return `${mins}m`
}

export function formatYear(year: number): string {
  return year.toString()
}

export function formatRating(rating: number): string {
  return rating.toFixed(1)
}