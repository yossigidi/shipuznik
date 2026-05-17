import { useState, useMemo, useEffect } from 'react'
import { Plus, Trash2, TrendingUp, Truck } from 'lucide-react'
import { MATERIAL_CATALOG } from '../data/materials'
import { getSupplierPrices } from '../utils/storage'
import { nis, num } from '../utils/format'

// מחשבון עלויות — מחיר קנייה + תוספת רווח. משתמש במחירי ספקים אישיים אם קיימים.
export default function CostCalcPage({ onNavigate }) {
  const [items, setItems] = useState([
    { id: '1', matKey: 'ceramic', qty: 20 },
    { id: '2', matKey: 'adhesive', qty: 5 },
  ])

  const [supplierPrices, setSupplierPrices] = useState({})
  const [overrides, setOverrides] = useState({}) // עריכות זמניות לפרוייקט הנוכחי

  useEffect(() => {
    setSupplierPrices(getSupplierPrices())
  }, [])

  function updateItem(id, patch) {
    setItems(items.map(i => (i.id === id ? { ...i, ...patch } : i)))
  }
  function removeItem(id) {
    setItems(items.filter(i => i.id !== id))
  }
  function addItem() {
    setItems([...items, { id: 'i_' + Date.now(), matKey: 'ceramic', qty: 1 }])
  }
  function setOverride(matKey, patch) {
    setOverrides(o => ({ ...o, [matKey]: { ...(o[matKey] || {}), ...patch } }))
  }

  const rows = useMemo(() => items.map(it => {
    const mat = MATERIAL_CATALOG[it.matKey]
    const sp = supplierPrices[it.matKey]
    const ov = overrides[it.matKey] || {}
    const price = ov.price !== undefined ? Number(ov.price) : (sp?.price ?? mat.price)
    const markupPct = ov.markupPct !== undefined ? Number(ov.markupPct) : (sp?.markupPct ?? mat.markupPct)
    const qty = Number(it.qty) || 0
    const cost = qty * price
    const sale = cost * (1 + markupPct / 100)
    const profit = sale - cost
    return { ...it, mat, sp, price, markupPct, cost, sale, profit, isCustom: !!sp }
  }), [items, overrides, supplierPrices])

  const totals = useMemo(() => rows.reduce(
    (s, r) => ({ cost: s.cost + r.cost, sale: s.sale + r.sale, profit: s.profit + r.profit }),
    { cost: 0, sale: 0, profit: 0 }
  ), [rows])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-gray-600">חישוב עלות חומרים + תוספת רווח.</p>
        <button
          onClick={() => onNavigate?.('suppliers')}
          className="text-sm text-brand-600 font-semibold flex items-center gap-1 flex-shrink-0"
        >
          <Truck className="w-4 h-4" /> ספקים
        </button>
      </div>

      <div className="space-y-2">
        {rows.map(r => (
          <div key={r.id} className="card space-y-2">
            <div className="flex items-center gap-2">
              <select
                className="input flex-1"
                value={r.matKey}
                onChange={e => updateItem(r.id, { matKey: e.target.value })}
              >
                {Object.entries(MATERIAL_CATALOG).map(([k, m]) => (
                  <option key={k} value={k}>{m.name}</option>
                ))}
              </select>
              {r.isCustom && (
                <span className="text-[10px] bg-brand-100 text-brand-700 font-bold px-2 py-1 rounded-full flex-shrink-0">
                  ספק שלי
                </span>
              )}
              <button
                onClick={() => removeItem(r.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                aria-label="מחק"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="label text-xs">כמות</label>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  step="0.5"
                  value={r.qty}
                  onChange={e => updateItem(r.id, { qty: e.target.value })}
                />
                <div className="text-[10px] text-gray-500 mt-0.5">{r.mat.niceUnit}</div>
              </div>
              <div>
                <label className="label text-xs">מחיר ליחידה</label>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={r.price}
                  onChange={e => setOverride(r.matKey, { price: e.target.value })}
                />
              </div>
              <div>
                <label className="label text-xs">תוספת %</label>
                <input
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min="0"
                  value={r.markupPct}
                  onChange={e => setOverride(r.matKey, { markupPct: e.target.value })}
                />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-2 text-sm grid grid-cols-3 gap-1 text-center">
              <div>
                <div className="text-xs text-gray-500">עלות</div>
                <div className="font-semibold text-gray-700">{nis(r.cost)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">ללקוח</div>
                <div className="font-semibold text-brand-700">{nis(r.sale)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">רווח</div>
                <div className="font-semibold text-green-600">{nis(r.profit)}</div>
              </div>
            </div>
          </div>
        ))}

        <button onClick={addItem} className="w-full card border-2 border-dashed border-gray-200 text-brand-600 font-semibold hover:bg-brand-50">
          <Plus className="w-5 h-5 inline" /> הוסף חומר
        </button>
      </div>

      <div className="card bg-gray-900 text-white space-y-2">
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <TrendingUp className="w-4 h-4" />
          סיכום
        </div>
        <Row label="סה״כ עלות לי" value={nis(totals.cost)} />
        <Row label="סה״כ ללקוח" value={nis(totals.sale)} strong />
        <Row label="רווח מהחומרים" value={nis(totals.profit)} positive />
        {totals.cost > 0 && (
          <div className="text-xs text-white/60 text-center pt-1">
            מרווח כולל: {num((totals.profit / totals.cost) * 100)}%
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, strong, positive }) {
  return (
    <div className="flex items-center justify-between">
      <span className={['text-sm', strong ? 'font-semibold' : 'opacity-80'].join(' ')}>{label}</span>
      <span className={[
        strong ? 'text-xl font-bold' : 'font-semibold',
        positive ? 'text-green-400' : '',
      ].join(' ')}>{value}</span>
    </div>
  )
}
