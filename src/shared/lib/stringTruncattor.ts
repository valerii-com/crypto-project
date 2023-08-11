export function truncateString(str: string, n: number) {
  return str.length > n ? str.substring(0, n - 1).trim() + '...' : str;
}
