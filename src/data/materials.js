// קטלוג חומרים מלא לשיפוצים בישראל — מחירי קבלן ממוצעים
// מאורגן לפי 7 קטגוריות. כל פריט: name, unit, niceUnit, price, markupPct, categoryId

export const MATERIAL_CATEGORIES = [
  { id: 'demo',       name: 'הריסה והכנה',   icon: '🧹' },
  { id: 'walls',      name: 'קירות ותקרה',   icon: '🧱' },
  { id: 'insulation', name: 'בידוד',         icon: '🧊' },
  { id: 'electrical', name: 'חשמל ותקשורת', icon: '⚡' },
  { id: 'flooring',   name: 'ריצוף',         icon: '🟫' },
  { id: 'paint',      name: 'צבע וגימור',    icon: '🎨' },
  { id: 'doors',      name: 'דלתות וחלונות', icon: '🚪' },
]

export const MATERIAL_CATALOG = {
  // ─── 1. הריסה והכנה ─────────────────────────────────────────────
  protection_sheet: { categoryId: 'demo', name: 'ניילון/יריעת הגנה', unit: 'm²',  niceUnit: 'מ"ר',     price: 4,   markupPct: 10 },
  debris_bag:       { categoryId: 'demo', name: 'שקי פסולת בניין',  unit: 'unit', niceUnit: 'שק',      price: 8,   markupPct: 10 },
  crack_sealant:    { categoryId: 'demo', name: 'חומר איטום סדקים', unit: 'unit', niceUnit: 'שפופרת',  price: 28,  markupPct: 10 },
  patch_concrete:   { categoryId: 'demo', name: 'בטון/טיט תיקונים', unit: 'bag',  niceUnit: 'שק 25 ק"ג', price: 30, markupPct: 10 },

  // ─── 2. קירות ותקרה ─────────────────────────────────────────────
  plaster_black:    { categoryId: 'walls', name: 'טיח שחור',           unit: 'bag',  niceUnit: 'שק 25 ק"ג', price: 35, markupPct: 10 },
  plaster_gypsum:   { categoryId: 'walls', name: 'טיח גבס',            unit: 'bag',  niceUnit: 'שק 25 ק"ג', price: 45, markupPct: 10 },
  spakhtel:         { categoryId: 'walls', name: 'שפכטל אמריקאי',      unit: 'bag',  niceUnit: 'דלי 20 ק"ג', price: 90, markupPct: 10 },
  alum_corner:      { categoryId: 'walls', name: 'פינות אלומיניום',    unit: 'm',    niceUnit: 'מטר',     price: 12, markupPct: 10 },
  gypsum_board:     { categoryId: 'walls', name: 'לוח גבס',            unit: 'unit', niceUnit: 'לוח',     price: 55, markupPct: 10 },
  metal_profile:    { categoryId: 'walls', name: 'ניצב/מסלול מתכת',    unit: 'm',    niceUnit: 'מטר',     price: 18, markupPct: 10 },
  gypsum_screws:    { categoryId: 'walls', name: 'ברגי גבס + סרט',     unit: 'unit', niceUnit: 'חבילה',  price: 45, markupPct: 10 },

  // ─── 3. בידוד ─────────────────────────────────────────────────────
  rockwool:         { categoryId: 'insulation', name: 'צמר סלעים',        unit: 'm²', niceUnit: 'מ"ר', price: 35, markupPct: 10 },
  glasswool:        { categoryId: 'insulation', name: 'צמר זכוכית',       unit: 'm²', niceUnit: 'מ"ר', price: 28, markupPct: 10 },
  acoustic_board:   { categoryId: 'insulation', name: 'בידוד אקוסטי',     unit: 'm²', niceUnit: 'מ"ר', price: 65, markupPct: 10 },

  // ─── 4. חשמל ותקשורת ────────────────────────────────────────────
  conduit:          { categoryId: 'electrical', name: 'צנרת חשמל',          unit: 'm',    niceUnit: 'מטר',   price: 6,  markupPct: 10 },
  wire:             { categoryId: 'electrical', name: 'כבלי חשמל',         unit: 'm',    niceUnit: 'מטר',   price: 9,  markupPct: 10 },
  outlet_box:       { categoryId: 'electrical', name: 'קופסת שקע/מפסק',     unit: 'unit', niceUnit: 'יחידה', price: 5,  markupPct: 10 },
  outlet:           { categoryId: 'electrical', name: 'שקע',                unit: 'unit', niceUnit: 'יחידה', price: 25, markupPct: 10 },
  switch:           { categoryId: 'electrical', name: 'מפסק',               unit: 'unit', niceUnit: 'יחידה', price: 22, markupPct: 10 },
  light_fixture:    { categoryId: 'electrical', name: 'גוף תאורה',          unit: 'unit', niceUnit: 'יחידה', price: 120, markupPct: 10 },
  network_cable:    { categoryId: 'electrical', name: 'כבל רשת/תקשורת',    unit: 'm',    niceUnit: 'מטר',   price: 8,  markupPct: 10 },

  // ─── 5. ריצוף ─────────────────────────────────────────────────────
  ceramic:          { categoryId: 'flooring', name: 'קרמיקה',           unit: 'm²', niceUnit: 'מ"ר',      price: 80,  markupPct: 25 },
  porcelain:        { categoryId: 'flooring', name: 'גרניט פורצלן',    unit: 'm²', niceUnit: 'מ"ר',      price: 120, markupPct: 25 },
  parquet:          { categoryId: 'flooring', name: 'פרקט',            unit: 'm²', niceUnit: 'מ"ר',      price: 110, markupPct: 25 },
  pvc_floor:        { categoryId: 'flooring', name: 'PVC',             unit: 'm²', niceUnit: 'מ"ר',      price: 55,  markupPct: 25 },
  adhesive:         { categoryId: 'flooring', name: 'דבק לקרמיקה',     unit: 'bag', niceUnit: 'שק 25 ק"ג', price: 40, markupPct: 10 },
  grout:            { categoryId: 'flooring', name: 'רובה',            unit: 'kg',  niceUnit: 'ק"ג',       price: 15, markupPct: 10 },
  leveling:         { categoryId: 'flooring', name: 'חומר יישור (מדה)', unit: 'bag', niceUnit: 'שק 25 ק"ג', price: 55, markupPct: 10 },
  skirting:         { categoryId: 'flooring', name: 'פנלים',           unit: 'm',   niceUnit: 'מטר',      price: 22, markupPct: 10 },

  // ─── 6. צבע וגימור ──────────────────────────────────────────────
  primer:           { categoryId: 'paint', name: 'פריימר (בונדרול)',     unit: 'liter', niceUnit: 'ליטר', price: 30, markupPct: 10 },
  paint_walls:      { categoryId: 'paint', name: 'צבע אקרילי לקירות',   unit: 'liter', niceUnit: 'ליטר', price: 35, markupPct: 10 },
  paint_ceiling:    { categoryId: 'paint', name: 'צבע לתקרה',           unit: 'liter', niceUnit: 'ליטר', price: 32, markupPct: 10 },
  silicon:          { categoryId: 'paint', name: 'סיליקון',             unit: 'unit',  niceUnit: 'שפופרת', price: 25, markupPct: 10 },
  acrylic_filler:   { categoryId: 'paint', name: 'אקריל למילוי חריצים', unit: 'unit',  niceUnit: 'שפופרת', price: 18, markupPct: 10 },

  // ─── 7. דלתות וחלונות ─────────────────────────────────────────
  door_frame:       { categoryId: 'doors', name: 'משקוף לדלת',        unit: 'unit', niceUnit: 'יחידה', price: 250,  markupPct: 15 },
  interior_door:    { categoryId: 'doors', name: 'דלת פנים',         unit: 'unit', niceUnit: 'יחידה', price: 700,  markupPct: 15 },
  pu_foam:          { categoryId: 'doors', name: 'קצף פוליאוריטן',   unit: 'unit', niceUnit: 'מיכל',  price: 35,   markupPct: 10 },
  window:           { categoryId: 'doors', name: 'חלון',             unit: 'unit', niceUnit: 'יחידה', price: 1200, markupPct: 15 },
  shutter:          { categoryId: 'doors', name: 'תריס',             unit: 'unit', niceUnit: 'יחידה', price: 850,  markupPct: 15 },
}

// ─── חישוב כמויות לפי חדר ─────────────────────────────────────────
// כל חדר מקבל length, width, wallHeight ומחזיר רשימת חומרים עם כמויות
// waste = % עודף לפסולת לחומרים שמתבזבזים (לא ליחידות שלמות)

export const ROOM_RULES = {
  bathroom: {
    name: 'אמבטיה',
    icon: '🛁',
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const walls = perimeter * wallHeight
      const tiledSurface = floor + walls // אמבטיה — קרמיקה מהרצפה עד התקרה
      return [
        // הריסה והכנה
        { key: 'protection_sheet', qty: floor * 1.5, waste: 0, label: 'יריעות הגנה' },
        { key: 'debris_bag',       qty: Math.ceil(floor * 0.8), waste: 0, label: 'שקי פסולת' },
        { key: 'crack_sealant',    qty: 2, waste: 0, label: 'סדקים סביב צנרת' },

        // קירות ותקרה (תיקונים בלבד — לא הקמה)
        { key: 'plaster_gypsum',   qty: Math.ceil(walls * 0.05), waste: 5, label: 'טיח גבס לתיקונים' },
        { key: 'alum_corner',      qty: wallHeight * 4, waste: 5, label: 'פינות אלומיניום' },

        // חשמל
        { key: 'conduit',     qty: 8, waste: 5, label: 'צנרת חשמל לאמבטיה' },
        { key: 'wire',        qty: 12, waste: 5, label: 'כבלי חשמל' },
        { key: 'outlet_box',  qty: 2, waste: 0, label: 'קופסת שקע ליד הראי' },
        { key: 'outlet',      qty: 1, waste: 0, label: 'שקע מוגן מים' },
        { key: 'switch',      qty: 2, waste: 0, label: 'מפסקים' },
        { key: 'light_fixture', qty: 2, waste: 0, label: 'תאורת מקלחת + מראה' },

        // ריצוף
        { key: 'leveling',  qty: Math.ceil(floor * 0.15), waste: 5, label: 'יישור לפני ריצוף' },
        { key: 'ceramic',   qty: tiledSurface, waste: 10, label: 'קרמיקה — רצפה + קירות' },
        { key: 'adhesive',  qty: tiledSurface * 0.2, waste: 5, label: 'דבק לקרמיקה' },
        { key: 'grout',     qty: tiledSurface * 0.3, waste: 0, label: 'רובה' },

        // גימור
        { key: 'primer',          qty: walls * 0.1, waste: 5, label: 'פריימר לפני הדבקה' },
        { key: 'silicon',         qty: Math.max(2, Math.round(perimeter / 4)), waste: 0, label: 'סיליקון לאטימה' },
        { key: 'acrylic_filler',  qty: 2, waste: 0, label: 'אקריל למילוי' },

        // דלת
        { key: 'door_frame',    qty: 1, waste: 0, label: 'משקוף' },
        { key: 'interior_door', qty: 1, waste: 0, label: 'דלת פנים' },
        { key: 'pu_foam',       qty: 1, waste: 0, label: 'קצף לדלת' },
      ]
    },
  },

  kitchen: {
    name: 'מטבח',
    icon: '🍳',
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const walls = perimeter * wallHeight
      const splashback = perimeter * 0.6 // קיר עבודה מצופה קרמיקה
      const paintedWalls = walls - splashback
      return [
        // הריסה והכנה
        { key: 'protection_sheet', qty: floor * 1.5, waste: 0, label: 'יריעות הגנה' },
        { key: 'debris_bag',       qty: Math.ceil(floor * 0.6), waste: 0, label: 'שקי פסולת' },
        { key: 'crack_sealant',    qty: 2, waste: 0, label: 'איטום סדקים' },

        // קירות ותקרה
        { key: 'plaster_gypsum',   qty: Math.ceil(walls * 0.05), waste: 5, label: 'טיח לתיקונים' },
        { key: 'spakhtel',         qty: Math.ceil(walls / 30),   waste: 5, label: 'שפכטל לפני צבע' },
        { key: 'alum_corner',      qty: wallHeight * 4, waste: 5, label: 'פינות אלומיניום' },

        // חשמל — מטבח דורש הרבה
        { key: 'conduit',       qty: 25, waste: 5, label: 'צנרת חשמל' },
        { key: 'wire',          qty: 40, waste: 5, label: 'כבלי חשמל' },
        { key: 'outlet_box',    qty: 8,  waste: 0, label: 'קופסאות לשקעים' },
        { key: 'outlet',        qty: 8,  waste: 0, label: 'שקעים על השיש' },
        { key: 'switch',        qty: 3,  waste: 0, label: 'מפסקים' },
        { key: 'light_fixture', qty: 3,  waste: 0, label: 'תאורה ראשית + תחת ארונות' },
        { key: 'network_cable', qty: 10, waste: 5, label: 'כבל רשת למקרר חכם' },

        // ריצוף
        { key: 'leveling',  qty: Math.ceil(floor * 0.15), waste: 5, label: 'יישור רצפה' },
        { key: 'porcelain', qty: floor + splashback, waste: 10, label: 'גרניט פורצלן + קיר עבודה' },
        { key: 'adhesive',  qty: (floor + splashback) * 0.2, waste: 5, label: 'דבק' },
        { key: 'grout',     qty: (floor + splashback) * 0.3, waste: 0, label: 'רובה' },

        // צבע
        { key: 'primer',         qty: paintedWalls * 0.1, waste: 5, label: 'פריימר' },
        { key: 'paint_walls',    qty: paintedWalls * 0.15, waste: 10, label: 'צבע לקירות (2 שכבות)' },
        { key: 'paint_ceiling',  qty: floor * 0.13, waste: 10, label: 'צבע תקרה' },
        { key: 'silicon',        qty: 3, waste: 0, label: 'סיליקון לכיור/שיש' },

        // דלת
        { key: 'door_frame',    qty: 1, waste: 0, label: 'משקוף' },
        { key: 'interior_door', qty: 1, waste: 0, label: 'דלת פנים' },
        { key: 'pu_foam',       qty: 1, waste: 0, label: 'קצף לדלת' },
      ]
    },
  },

  bedroom: {
    name: 'חדר שינה',
    icon: '🛏️',
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const walls = perimeter * wallHeight
      return [
        // הריסה והכנה
        { key: 'protection_sheet', qty: floor * 1.2, waste: 0, label: 'יריעות הגנה' },
        { key: 'debris_bag',       qty: Math.ceil(floor * 0.3), waste: 0, label: 'שקי פסולת' },

        // קירות ותקרה
        { key: 'plaster_gypsum',   qty: Math.ceil(walls * 0.04), waste: 5, label: 'טיח לתיקונים' },
        { key: 'spakhtel',         qty: Math.ceil(walls / 25),   waste: 5, label: 'שפכטל לפני צבע' },
        { key: 'alum_corner',      qty: wallHeight * 4, waste: 5, label: 'פינות אלומיניום' },

        // בידוד (חשוב לחדר שינה — אקוסטיקה)
        { key: 'acoustic_board',  qty: walls * 0.3, waste: 10, label: 'בידוד אקוסטי לקיר חיצוני' },

        // חשמל
        { key: 'conduit',       qty: 15, waste: 5, label: 'צנרת חשמל' },
        { key: 'wire',          qty: 25, waste: 5, label: 'כבלי חשמל' },
        { key: 'outlet_box',    qty: 6,  waste: 0, label: 'קופסאות לשקעים' },
        { key: 'outlet',        qty: 6,  waste: 0, label: 'שקעים + USB ליד המיטה' },
        { key: 'switch',        qty: 2,  waste: 0, label: 'מפסקים (כפול)' },
        { key: 'light_fixture', qty: 2,  waste: 0, label: 'תאורה ראשית + ספוט' },
        { key: 'network_cable', qty: 10, waste: 5, label: 'כבל רשת' },

        // ריצוף
        { key: 'leveling', qty: Math.ceil(floor * 0.1), waste: 5, label: 'יישור רצפה' },
        { key: 'parquet',  qty: floor, waste: 10, label: 'פרקט' },
        { key: 'skirting', qty: perimeter * 0.95, waste: 10, label: 'פנלים' },

        // צבע
        { key: 'primer',          qty: (walls + floor) * 0.07, waste: 5, label: 'פריימר' },
        { key: 'paint_walls',     qty: walls * 0.15, waste: 10, label: 'צבע לקירות (2 שכבות)' },
        { key: 'paint_ceiling',   qty: floor * 0.13, waste: 10, label: 'צבע תקרה' },
        { key: 'acrylic_filler',  qty: 2, waste: 0, label: 'אקריל למילוי חריצים' },

        // דלת
        { key: 'door_frame',    qty: 1, waste: 0, label: 'משקוף' },
        { key: 'interior_door', qty: 1, waste: 0, label: 'דלת פנים' },
        { key: 'pu_foam',       qty: 1, waste: 0, label: 'קצף לדלת' },
      ]
    },
  },

  livingroom: {
    name: 'סלון',
    icon: '🛋️',
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const walls = perimeter * wallHeight
      return [
        // הריסה והכנה
        { key: 'protection_sheet', qty: floor * 1.2, waste: 0, label: 'יריעות הגנה' },
        { key: 'debris_bag',       qty: Math.ceil(floor * 0.5), waste: 0, label: 'שקי פסולת' },
        { key: 'crack_sealant',    qty: 3, waste: 0, label: 'איטום סדקים' },
        { key: 'patch_concrete',   qty: Math.ceil(floor * 0.05), waste: 5, label: 'טיט לתיקוני רצפה' },

        // קירות ותקרה
        { key: 'plaster_gypsum',   qty: Math.ceil(walls * 0.05), waste: 5, label: 'טיח לתיקונים' },
        { key: 'spakhtel',         qty: Math.ceil(walls / 22),   waste: 5, label: 'שפכטל מלא' },
        { key: 'alum_corner',      qty: wallHeight * 6, waste: 5, label: 'פינות אלומיניום' },

        // תקרת גבס לסלון (אופציונלי אך נפוץ)
        { key: 'gypsum_board',  qty: Math.ceil(floor / 2.88), waste: 10, label: 'לוחות גבס לתקרה' },
        { key: 'metal_profile', qty: perimeter + floor * 0.5,  waste: 10, label: 'ניצבים ומסלולים' },
        { key: 'gypsum_screws', qty: Math.ceil(floor / 5),     waste: 0, label: 'ברגי גבס + סרט' },

        // חשמל — סלון דורש הרבה (טלוויזיה, רמקולים, רשת)
        { key: 'conduit',       qty: 35, waste: 5, label: 'צנרת חשמל' },
        { key: 'wire',          qty: 55, waste: 5, label: 'כבלי חשמל' },
        { key: 'outlet_box',    qty: 10, waste: 0, label: 'קופסאות לשקעים' },
        { key: 'outlet',        qty: 10, waste: 0, label: 'שקעים (כולל מאחורי טלוויזיה)' },
        { key: 'switch',        qty: 4,  waste: 0, label: 'מפסקים' },
        { key: 'light_fixture', qty: 5,  waste: 0, label: 'תאורה ראשית + ספוטים' },
        { key: 'network_cable', qty: 20, waste: 5, label: 'כבלי רשת' },

        // ריצוף
        { key: 'leveling',  qty: Math.ceil(floor * 0.12), waste: 5, label: 'יישור רצפה' },
        { key: 'porcelain', qty: floor, waste: 10, label: 'גרניט פורצלן' },
        { key: 'adhesive',  qty: floor * 0.2, waste: 5, label: 'דבק' },
        { key: 'grout',     qty: floor * 0.3, waste: 0, label: 'רובה' },
        { key: 'skirting',  qty: perimeter * 0.95, waste: 10, label: 'פנלים' },

        // צבע
        { key: 'primer',         qty: (walls + floor) * 0.08, waste: 5, label: 'פריימר' },
        { key: 'paint_walls',    qty: walls * 0.15, waste: 10, label: 'צבע לקירות' },
        { key: 'paint_ceiling',  qty: floor * 0.13, waste: 10, label: 'צבע תקרה' },
        { key: 'acrylic_filler', qty: 3, waste: 0, label: 'אקריל למילוי' },

        // דלת
        { key: 'door_frame',    qty: 1, waste: 0, label: 'משקוף' },
        { key: 'interior_door', qty: 1, waste: 0, label: 'דלת פנים' },
        { key: 'pu_foam',       qty: 1, waste: 0, label: 'קצף לדלת' },
      ]
    },
  },
}
