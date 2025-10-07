/**
 * Formats a number with K/M suffixes for better readability
 * @param num - The number to format
 * @returns Formatted string (e.g., 1500 -> "1.5K", 1500000 -> "1.5M")
 */
export function formatViewCount(num: number): string {
  if (num < 1000) {
    return num.toString()
  }

  if (num < 1000000) {
    const formatted = (num / 1000).toFixed(1)
    // Remove trailing .0
    return formatted.endsWith('.0') ?
      `${Math.floor(num / 1000)}K` :
      `${formatted}K`
  }

  const formatted = (num / 1000000).toFixed(1)
  // Remove trailing .0
  return formatted.endsWith('.0') ?
    `${Math.floor(num / 1000000)}M` :
    `${formatted}M`
}