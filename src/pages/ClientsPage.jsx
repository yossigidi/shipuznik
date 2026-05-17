import { useEffect, useState, useMemo } from 'react'
import { Phone, MapPin, ChevronLeft, Users, Search } from 'lucide-react'
import { listClients } from '../utils/storage'
import { nis, dateShort } from '../utils/format'

export default function ClientsPage({ onNavigate }) {
  const [clients, setClients] = useState([])
  const [q, setQ] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    setClients(listClients())
  }, [])

  const filtered = useMemo(() => {
    if (!q.trim()) return clients
    const s = q.trim().toLowerCase()
    return clients.filter(c =>
      c.clientName.toLowerCase().includes(s) ||
      c.phone.includes(s) ||
      c.address.toLowerCase().includes(s)
    )
  }, [clients, q])

  if (clients.length === 0) {
    return (
      <div className="card text-center py-10">
        <Users className="w-12 h-12 mx-auto text-gray-300" />
        <div className="font-bold text-gray-900 mt-3">עוד אין לקוחות</div>
        <div className="text-sm text-gray-500 mt-1">לקוחות יופיעו אוטומטית כשתיצור פרוייקטים</div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          className="input pr-10"
          placeholder="חיפוש לפי שם / טלפון / כתובת"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filtered.map(c => {
          const isOpen = expanded === c.key
          return (
            <div key={c.key} className="card overflow-hidden p-0">
              <button
                onClick={() => setExpanded(isOpen ? null : c.key)}
                className="w-full p-3 text-right hover:bg-gray-50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-gray-900">{c.clientName}</div>
                    {c.phone && (
                      <div className="text-sm text-gray-600 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3.5 h-3.5" /> {c.phone}
                      </div>
                    )}
                    {c.address && (
                      <div className="text-xs text-gray-500 flex items-center gap-1 truncate mt-0.5">
                        <MapPin className="w-3.5 h-3.5" /> {c.address}
                      </div>
                    )}
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-gray-900">{nis(c.totalRevenue)}</div>
                    <div className="text-xs text-gray-500">{c.projects.length} פרוייקטים</div>
                  </div>
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-gray-100 divide-y divide-gray-50">
                  {c.phone && (
                    <a
                      href={`tel:${c.phone}`}
                      className="flex items-center justify-between px-3 py-2.5 text-brand-600 font-semibold hover:bg-brand-50"
                    >
                      <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> התקשר</span>
                    </a>
                  )}
                  {c.projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => onNavigate('project', { id: p.id })}
                      className="w-full flex items-center justify-between px-3 py-2.5 text-right hover:bg-gray-50"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-sm text-gray-900 truncate">{p.title}</div>
                        <div className="text-xs text-gray-500">{dateShort(p.updatedAt)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="font-bold text-gray-900">{nis(p.total || 0)}</div>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
