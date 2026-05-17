import { useState, useMemo } from 'react'
import { Zap, Share2, Plus, Minus } from 'lucide-react'
import { ROOMS, PACKAGE_LEVELS, PACKAGES } from '../data/packages'
import { ALL_WORK_ITEMS, UNIT_LABELS } from '../data/workItems'
import { nis } from '../utils/format'

// מצב שדה: בחירת חדר + רמה + שטח → הצעת מחיר מהירה לוואטסאפ ב-30 שניות
export default function QuickQuotePage() {
  const [roomId, setRoomId] = useState('bathroom')
  const [levelId, setLevelId] = useState('partial')
  const [scale, setScale] = useState(1) // מכפיל גודל — מתאים לחדרים גדולים/קטנים
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')

  const items = useMemo(() => {
    const list = PACKAGES[roomId]?.[levelId] || []
    return list.map(p => {
      const it = ALL_WORK_ITEMS.find(i => i.id === p.itemId)
      if (!it) return null
      return { item: it, qty: +(p.qty * scale).toFixed(1) }
    }).filter(Boolean)
  }, [roomId, levelId, scale])

  const total = useMemo(() => items.reduce((s, { item, qty }) => s + qty * item.defaultPrice, 0), [items])

  // עיגול לקרוב ל-100 מטה (להציג מספר עגול ללקוח)
  const rounded = Math.floor(total / 100) * 100

  function share() {
    const room = ROOMS.find(r => r.id === roomId)
    const level = PACKAGE_LEVELS.find(l => l.id === levelId)
    const lines = [
      clientName ? `הצעת מחיר עבור ${clientName}` : 'הצעת מחיר ראשונית',
      `${room?.name} — שיפוץ ${level?.name}`,
      '',
      'כולל:',
      ...items.map(({ item, qty }) => `• ${item.name} (${qty} ${UNIT_LABELS[item.unit]})`),
      '',
      `מחיר משוער: ${nis(rounded)}`,
      '',
      'המחיר הסופי ייקבע לאחר ביקור באתר.',
    ]
    const text = encodeURIComponent(lines.join('\n'))
    const cleanPhone = phone.replace(/[^\d]/g, '').replace(/^0/, '972')
    const url = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${text}`
      : `https://wa.me/?text=${text}`
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
          <div className="text-xs opacity-90">30 שניות → לוואטסאפ</div>
        </div>
      </div>

      <div>
        <label className="label">סוג חדר</label>
        <div className="grid grid-cols-2 gap-2">
          {ROOMS.map(r => (
            <button
              key={r.id}
              onClick={() => setRoomId(r.id)}
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

      <div>
        <label className="label">גודל החדר</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScale(Math.max(0.5, +(scale - 0.25).toFixed(2)))}
            className="w-12 h-12 rounded-xl bg-gray-100 grid place-items-center hover:bg-gray-200"
            aria-label="קטן יותר"
          >
            <Minus className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center bg-white border-2 border-gray-200 rounded-xl py-3">
            <div className="text-xs text-gray-500">
              {scale < 1 ? 'קטן' : scale === 1 ? 'בינוני' : 'גדול'}
            </div>
            <div className="font-bold">×{scale}</div>
          </div>
          <button
            onClick={() => setScale(Math.min(2.5, +(scale + 0.25).toFixed(2)))}
            className="w-12 h-12 rounded-xl bg-gray-100 grid place-items-center hover:bg-gray-200"
            aria-label="גדול יותר"
          >
            <Plus className="w-5 h-5" />
          </button>
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

      <div className="card bg-gray-900 text-white text-center">
        <div className="text-sm opacity-80">הערכה מהירה</div>
        <div className="text-3xl font-bold mt-1">{nis(rounded)}</div>
        <div className="text-xs opacity-60 mt-1">{items.length} פריטי עבודה</div>
      </div>

      <button onClick={share} className="btn-primary w-full">
        <Share2 className="w-5 h-5" />
        שלח לוואטסאפ
      </button>

      <p className="text-xs text-gray-500 text-center px-4">
        זוהי הערכה ראשונית בלבד. המחיר הסופי ייקבע לאחר ביקור באתר ומדידה.
      </p>
    </div>
  )
}
