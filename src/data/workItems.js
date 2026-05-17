// קטלוג פריטי עבודה נפוצים — מקובץ לפי קטגוריה
// יחידה: m² (מ"ר), m (מטר רץ), unit (יחידה), day (יום עבודה), job (עבודה גלובלית)

export const WORK_CATEGORIES = [
  {
    id: 'flooring',
    name: 'ריצוף',
    icon: '🧱',
    items: [
      { id: 'fl-ceramic',   name: 'ריצוף קרמיקה',          unit: 'm²', defaultPrice: 180 },
      { id: 'fl-porcelain', name: 'ריצוף פורצלן',          unit: 'm²', defaultPrice: 250 },
      { id: 'fl-parquet',   name: 'הנחת פרקט',             unit: 'm²', defaultPrice: 220 },
      { id: 'fl-skirting',  name: 'התקנת פנלים',           unit: 'm',  defaultPrice: 35 },
      { id: 'fl-demo',      name: 'פירוק ריצוף קיים',      unit: 'm²', defaultPrice: 60 },
    ],
  },
  {
    id: 'paint',
    name: 'צבע וטיח',
    icon: '🎨',
    items: [
      { id: 'pa-walls',     name: 'צביעת קירות (שכבה אחת)', unit: 'm²', defaultPrice: 30 },
      { id: 'pa-walls-2',   name: 'צביעה + שכבת יסוד',      unit: 'm²', defaultPrice: 45 },
      { id: 'pa-ceiling',   name: 'צביעת תקרה',            unit: 'm²', defaultPrice: 40 },
      { id: 'pa-plaster',   name: 'תיקוני טיח',            unit: 'm²', defaultPrice: 80 },
      { id: 'pa-spakhtel',  name: 'שפכטל מלא',             unit: 'm²', defaultPrice: 60 },
    ],
  },
  {
    id: 'plumbing',
    name: 'אינסטלציה',
    icon: '🚰',
    items: [
      { id: 'pl-sink',      name: 'התקנת כיור',            unit: 'unit', defaultPrice: 350 },
      { id: 'pl-toilet',    name: 'התקנת אסלה',            unit: 'unit', defaultPrice: 450 },
      { id: 'pl-faucet',    name: 'החלפת ברז',             unit: 'unit', defaultPrice: 200 },
      { id: 'pl-shower',    name: 'התקנת מקלחון',          unit: 'unit', defaultPrice: 800 },
      { id: 'pl-pipes',     name: 'החלפת צנרת',            unit: 'm',    defaultPrice: 120 },
      { id: 'pl-leak',      name: 'איתור ותיקון נזילה',    unit: 'job',  defaultPrice: 600 },
    ],
  },
  {
    id: 'electrical',
    name: 'חשמל',
    icon: '⚡',
    items: [
      { id: 'el-outlet',    name: 'הוספת שקע',             unit: 'unit', defaultPrice: 220 },
      { id: 'el-switch',    name: 'החלפת מפסק',            unit: 'unit', defaultPrice: 80 },
      { id: 'el-light',     name: 'התקנת גוף תאורה',       unit: 'unit', defaultPrice: 150 },
      { id: 'el-panel',     name: 'שדרוג לוח חשמל',        unit: 'job',  defaultPrice: 1800 },
      { id: 'el-wire',      name: 'מתיחת חוטי חשמל',       unit: 'm',    defaultPrice: 40 },
    ],
  },
  {
    id: 'drywall',
    name: 'גבס ושיפוצים',
    icon: '🔨',
    items: [
      { id: 'dw-wall',      name: 'הקמת קיר גבס',          unit: 'm²', defaultPrice: 220 },
      { id: 'dw-ceiling',   name: 'תקרת גבס',              unit: 'm²', defaultPrice: 260 },
      { id: 'dw-niche',     name: 'בניית גומחה',           unit: 'unit', defaultPrice: 450 },
      { id: 'dw-demo-wall', name: 'הריסת קיר',             unit: 'm²', defaultPrice: 180 },
    ],
  },
  {
    id: 'doors',
    name: 'דלתות וחלונות',
    icon: '🚪',
    items: [
      { id: 'dr-door',      name: 'התקנת דלת פנים',        unit: 'unit', defaultPrice: 650 },
      { id: 'dr-entry',     name: 'התקנת דלת כניסה',       unit: 'unit', defaultPrice: 1200 },
      { id: 'dr-window',    name: 'התקנת חלון',            unit: 'unit', defaultPrice: 950 },
      { id: 'dr-handle',    name: 'החלפת ידית',            unit: 'unit', defaultPrice: 60 },
    ],
  },
]

export const ALL_WORK_ITEMS = WORK_CATEGORIES.flatMap(c =>
  c.items.map(item => ({ ...item, categoryId: c.id, categoryName: c.name }))
)

export const UNIT_LABELS = {
  'm²':   'מ"ר',
  'm':    'מטר',
  'unit': 'יחידה',
  'day':  'יום',
  'job':  'עבודה',
}
