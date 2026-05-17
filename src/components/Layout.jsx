import { ArrowRight } from 'lucide-react'

// מעטפת מובייל-פירסט עם header דביק והגבלת רוחב לדמוי-נייד במסך גדול
export default function Layout({ title, onBack, action, children }) {
  return (
    <div className="min-h-full bg-gray-50 flex justify-center">
      <div className="w-full max-w-md min-h-full flex flex-col bg-white shadow-soft md:my-4 md:rounded-3xl md:overflow-hidden">
        <header className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-100">
          <div className="flex items-center gap-2 px-3 py-3 min-h-[56px]">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 -m-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                aria-label="חזרה"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            )}
            <h1 className="flex-1 text-lg font-bold text-gray-900 truncate">{title}</h1>
            {action}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 pb-24">{children}</main>
      </div>
    </div>
  )
}
