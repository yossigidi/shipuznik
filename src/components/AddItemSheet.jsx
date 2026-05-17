import { useState } from 'react'
import { X, ChevronLeft, Plus, Search } from 'lucide-react'
import { WORK_CATEGORIES, UNIT_LABELS } from '../data/workItems'
import { nis } from '../utils/format'

// גליון בחירת פריט עבודה — קטגוריה → פריט → קביעת כמות+מחיר
export default function AddItemSheet({ onClose, onAdd }) {
  const [step, setStep] = useState('categories') // categories | items | edit
  const [category, setCategory] = useState(null)
  const [item, setItem] = useState(null)
  const [search, setSearch] = useState('')
  const [qty, setQty] = useState(1)
  const [price, setPrice] = useState(0)
  const [note, setNote] = useState('')

  function pickCategory(c) {
    setCategory(c)
    setStep('items')
  }
  function pickItem(i) {
    setItem(i)
    setQty(1)
    setPrice(i.defaultPrice)
    setNote('')
    setStep('edit')
  }
  function addCustom() {
    setItem({ id: 'custom_' + Date.now(), name: '', unit: 'unit', defaultPrice: 0 })
    setQty(1)
    setPrice(0)
    setNote('')
    setStep('edit')
  }
  function commit() {
    if (!item.name.trim()) return
    onAdd({
      id: item.id + '_' + Date.now(),
      name: item.name.trim(),
      unit: item.unit,
      qty: Number(qty) || 0,
      price: Number(price) || 0,
      note: note.trim(),
    })
  }

  const filtered = search.trim()
    ? WORK_CATEGORIES.flatMap(c => c.items.map(i => ({ ...i, categoryName: c.name })))
      .filter(i => i.name.includes(search.trim()))
    : null

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <button
            onClick={step === 'categories' ? onClose : () => setStep(step === 'edit' ? 'items' : 'categories')}
            className="p-2 -m-2 rounded-lg hover:bg-gray-100"
            aria-label="חזרה"
          >
            {step === 'categories' ? <X className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
          <h2 className="flex-1 font-bold text-gray-900">
            {step === 'categories' && 'בחר קטגוריה'}
            {step === 'items' && (category?.name || 'בחר פריט')}
            {step === 'edit' && 'פרטי הפריט'}
          </h2>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {step === 'categories' && (
            <>
              <div className="relative mb-3">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="input pr-10"
                  placeholder="חיפוש פריט..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {filtered ? (
                <div className="space-y-2">
                  {filtered.length === 0 && (
                    <div className="text-center text-gray-500 py-4">לא נמצאו תוצאות</div>
                  )}
                  {filtered.map(i => (
                    <button
                      key={i.id}
                      onClick={() => pickItem(i)}
                      className="w-full card text-right flex items-center justify-between hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-semibold">{i.name}</div>
                        <div className="text-xs text-gray-500">{i.categoryName} · {UNIT_LABELS[i.unit]}</div>
                      </div>
                      <div className="text-sm text-gray-600">{nis(i.defaultPrice)}</div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {WORK_CATEGORIES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => pickCategory(c)}
                      className="card text-center hover:bg-gray-50"
                    >
                      <div className="text-3xl mb-1">{c.icon}</div>
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-xs text-gray-500">{c.items.length} פריטים</div>
                    </button>
                  ))}
                  <button
                    onClick={addCustom}
                    className="card text-center hover:bg-gray-50 border-2 border-dashed border-gray-200 col-span-2"
                  >
                    <Plus className="w-6 h-6 mx-auto text-brand-500" />
                    <div className="font-semibold mt-1">פריט מותאם אישית</div>
                  </button>
                </div>
              )}
            </>
          )}

          {step === 'items' && category && (
            <div className="space-y-2">
              {category.items.map(i => (
                <button
                  key={i.id}
                  onClick={() => pickItem(i)}
                  className="w-full card text-right flex items-center justify-between hover:bg-gray-50"
                >
                  <div>
                    <div className="font-semibold">{i.name}</div>
                    <div className="text-xs text-gray-500">{UNIT_LABELS[i.unit]}</div>
                  </div>
                  <div className="text-sm text-gray-600">{nis(i.defaultPrice)}</div>
                </button>
              ))}
              <button
                onClick={addCustom}
                className="w-full card text-center border-2 border-dashed border-gray-200 hover:bg-gray-50"
              >
                <Plus className="w-5 h-5 inline" /> פריט אחר
              </button>
            </div>
          )}

          {step === 'edit' && item && (
            <div className="space-y-3">
              <div>
                <label className="label">שם הפריט</label>
                <input
                  className="input"
                  value={item.name}
                  onChange={e => setItem({ ...item, name: e.target.value })}
                  placeholder="תיאור העבודה"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-1">
                  <label className="label">כמות</label>
                  <input
                    className="input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    step="0.1"
                    value={qty}
                    onChange={e => setQty(e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="label">יחידה</label>
                  <select
                    className="input"
                    value={item.unit}
                    onChange={e => setItem({ ...item, unit: e.target.value })}
                  >
                    {Object.entries(UNIT_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="label">מחיר ליח'</label>
                  <input
                    className="input"
                    type="number"
                    inputMode="decimal"
                    min="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="label">הערה (לא חובה)</label>
                <input
                  className="input"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="לדוגמה: לא כולל פירוק"
                />
              </div>

              <div className="card bg-brand-50 border border-brand-100 flex items-center justify-between">
                <span className="text-gray-700">סה״כ פריט:</span>
                <span className="text-xl font-bold text-brand-700">{nis((Number(qty) || 0) * (Number(price) || 0))}</span>
              </div>

              <button className="btn-primary w-full" onClick={commit} disabled={!item.name.trim()}>
                הוסף להצעה
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
