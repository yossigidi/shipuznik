import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Share2, FileText, Phone, MapPin, Pencil } from 'lucide-react'
import { getProject, saveProject, deleteProject } from '../utils/storage'
import { nis } from '../utils/format'
import { UNIT_LABELS } from '../data/workItems'
import AddItemSheet from '../components/AddItemSheet'

export default function ProjectPage({ projectId, onNavigate, onDeleted }) {
  const [project, setProject] = useState(null)
  const [showSheet, setShowSheet] = useState(false)
  const [editingHeader, setEditingHeader] = useState(false)

  useEffect(() => {
    const p = getProject(projectId)
    setProject(p)
  }, [projectId])

  const total = useMemo(() => {
    if (!project) return 0
    return (project.items || []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0)
  }, [project])

  function update(patch) {
    const next = { ...project, ...patch }
    const saved = saveProject({ ...next, total: calcTotal(next.items) })
    setProject(saved)
  }

  function addItem(item) {
    const items = [...(project.items || []), item]
    update({ items })
    setShowSheet(false)
  }

  function removeItem(id) {
    const items = (project.items || []).filter(i => i.id !== id)
    update({ items })
  }

  function shareToWhatsapp() {
    if (!project) return
    const lines = [
      `הצעת מחיר עבור ${project.clientName}`,
      project.title ? project.title : '',
      '',
      ...(project.items || []).map(it =>
        `• ${it.name} — ${it.qty} ${UNIT_LABELS[it.unit]} × ${nis(it.price)} = ${nis(it.qty * it.price)}`
      ),
      '',
      `סה״כ: ${nis(total)}`,
    ].filter(Boolean)
    const link = `${window.location.origin}/?view=${project.id}` // לעתיד: עמוד ציבורי אמיתי
    const text = encodeURIComponent(lines.join('\n') + `\n\nלאישור וחתימה: ${link}`)
    const phone = (project.phone || '').replace(/[^\d]/g, '').replace(/^0/, '972')
    const url = phone
      ? `https://wa.me/${phone}?text=${text}`
      : `https://wa.me/?text=${text}`
    window.open(url, '_blank')
    if (project.status === 'draft') update({ status: 'sent' })
  }

  function confirmDelete() {
    if (!window.confirm('למחוק את הפרוייקט? פעולה לא הפיכה.')) return
    deleteProject(project.id)
    onDeleted()
  }

  if (!project) {
    return <div className="text-center text-gray-500 py-10">לא נמצא פרוייקט</div>
  }

  return (
    <div className="space-y-4">
      <section className="card">
        {editingHeader ? (
          <EditHeader project={project} onSave={(patch) => { update(patch); setEditingHeader(false) }} onCancel={() => setEditingHeader(false)} />
        ) : (
          <>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-lg font-bold text-gray-900">{project.clientName}</div>
                <div className="text-sm text-gray-600">{project.title}</div>
              </div>
              <button onClick={() => setEditingHeader(true)} className="p-2 -m-2 text-gray-500 hover:text-gray-800">
                <Pencil className="w-4 h-4" />
              </button>
            </div>
            {(project.phone || project.address) && (
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                {project.phone && (
                  <a href={`tel:${project.phone}`} className="flex items-center gap-2 hover:text-brand-600">
                    <Phone className="w-4 h-4" /> {project.phone}
                  </a>
                )}
                {project.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {project.address}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="font-bold text-gray-900">פריטי עבודה</h2>
          <span className="text-sm text-gray-500">{(project.items || []).length} פריטים</span>
        </div>

        <div className="space-y-2">
          {(project.items || []).map(it => (
            <div key={it.id} className="card flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900">{it.name}</div>
                <div className="text-sm text-gray-500">
                  {it.qty} {UNIT_LABELS[it.unit]} × {nis(it.price)}
                </div>
                {it.note && <div className="text-xs text-gray-400 mt-1">{it.note}</div>}
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900">{nis(it.qty * it.price)}</div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="text-red-500 hover:text-red-700 p-1 -m-1"
                  aria-label="מחק"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <button
            onClick={() => setShowSheet(true)}
            className="w-full card border-2 border-dashed border-gray-200 text-brand-600 font-semibold hover:bg-brand-50"
          >
            <Plus className="w-5 h-5 inline" /> הוסף פריט עבודה
          </button>
        </div>
      </section>

      <section className="card bg-gray-900 text-white flex items-center justify-between">
        <span className="text-sm opacity-80">סה״כ הצעה</span>
        <span className="text-2xl font-bold">{nis(total)}</span>
      </section>

      <section className="grid grid-cols-2 gap-2">
        <button
          onClick={shareToWhatsapp}
          className="btn-primary"
          disabled={(project.items || []).length === 0}
        >
          <Share2 className="w-5 h-5" />
          שלח בוואטסאפ
        </button>
        <button
          onClick={() => onNavigate('clientView', { id: project.id })}
          className="btn-secondary"
        >
          <FileText className="w-5 h-5" />
          תצוגת לקוח
        </button>
      </section>

      <button
        onClick={confirmDelete}
        className="w-full text-sm text-red-500 hover:text-red-700 py-3"
      >
        מחק פרוייקט
      </button>

      {showSheet && <AddItemSheet onClose={() => setShowSheet(false)} onAdd={addItem} />}
    </div>
  )
}

function calcTotal(items) {
  return (items || []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0)
}

function EditHeader({ project, onSave, onCancel }) {
  const [clientName, setClientName] = useState(project.clientName || '')
  const [phone, setPhone] = useState(project.phone || '')
  const [address, setAddress] = useState(project.address || '')
  const [title, setTitle] = useState(project.title || '')

  return (
    <div className="space-y-2">
      <input className="input" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="שם לקוח" />
      <input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="כותרת הפרוייקט" />
      <input className="input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="טלפון" type="tel" />
      <input className="input" value={address} onChange={e => setAddress(e.target.value)} placeholder="כתובת" />
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button className="btn-secondary" onClick={onCancel}>ביטול</button>
        <button className="btn-primary" onClick={() => onSave({ clientName: clientName.trim(), phone, address, title: title.trim() || 'הצעת מחיר' })}>
          שמור
        </button>
      </div>
    </div>
  )
}
