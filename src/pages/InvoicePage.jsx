import { useEffect, useState, useMemo } from 'react'
import { Printer, AlertCircle } from 'lucide-react'
import { getProject, getSettings, saveProject, nextInvoiceNumber } from '../utils/storage'
import { nis, dateShort } from '../utils/format'
import { UNIT_LABELS } from '../data/workItems'

// חשבונית/קבלה — דף HTML מעוצב, מודפס ל-PDF דרך הדפדפן
export default function InvoicePage({ projectId, onNavigate }) {
  const [project, setProject] = useState(null)
  const [settings, setSettings] = useState(getSettings())

  useEffect(() => {
    const p = getProject(projectId)
    // אם אין מספר חשבונית עדיין — צור אחד וקבע אותו
    if (p && !p.invoiceNumber) {
      const num = nextInvoiceNumber()
      const updated = saveProject({ ...p, invoiceNumber: num, invoicedAt: Date.now() })
      setProject(updated)
    } else {
      setProject(p)
    }
    setSettings(getSettings())
  }, [projectId])

  const calc = useMemo(() => {
    if (!project) return { subtotal: 0, vat: 0, total: 0 }
    const subtotal = project.total || 0
    if (settings.businessType === 'murshe') {
      // מע"מ נכלל בסכום שהוצג ללקוח — נפריד אותו
      const rate = (settings.vatRate || 17) / 100
      const beforeVat = subtotal / (1 + rate)
      const vat = subtotal - beforeVat
      return { subtotal: beforeVat, vat, total: subtotal }
    }
    return { subtotal, vat: 0, total: subtotal }
  }, [project, settings])

  if (!project) return <div className="text-center text-gray-500 py-10">לא נמצא פרוייקט</div>

  const settingsOk = settings.businessName && settings.taxId

  return (
    <div className="space-y-3">
      {!settingsOk && (
        <div className="card bg-amber-50 border border-amber-200 no-print">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="flex-1">
              <div className="font-semibold text-amber-900">חסרים פרטי עסק</div>
              <div className="text-sm text-amber-800 mt-0.5">מלא שם עסק ות.ז./ע.מ. בהגדרות לפני הפקת חשבונית.</div>
              <button onClick={() => onNavigate('settings')} className="mt-2 text-sm text-amber-900 font-bold underline">
                לעמוד ההגדרות
              </button>
            </div>
          </div>
        </div>
      )}

      <button onClick={() => window.print()} className="btn-primary w-full no-print">
        <Printer className="w-5 h-5" />
        הדפס / שמור כ-PDF
      </button>

      <div className="print-area bg-white rounded-2xl shadow-card p-6 text-sm leading-relaxed text-gray-900">
        <header className="flex items-start justify-between border-b-2 border-gray-900 pb-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {settings.businessType === 'murshe' ? 'חשבונית מס' : 'קבלה'}
            </h1>
            <p className="text-gray-600 text-base">מספר {project.invoiceNumber}</p>
            <p className="text-gray-500 text-xs">תאריך הפקה: {dateShort(project.invoicedAt || Date.now())}</p>
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">{settings.businessName || '—'}</p>
            {settings.ownerName && <p>{settings.ownerName}</p>}
            {settings.taxId && <p>{settings.businessType === 'murshe' ? 'ע.מ.' : 'ת.ז./ע.פ.'}: {settings.taxId}</p>}
            {settings.phone && <p>{settings.phone}</p>}
            {settings.email && <p>{settings.email}</p>}
            {settings.address && <p>{settings.address}</p>}
          </div>
        </header>

        <section className="mb-6">
          <h2 className="font-bold text-base mb-2">לכבוד</h2>
          <p className="font-bold">{project.clientName}</p>
          {project.phone && <p>טל': {project.phone}</p>}
          {project.address && <p>{project.address}</p>}
        </section>

        <section className="mb-6">
          <h2 className="font-bold text-base mb-2">פירוט</h2>
          <p className="text-gray-600 mb-2">{project.title}</p>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-right p-2 border border-gray-300 font-bold">תיאור</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-16">כמות</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-16">יח'</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-20">מחיר</th>
                <th className="text-center p-2 border border-gray-300 font-bold w-24">סה"כ</th>
              </tr>
            </thead>
            <tbody>
              {(project.items || []).map(it => (
                <tr key={it.id}>
                  <td className="p-2 border border-gray-300">{it.name}</td>
                  <td className="text-center p-2 border border-gray-300">{it.qty}</td>
                  <td className="text-center p-2 border border-gray-300">{UNIT_LABELS[it.unit]}</td>
                  <td className="text-center p-2 border border-gray-300">{nis(it.price)}</td>
                  <td className="text-center p-2 border border-gray-300">{nis(it.qty * it.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="ms-auto max-w-xs mb-8">
          <div className="space-y-1 border-t border-gray-300 pt-2">
            {settings.businessType === 'murshe' ? (
              <>
                <Row label="סכום לפני מע״מ" value={nis(calc.subtotal)} />
                <Row label={`מע״מ ${settings.vatRate}%`} value={nis(calc.vat)} />
                <Row label="סה״כ לתשלום" value={nis(calc.total)} bold />
              </>
            ) : (
              <>
                <Row label="סה״כ לתשלום" value={nis(calc.total)} bold />
                <p className="text-[11px] text-gray-500 mt-1">עוסק פטור — ללא מע"מ</p>
              </>
            )}
          </div>
        </section>

        <footer className="mt-12 pt-4 border-t border-gray-300 text-center">
          <p className="font-bold">תודה שבחרת בנו!</p>
          <p className="text-xs text-gray-500 mt-1">מסמך זה הופק באמצעות אפליקציית שיפוצניק</p>
        </footer>
      </div>
    </div>
  )
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? 'font-bold' : ''}>{label}</span>
      <span className={bold ? 'font-bold text-lg' : ''}>{value}</span>
    </div>
  )
}
