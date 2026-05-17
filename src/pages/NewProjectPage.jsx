import { useState } from 'react'
import { Check } from 'lucide-react'
import { saveProject, newProjectId } from '../utils/storage'

export default function NewProjectPage({ onCreated }) {
  const [clientName, setClientName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [title, setTitle] = useState('')

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
