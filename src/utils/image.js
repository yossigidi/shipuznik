// המרת קובץ תמונה ל-dataURL עם compression בסיסי דרך canvas
// מטרה: לחסוך מקום ב-localStorage (יחליף ל-Firebase Storage בעתיד)

export async function fileToCompressedDataURL(file, { maxDim = 1280, quality = 0.78 } = {}) {
  if (!file || !file.type.startsWith('image/')) {
    throw new Error('הקובץ אינו תמונה')
  }
  const dataUrl = await new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result)
    r.onerror = reject
    r.readAsDataURL(file)
  })
  const img = await new Promise((resolve, reject) => {
    const im = new Image()
    im.onload = () => resolve(im)
    im.onerror = reject
    im.src = dataUrl
  })
  let { width, height } = img
  if (Math.max(width, height) > maxDim) {
    const scale = maxDim / Math.max(width, height)
    width = Math.round(width * scale)
    height = Math.round(height * scale)
  }
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)
  return canvas.toDataURL('image/jpeg', quality)
}
