import { useState, useRef } from 'react'
import { Plus, Trash2, Receipt, Camera, X, Image as ImageIcon } from 'lucide-react'
import { nis, dateShort } from '../utils/format'
import { fileToCompressedDataURL } from '../utils/image'

// הוצאות פרויקט — סכום + תיאור + קבלה (תמונה)
export default function ExpensesPanel({ expenses, revenue, onChange }) {
  const [adding, setAdding] = useState(false)
  const [preview, setPreview] = useState(null)
  const list = expenses || []

  const total = list.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const profit = (revenue || 0) - total

  function add(expense) {
    onChange([...list, expense])
    setAdding(false)
  }
  function remove(id) {
    if (!window.confirm('למחוק את ההוצאה?')) return
    onChange(list.filter(e => e.id !== id))
  }

  return (
    <div className="space-y-3">
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Receipt className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold flex-1">הוצאות הפרוייקט</h3>
          <span className="text-xs text-gray-500">{list.length}</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3 text-center">
          <Stat label="הכנסות" value={nis(revenue || 0)} tone="brand" />
          <Stat label="הוצאות" value={nis(total)} tone="red" />
          <Stat label="רווח" value={nis(profit)} tone={profit >= 0 ? 'green' : 'red'} />
        </div>

        {list.length === 0 ? (
          <div className="text-center text-gray-500 py-4 text-sm">
            אין הוצאות עדיין. הוסף קבלות מהשטח לחישוב רווחיות אמיתי.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {list.map(e => (
              <div key={e.id} className="py-2.5 flex items-start gap-2">
                {e.photo ? (
                  <button onClick={() => setPreview(e.photo)} className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img src={e.photo} alt="" className="w-full h-full object-cover" />
                  </button>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 grid place-items-center flex-shrink-0">
                    <Receipt className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 text-sm">{e.description}</div>
                  <div className="text-xs text-gray-500">{dateShort(e.date)}</div>
                </div>
                <div className="text-left">
                  <div className="font-bold text-red-600">-{nis(e.amount)}</div>
                  <button
                    onClick={() => remove(e.id)}
                    className="text-gray-400 hover:text-red-500"
                    aria-label="מחק"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setAdding(true)}
          className="w-full mt-3 btn-primary text-sm"
        >
          <Plus className="w-5 h-5" />
          הוסף הוצאה
        </button>
      </div>

      {adding && <AddExpenseSheet onAdd={add} onClose={() => setAdding(false)} />}

      {preview && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <button className="absolute top-4 left-4 text-white p-2 bg-white/10 rounded-full" onClick={() => setPreview(null)} aria-label="סגור">
            <X className="w-6 h-6" />
          </button>
          <img src={preview} alt="" className="max-w-full max-h-full object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

function Stat({ label, value, tone }) {
  const cls = {
    brand: 'bg-brand-50 text-brand-700',
    red:   'bg-red-50 text-red-700',
    green: 'bg-green-50 text-green-700',
  }[tone] || 'bg-gray-50 text-gray-700'
  return (
    <div className={`rounded-xl p-2 ${cls}`}>
      <div className="text-[10px] opacity-80">{label}</div>
      <div className="font-bold text-sm leading-tight">{value}</div>
    </div>
  )
}

function AddExpenseSheet({ onAdd, onClose }) {
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [photo, setPhoto] = useState(null)
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef(null)

  async function pickPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      const data = await fileToCompressedDataURL(file)
      setPhoto(data)
    } catch (err) {
      console.error(err)
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  function submit() {
    const amt = Number(amount)
    if (!amt || !description.trim()) return
    onAdd({
      id: 'e_' + Date.now(),
      amount: amt,
      description: description.trim(),
      photo,
      date: Date.now(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <button onClick={onClose} className="p-2 -m-2 rounded-lg hover:bg-gray-100" aria-label="סגור">
            <X className="w-6 h-6" />
          </button>
          <h2 className="flex-1 font-bold">הוצאה חדשה</h2>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="label">סכום (₪)</label>
            <input
              className="input text-2xl font-bold text-center"
              type="number"
              inputMode="decimal"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              autoFocus
            />
          </div>
          <div>
            <label className="label">תיאור</label>
            <input
              className="input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="לדוגמה: קרמיקה מבית-וגן"
            />
          </div>

          <div>
            <label className="label">קבלה (אופציונלי)</label>
            <input ref={fileInputRef} type="file" accept="image/*" capture="environment" onChange={pickPhoto} className="hidden" />
            {photo ? (
              <div className="relative">
                <img src={photo} alt="קבלה" className="w-full max-h-48 object-contain bg-gray-50 rounded-xl border border-gray-200" />
                <button
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow"
                  aria-label="הסר"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={busy}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                <Camera className="w-6 h-6 mx-auto" />
                <div className="text-sm font-semibold mt-1">{busy ? 'מעלה...' : 'צלם קבלה'}</div>
              </button>
            )}
          </div>

          <button
            className="btn-primary w-full"
            onClick={submit}
            disabled={!amount || !description.trim()}
          >
            שמור הוצאה
          </button>
        </div>
      </div>
    </div>
  )
}
