import { useState } from 'react'
import { Star, Send, Pencil } from 'lucide-react'

// פאנל דירוג לקוח — השיפוצניק מזין דירוג שקיבל, או שולח בקשת דירוג לוואטסאפ
export default function RatingPanel({ project, rating, onChange }) {
  const [editing, setEditing] = useState(!rating)
  const [stars, setStars] = useState(rating?.stars || 0)
  const [text, setText] = useState(rating?.text || '')
  const [hover, setHover] = useState(0)

  function save() {
    if (stars === 0) return
    onChange({
      stars,
      text: text.trim(),
      addedAt: Date.now(),
      showInPortfolio: rating?.showInPortfolio ?? true,
    })
    setEditing(false)
  }

  function sendRequestToClient() {
    const link = `${window.location.origin}/?rate=${project.id}`
    const text = encodeURIComponent(
      `שלום ${project.clientName},\n\nאשמח לדירוג קצר על העבודה שביצענו (${project.title}):\n\n${link}\n\nתודה רבה!`
    )
    const phone = (project.phone || '').replace(/[^\d]/g, '').replace(/^0/, '972')
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`
    window.open(url, '_blank')
  }

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
        <h3 className="font-bold flex-1">דירוג הלקוח</h3>
        {rating && !editing && (
          <button onClick={() => setEditing(true)} className="text-sm text-brand-600 font-semibold flex items-center gap-1">
            <Pencil className="w-3 h-3" /> ערוך
          </button>
        )}
      </div>

      {!editing && rating ? (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={[
                  'w-5 h-5',
                  i < rating.stars ? 'text-amber-400 fill-amber-400' : 'text-gray-300',
                ].join(' ')}
              />
            ))}
            <span className="text-sm font-bold text-amber-700 me-1">{rating.stars}/5</span>
          </div>
          {rating.text && <p className="text-sm text-amber-900 mt-2 italic">"{rating.text}"</p>}
          <label className="flex items-center gap-2 mt-3 text-xs text-amber-700">
            <input
              type="checkbox"
              checked={rating.showInPortfolio !== false}
              onChange={e => onChange({ ...rating, showInPortfolio: e.target.checked })}
            />
            הצג בפורטפוליו הציבורי
          </label>
        </div>
      ) : (
        <>
          <div>
            <div className="text-sm text-gray-600 mb-2">כמה כוכבים נתן הלקוח?</div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setStars(i + 1)}
                  onMouseEnter={() => setHover(i + 1)}
                  onMouseLeave={() => setHover(0)}
                  className="p-1"
                >
                  <Star
                    className={[
                      'w-8 h-8 transition-colors',
                      i < (hover || stars) ? 'text-amber-400 fill-amber-400' : 'text-gray-300',
                    ].join(' ')}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">חוות דעת (לא חובה)</label>
            <textarea
              className="input min-h-[80px]"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="המלצה שכתב הלקוח..."
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={sendRequestToClient}
              className="btn-secondary text-sm"
            >
              <Send className="w-4 h-4" />
              בקש מהלקוח
            </button>
            <button
              onClick={save}
              disabled={stars === 0}
              className="btn-primary text-sm disabled:opacity-50"
            >
              שמור
            </button>
          </div>
        </>
      )}
    </div>
  )
}
