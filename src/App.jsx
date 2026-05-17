import { useCallback, useState } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProjectsListPage from './pages/ProjectsListPage'
import NewProjectPage from './pages/NewProjectPage'
import ProjectPage from './pages/ProjectPage'
import QuantityCalcPage from './pages/QuantityCalcPage'
import CostCalcPage from './pages/CostCalcPage'
import ClientViewPage from './pages/ClientViewPage'
import QuickQuotePage from './pages/QuickQuotePage'
import ClientsPage from './pages/ClientsPage'
import SettingsPage from './pages/SettingsPage'
import ContractPage from './pages/ContractPage'
import InvoicePage from './pages/InvoicePage'
import PortfolioPage from './pages/PortfolioPage'
import CalendarPage from './pages/CalendarPage'
import SuppliersPage from './pages/SuppliersPage'

// ניווט בסטייט פשוט — אין react-router, רק עמדת page נוכחית + history
const PAGE_TITLES = {
  home:        'שיפוצניק',
  projects:    'הפרוייקטים שלי',
  newProject:  'פרוייקט חדש',
  project:     'פרוייקט',
  quantityCalc:'מחשבון כמויות',
  costCalc:    'מחשבון עלויות',
  clientView:  'הצעת מחיר',
  quickQuote:  'הצעה מהירה',
  clients:     'הלקוחות שלי',
  settings:    'הגדרות',
  contract:    'חוזה עבודה',
  invoice:     'חשבונית',
  portfolio:   'הפורטפוליו שלי',
  calendar:    'יומן פרוייקטים',
  suppliers:   'הספקים שלי',
}

export default function App() {
  const [stack, setStack] = useState([{ page: 'home', params: {} }])

  const current = stack[stack.length - 1]

  const navigate = useCallback((page, params = {}) => {
    setStack(s => [...s, { page, params }])
  }, [])

  const back = useCallback(() => {
    setStack(s => (s.length > 1 ? s.slice(0, -1) : s))
  }, [])

  const replace = useCallback((page, params = {}) => {
    setStack(s => [...s.slice(0, -1), { page, params }])
  }, [])

  const goHome = useCallback(() => setStack([{ page: 'home', params: {} }]), [])

  const isHome = current.page === 'home'
  const title = PAGE_TITLES[current.page] || ''

  return (
    <Layout title={title} onBack={isHome ? null : back}>
      {renderPage(current.page, current.params, { navigate, back, replace, goHome })}
    </Layout>
  )
}

function renderPage(page, params, nav) {
  switch (page) {
    case 'home':         return <HomePage onNavigate={nav.navigate} />
    case 'projects':     return <ProjectsListPage onNavigate={nav.navigate} />
    case 'newProject':   return <NewProjectPage onCreated={(id) => nav.replace('project', { id })} />
    case 'project':      return <ProjectPage projectId={params.id} onNavigate={nav.navigate} onDeleted={nav.goHome} />
    case 'quantityCalc': return <QuantityCalcPage />
    case 'costCalc':     return <CostCalcPage onNavigate={nav.navigate} />
    case 'clientView':   return <ClientViewPage projectId={params.id} />
    case 'quickQuote':   return <QuickQuotePage onNavigate={nav.navigate} />
    case 'clients':      return <ClientsPage onNavigate={nav.navigate} />
    case 'settings':     return <SettingsPage />
    case 'contract':     return <ContractPage projectId={params.id} onNavigate={nav.navigate} />
    case 'invoice':      return <InvoicePage projectId={params.id} onNavigate={nav.navigate} />
    case 'portfolio':    return <PortfolioPage />
    case 'calendar':     return <CalendarPage onNavigate={nav.navigate} />
    case 'suppliers':    return <SuppliersPage />
    default:             return <HomePage onNavigate={nav.navigate} />
  }
}
