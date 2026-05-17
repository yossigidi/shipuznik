import { useRef, useState } from 'react'
import { Camera, Trash2, Image as ImageIcon, X } from 'lucide-react'
import { fileToCompressedDataURL } from '../utils/image'

const PHASES = [
  { id: 'before', label: 'לפני',   color: 'bg-amber-100 text-amber-700' },
  { id: 'during', label: 'תוך כדי', color: 'bg-blue-100 text-blue-700' },
  { id: 'after',  label: 'אחרי',   color: 'bg-green-100 text-green-700' },
]

// אלבום פרוייקט — תמונות מתויגות לפי שלב (לפני/תוך כדי/אחרי)
export default function PhotosPanel({ photos, onChange }) {
  const [phase, setPhase] = useState('before')
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState(null)
  const fileInputRef = useRef(null)

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setBusy(true)
    try {
      const next = [...(photos || [])]
      for (const f of files) {
        try {
          const dataUrl = await fileToCompressedDataURL(f)
          next.push({
            id: 'ph_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
            phase,
            dataUrl,
            addedAt: Date.now(),
          })
        } catch (err) {
          console.error('image conversion failed', err)
        }
      }
      onChange(next)
    } finally {
      setBusy(false)
      e.target.value = '' // לאפשר בחירה חוזרת של אותו קובץ
    }
  }

  function removePhoto(id) {
    onChange((photos || []).filter(p => p.id !== id))
  }

  const grouped = PHASES.map(p => ({
    ...p,
    items: (photos || []).filter(x => x.phase === p.id),
  }))

  return (
    <div className="card space-y-3">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-brand-500" />
        <h3 className="font-bold flex-1">אלבום פרוייקט</h3>
        <span className="text-xs text-gray-500">{(photos || []).length} תמונות</span>
      </div>

      <div className="grid grid-cols-3 gap-1.5">
        {PHASES.map(p => (
          <button
            key={p.id}
            onClick={() => setPhase(p.id)}
            className={[
              'py-2 px-2 rounded-lg text-sm font-semibold transition-colors border',
              phase === p.id
                ? 'bg-brand-500 text-white border-brand-500'
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
            ].join(' ')}
          >
            {p.label}
          </button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        onChange={handleFiles}
        className="hidden"
      />

      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={busy}
        className="btn-primary w-full disabled:opacity-50"
      >
        <Camera className="w-5 h-5" />
        {busy ? 'מעלה תמונות...' : `הוסף תמונה — ${PHASES.find(p => p.id === phase)?.label}`}
      </button>

      {grouped.map(g => (
        g.items.length > 0 && (
          <div key={g.id}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${g.color}`}>{g.label}</span>
              <span className="text-xs text-gray-500">{g.items.length}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {g.items.map(p => (
                <button
                  key={p.id}
                  onClick={() => setPreview(p)}
                  className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                >
                  <img src={p.dataUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )
      ))}

      {preview && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreview(null)}
        >
          <button
            className="absolute top-4 left-4 text-white p-2 bg-white/10 rounded-full"
            onClick={() => setPreview(null)}
            aria-label="סגור"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            className="absolute bottom-6 right-1/2 translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              if (window.confirm('למחוק את התמונה?')) {
                removePhoto(preview.id)
                setPreview(null)
              }
            }}
          >
            <Trash2 className="w-4 h-4" /> מחק
          </button>
          <img
            src={preview.dataUrl}
            alt=""
            className="max-w-full max-h-full object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  )
}
