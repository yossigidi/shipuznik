import { useState } from 'react'
import { Check, Building2 } from 'lucide-react'
import { getSettings, saveSettings } from '../utils/storage'

export default function SettingsPage() {
  const [settings, setSettings] = useState(getSettings)
  const [saved, setSaved] = useState(false)

  function update(patch) {
    const next = { ...settings, ...patch }
    setSettings(next)
  }

  function submit(e) {
    e.preventDefault()
    saveSettings(settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="card bg-brand-50 border border-brand-100 flex items-center gap-3">
        <Building2 className="w-6 h-6 text-brand-600 flex-shrink-0" />
        <p className="text-sm text-brand-900">
          הפרטים האלה יופיעו על חוזים וחשבוניות שתפיק ללקוחות.
        </p>
      </div>

      <div>
        <label className="label">שם העסק</label>
        <input
          className="input"
          value={settings.businessName}
          onChange={e => update({ businessName: e.target.value })}
          placeholder="לדוגמה: אבי שיפוצים"
        />
      </div>

      <div>
        <label className="label">שם בעל העסק</label>
        <input
          className="input"
          value={settings.ownerName}
          onChange={e => update({ ownerName: e.target.value })}
          placeholder="שם פרטי + משפחה"
        />
      </div>

      <div>
        <label className="label">סוג עסק</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => update({ businessType: 'patur' })}
            className={[
              'p-3 rounded-xl border-2 text-center',
              settings.businessType === 'patur' ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white',
            ].join(' ')}
          >
            <div className="font-semibold">עוסק פטור</div>
            <div className="text-xs text-gray-500">ללא מע"מ</div>
          </button>
          <button
            type="button"
            onClick={() => update({ businessType: 'murshe' })}
            className={[
              'p-3 rounded-xl border-2 text-center',
              settings.businessType === 'murshe' ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white',
            ].join(' ')}
          >
            <div className="font-semibold">עוסק מורשה</div>
            <div className="text-xs text-gray-500">כולל מע"מ</div>
          </button>
        </div>
      </div>

      <div>
        <label className="label">{settings.businessType === 'murshe' ? 'מספר עוסק מורשה' : 'תעודת זהות / מספר עוסק'}</label>
        <input
          className="input"
          inputMode="numeric"
          value={settings.taxId}
          onChange={e => update({ taxId: e.target.value })}
          placeholder="9 ספרות"
        />
      </div>

      {settings.businessType === 'murshe' && (
        <div>
          <label className="label">אחוז מע"מ</label>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            min="0"
            max="100"
            value={settings.vatRate}
            onChange={e => update({ vatRate: Number(e.target.value) })}
          />
        </div>
      )}

      <div>
        <label className="label">טלפון</label>
        <input
          className="input"
          type="tel"
          inputMode="tel"
          value={settings.phone}
          onChange={e => update({ phone: e.target.value })}
          placeholder="050-1234567"
        />
      </div>

      <div>
        <label className="label">אימייל</label>
        <input
          className="input"
          type="email"
          value={settings.email}
          onChange={e => update({ email: e.target.value })}
        />
      </div>

      <div>
        <label className="label">כתובת העסק</label>
        <input
          className="input"
          value={settings.address}
          onChange={e => update({ address: e.target.value })}
        />
      </div>

      <button type="submit" className="btn-primary w-full">
        <Check className="w-5 h-5" />
        {saved ? 'נשמר!' : 'שמור הגדרות'}
      </button>
    </form>
  )
}
