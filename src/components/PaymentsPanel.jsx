import { useEffect, useState } from 'react'
import { Plus, Trash2, Check, X, CircleDollarSign } from 'lucide-react'
import { nis } from '../utils/format'

const DEFAULT_MILESTONES = [
  { id: 'm1', label: 'מקדמה',    pct: 30, paid: false },
  { id: 'm2', label: 'אמצע',     pct: 40, paid: false },
  { id: 'm3', label: 'תשלום סופי', pct: 30, paid: false },
]

// פאנל ניהול תשלומים — מבוסס אחוזים מסה"כ ההצעה
export default function PaymentsPanel({ total, milestones, onChange }) {
  const list = milestones && milestones.length ? milestones : DEFAULT_MILESTONES

  // אם הפרוייקט נטען לראשונה ואין מילסטונים — שמור ברירת מחדל
  useEffect(() => {
    if (!milestones || milestones.length === 0) onChange(DEFAULT_MILESTONES)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function update(id, patch) {
    onChange(list.map(m => (m.id === id ? { ...m, ...patch } : m)))
  }
  function remove(id) {
    onChange(list.filter(m => m.id !== id))
  }
  function add() {
    onChange([...list, { id: 'm_' + Date.now(), label: 'תשלום', pct: 0, paid: false }])
  }

  const totalPct = list.reduce((s, m) => s + (Number(m.pct) || 0), 0)
  const paidAmount = list.reduce((s, m) => s + (m.paid ? (total * (Number(m.pct) || 0) / 100) : 0), 0)
  const remaining = total - paidAmount
  const pctMismatch = Math.abs(totalPct - 100) > 0.5 && list.length > 0

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <CircleDollarSign className="w-5 h-5 text-brand-500" />
        <h3 className="font-bold">תשלומים</h3>
      </div>

      <div className="space-y-2">
        {list.map(m => (
          <MilestoneRow
            key={m.id}
            m={m}
            total={total}
            onChange={(patch) => update(m.id, patch)}
            onRemove={() => remove(m.id)}
          />
        ))}
      </div>

      <button
        onClick={add}
        className="w-full text-sm text-brand-600 font-semibold border border-dashed border-gray-200 rounded-lg py-2 hover:bg-brand-50"
      >
        <Plus className="w-4 h-4 inline" /> שלב תשלום נוסף
      </button>

      {pctMismatch && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5">
          סך האחוזים כרגע {totalPct.toFixed(0)}% (לא 100%) — מומלץ לאזן
        </div>
      )}

      <div className="border-t border-gray-100 pt-3 space-y-1.5">
        <SummaryRow label="סה״כ הצעה" value={nis(total)} />
        <SummaryRow label="התקבל" value={nis(paidAmount)} positive />
        <SummaryRow label="נותר" value={nis(Math.max(0, remaining))} strong />
        <ProgressBar value={total > 0 ? (paidAmount / total) * 100 : 0} />
      </div>
    </div>
  )
}

function MilestoneRow({ m, total, onChange, onRemove }) {
  const [editing, setEditing] = useState(false)
  const amount = total * (Number(m.pct) || 0) / 100

  return (
    <div className={[
      'rounded-xl border p-3 transition-colors',
      m.paid ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200',
    ].join(' ')}>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange({ paid: !m.paid })}
          className={[
            'w-7 h-7 rounded-full grid place-items-center transition-colors flex-shrink-0',
            m.paid ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500',
          ].join(' ')}
          aria-label={m.paid ? 'סמן כלא שולם' : 'סמן כשולם'}
        >
          {m.paid ? <Check className="w-4 h-4" /> : null}
        </button>

        {editing ? (
          <input
            className="flex-1 min-w-0 px-2 py-1 border border-gray-200 rounded-lg text-sm"
            value={m.label}
            onChange={e => onChange({ label: e.target.value })}
            onBlur={() => setEditing(false)}
            autoFocus
          />
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="flex-1 text-right font-semibold text-gray-900 truncate"
          >
            {m.label}
          </button>
        )}

        <input
          className="w-16 px-2 py-1 border border-gray-200 rounded-lg text-sm text-center"
          type="number"
          inputMode="numeric"
          min="0"
          max="100"
          value={m.pct}
          onChange={e => onChange({ pct: e.target.value })}
        />
        <span className="text-xs text-gray-500">%</span>

        <button
          onClick={onRemove}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          aria-label="מחק"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-2 text-left">
        <span className={['font-bold', m.paid ? 'text-green-700' : 'text-gray-900'].join(' ')}>
          {nis(amount)}
        </span>
      </div>
    </div>
  )
}

function SummaryRow({ label, value, positive, strong }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={[
        strong ? 'text-lg font-bold' : 'font-semibold',
        positive ? 'text-green-600' : 'text-gray-900',
      ].join(' ')}>{value}</span>
    </div>
  )
}

function ProgressBar({ value }) {
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className="h-full bg-green-500 transition-all"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}
