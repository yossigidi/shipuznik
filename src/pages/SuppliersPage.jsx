import { useEffect, useState, useMemo } from 'react'
import { Truck, Search, RotateCcw, Check } from 'lucide-react'
import { MATERIAL_CATALOG, MATERIAL_CATEGORIES } from '../data/materials'
import { getSupplierPrices, saveSupplierPrice } from '../utils/storage'
import { nis, dateShort } from '../utils/format'

// ספריית הספקים האישית — עריכת מחיר קנייה + אחוז רווח לכל חומר
export default function SuppliersPage() {
  const [prices, setPrices] = useState({})
  const [q, setQ] = useState('')
  const [openCat, setOpenCat] = useState(MATERIAL_CATEGORIES[0]?.id)

  useEffect(() => {
    setPrices(getSupplierPrices())
  }, [])

  function update(matKey, patch) {
    if (patch === null) {
      const next = { ...prices }
      delete next[matKey]
      saveSupplierPrice(matKey, null)
      setPrices(next)
      return
    }
    const merged = { ...(prices[matKey] || {}), ...patch, updatedAt: Date.now() }
    saveSupplierPrice(matKey, merged)
    setPrices(p => ({ ...p, [matKey]: merged }))
  }

  const allMats = useMemo(() => {
    return Object.entries(MATERIAL_CATALOG).map(([key, mat]) => ({ key, ...mat }))
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return allMats
    return allMats.filter(m =>
      m.name.toLowerCase().includes(s) ||
      (prices[m.key]?.supplierName || '').toLowerCase().includes(s)
    )
  }, [allMats, q, prices])

  const grouped = useMemo(() => {
    return MATERIAL_CATEGORIES.map(cat => ({
      ...cat,
      items: filtered.filter(m => m.categoryId === cat.id),
    })).filter(g => g.items.length > 0)
  }, [filtered])

  const customCount = Object.keys(prices).length

  return (
    <div className="space-y-3">
      <div className="card bg-brand-50 border border-brand-100 flex items-center gap-3">
        <Truck className="w-6 h-6 text-brand-600 flex-shrink-0" />
        <div className="text-sm text-brand-900 flex-1">
          <div className="font-semibold">המחירים שלך</div>
          <div className="text-xs text-brand-700">
            {customCount > 0 ? `${customCount} חומרים מותאמים. ` : 'אף חומר לא הותאם עדיין. '}
            המחירים האלה ישמשו בחישובי עלויות.
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          className="input pr-10"
          placeholder="חיפוש חומר / ספק"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {grouped.map(g => (
        <div key={g.id} className="card p-0 overflow-hidden">
          <button
            onClick={() => setOpenCat(openCat === g.id ? null : g.id)}
            className="w-full flex items-center gap-2 p-3 hover:bg-gray-50"
          >
            <span className="text-xl">{g.icon}</span>
            <span className="font-bold flex-1 text-right">{g.name}</span>
            <span className="text-xs text-gray-500">{g.items.filter(m => prices[m.key]).length}/{g.items.length}</span>
          </button>
          {openCat === g.id && (
            <div className="border-t border-gray-100 divide-y divide-gray-50">
              {g.items.map(mat => (
                <SupplierRow
                  key={mat.key}
                  mat={mat}
                  saved={prices[mat.key]}
                  onSave={(patch) => update(mat.key, patch)}
                  onReset={() => update(mat.key, null)}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function SupplierRow({ mat, saved, onSave, onReset }) {
  const [price, setPrice] = useState(saved?.price ?? mat.price)
  const [markupPct, setMarkupPct] = useState(saved?.markupPct ?? mat.markupPct)
  const [supplierName, setSupplierName] = useState(saved?.supplierName || '')
  const [dirty, setDirty] = useState(false)

  function commit() {
    onSave({ price: Number(price), markupPct: Number(markupPct), supplierName: supplierName.trim() })
    setDirty(false)
  }

  const isCustom = !!saved
  const hasChanges = dirty ||
    Number(price) !== (saved?.price ?? mat.price) ||
    Number(markupPct) !== (saved?.markupPct ?? mat.markupPct) ||
    supplierName !== (saved?.supplierName || '')

  return (
    <div className={['p-3', isCustom ? 'bg-brand-50/30' : ''].join(' ')}>
      <div className="flex items-center justify-between mb-2">
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm">{mat.name}</div>
          <div className="text-[10px] text-gray-500">ברירת מחדל: {nis(mat.price)} / {mat.niceUnit} · +{mat.markupPct}%</div>
        </div>
        {isCustom && (
          <button onClick={onReset} className="text-gray-400 hover:text-red-500 p-1" aria-label="אפס לברירת מחדל">
            <RotateCcw className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <div>
          <label className="text-[10px] text-gray-500">מחיר ({mat.niceUnit})</label>
          <input
            className="input py-2"
            type="number"
            inputMode="decimal"
            min="0"
            value={price}
            onChange={e => { setPrice(e.target.value); setDirty(true) }}
          />
        </div>
        <div>
          <label className="text-[10px] text-gray-500">תוספת רווח %</label>
          <input
            className="input py-2"
            type="number"
            inputMode="decimal"
            min="0"
            value={markupPct}
            onChange={e => { setMarkupPct(e.target.value); setDirty(true) }}
          />
        </div>
      </div>

      <div className="flex gap-2">
        <input
          className="input py-2 flex-1"
          placeholder="שם ספק (אופציונלי)"
          value={supplierName}
          onChange={e => { setSupplierName(e.target.value); setDirty(true) }}
        />
        <button
          onClick={commit}
          disabled={!hasChanges}
          className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
        >
          <Check className="w-4 h-4" />
          שמור
        </button>
      </div>

      {saved && (
        <div className="text-[10px] text-gray-500 mt-1.5">
          עודכן {dateShort(saved.updatedAt)}{saved.supplierName ? ` · ${saved.supplierName}` : ''}
        </div>
      )}
    </div>
  )
}
