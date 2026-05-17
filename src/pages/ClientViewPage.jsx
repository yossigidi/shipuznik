import { useEffect, useState } from 'react'
import { CheckCircle2, Hammer } from 'lucide-react'
import { getProject, saveProject } from '../utils/storage'
import { nis, dateShort } from '../utils/format'
import { UNIT_LABELS } from '../data/workItems'
import SignaturePad from '../components/SignaturePad'

// תצוגת לקוח — מה הלקוח רואה כשמקבל את הלינק. כולל אישור + חתימה.
export default function ClientViewPage({ projectId }) {
  const [project, setProject] = useState(null)
  const [signature, setSignature] = useState(null)
  const [signedAt, setSignedAt] = useState(null)

  useEffect(() => {
    const p = getProject(projectId)
    setProject(p)
    if (p?.signature) {
      setSignature(p.signature)
      setSignedAt(p.signedAt)
    }
  }, [projectId])

  if (!project) {
    return <div className="text-center text-gray-500 py-10">לא נמצאה הצעה</div>
  }

  const isSigned = !!signedAt

  function approve() {
    if (!signature) {
      alert('נא לחתום לפני האישור')
      return
    }
    const now = Date.now()
    saveProject({ ...project, signature, signedAt: now, status: 'approved' })
    setSignedAt(now)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-2xl p-5 text-center shadow-soft">
        <div className="w-12 h-12 rounded-xl bg-white/20 grid place-items-center mx-auto mb-2">
          <Hammer className="w-6 h-6" />
        </div>
        <div className="text-sm opacity-90">הצעת מחיר עבור</div>
        <div className="text-xl font-bold">{project.clientName}</div>
        <div className="text-sm opacity-90 mt-1">{project.title}</div>
      </div>

      <div className="card">
        <h3 className="font-bold mb-3">פירוט עבודה</h3>
        <div className="divide-y divide-gray-100">
          {(project.items || []).map(it => (
            <div key={it.id} className="py-2.5 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-gray-900">{it.name}</div>
                <div className="text-sm text-gray-500">
                  {it.qty} {UNIT_LABELS[it.unit]} × {nis(it.price)}
                </div>
                {it.note && <div className="text-xs text-gray-400">{it.note}</div>}
              </div>
              <div className="font-bold text-gray-900 whitespace-nowrap">{nis(it.qty * it.price)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gray-900 text-white flex items-center justify-between">
        <span className="opacity-80">סה״כ לתשלום</span>
        <span className="text-2xl font-bold">{nis(project.total || 0)}</span>
      </div>

      {!isSigned ? (
        <div className="card space-y-3">
          <div>
            <h3 className="font-bold">אישור הלקוח</h3>
            <p className="text-sm text-gray-600">אני מאשר את ההצעה ואת תנאיה, כולל הפריטים שלעיל.</p>
          </div>
          <SignaturePad onChange={setSignature} />
          <button
            onClick={approve}
            className="btn-primary w-full"
            disabled={!signature}
          >
            <CheckCircle2 className="w-5 h-5" />
            אני מאשר את ההצעה
          </button>
        </div>
      ) : (
        <div className="card bg-green-50 border border-green-100">
          <div className="flex items-center gap-2 text-green-700 font-bold">
            <CheckCircle2 className="w-5 h-5" />
            ההצעה אושרה
          </div>
          <div className="text-sm text-green-700/80 mt-1">{dateShort(signedAt)}</div>
          {signature && (
            <img src={signature} alt="חתימת לקוח" className="mt-3 max-h-32 mx-auto bg-white rounded-lg border border-green-200 p-2" />
          )}
        </div>
      )}
    </div>
  )
}
