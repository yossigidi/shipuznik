import { useEffect, useState } from 'react'
import { Printer, AlertCircle } from 'lucide-react'
import { getProject, getSettings } from '../utils/storage'
import { nis, dateShort } from '../utils/format'
import { UNIT_LABELS } from '../data/workItems'

// חוזה עבודה — דף HTML מעוצב, מודפס ל-PDF דרך הדפדפן (תומך RTL מלא)
export default function ContractPage({ projectId, onNavigate }) {
  const [project, setProject] = useState(null)
  const [settings, setSettings] = useState(getSettings())

  useEffect(() => {
    setProject(getProject(projectId))
    setSettings(getSettings())
  }, [projectId])

  if (!project) return <div className="text-center text-gray-500 py-10">לא נמצא פרוייקט</div>

  const settingsOk = settings.businessName && settings.ownerName && settings.taxId
  const today = dateShort(Date.now())

  return (
    <div className="space-y-3">
      {!settingsOk && (
        <div className="card bg-amber-50 border border-amber-200 no-print">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-amber-900">חסרים פרטי עסק</div>
              <div className="text-sm text-amber-800 mt-0.5">מלא שם, ת.ז. וסוג עסק בהגדרות כדי שיופיעו בחוזה.</div>
              <button onClick={() => onNavigate('settings')} className="mt-2 text-sm text-amber-900 font-bold underline">
                לעמוד ההגדרות
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => window.print()}
        className="btn-primary w-full no-print"
      >
        <Printer className="w-5 h-5" />
        הדפס / שמור כ-PDF
      </button>

      <div className="print-area bg-white rounded-2xl shadow-card p-6 text-sm leading-relaxed text-gray-900">
        <header className="text-center border-b-2 border-gray-900 pb-4 mb-6">
          <h1 className="text-2xl font-bold mb-1">חוזה ביצוע עבודות שיפוץ</h1>
          <p className="text-gray-600">נחתם ב-{today}</p>
        </header>

        <section className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1">המבצע</h2>
            <p className="font-bold">{settings.businessName || '—'}</p>
            <p>{settings.ownerName}</p>
            {settings.taxId && <p>ת.ז./ע.מ.: {settings.taxId}</p>}
            <p>{settings.businessType === 'murshe' ? 'עוסק מורשה' : 'עוסק פטור'}</p>
            {settings.phone && <p>טל': {settings.phone}</p>}
            {settings.email && <p>{settings.email}</p>}
            {settings.address && <p>{settings.address}</p>}
          </div>
          <div>
            <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1">המזמין</h2>
            <p className="font-bold">{project.clientName}</p>
            {project.phone && <p>טל': {project.phone}</p>}
            {project.address && <p>כתובת העבודה: {project.address}</p>}
          </div>
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1">תיאור העבודה</h2>
          <p>{project.title || 'הצעת מחיר'}</p>
          <table className="w-full mt-3 border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-right p-2 border border-gray-300 font-bold">פריט</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-16">כמות</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-16">יח'</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-20">מחיר</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-24">סה"כ</th>
              </tr>
            </thead>
            <tbody>
              {(project.items || []).map(it => (
                <tr key={it.id}>
                  <td className="p-2 border border-gray-300">
                    {it.name}
                    {it.note && <div className="text-xs text-gray-500 mt-0.5">{it.note}</div>}
                  </td>
                  <td className="text-center p-2 border border-gray-300">{it.qty}</td>
                  <td className="text-center p-2 border border-gray-300">{UNIT_LABELS[it.unit]}</td>
                  <td className="text-center p-2 border border-gray-300">{nis(it.price)}</td>
                  <td className="text-center p-2 border border-gray-300 font-semibold">{nis(it.qty * it.price)}</td>
                </tr>
              ))}
              <tr className="bg-gray-100">
                <td colSpan="4" className="text-left p-2 border border-gray-300 font-bold">סה"כ</td>
                <td className="text-center p-2 border border-gray-300 font-bold text-base">{nis(project.total || 0)}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {(project.milestones || []).length > 0 && (
          <section className="mb-6">
            <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1">תנאי תשלום</h2>
            <ul className="space-y-1">
              {project.milestones.map(m => (
                <li key={m.id}>
                  • {m.label}: {m.pct}% ({nis((project.total || 0) * m.pct / 100)})
                </li>
              ))}
            </ul>
          </section>
        )}

        {project.estimatedDays > 0 && (
          <section className="mb-6">
            <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1">לוח זמנים</h2>
            <p>משך עבודה משוער: {project.estimatedDays} ימי עבודה</p>
          </section>
        )}

        <section className="mb-6">
          <h2 className="font-bold text-base mb-2 border-b border-gray-300 pb-1">תנאים כלליים</h2>
          <ol className="list-decimal list-inside space-y-1 text-gray-800">
            <li>המחירים סופיים וכוללים את כל החומרים והעבודה המפורטים לעיל.</li>
            <li>שינויים והוספות יתומחרו בנפרד בכתב לפני ביצוע.</li>
            <li>איחור בתשלום אבן דרך עלול לעכב את המשך העבודה.</li>
            <li>המבצע אחראי לאיכות העבודה במשך 12 חודשים מסיומה.</li>
            <li>הלקוח אחראי לפנות את אזור העבודה ולאפשר גישה.</li>
          </ol>
        </section>

        <section className="grid grid-cols-2 gap-8 mt-12 pt-4 border-t border-gray-300">
          <div className="text-center">
            <div className="border-b border-gray-900 h-10 mb-1"></div>
            <p className="font-bold">חתימת המבצע</p>
            <p className="text-xs text-gray-600">{settings.ownerName}</p>
          </div>
          <div className="text-center">
            {project.signature ? (
              <img src={project.signature} alt="חתימה" className="h-10 mx-auto mb-1" />
            ) : (
              <div className="border-b border-gray-900 h-10 mb-1"></div>
            )}
            <p className="font-bold">חתימת המזמין</p>
            <p className="text-xs text-gray-600">{project.clientName}</p>
          </div>
        </section>
      </div>
    </div>
  )
}
