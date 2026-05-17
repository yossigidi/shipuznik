import { useState, useMemo } from 'react'
import { Zap, Share2, Ruler, ChevronDown } from 'lucide-react'
import { ROOMS, PACKAGE_LEVELS, PACKAGES } from '../data/packages'
import { ALL_WORK_ITEMS, UNIT_LABELS } from '../data/workItems'
import { ROOM_RULES, MATERIAL_CATALOG, MATERIAL_CATEGORIES } from '../data/materials'
import { nis, num } from '../utils/format'

// גודל "בסיס" לכל חדר — לפי זה משוקללת ההצעה ביחס למידות בפועל
const BASE_SIZES = {
  bathroom:   { length: 3, width: 2, wallHeight: 2.5 }, // 6 m²
  kitchen:    { length: 4, width: 3, wallHeight: 2.5 }, // 12 m²
  bedroom:    { length: 4, width: 3, wallHeight: 2.5 }, // 12 m²
  livingroom: { length: 5, width: 5, wallHeight: 2.5 }, // 25 m²
}

const DEFAULT_DIMS = {
  bathroom:   { length: 3, width: 2, wallHeight: 2.5 },
  kitchen:    { length: 4, width: 3, wallHeight: 2.5 },
  bedroom:    { length: 4, width: 3, wallHeight: 2.5 },
  livingroom: { length: 5, width: 5, wallHeight: 2.5 },
}

export default function QuickQuotePage() {
  const [roomId, setRoomId] = useState('bathroom')
  const [levelId, setLevelId] = useState('partial')
  const [length, setLength] = useState(DEFAULT_DIMS.bathroom.length)
  const [width, setWidth] = useState(DEFAULT_DIMS.bathroom.width)
  const [wallHeight, setWallHeight] = useState(DEFAULT_DIMS.bathroom.wallHeight)
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [showMaterials, setShowMaterials] = useState(false)

  // החלפת חדר מאפסת את המידות לברירת המחדל של אותו חדר
  function pickRoom(id) {
    setRoomId(id)
    const d = DEFAULT_DIMS[id]
    if (d) {
      setLength(d.length)
      setWidth(d.width)
      setWallHeight(d.wallHeight)
    }
  }

  // מקדם שטח מול גודל בסיס — מכפיל את כמויות העבודה בחבילה
  const areaScale = useMemo(() => {
    const base = BASE_SIZES[roomId]
    if (!base) return 1
    const baseArea = base.length * base.width
    const userArea = (Number(length) || 0) * (Number(width) || 0)
    if (baseArea === 0) return 1
    return userArea / baseArea
  }, [roomId, length, width])

  // פריטי עבודה — כמויות משוקללות לפי מקדם השטח
  const workItems = useMemo(() => {
    const list = PACKAGES[roomId]?.[levelId] || []
    return list.map(p => {
      const it = ALL_WORK_ITEMS.find(i => i.id === p.itemId)
      if (!it) return null
      const qty = +(p.qty * areaScale).toFixed(1)
      return { item: it, qty }
    }).filter(Boolean)
  }, [roomId, levelId, areaScale])

  const workTotal = useMemo(
    () => workItems.reduce((s, { item, qty }) => s + qty * item.defaultPrice, 0),
    [workItems]
  )

  // חומרים — מחושב מ-ROOM_RULES לפי המידות בפועל
  const materials = useMemo(() => {
    const rule = ROOM_RULES[roomId]
    if (!rule) return []
    const raw = rule.calc({
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
      const matCost = qty * mat.price
      return { ...r, mat, qty, matCost }
    }).filter(Boolean)
  }, [roomId, length, width, wallHeight])

  // קיבוץ חומרים לפי קטגוריה
  const groupedMaterials = useMemo(() => {
    const map = new Map()
    for (const cat of MATERIAL_CATEGORIES) map.set(cat.id, [])
    for (const m of materials) {
      const list = map.get(m.mat.categoryId)
      if (list) list.push(m)
    }
    return MATERIAL_CATEGORIES.map(cat => ({ ...cat, items: map.get(cat.id) || [] })).filter(g => g.items.length > 0)
  }, [materials])

  const materialsCost = useMemo(() => materials.reduce((s, m) => s + m.matCost, 0), [materials])

  // המחיר ללקוח = עבודה + חומרים. מעוגל לקרוב ל-100 מטה (להציג מספר עגול)
  const totalEstimate = workTotal + materialsCost
  const rounded = Math.floor(totalEstimate / 100) * 100

  function share() {
    const room = ROOMS.find(r => r.id === roomId)
    const level = PACKAGE_LEVELS.find(l => l.id === levelId)
    const lines = [
      clientName ? `הצעת מחיר עבור ${clientName}` : 'הצעת מחיר ראשונית',
      `${room?.name} ${length}×${width} מ׳ (${num(length * width)} מ"ר) — שיפוץ ${level?.name}`,
      '',
      'עבודות עיקריות:',
      ...workItems.slice(0, 8).map(({ item, qty }) => `• ${item.name} (${qty} ${UNIT_LABELS[item.unit]})`),
      workItems.length > 8 ? `• ועוד ${workItems.length - 8} פריטים...` : '',
      '',
      'חומרים כלולים:',
      ...groupedMaterials.map(g => `• ${g.name} (${g.items.length} פריטים)`),
      '',
      `מחיר משוער: ${nis(rounded)}`,
      '',
      'המחיר הסופי ייקבע לאחר ביקור באתר.',
    ].filter(Boolean)
    const text = encodeURIComponent(lines.join('\n'))
    const cleanPhone = phone.replace(/[^\d]/g, '').replace(/^0/, '972')
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl p-4 flex items-center gap-3 shadow-soft">
        <div className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center">
          <Zap className="w-6 h-6" />
        </div>
        <div>
          <div className="font-bold">הצעה מהירה</div>
          <div className="text-xs opacity-90">חדר + מידות + רמה → הצעה מדויקת לוואטסאפ</div>
        </div>
      </div>

      <div>
        <label className="label">סוג חדר</label>
        <div className="grid grid-cols-2 gap-2">
          {ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => pickRoom(r.id)}
              className={[
                'p-3 rounded-xl border-2 text-center transition-colors',
                roomId === r.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white',
              ].join(' ')}
            >
              <div className="text-2xl">{r.icon}</div>
              <div className="text-sm font-semibold mt-1">{r.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">רמת השיפוץ</label>
        <div className="grid grid-cols-3 gap-2">
          {PACKAGE_LEVELS.map(l => (
            <button
              key={l.id}
              onClick={() => setLevelId(l.id)}
              className={[
                'p-3 rounded-xl border-2 text-center transition-colors',
                levelId === l.id ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white',
              ].join(' ')}
            >
              <div className="text-2xl">{l.icon}</div>
              <div className="text-xs font-semibold mt-0.5">{l.name}</div>
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
            <label className="label text-xs">אורך (מ')</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={length}
              onChange={e => setLength(e.target.value)}
            />
          </div>
          <div>
            <label className="label text-xs">רוחב (מ')</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={width}
              onChange={e => setWidth(e.target.value)}
            />
          </div>
          <div>
            <label className="label text-xs">גובה (מ')</label>
            <input
              className="input"
              type="number"
              inputMode="decimal"
              min="0"
              step="0.1"
              value={wallHeight}
              onChange={e => setWallHeight(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          רצפה: <b>{num(length * width)} מ"ר</b> · היקף: <b>{num(2 * (Number(length) + Number(width)))} מ׳</b>
        </div>
      </div>

      <div>
        <label className="label">שם לקוח (לא חובה)</label>
        <input
          className="input"
          placeholder="לדוגמה: דני"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
        />
      </div>

      <div>
        <label className="label">טלפון לוואטסאפ (לא חובה)</label>
        <input
          className="input"
          type="tel"
          inputMode="tel"
          placeholder="050-1234567"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>

      <div className="card bg-gray-900 text-white">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-[10px] opacity-70">עבודה</div>
            <div className="font-bold">{nis(workTotal)}</div>
          </div>
          <div>
            <div className="text-[10px] opacity-70">חומרים</div>
            <div className="font-bold">{nis(materialsCost)}</div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-2 pt-2 text-center">
          <div className="text-sm opacity-80">הערכה ללקוח</div>
          <div className="text-3xl font-bold mt-0.5">{nis(rounded)}</div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <button
          onClick={() => setShowMaterials(s => !s)}
          className="w-full flex items-center gap-2 p-3 hover:bg-gray-50"
        >
          <span className="font-bold flex-1 text-right">פירוט החומרים</span>
          <span className="text-xs text-gray-500">{materials.length}</span>
          <ChevronDown className={['w-4 h-4 text-gray-400 transition-transform', showMaterials ? '' : '-rotate-90'].join(' ')} />
        </button>
        {showMaterials && (
          <div className="border-t border-gray-100">
            {groupedMaterials.map(g => (
              <div key={g.id} className="border-b border-gray-50 last:border-0">
                <div className="bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 flex items-center gap-2">
                  <span>{g.icon}</span>
                  {g.name}
                </div>
                <div className="divide-y divide-gray-50">
                  {g.items.map(m => (
                    <div key={m.key + m.label} className="flex items-center justify-between px-3 py-1.5 text-sm">
                      <div className="flex-1 min-w-0 truncate">{m.label}</div>
                      <div className="text-left ms-2 flex-shrink-0">
                        <span className="font-semibold text-gray-900">{num(m.qty)}</span>
                        <span className="text-[10px] text-gray-500 me-1">{m.mat.niceUnit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={share} className="btn-primary w-full">
        <Share2 className="w-5 h-5" />
        שלח לוואטסאפ
      </button>

      <p className="text-xs text-gray-500 text-center px-4">
        הערכה ראשונית בלבד. המחיר הסופי ייקבע לאחר ביקור באתר ומדידה מדויקת.
      </p>
    </div>
  )
}
