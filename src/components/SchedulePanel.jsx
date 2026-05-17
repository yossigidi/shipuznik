import { useState } from 'react'
import { Calendar, Pencil } from 'lucide-react'

// פאנל תזמון — תאריך התחלה לפרוייקט (סוף מחושב לפי estimatedDays)
export default function SchedulePanel({ startDate, estimatedDays, onChange }) {
  const [editing, setEditing] = useState(!startDate)
  const [date, setDate] = useState(() => toInputDate(startDate || Date.now()))

  function save() {
    if (!date) return
    onChange(new Date(date + 'T08:00:00').getTime())
    setEditing(false)
  }

  const endDate = startDate && estimatedDays
    ? new Date(startDate + estimatedDays * 86400_000)
    : null

  return (
    <div className="card flex items-start gap-3">
      <Calendar className="w-5 h-5 text-brand-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-bold flex-1">תאריך התחלה</h3>
          {!editing && startDate && (
            <button onClick={() => setEditing(true)} className="text-sm text-brand-600 font-semibold flex items-center gap-1">
              <Pencil className="w-3 h-3" /> ערוך
            </button>
          )}
        </div>

        {editing ? (
          <div className="flex gap-2 mt-2">
            <input
              type="date"
              className="input flex-1"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
            <button className="btn-primary px-4" onClick={save}>שמור</button>
          </div>
        ) : startDate ? (
          <div className="mt-1 text-sm text-gray-700">
            <div>התחלה: <b>{formatHe(new Date(startDate))}</b></div>
            {endDate && (
              <div className="text-gray-500 text-xs mt-0.5">
                סיום צפוי: {formatHe(endDate)} ({estimatedDays} ימים)
              </div>
            )}
          </div>
        ) : (
          <div className="text-sm text-gray-500 mt-1">
            הוסף תאריך כדי שיופיע ביומן
          </div>
        )}
      </div>
    </div>
  )
}

function toInputDate(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${dd}`
}
function formatHe(d) {
  return d.toLocaleDateString('he-IL', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
}
