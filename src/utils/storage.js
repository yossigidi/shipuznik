// אחסון מקומי פשוט ב-localStorage. בעתיד יוחלף ב-Firestore.

const KEY = 'shipuznik:v1'
const SETTINGS_KEY = 'shipuznik:settings:v1'

function readAll() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : { projects: [] }
  } catch {
    return { projects: [] }
  }
}

function writeAll(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

const DEFAULT_SETTINGS = {
  businessName: '',     // שם העסק (לדוגמה: "אבי שיפוצים")
  ownerName: '',        // שם בעל העסק
  taxId: '',            // ת.ז. או ע.מ.
  businessType: 'patur', // patur | murshe
  phone: '',
  email: '',
  address: '',
  vatRate: 17,          // אחוז מע"מ
  invoiceCounter: 1,    // מספור רץ לחשבוניות
}

export function getSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    return raw ? { ...DEFAULT_SETTINGS, ...JSON.parse(raw) } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(patch) {
  const next = { ...getSettings(), ...patch }
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  return next
}

export function nextInvoiceNumber() {
  const s = getSettings()
  const n = s.invoiceCounter || 1
  saveSettings({ invoiceCounter: n + 1 })
  return n
}

export function listProjects() {
  return readAll().projects
}

export function getProject(id) {
  return readAll().projects.find(p => p.id === id) || null
}

export function saveProject(project) {
  const data = readAll()
  const idx = data.projects.findIndex(p => p.id === project.id)
  const now = Date.now()
  const next = { ...project, updatedAt: now, createdAt: project.createdAt || now }
  if (idx >= 0) data.projects[idx] = next
  else data.projects.push(next)
  writeAll(data)
  return next
}

export function deleteProject(id) {
  const data = readAll()
  data.projects = data.projects.filter(p => p.id !== id)
  writeAll(data)
}

export function newProjectId() {
  return 'p_' + Math.random().toString(36).slice(2, 10)
}

// מקבץ פרוייקטים ללקוחות לפי טלפון (או שם אם אין טלפון)
// מחזיר: [{ key, clientName, phone, address, projects, totalRevenue, lastProjectAt }]
export function listClients() {
  const projects = listProjects()
  const map = new Map()
  for (const p of projects) {
    const key = (p.phone || '').replace(/[^\d]/g, '') || `name:${p.clientName || ''}`
    if (!map.has(key)) {
      map.set(key, {
        key,
        clientName: p.clientName || 'ללא שם',
        phone: p.phone || '',
        address: p.address || '',
        projects: [],
        totalRevenue: 0,
        lastProjectAt: 0,
      })
    }
    const c = map.get(key)
    c.projects.push(p)
    c.totalRevenue += Number(p.total) || 0
    if ((p.updatedAt || 0) > c.lastProjectAt) c.lastProjectAt = p.updatedAt || 0
    // עדכן את הכתובת לאחרונה שמולאה
    if (p.address && !c.address) c.address = p.address
  }
  return Array.from(map.values()).sort((a, b) => b.lastProjectAt - a.lastProjectAt)
}
