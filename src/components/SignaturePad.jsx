import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'

// Canvas לחתימה באצבע — כולל טיפול ב-pointer events ל-mobile + עכבר
export default function SignaturePad({ onChange, height = 200 }) {
  const canvasRef = useRef(null)
  const drawingRef = useRef(false)
  const lastRef = useRef({ x: 0, y: 0 })
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // התאמת DPR למסכים חדים
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = height * dpr
    canvas.style.height = `${height}px`
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.strokeStyle = '#111827'
    ctx.lineWidth = 2.5
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [height])

  function pos(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function start(e) {
    e.preventDefault()
    drawingRef.current = true
    lastRef.current = pos(e)
    canvasRef.current.setPointerCapture(e.pointerId)
  }

  function move(e) {
    if (!drawingRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const p = pos(e)
    ctx.beginPath()
    ctx.moveTo(lastRef.current.x, lastRef.current.y)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    lastRef.current = p
    if (!hasInk) setHasInk(true)
  }

  function end() {
    if (!drawingRef.current) return
    drawingRef.current = false
    onChange?.(canvasRef.current.toDataURL('image/png'))
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange?.(null)
  }

  return (
    <div className="space-y-2">
      <div className="relative border-2 border-dashed border-gray-300 rounded-xl bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full block touch-none"
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerLeave={end}
          onPointerCancel={end}
        />
        {!hasInk && (
          <div className="absolute inset-0 grid place-items-center text-gray-400 pointer-events-none text-sm">
            חתום כאן עם האצבע
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={clear}
        className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
      >
        <RotateCcw className="w-4 h-4" />
        נקה חתימה
      </button>
    </div>
  )
}
