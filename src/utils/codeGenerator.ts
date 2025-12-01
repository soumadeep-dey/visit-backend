export function generateCode(prefix: string, count: number): string {
  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}
