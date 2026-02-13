export function isValidDuration(value: string): boolean {
  return /^[0-9]+$/.test(value) && Number(value) > 0
}
