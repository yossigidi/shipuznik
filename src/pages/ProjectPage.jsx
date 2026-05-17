import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Share2, FileText, Phone, MapPin, Pencil, ListChecks, CircleDollarSign, Image as ImageIcon, Sparkles, Wallet } from 'lucide-react'
import { getProject, saveProject, deleteProject } from '../utils/storage'
import { nis } from '../utils/format'
import { UNIT_LABELS } from '../data/workItems'
import AddItemSheet from '../components/AddItemSheet'
import PaymentsPanel from '../components/PaymentsPanel'
import PhotosPanel from '../components/PhotosPanel'
import PackagePicker from '../components/PackagePicker'
import ExpensesPanel from '../components/ExpensesPanel'
import ProfitabilityPanel from '../components/ProfitabilityPanel'

const TABS = [
  { id: 'items',    label: 'פריטים',   icon: ListChecks },
  { id: 'payments', label: 'תשלומים',  icon: CircleDollarSign },
  { id: 'money',    label: 'כסף',      icon: Wallet },
  { id: 'photos',   label: 'תמונות',   icon: ImageIcon },
]

export default function ProjectPage({ projectId, onNavigate, onDeleted }) {
  const [project, setProject] = useState(null)
  const [showSheet, setShowSheet] = useState(false)
  const [showPackages, setShowPackages] = useState(false)
  const [editingHeader, setEditingHeader] = useState(false)
  const [tab, setTab] = useState('items')

  useEffect(() => {
    setProject(getProject(projectId))
  }, [projectId])

  const total = useMemo(() => {
    if (!project) return 0
    return (project.items || []).reduce((s, it) => s + (Number(it.qty) || 0) * (Number(it.price) || 0), 0)
  }, [project])

  function update(patch) {
    const next = { ...project, ...patch }
    setProject(saveProject({ ...next, total: calcTotal(next.items) }))
  }

  function addItem(item) {
    update({ items: [...(project.items || []), item] })
    setShowSheet(false)
  }

  function addItemsBulk(items) {
    update({ items: [...(project.items || []), ...items] })
    setShowPackages(false)
  }

  function removeItem(id) {
    update({ items: (project.items || []).filter(i => i.id !== id) })
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
    const link = `${window.location.origin}/?view=${project.id}`
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
          <EditHeader
            project={project}
            onSave={(patch) => { update(patch); setEditingHeader(false) }}
            onCancel={() => setEditingHeader(false)}
          />
        ) : (
          <ProjectHeader project={project} onEdit={() => setEditingHeader(true)} />
        )}
      </section>

      <nav className="grid grid-cols-4 gap-1 bg-white rounded-2xl p-1 shadow-card sticky top-[56px] z-10">
        {TABS.map(t => {
          const Icon = t.icon
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                'flex flex-col items-center gap-0.5 py-2 rounded-xl text-xs font-semibold transition-colors',
                active ? 'bg-brand-500 text-white' : 'text-gray-600 hover:bg-gray-50',
              ].join(' ')}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          )
        })}
      </nav>

      {tab === 'items' && (
        <ItemsTab
          project={project}
          total={total}
          onAdd={() => setShowSheet(true)}
          onAddPackage={() => setShowPackages(true)}
          onRemove={removeItem}
          onShare={shareToWhatsapp}
          onClientView={() => onNavigate('clientView', { id: project.id })}
        />
      )}

      {tab === 'payments' && (
        <PaymentsPanel
          total={total}
          milestones={project.milestones || []}
          onChange={(milestones) => update({ milestones })}
        />
      )}

      {tab === 'money' && (
        <div className="space-y-3">
          <ExpensesPanel
            expenses={project.expenses || []}
            revenue={total}
            onChange={(expenses) => update({ expenses })}
          />
          <ProfitabilityPanel
            revenue={total}
            expenses={(project.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0)}
            days={project.estimatedDays || 0}
            onChangeDays={(estimatedDays) => update({ estimatedDays })}
          />
        </div>
      )}

      {tab === 'photos' && (
        <PhotosPanel
          photos={project.photos || []}
          onChange={(photos) => update({ photos })}
        />
      )}

      <button
        onClick={confirmDelete}
        className="w-full text-sm text-red-500 hover:text-red-700 py-3"
      >
        מחק פרוייקט
      </button>

      {showSheet && <AddItemSheet onClose={() => setShowSheet(false)} onAdd={addItem} />}
      {showPackages && <PackagePicker onClose={() => setShowPackages(false)} onAdd={addItemsBulk} />}
    </div>
  )
}

function ProjectHeader({ project, onEdit }) {
  return (
    <>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-lg font-bold text-gray-900">{project.clientName}</div>
          <div className="text-sm text-gray-600">{project.title}</div>
        </div>
        <button onClick={onEdit} className="p-2 -m-2 text-gray-500 hover:text-gray-800">
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
  )
}

function ItemsTab({ project, total, onAdd, onAddPackage, onRemove, onShare, onClientView }) {
  const isEmpty = (project.items || []).length === 0

  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="font-bold text-gray-900">פריטי עבודה</h2>
          <span className="text-sm text-gray-500">{(project.items || []).length} פריטים</span>
        </div>

        {isEmpty && (
          <button
            onClick={onAddPackage}
            className="w-full card bg-gradient-to-br from-brand-500 to-brand-600 text-white text-right mb-2 hover:shadow-soft transition-shadow"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div className="flex-1">
                <div className="font-bold">התחל מחבילה מוכנה</div>
                <div className="text-xs opacity-90">קוסמטי / חלקי / מלא לפי חדר — 10 שניות</div>
              </div>
            </div>
          </button>
        )}

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
                  onClick={() => onRemove(it.id)}
                  className="text-red-500 hover:text-red-700 p-1 -m-1"
                  aria-label="מחק"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={onAdd}
              className="card border-2 border-dashed border-gray-200 text-brand-600 font-semibold hover:bg-brand-50 py-3 text-sm"
            >
              <Plus className="w-5 h-5 inline" /> פריט בודד
            </button>
            <button
              onClick={onAddPackage}
              className="card border-2 border-dashed border-brand-200 bg-brand-50 text-brand-700 font-semibold hover:bg-brand-100 py-3 text-sm"
            >
              <Sparkles className="w-5 h-5 inline" /> חבילה מוכנה
            </button>
          </div>
        </div>
      </section>

      <section className="card bg-gray-900 text-white flex items-center justify-between mt-4">
        <span className="text-sm opacity-80">סה״כ הצעה</span>
        <span className="text-2xl font-bold">{nis(total)}</span>
      </section>

      <section className="grid grid-cols-2 gap-2 mt-2">
        <button
          onClick={onShare}
          className="btn-primary"
          disabled={(project.items || []).length === 0}
        >
          <Share2 className="w-5 h-5" />
          שלח בוואטסאפ
        </button>
        <button onClick={onClientView} className="btn-secondary">
          <FileText className="w-5 h-5" />
          תצוגת לקוח
        </button>
      </section>
    </>
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
