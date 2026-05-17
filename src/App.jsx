import { useCallback, useState } from 'react'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import ProjectsListPage from './pages/ProjectsListPage'
import NewProjectPage from './pages/NewProjectPage'
import ProjectPage from './pages/ProjectPage'
import QuantityCalcPage from './pages/QuantityCalcPage'
import CostCalcPage from './pages/CostCalcPage'
import ClientViewPage from './pages/ClientViewPage'

// ניווט בסטייט פשוט — אין react-router, רק עמדת page נוכחית + history
const PAGE_TITLES = {
  home:        'שיפוצניק',
  projects:    'הפרוייקטים שלי',
  newProject:  'פרוייקט חדש',
  project:     'פרוייקט',
  quantityCalc:'מחשבון כמויות',
  costCalc:    'מחשבון עלויות',
  clientView:  'הצעת מחיר',
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
    case 'costCalc':     return <CostCalcPage />
    case 'clientView':   return <ClientViewPage projectId={params.id} />
    default:             return <HomePage onNavigate={nav.navigate} />
  }
}
