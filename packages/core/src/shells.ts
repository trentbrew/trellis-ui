export type Shell = 'node' | 'row' | 'card'

export function resolveShell(vantage: number): Shell {
  if (vantage <= 4) return 'node'
  if (vantage <= 7) return 'row'
  return 'card'
}
