import { useState, useMemo, useEffect } from 'react'
import { Check, User } from 'lucide-react'
import { saveProject, newProjectId, listClients } from '../utils/storage'

export default function NewProjectPage({ onCreated }) {
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')
  const [clients, setClients] = useState([])

  useEffect(() => {
    setClients(listClients())
  }, [])

  // הצעות לקוחות קיימים — מסונן לפי הקלדה בשם/טלפון
  const suggestions = useMemo(() => {
    if (!clientName && !phone) return []
    const s = (clientName + ' ' + phone).trim().toLowerCase()
    if (s.length < 2) return []
    return clients.filter(c =>
      c.clientName.toLowerCase().includes(s) ||
      (phone && c.phone.includes(phone))
    ).slice(0, 3)
  }, [clientName, phone, clients])

  function pickClient(c) {
    setClientName(c.clientName)
    setPhone(c.phone)
    setAddress(c.address)
  }

  function submit(e) {
    e.preventDefault()
    if (!clientName.trim()) return
    const p = saveProject({
      id: newProjectId(),
      clientName: clientName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      title: title.trim() || 'הצעת מחיר',
      items: [],
      total: 0,
      status: 'draft',
      signature: null,
    })
    onCreated(p.id)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <p className="text-sm text-gray-600">פרטי הלקוח לפרוייקט החדש. אחר כך נבנה את הצעת המחיר.</p>

      <div>
        <label className="label">שם הלקוח <span className="text-red-500">*</span></label>
        <input
          className="input"
          placeholder="לדוגמה: דנה כהן"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          autoFocus
        />
        {suggestions.length > 0 && (
          <div className="mt-2 bg-brand-50 border border-brand-100 rounded-xl p-2 space-y-1">
            <div className="text-xs text-brand-700 font-semibold px-1">לקוחות קיימים:</div>
            {suggestions.map(c => (
              <button
                key={c.key}
                type="button"
                onClick={() => pickClient(c)}
                className="w-full bg-white rounded-lg p-2 text-right hover:bg-gray-50 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-brand-500 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm">{c.clientName}</div>
                  <div className="text-xs text-gray-500 truncate">
                    {c.phone}{c.address ? ` · ${c.address}` : ''}
                  </div>
                </div>
                <div className="text-xs text-gray-400">{c.projects.length} פרוייקטים</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="label">טלפון</label>
        <input
          className="input"
          type="tel"
          inputMode="tel"
          placeholder="050-1234567"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
      </div>

      <div>
        <label className="label">כתובת העבודה</label>
        <input
          className="input"
          placeholder="רחוב, מספר, עיר"
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
      </div>

      <div>
        <label className="label">כותרת הפרוייקט</label>
        <input
          className="input"
          placeholder="לדוגמה: שיפוץ אמבטיה"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>

      <button type="submit" className="btn-primary w-full text-base" disabled={!clientName.trim()}>
        <Check className="w-5 h-5" />
        צור פרוייקט
      </button>
    </form>
  )
}
