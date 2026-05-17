import { useEffect, useState } from 'react'
import { Plus, FolderOpen, Calculator, Hammer, ChevronLeft } from 'lucide-react'
import { listProjects } from '../utils/storage'
import { nis, dateShort } from '../utils/format'

export default function HomePage({ onNavigate }) {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    setProjects(listProjects().sort((a, b) => b.updatedAt - a.updatedAt))
  }, [])

  const recent = projects.slice(0, 3)

  return (
    <div className="space-y-6">
      <section className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl bg-white/20 grid place-items-center">
            <Hammer className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm opacity-90">שלום, שיפוצניק</div>
            <div className="text-lg font-bold">מה בונים היום?</div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <ActionTile
          icon={<Plus className="w-7 h-7" />}
          title="פרוייקט חדש"
          subtitle="הצעת מחיר ללקוח"
          tone="primary"
          onClick={() => onNavigate('newProject')}
        />
        <ActionTile
          icon={<Calculator className="w-7 h-7" />}
          title="מחשבון כמויות"
          subtitle="חומרים לפי חדר"
          onClick={() => onNavigate('quantityCalc')}
        />
        <ActionTile
          icon={<FolderOpen className="w-7 h-7" />}
          title="הפרוייקטים שלי"
          subtitle={`${projects.length} פרוייקטים`}
          onClick={() => onNavigate('projects')}
        />
        <ActionTile
          icon={<Calculator className="w-7 h-7" />}
          title="מחשבון עלויות"
          subtitle="עלות חומרים + רווח"
          onClick={() => onNavigate('costCalc')}
        />
      </section>

      {recent.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-2 px-1">
            <h2 className="text-base font-bold text-gray-900">אחרונים</h2>
            <button
              className="text-sm text-brand-600 font-semibold"
              onClick={() => onNavigate('projects')}
            >
              הכל
            </button>
          </div>
          <div className="space-y-2">
            {recent.map(p => (
              <button
                key={p.id}
                onClick={() => onNavigate('project', { id: p.id })}
                className="w-full card flex items-center justify-between text-right hover:bg-gray-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-gray-900 truncate">{p.clientName || 'ללא שם'}</div>
                  <div className="text-sm text-gray-500 truncate">{p.title || 'הצעת מחיר'}</div>
                  <div className="text-xs text-gray-400 mt-1">{dateShort(p.updatedAt)}</div>
                </div>
                <div className="text-left ms-2">
                  <div className="font-bold text-gray-900">{nis(p.total || 0)}</div>
                  <ChevronLeft className="w-4 h-4 text-gray-400 inline-block" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <section className="card text-center py-8">
          <div className="text-5xl mb-2">👷‍♂️</div>
          <div className="font-bold text-gray-900 mb-1">בוא נתחיל פרוייקט ראשון</div>
          <div className="text-sm text-gray-500 mb-4">בונה הצעת מחיר ושולח ללקוח בוואטסאפ תוך 3 דקות</div>
          <button className="btn-primary w-full" onClick={() => onNavigate('newProject')}>
            <Plus className="w-5 h-5" />
            פרוייקט חדש
          </button>
        </section>
      )}
    </div>
  )
}

function ActionTile({ icon, title, subtitle, onClick, tone }) {
  const primary = tone === 'primary'
  return (
    <button
      onClick={onClick}
      className={[
        'card text-right flex flex-col gap-2 active:scale-[0.98] transition-transform',
        primary ? 'bg-brand-500 text-white shadow-soft' : '',
      ].join(' ')}
    >
      <div className={[
        'w-12 h-12 rounded-xl grid place-items-center',
        primary ? 'bg-white/20 text-white' : 'bg-brand-50 text-brand-600',
      ].join(' ')}>
        {icon}
      </div>
      <div>
        <div className={['font-bold', primary ? 'text-white' : 'text-gray-900'].join(' ')}>{title}</div>
        <div className={['text-xs', primary ? 'text-white/80' : 'text-gray-500'].join(' ')}>{subtitle}</div>
      </div>
    </button>
  )
}
