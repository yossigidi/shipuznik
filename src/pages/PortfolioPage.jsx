import { useEffect, useState, useMemo } from 'react'
import { Star, MessageCircle, Share2, Hammer } from 'lucide-react'
import { listProjects, getSettings } from '../utils/storage'

// פורטפוליו ציבורי — תמונות לפני/אחרי + דירוגי לקוחות
// השיפוצניק יכול לשתף את המסך הזה ללקוחות פוטנציאלים (screenshot / link)
export default function PortfolioPage() {
  const [projects, setProjects] = useState([])
  const [settings, setSettings] = useState(getSettings())

  useEffect(() => {
    setProjects(listProjects())
    setSettings(getSettings())
  }, [])

  // רק פרוייקטים עם דירוג שאושר להצגה או עם תמונות אחרי
  const featured = useMemo(() => projects.filter(p =>
    (p.rating?.showInPortfolio !== false && p.rating?.stars >= 4) ||
    (p.photos || []).some(ph => ph.phase === 'after')
  ), [projects])

  const ratings = featured.filter(p => p.rating?.stars > 0)
  const avgRating = ratings.length > 0
    ? ratings.reduce((s, p) => s + p.rating.stars, 0) / ratings.length
    : 0

  function shareLink() {
    const link = window.location.origin + '/?portfolio=1'
    const text = encodeURIComponent(
      `שיפוצניק מקצועי לשירותכם!\n\nראו את העבודות והדירוגים שלי:\n${link}`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div className="space-y-4">
      <header className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl p-5 text-center shadow-soft">
        <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center mx-auto mb-2">
          <Hammer className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold">{settings.businessName || 'שיפוצים'}</h2>
        {settings.ownerName && <p className="text-sm opacity-90">{settings.ownerName}</p>}
        {avgRating > 0 && (
          <div className="flex items-center justify-center gap-1 mt-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={i < Math.round(avgRating) ? 'w-4 h-4 fill-amber-300 text-amber-300' : 'w-4 h-4 text-white/30'} />
            ))}
            <span className="text-sm font-bold me-1">{avgRating.toFixed(1)}</span>
            <span className="text-xs opacity-80">({ratings.length} לקוחות)</span>
          </div>
        )}
        {settings.phone && (
          <a
            href={`tel:${settings.phone}`}
            className="inline-block mt-3 bg-white text-brand-600 font-bold py-2 px-4 rounded-xl"
          >
            התקשר עכשיו
          </a>
        )}
      </header>

      <button onClick={shareLink} className="btn-secondary w-full">
        <Share2 className="w-5 h-5" />
        שתף את הפורטפוליו בוואטסאפ
      </button>

      {featured.length === 0 ? (
        <div className="card text-center py-10 text-gray-500">
          <div className="text-5xl mb-2">📸</div>
          <div className="font-bold text-gray-900">עוד אין עבודות להציג</div>
          <div className="text-sm mt-1">העלה תמונות "אחרי" בפרוייקטים שסיימת,</div>
          <div className="text-sm">ובקש דירוגים מהלקוחות שלך.</div>
        </div>
      ) : (
        featured.map(p => <PortfolioCard key={p.id} project={p} />)
      )}
    </div>
  )
}

function PortfolioCard({ project }) {
  const before = (project.photos || []).filter(p => p.phase === 'before')[0]
  const after  = (project.photos || []).filter(p => p.phase === 'after')[0]
  const rating = project.rating

  return (
    <div className="card space-y-3">
      <div>
        <h3 className="font-bold text-gray-900">{project.title}</h3>
        {project.address && <p className="text-xs text-gray-500">{project.address}</p>}
      </div>

      {(before || after) && (
        <div className="grid grid-cols-2 gap-2">
          {before && (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={before.dataUrl} alt="לפני" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                לפני
              </div>
            </div>
          )}
          {after && (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100">
              <img src={after.dataUrl} alt="אחרי" className="w-full h-full object-cover" />
              <div className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                אחרי
              </div>
            </div>
          )}
        </div>
      )}

      {rating && rating.showInPortfolio !== false && rating.stars > 0 && (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
          <div className="flex items-center gap-1 mb-1">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={i < rating.stars ? 'w-4 h-4 fill-amber-400 text-amber-400' : 'w-4 h-4 text-gray-300'} />
            ))}
          </div>
          {rating.text && (
            <div className="text-sm text-amber-900 italic flex items-start gap-1">
              <MessageCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              "{rating.text}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
