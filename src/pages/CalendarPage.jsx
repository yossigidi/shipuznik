import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, AlertTriangle, Calendar as CalIcon } from 'lucide-react'
import { listProjects } from '../utils/storage'
import { nis } from '../utils/format'

const MONTHS_HE = ['ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']
const DAYS_HE   = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']
const COLORS = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-cyan-500', 'bg-rose-500']

// יומן חודשי — פרוייקטים פעילים על ציר זמן
export default function CalendarPage({ onNavigate }) {
  const [projects, setProjects] = useState([])
  const [cursor, setCursor] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })

  useEffect(() => {
    setProjects(listProjects())
  }, [])

  // פרוייקטים עם תאריך התחלה
  const scheduled = useMemo(() => {
    return projects
      .filter(p => p.startDate)
      .map((p, i) => {
        const start = new Date(p.startDate)
        const end = new Date(p.startDate + (p.estimatedDays || 1) * 86400_000)
        return { ...p, _start: start, _end: end, color: COLORS[i % COLORS.length] }
      })
  }, [projects])

  // בניית רשת היומן
  const grid = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor])

  function prev() {
    setCursor(c => c.month === 0 ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 })
  }
  function next() {
    setCursor(c => c.month === 11 ? { year: c.year + 1, month: 0 } : { ...c, month: c.month + 1 })
  }
  function today() {
    const d = new Date()
    setCursor({ year: d.getFullYear(), month: d.getMonth() })
  }

  // מציאת הפרוייקטים שחופפים ליום מסוים
  function projectsOnDay(date) {
    return scheduled.filter(p => {
      const ts = date.getTime()
      return ts >= startOfDay(p._start).getTime() && ts <= startOfDay(p._end).getTime()
    })
  }

  // פרוייקטים פעילים השבוע (לתצוגת רשימה)
  const upcoming = useMemo(() => {
    const now = Date.now()
    return scheduled
      .filter(p => p._end.getTime() >= now - 86400_000)
      .sort((a, b) => a._start - b._start)
      .slice(0, 5)
  }, [scheduled])

  // ימים עם 3+ פרוייקטים — אזהרת עומס
  const overloaded = useMemo(() => {
    const seen = new Map()
    for (const p of scheduled) {
      let d = startOfDay(p._start).getTime()
      const endTs = startOfDay(p._end).getTime()
      while (d <= endTs) {
        seen.set(d, (seen.get(d) || 0) + 1)
        d += 86400_000
      }
    }
    return Array.from(seen.entries()).filter(([_, n]) => n >= 3).map(([ts]) => new Date(ts))
  }, [scheduled])

  if (projects.length === 0) {
    return (
      <div className="card text-center py-10">
        <CalIcon className="w-12 h-12 mx-auto text-gray-300" />
        <div className="font-bold text-gray-900 mt-3">אין פרוייקטים ביומן</div>
        <div className="text-sm text-gray-500 mt-1">קבע תאריך התחלה לפרוייקט וצפה כאן בעומס שלך</div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={prev} className="p-2 -m-2 rounded-lg hover:bg-gray-100" aria-label="חודש קודם">
            <ChevronRight className="w-5 h-5" />
          </button>
          <button onClick={today} className="flex-1 text-center font-bold">
            {MONTHS_HE[cursor.month]} {cursor.year}
          </button>
          <button onClick={next} className="p-2 -m-2 rounded-lg hover:bg-gray-100" aria-label="חודש הבא">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
          {DAYS_HE.map(d => <div key={d} className="font-semibold">{d}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell, i) => {
            const projs = cell ? projectsOnDay(cell.date) : []
            const isToday = cell && isSameDay(cell.date, new Date())
            const isOverloaded = projs.length >= 3
            return (
              <div
                key={i}
                className={[
                  'aspect-square rounded-lg p-0.5 flex flex-col text-[10px] relative',
                  !cell && 'opacity-0',
                  isToday && 'ring-2 ring-brand-500',
                  isOverloaded ? 'bg-red-50' : projs.length > 0 ? 'bg-brand-50' : 'bg-gray-50',
                ].filter(Boolean).join(' ')}
              >
                {cell && (
                  <>
                    <span className={['font-semibold leading-tight', isToday ? 'text-brand-700' : 'text-gray-700'].join(' ')}>
                      {cell.date.getDate()}
                    </span>
                    <div className="flex gap-0.5 mt-auto flex-wrap">
                      {projs.slice(0, 3).map(p => (
                        <span key={p.id} className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                      ))}
                      {projs.length > 3 && <span className="text-[8px] text-red-600 font-bold">+{projs.length - 3}</span>}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {overloaded.length > 0 && (
        <div className="card bg-red-50 border border-red-100">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="text-sm">
              <div className="font-bold text-red-900">עומס יומי גבוה</div>
              <div className="text-red-700 mt-0.5">
                ב-{overloaded.length} ימים יש 3 או יותר פרוייקטים פעילים במקביל
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-bold text-gray-900 mb-2 px-1">פרוייקטים פעילים וקרובים</h3>
        <div className="space-y-2">
          {upcoming.length === 0 && (
            <div className="card text-center text-sm text-gray-500 py-4">
              אין פרוייקטים מתוזמנים. קבע תאריכים בעמוד הפרוייקט.
            </div>
          )}
          {upcoming.map(p => (
            <button
              key={p.id}
              onClick={() => onNavigate('project', { id: p.id })}
              className="w-full card text-right hover:bg-gray-50 flex items-center gap-3"
            >
              <div className={`w-2 h-12 rounded-full ${p.color}`} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-gray-900 truncate">{p.clientName}</div>
                <div className="text-xs text-gray-500 truncate">{p.title}</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {formatDate(p._start)} → {formatDate(p._end)} ({p.estimatedDays || 1} ימים)
                </div>
              </div>
              <div className="text-left text-sm font-bold text-gray-900">{nis(p.total || 0)}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function buildMonthGrid(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startWeekday = firstDay.getDay() // 0=Sunday in JS, matches Hebrew week (א=ראשון)
  const days = lastDay.getDate()
  const cells = []
  for (let i = 0; i < startWeekday; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push({ date: new Date(year, month, d) })
  while (cells.length % 7 !== 0) cells.push(null)
  return cells
}
function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function formatDate(d) {
  return d.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' })
}
