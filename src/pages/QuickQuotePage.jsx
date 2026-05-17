import { useState, useMemo } from 'react'
import { Zap, Share2, Ruler, ChevronDown, FilePlus, Info, Truck } from 'lucide-react'
import { ROOMS, PACKAGE_LEVELS, PACKAGES } from '../data/packages'
import { ALL_WORK_ITEMS, UNIT_LABELS } from '../data/workItems'
import { ROOM_RULES, MATERIAL_CATALOG, MATERIAL_CATEGORIES } from '../data/materials'
import { getSupplierPrices, createProjectFromQuickQuote } from '../utils/storage'
import { nis, num } from '../utils/format'

const BASE_SIZES = {
  bathroom:   { length: 3, width: 2, wallHeight: 2.5 },
  kitchen:    { length: 4, width: 3, wallHeight: 2.5 },
  bedroom:    { length: 4, width: 3, wallHeight: 2.5 },
  livingroom: { length: 5, width: 5, wallHeight: 2.5 },
}
const DEFAULT_DIMS = BASE_SIZES

export default function QuickQuotePage({ onNavigate }) {
  const [roomId, setRoomId] = useState('bathroom')
  const [levelId, setLevelId] = useState('partial')
  const [length, setLength] = useState(DEFAULT_DIMS.bathroom.length)
  const [width, setWidth] = useState(DEFAULT_DIMS.bathroom.width)
  const [wallHeight, setWallHeight] = useState(DEFAULT_DIMS.bathroom.wallHeight)
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [showMaterials, setShowMaterials] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  // מחירי ספקים אישיים — אם השיפוצניק עדכן מחיר ב"הספקים שלי", הוא משתמש כאן
  const supplierPrices = useMemo(() => getSupplierPrices(), [])

  function pickRoom(id) {
    setRoomId(id)
    const d = DEFAULT_DIMS[id]
    if (d) { setLength(d.length); setWidth(d.width); setWallHeight(d.wallHeight) }
  }

  const areaScale = useMemo(() => {
    const base = BASE_SIZES[roomId]
    const baseArea = base.length * base.width
    const userArea = (Number(length) || 0) * (Number(width) || 0)
    return baseArea === 0 ? 1 : userArea / baseArea
  }, [roomId, length, width])

  // פריטי עבודה משוקללים לפי מקדם השטח
  const workItems = useMemo(() => {
    const list = PACKAGES[roomId]?.[levelId] || []
    return list.map(p => {
      const it = ALL_WORK_ITEMS.find(i => i.id === p.itemId)
      if (!it) return null
      const qty = +(p.qty * areaScale).toFixed(1)
      return { item: it, qty, total: qty * it.defaultPrice }
    }).filter(Boolean)
  }, [roomId, levelId, areaScale])

  const workTotal = useMemo(() => workItems.reduce((s, w) => s + w.total, 0), [workItems])

  // חומרים — מחושב לפי המידות, כולל markup לקבלת מחיר ללקוח
  const materials = useMemo(() => {
    const rule = ROOM_RULES[roomId]
    if (!rule) return []
    const raw = rule.calc({ length: Number(length) || 0, width: Number(width) || 0, wallHeight: Number(wallHeight) || 0 })
    return raw.map(r => {
      const mat = MATERIAL_CATALOG[r.key]
      if (!mat) return null
      const sp = supplierPrices[r.key]
      const costPrice = sp?.price ?? mat.price
      const markupPct = sp?.markupPct ?? mat.markupPct
      const clientPrice = costPrice * (1 + markupPct / 100)
      const withWaste = r.qty * (1 + (r.waste || 0) / 100)
      const isWhole = ['bag', 'unit'].includes(mat.unit)
      const qty = isWhole ? Math.ceil(withWaste) : +(withWaste.toFixed(2))
      return {
        ...r, mat, qty, costPrice, markupPct, clientPrice,
        rowCost: qty * costPrice,
        rowClient: qty * clientPrice,
        isCustom: !!sp,
      }
    }).filter(Boolean)
  }, [roomId, length, width, wallHeight, supplierPrices])

  const groupedMaterials = useMemo(() => {
    const map = new Map()
    for (const cat of MATERIAL_CATEGORIES) map.set(cat.id, [])
    for (const m of materials) {
      const list = map.get(m.mat.categoryId)
      if (list) list.push(m)
    }
    return MATERIAL_CATEGORIES.map(cat => ({ ...cat, items: map.get(cat.id) || [] })).filter(g => g.items.length > 0)
  }, [materials])

  const materialsCost   = useMemo(() => materials.reduce((s, m) => s + m.rowCost, 0), [materials])
  const materialsClient = useMemo(() => materials.reduce((s, m) => s + m.rowClient, 0), [materials])
  const materialsProfit = materialsClient - materialsCost

  // מחיר סופי ללקוח = עבודה + חומרים עם markup
  const totalEstimate = workTotal + materialsClient
  const rounded = Math.floor(totalEstimate / 100) * 100

  // המרה לפרוייקט מלא ערוך — מאחד את כל הפריטים לרשימה אחת
  function convertToProject() {
    const room = ROOMS.find(r => r.id === roomId)
    const level = PACKAGE_LEVELS.find(l => l.id === levelId)

    const projectItems = [
      // פריטי עבודה
      ...workItems.map(({ item, qty }) => ({
        id: item.id + '_' + Math.random().toString(36).slice(2, 8),
        name: item.name,
        unit: item.unit,
        qty,
        price: item.defaultPrice,
        note: 'עבודה',
      })),
      // חומרים — מקובצים לפריט אחד גדול לקטגוריה כדי לא להציף את ההצעה
      ...groupedMaterials.map(g => ({
        id: 'mat_' + g.id + '_' + Math.random().toString(36).slice(2, 8),
        name: `חומרים — ${g.name}`,
        unit: 'job',
        qty: 1,
        price: Math.round(g.items.reduce((s, m) => s + m.rowClient, 0)),
        note: g.items.map(m => m.label).join(', ').slice(0, 100),
      })).filter(it => it.price > 0),
    ]

    const project = createProjectFromQuickQuote({
      clientName,
      phone,
      title: `${room?.name} — שיפוץ ${level?.name} (${length}×${width} מ׳)`,
      items: projectItems,
    })
    onNavigate?.('project', { id: project.id })
  }

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
        <div className="flex-1">
          <div className="font-bold">הצעה מהירה</div>
          <div className="text-xs opacity-90">חדר + מידות + רמה → הצעה לוואטסאפ או פרוייקט מלא</div>
        </div>
        <button onClick={() => setShowInfo(s => !s)} className="text-white/80 hover:text-white" aria-label="מידע">
          <Info className="w-5 h-5" />
        </button>
      </div>

      {showInfo && (
        <div className="card bg-blue-50 border border-blue-100 text-sm text-blue-900 space-y-2">
          <p><b>מהיכן המחירים?</b></p>
          <p>• <b>עבודה:</b> מחירי קבלן מקובלים בישראל (ללא חומרים).</p>
          <p>• <b>חומרים:</b> מחירי קנייה ממוצעים מספקים, ועליהם מתווסף רווח (קרמיקה 25%, אינסטלציה 15-20%, אחרים 10%).</p>
          <p>• המחיר ללקוח מציג כבר את הרווח. אתה רואה בנפרד "עלות שלי" ו"רווח".</p>
          <p className="flex items-center gap-1 pt-1 border-t border-blue-100">
            <Truck className="w-4 h-4" />
            עדכן מחירים אישיים ב<button onClick={() => onNavigate?.('suppliers')} className="font-bold underline">"הספקים שלי"</button>
          </p>
        </div>
      )}

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
          <Dim label="אורך (מ')" value={length} onChange={setLength} />
          <Dim label="רוחב (מ')" value={width} onChange={setWidth} />
          <Dim label="גובה (מ')" value={wallHeight} onChange={setWallHeight} />
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          רצפה: <b>{num(length * width)} מ"ר</b> · היקף: <b>{num(2 * (Number(length) + Number(width)))} מ׳</b>
        </div>
      </div>

      <div>
        <label className="label">שם לקוח (לא חובה)</label>
        <input className="input" placeholder="לדוגמה: דני" value={clientName} onChange={e => setClientName(e.target.value)} />
      </div>
      <div>
        <label className="label">טלפון לוואטסאפ (לא חובה)</label>
        <input className="input" type="tel" inputMode="tel" placeholder="050-1234567" value={phone} onChange={e => setPhone(e.target.value)} />
      </div>

      <div className="card bg-gray-900 text-white">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-[10px] opacity-70">עבודה</div>
            <div className="font-bold">{nis(workTotal)}</div>
          </div>
          <div>
            <div className="text-[10px] opacity-70">חומרים ללקוח</div>
            <div className="font-bold">{nis(materialsClient)}</div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-2 pt-2 text-center">
          <div className="text-sm opacity-80">הערכה ללקוח</div>
          <div className="text-3xl font-bold mt-0.5">{nis(rounded)}</div>
          <div className="text-[10px] opacity-60 mt-1">
            עלות חומרים: {nis(materialsCost)} · רווח מחומרים: {nis(materialsProfit)}
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <button
          onClick={() => setShowMaterials(s => !s)}
          className="w-full flex items-center gap-2 p-3 hover:bg-gray-50"
        >
          <span className="font-bold flex-1 text-right">פירוט החומרים — מחיר ליחידה</span>
          <span className="text-xs text-gray-500">{materials.length}</span>
          <ChevronDown className={['w-4 h-4 text-gray-400 transition-transform', showMaterials ? '' : '-rotate-90'].join(' ')} />
        </button>
        {showMaterials && (
          <div className="border-t border-gray-100">
            {groupedMaterials.map(g => {
              const catTotal = g.items.reduce((s, m) => s + m.rowClient, 0)
              return (
                <div key={g.id} className="border-b border-gray-50 last:border-0">
                  <div className="bg-gray-50 px-3 py-1.5 text-xs font-bold text-gray-700 flex items-center gap-2">
                    <span>{g.icon}</span>
                    <span className="flex-1">{g.name}</span>
                    <span>{nis(catTotal)}</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {g.items.map(m => (
                      <div key={m.key + m.label} className="px-3 py-2 text-sm">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate">{m.label}</div>
                            <div className="text-[10px] text-gray-500">
                              {num(m.qty)} {m.mat.niceUnit} × {nis(m.clientPrice)}
                              {m.isCustom && <span className="text-brand-600 font-bold ms-1">· ספק שלי</span>}
                              {!m.isCustom && <span className="text-gray-400 ms-1">· עלות {nis(m.costPrice)} + {m.markupPct}%</span>}
                            </div>
                          </div>
                          <div className="font-bold text-gray-900 whitespace-nowrap">{nis(m.rowClient)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={share} className="btn-secondary text-sm">
          <Share2 className="w-5 h-5" />
          לוואטסאפ
        </button>
        <button onClick={convertToProject} className="btn-primary text-sm">
          <FilePlus className="w-5 h-5" />
          המר לפרוייקט ערוך
        </button>
      </div>

      <p className="text-xs text-gray-500 text-center px-4">
        "המר לפרוייקט" מעביר אותך לעמוד הפרוייקט המלא — שם תוכל להוסיף, להוריד או לשנות מחירים של כל פריט.
      </p>
    </div>
  )
}

function Dim({ label, value, onChange }) {
  return (
    <div>
      <label className="label text-xs">{label}</label>
      <input
        className="input"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.1"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
