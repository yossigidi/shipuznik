export function nis(n) {
  const v = Number(n) || 0
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    maximumFractionDigits: 0,
  }).format(v)
}

export function num(n) {
  return new Intl.NumberFormat('he-IL', { maximumFractionDigits: 2 }).format(Number(n) || 0)
}

export function dateShort(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: '2-digit' })
}
