import { useState } from 'react'
import { TrendingUp, TrendingDown, Calendar, Pencil } from 'lucide-react'
import { nis, num } from '../utils/format'

// פאנל רווחיות — הכנסות, הוצאות, ימים → רווח יומי + מדד
export default function ProfitabilityPanel({ revenue, expenses, days, onChangeDays }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(days || '')

  const exp = expenses || 0
  const profit = revenue - exp
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0
  const dailyProfit = days > 0 ? profit / days : 0

  // מדד רווחיות — לפי רווח יומי בש"ח
  const verdict = dailyProfit >= 1500
    ? { label: 'רווחי מאוד', color: 'text-green-600 bg-green-50' }
    : dailyProfit >= 800
      ? { label: 'רווחי', color: 'text-brand-700 bg-brand-50' }
      : dailyProfit >= 400
        ? { label: 'בינוני', color: 'text-amber-700 bg-amber-50' }
        : dailyProfit > 0
          ? { label: 'נמוך', color: 'text-orange-700 bg-orange-50' }
          : { label: 'הפסד', color: 'text-red-700 bg-red-50' }

  function saveDays() {
    onChangeDays(Number(draft) || 0)
    setEditing(false)
  }

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        {profit >= 0 ? <TrendingUp className="w-5 h-5 text-green-500" /> : <TrendingDown className="w-5 h-5 text-red-500" />}
        <h3 className="font-bold flex-1">רווחיות</h3>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${verdict.color}`}>{verdict.label}</span>
      </div>

      <div className="space-y-1.5">
        <Row label="הכנסות (הצעה)" value={nis(revenue)} />
        <Row label="הוצאות" value={`-${nis(exp)}`} negative />
        <div className="border-t border-gray-100 pt-1.5">
          <Row label="רווח" value={nis(profit)} bold positive={profit >= 0} />
          {revenue > 0 && (
            <div className="text-xs text-gray-500 text-left mt-0.5">
              שולי רווח: {num(margin)}%
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-700 flex-1">ימי עבודה צפויים</span>
          {!editing && (
            <button onClick={() => { setDraft(days || ''); setEditing(true) }} className="text-sm text-brand-600 font-semibold flex items-center gap-1">
              <Pencil className="w-3 h-3" /> {days ? 'ערוך' : 'הוסף'}
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex gap-2">
            <input
              className="input flex-1"
              type="number"
              inputMode="numeric"
              min="0"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="כמה ימים?"
              autoFocus
            />
            <button className="btn-primary px-4" onClick={saveDays}>שמור</button>
          </div>
        ) : days > 0 ? (
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <div className="text-xs text-gray-500">רווח ליום עבודה</div>
            <div className="text-2xl font-bold text-gray-900">{nis(dailyProfit)}</div>
            <div className="text-xs text-gray-500 mt-1">{days} ימים</div>
          </div>
        ) : (
          <div className="text-xs text-gray-500 text-center py-2">
            הוסף ימים צפויים כדי לראות רווח יומי
          </div>
        )}
      </div>
    </div>
  )
}

function Row({ label, value, bold, positive, negative }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={[
        bold ? 'text-lg font-bold' : 'font-semibold',
        positive ? 'text-green-600' : '',
        negative ? 'text-red-600' : '',
      ].filter(Boolean).join(' ')}>{value}</span>
    </div>
  )
}
