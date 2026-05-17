import { useEffect, useState } from 'react'
import { Plus, ChevronLeft, Search } from 'lucide-react'
import { listProjects } from '../utils/storage'
import { nis, dateShort } from '../utils/format'

export default function ProjectsListPage({ onNavigate }) {
  const [projects, setProjects] = useState([])
  const [q, setQ] = useState('')

  useEffect(() => {
    setProjects(listProjects().sort((a, b) => b.updatedAt - a.updatedAt))
  }, [])

  const filtered = projects.filter(p => {
    if (!q.trim()) return true
    const s = q.trim().toLowerCase()
    return (p.clientName || '').toLowerCase().includes(s)
      || (p.title || '').toLowerCase().includes(s)
      || (p.address || '').toLowerCase().includes(s)
  })

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          className="input pr-10"
          placeholder="חיפוש לפי שם / כתובת"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      <button className="btn-primary w-full" onClick={() => onNavigate('newProject')}>
        <Plus className="w-5 h-5" />
        פרוייקט חדש
      </button>

      {filtered.length === 0 && (
        <div className="card text-center py-8 text-gray-500">
          {projects.length === 0 ? 'עוד לא יצרת פרוייקטים' : 'לא נמצאו תוצאות'}
        </div>
      )}

      {filtered.map(p => (
        <button
          key={p.id}
          onClick={() => onNavigate('project', { id: p.id })}
          className="w-full card flex items-center justify-between text-right hover:bg-gray-50"
        >
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-gray-900 truncate">{p.clientName || 'ללא שם'}</div>
            <div className="text-sm text-gray-500 truncate">{p.title}</div>
            {p.address && <div className="text-xs text-gray-400 truncate">{p.address}</div>}
            <div className="text-xs text-gray-400 mt-1">עודכן {dateShort(p.updatedAt)}</div>
          </div>
          <div className="text-left ms-2 flex items-center gap-1">
            <div>
              <div className="font-bold text-gray-900">{nis(p.total || 0)}</div>
              <StatusBadge status={p.status} />
            </div>
            <ChevronLeft className="w-4 h-4 text-gray-400" />
          </div>
        </button>
      ))}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    draft:    { label: 'טיוטה',  cls: 'bg-gray-100 text-gray-600' },
    sent:     { label: 'נשלח',   cls: 'bg-blue-100 text-blue-700' },
    approved: { label: 'מאושר',  cls: 'bg-green-100 text-green-700' },
    done:     { label: 'הושלם',  cls: 'bg-brand-100 text-brand-700' },
  }
  const s = map[status] || map.draft
  return <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${s.cls}`}>{s.label}</span>
}
