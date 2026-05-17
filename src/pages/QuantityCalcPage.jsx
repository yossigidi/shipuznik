import { useState, useMemo } from 'react'
import { Ruler, Share2, ChevronDown } from 'lucide-react'
import { ROOM_RULES, MATERIAL_CATALOG, MATERIAL_CATEGORIES } from '../data/materials'
import { num } from '../utils/format'

export default function QuantityCalcPage() {
  const [roomKey, setRoomKey] = useState('bathroom')
  const [length, setLength] = useState(3)
  const [width, setWidth] = useState(2)
  const [wallHeight, setWallHeight] = useState(2.5)
  const [openCats, setOpenCats] = useState(() => new Set(MATERIAL_CATEGORIES.map(c => c.id)))

  const room = ROOM_RULES[roomKey]

  const results = useMemo(() => {
    if (!room) return []
    const raw = room.calc({
      length: Number(length) || 0,
      width: Number(width) || 0,
      wallHeight: Number(wallHeight) || 0,
    })
    return raw.map(r => {
      const mat = MATERIAL_CATALOG[r.key]
      if (!mat) return null
      const withWaste = r.qty * (1 + (r.waste || 0) / 100)
      const isWhole = ['bag', 'unit'].includes(mat.unit)
      const qty = isWhole ? Math.ceil(withWaste) : +(withWaste.toFixed(2))
      return { ...r, mat, qty }
    }).filter(Boolean)
  }, [room, length, width, wallHeight])

  // קיבוץ לפי קטגוריה
  const grouped = useMemo(() => {
    const map = new Map()
    for (const cat of MATERIAL_CATEGORIES) map.set(cat.id, [])
    for (const r of results) {
      const list = map.get(r.mat.categoryId)
      if (list) list.push(r)
    }
    return MATERIAL_CATEGORIES.map(cat => ({ ...cat, items: map.get(cat.id) || [] })).filter(g => g.items.length > 0)
  }, [results])

  function toggleCat(id) {
    setOpenCats(s => {
      const next = new Set(s)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function share() {
    const lines = [
      `רשימת קניות — ${room.name}`,
      `${length}×${width} מ׳, גובה ${wallHeight} מ׳`,
      '',
      ...grouped.flatMap(g => [
        `*${g.name}*`,
        ...g.items.map(r => `• ${r.label}: ${num(r.qty)} ${r.mat.niceUnit}`),
        '',
      ]),
    ]
    const text = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="card">
        <label className="label">סוג חדר</label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ROOM_RULES).map(([key, r]) => (
            <button
              key={key}
              onClick={() => setRoomKey(key)}
              className={[
                'p-3 rounded-xl border-2 text-center transition-colors',
                roomKey === key ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white',
              ].join(' ')}
            >
              <div className="text-2xl">{r.icon}</div>
              <div className="text-sm font-semibold mt-1">{r.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Ruler className="w-5 h-5 text-brand-500" />
          <h3 className="font-bold">מידות החדר</h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="label">אורך (מ׳)</label>
            <input className="input" type="number" inputMode="decimal" min="0" step="0.1" value={length} onChange={e => setLength(e.target.value)} />
          </div>
          <div>
            <label className="label">רוחב (מ׳)</label>
            <input className="input" type="number" inputMode="decimal" min="0" step="0.1" value={width} onChange={e => setWidth(e.target.value)} />
          </div>
          <div>
            <label className="label">גובה (מ׳)</label>
            <input className="input" type="number" inputMode="decimal" min="0" step="0.1" value={wallHeight} onChange={e => setWallHeight(e.target.value)} />
          </div>
        </div>
        <div className="mt-3 text-sm text-gray-600">
          רצפה: <b>{num(length * width)} מ"ר</b> · היקף: <b>{num(2 * (Number(length) + Number(width)))} מ׳</b>
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2 px-1">רשימת חומרים מלאה</h3>
        <div className="space-y-2">
          {grouped.map(g => {
            const isOpen = openCats.has(g.id)
            return (
              <div key={g.id} className="card overflow-hidden p-0">
                <button
                  onClick={() => toggleCat(g.id)}
                  className="w-full flex items-center gap-2 p-3 hover:bg-gray-50"
                >
                  <span className="text-xl">{g.icon}</span>
                  <span className="font-bold flex-1 text-right">{g.name}</span>
                  <span className="text-xs text-gray-500">{g.items.length}</span>
                  <ChevronDown className={['w-4 h-4 text-gray-400 transition-transform', isOpen ? '' : '-rotate-90'].join(' ')} />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-50">
                    {g.items.map(r => (
                      <div key={r.key + r.label} className="flex items-center justify-between px-3 py-2">
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-gray-900 text-sm">{r.label}</div>
                          <div className="text-xs text-gray-500">
                            {r.mat.name}
                            {r.waste > 0 && <span> · +{r.waste}%</span>}
                          </div>
                        </div>
                        <div className="text-left ms-2">
                          <div className="font-bold text-gray-900">{num(r.qty)}</div>
                          <div className="text-[10px] text-gray-500">{r.mat.niceUnit}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <button className="btn-primary w-full" onClick={share}>
        <Share2 className="w-5 h-5" />
        שלח רשימה בוואטסאפ
      </button>
    </div>
  )
}
