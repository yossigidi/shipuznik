import { useState, useMemo } from 'react'
import { X, ChevronLeft, Sparkles, Plus, Check } from 'lucide-react'
import { ROOMS, PACKAGE_LEVELS, PACKAGES, RECOMMENDED_ADDONS } from '../data/packages'
import { ALL_WORK_ITEMS, UNIT_LABELS } from '../data/workItems'
import { nis } from '../utils/format'

// בוחר חבילה — בחירת חדר → רמת חבילה → תצוגה והתאמה → הוספה לפרוייקט
export default function PackagePicker({ onClose, onAdd }) {
  const [step, setStep] = useState('room')   // room | level | review
  const [roomId, setRoomId] = useState(null)
  const [levelId, setLevelId] = useState(null)
  const [selected, setSelected] = useState({}) // { itemId: qty } — ניתן לערוך לפני הוספה
  const [selectedAddons, setSelectedAddons] = useState({})

  const pkgItems = useMemo(() => {
    if (!roomId || !levelId) return []
    return (PACKAGES[roomId]?.[levelId] || []).map(p => ({
      ...p,
      item: ALL_WORK_ITEMS.find(i => i.id === p.itemId),
    })).filter(p => p.item)
  }, [roomId, levelId])

  const addons = useMemo(() => {
    if (!roomId) return []
    return (RECOMMENDED_ADDONS[roomId] || []).map(a => ({
      ...a,
      item: ALL_WORK_ITEMS.find(i => i.id === a.itemId),
    })).filter(a => a.item)
  }, [roomId])

  function pickRoom(r) {
    setRoomId(r.id)
    setStep('level')
  }

  function pickLevel(l) {
    setLevelId(l.id)
    // אתחל בחירות עם כל פריטי החבילה מסומנים בכמות ברירת המחדל
    const init = {}
    PACKAGES[roomId][l.id].forEach(p => { init[p.itemId] = p.qty })
    setSelected(init)
    setSelectedAddons({})
    setStep('review')
  }

  function toggleItem(itemId, defaultQty) {
    setSelected(s => {
      const next = { ...s }
      if (itemId in next) delete next[itemId]
      else next[itemId] = defaultQty
      return next
    })
  }

  function setQty(itemId, qty) {
    setSelected(s => ({ ...s, [itemId]: Number(qty) || 0 }))
  }

  function toggleAddon(itemId, defaultQty) {
    setSelectedAddons(s => {
      const next = { ...s }
      if (itemId in next) delete next[itemId]
      else next[itemId] = defaultQty
      return next
    })
  }

  function commit() {
    const newItems = []
    const room = ROOMS.find(r => r.id === roomId)
    Object.entries(selected).forEach(([itemId, qty]) => {
      const it = ALL_WORK_ITEMS.find(i => i.id === itemId)
      if (!it || qty <= 0) return
      newItems.push({
        id: it.id + '_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        name: it.name,
        unit: it.unit,
        qty,
        price: it.defaultPrice,
        note: room?.name || '',
      })
    })
    Object.entries(selectedAddons).forEach(([itemId, qty]) => {
      const it = ALL_WORK_ITEMS.find(i => i.id === itemId)
      if (!it || qty <= 0) return
      newItems.push({
        id: it.id + '_addon_' + Date.now() + '_' + Math.random().toString(36).slice(2, 5),
        name: it.name,
        unit: it.unit,
        qty,
        price: it.defaultPrice,
        note: 'תוספת מומלצת',
      })
    })
    onAdd(newItems)
  }

  const totalSelected = useMemo(() => {
    let s = 0
    Object.entries(selected).forEach(([id, qty]) => {
      const it = ALL_WORK_ITEMS.find(i => i.id === id)
      if (it) s += qty * it.defaultPrice
    })
    Object.entries(selectedAddons).forEach(([id, qty]) => {
      const it = ALL_WORK_ITEMS.find(i => i.id === id)
      if (it) s += qty * it.defaultPrice
    })
    return s
  }, [selected, selectedAddons])

  const selectedCount = Object.keys(selected).length + Object.keys(selectedAddons).length

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white rounded-t-3xl md:rounded-3xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <button
            onClick={step === 'room' ? onClose : () => setStep(step === 'review' ? 'level' : 'room')}
            className="p-2 -m-2 rounded-lg hover:bg-gray-100"
            aria-label="חזרה"
          >
            {step === 'room' ? <X className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
          </button>
          <h2 className="flex-1 font-bold text-gray-900">
            {step === 'room' && 'בחר חדר לחבילה'}
            {step === 'level' && `${ROOMS.find(r => r.id === roomId)?.name} — בחר רמה`}
            {step === 'review' && 'התאם את החבילה'}
          </h2>
        </div>

        <div className="overflow-y-auto p-4 flex-1">
          {step === 'room' && (
            <div className="space-y-2">
              <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 mb-3 text-sm text-brand-900">
                <Sparkles className="w-4 h-4 inline ms-1" />
                בחר חדר וקבל הצעת מחיר מוכנה תוך 10 שניות
              </div>
              {ROOMS.map(r => (
                <button
                  key={r.id}
                  onClick={() => pickRoom(r)}
                  className="w-full card text-right flex items-center gap-3 hover:bg-gray-50"
                >
                  <div className="text-3xl">{r.icon}</div>
                  <div className="font-semibold">{r.name}</div>
                </button>
              ))}
            </div>
          )}

          {step === 'level' && roomId && (
            <div className="space-y-2">
              {PACKAGE_LEVELS.map(l => {
                const items = PACKAGES[roomId]?.[l.id] || []
                const total = items.reduce((s, p) => {
                  const it = ALL_WORK_ITEMS.find(i => i.id === p.itemId)
                  return s + (it ? it.defaultPrice * p.qty : 0)
                }, 0)
                return (
                  <button
                    key={l.id}
                    onClick={() => pickLevel(l)}
                    className="w-full card text-right hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{l.icon}</div>
                      <div className="flex-1">
                        <div className="font-bold text-lg">{l.name}</div>
                        <div className="text-sm text-gray-500">{l.desc}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{items.length} פריטי עבודה</div>
                      </div>
                      <div className="text-left">
                        <div className="text-xs text-gray-500">מחיר משוער</div>
                        <div className="font-bold text-brand-600">{nis(total)}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">
                סמן/בטל פריטים, התאם כמויות. הוסף גם תוספות מומלצות בסוף.
              </div>

              <div className="space-y-1.5">
                {pkgItems.map(({ itemId, item, qty: defaultQty }) => {
                  const isOn = itemId in selected
                  const qty = selected[itemId] || defaultQty
                  return (
                    <SelectableItem
                      key={itemId}
                      item={item}
                      qty={qty}
                      isOn={isOn}
                      onToggle={() => toggleItem(itemId, defaultQty)}
                      onQty={(v) => setQty(itemId, v)}
                    />
                  )
                })}
              </div>

              {addons.length > 0 && (
                <>
                  <h3 className="font-bold text-gray-900 pt-2">תוספות מומלצות</h3>
                  <div className="space-y-1.5">
                    {addons.map(({ itemId, item, reason }) => {
                      const isOn = itemId in selectedAddons
                      const qty = selectedAddons[itemId] || 1
                      return (
                        <SelectableItem
                          key={itemId}
                          item={item}
                          qty={qty}
                          isOn={isOn}
                          subtitle={reason}
                          onToggle={() => toggleAddon(itemId, 1)}
                          onQty={(v) => setSelectedAddons(s => ({ ...s, [itemId]: Number(v) || 0 }))}
                        />
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {step === 'review' && (
          <div className="border-t border-gray-100 p-3 space-y-2 bg-gray-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{selectedCount} פריטים נבחרו</span>
              <span className="text-lg font-bold text-gray-900">{nis(totalSelected)}</span>
            </div>
            <button
              className="btn-primary w-full"
              onClick={commit}
              disabled={selectedCount === 0}
            >
              <Plus className="w-5 h-5" />
              הוסף להצעה
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SelectableItem({ item, qty, isOn, subtitle, onToggle, onQty }) {
  return (
    <div className={[
      'rounded-xl border p-2.5 transition-colors',
      isOn ? 'border-brand-300 bg-brand-50' : 'border-gray-200 bg-white',
    ].join(' ')}>
      <div className="flex items-start gap-2">
        <button
          onClick={onToggle}
          className={[
            'w-6 h-6 rounded-md grid place-items-center flex-shrink-0 mt-0.5 transition-colors',
            isOn ? 'bg-brand-500 text-white' : 'bg-white border border-gray-300',
          ].join(' ')}
          aria-label={isOn ? 'הסר' : 'הוסף'}
        >
          {isOn && <Check className="w-4 h-4" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 text-sm">{item.name}</div>
          {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
          <div className="text-xs text-gray-500">{nis(item.defaultPrice)} / {UNIT_LABELS[item.unit]}</div>
        </div>

        {isOn && (
          <div className="flex items-center gap-1">
            <input
              type="number"
              inputMode="decimal"
              min="0"
              step="0.5"
              value={qty}
              onChange={e => onQty(e.target.value)}
              className="w-14 px-2 py-1 border border-gray-200 rounded-md text-sm text-center"
            />
            <div className="text-xs font-semibold text-brand-700 min-w-[60px] text-left">
              {nis(qty * item.defaultPrice)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
