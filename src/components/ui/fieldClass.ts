export function fieldClass(invalid = false): string {
  const border = invalid ? 'border-neutral-900' : 'border-neutral-300'
  return `w-full rounded border bg-white px-3 py-2 text-neutral-900 outline-none disabled:opacity-50 ${border}`
}
