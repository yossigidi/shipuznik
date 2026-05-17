// מחירוני חומרים — מחירי קבלן ממוצעים בשוק הישראלי
// המחיר הוא ליחידה. niceUnit = יחידה להצגה למשתמש

export const MATERIAL_CATALOG = {
  ceramic:  { name: 'קרמיקה / פורצלן', unit: 'm²',   niceUnit: 'מ"ר', price: 80,  markupPct: 25 },
  adhesive: { name: 'דבק לקרמיקה',     unit: 'bag',  niceUnit: 'שק 25 ק"ג', price: 40, markupPct: 10 },
  grout:    { name: 'רובה',            unit: 'kg',   niceUnit: 'ק"ג', price: 15, markupPct: 10 },
  paint:    { name: 'צבע פנים',        unit: 'liter',niceUnit: 'ליטר', price: 35, markupPct: 10 },
  primer:   { name: 'יסוד / פריימר',   unit: 'liter',niceUnit: 'ליטר', price: 30, markupPct: 10 },
  plaster:  { name: 'טיח',             unit: 'bag',  niceUnit: 'שק 25 ק"ג', price: 35, markupPct: 10 },
  profile:  { name: 'פרופיל גבס',      unit: 'm',    niceUnit: 'מטר', price: 18, markupPct: 10 },
  gypsum:   { name: 'לוח גבס',         unit: 'unit', niceUnit: 'לוח', price: 55, markupPct: 10 },
  silicon:  { name: 'סיליקון',         unit: 'unit', niceUnit: 'שפופרת', price: 25, markupPct: 10 },
  skirting: { name: 'פנלים',           unit: 'm',    niceUnit: 'מטר', price: 22, markupPct: 10 },
}

// כללי חישוב כמויות לפי חדר. waste = אחוז עודף לפסולת.
// היחס מתואר לפי מ"ר ריצוף, פרט לסוגי חדר שיש להם לוגיקה אחרת.

export const ROOM_RULES = {
  bathroom: {
    name: 'אמבטיה',
    icon: '🛁',
    // קלט: floorArea (מ"ר), wallHeight (מ׳)
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const walls = perimeter * wallHeight
      return [
        { key: 'ceramic',  qty: floor + walls, waste: 10, label: 'קרמיקה רצפה + קירות' },
        { key: 'adhesive', qty: (floor + walls) * 0.2,  waste: 5, label: 'דבק (שקים)' }, // ~5 ק"ג למ"ר, שק 25 ק"ג
        { key: 'grout',    qty: (floor + walls) * 0.3,  waste: 0, label: 'רובה' },
        { key: 'silicon',  qty: Math.max(2, Math.round(perimeter / 4)), waste: 0, label: 'סיליקון' },
      ]
    },
  },
  kitchen: {
    name: 'מטבח',
    icon: '🍳',
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const splashback = perimeter * 0.6 // קיר מצוף בלבד
      return [
        { key: 'ceramic',  qty: floor + splashback, waste: 10, label: 'ריצוף + קיר עבודה' },
        { key: 'adhesive', qty: (floor + splashback) * 0.2, waste: 5, label: 'דבק' },
        { key: 'grout',    qty: (floor + splashback) * 0.3, waste: 0, label: 'רובה' },
        { key: 'paint',    qty: (perimeter * wallHeight - splashback) * 0.1, waste: 10, label: 'צבע ליתרת קירות' },
        { key: 'skirting', qty: perimeter * 0.9, waste: 10, label: 'פנלים' },
      ]
    },
  },
  bedroom: {
    name: 'חדר שינה',
    icon: '🛏️',
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const walls = perimeter * wallHeight + floor // קירות + תקרה
      return [
        { key: 'paint',    qty: walls * 0.1, waste: 10, label: 'צבע (שתי שכבות)' },
        { key: 'primer',   qty: walls * 0.07, waste: 5, label: 'יסוד' },
        { key: 'skirting', qty: perimeter * 0.95, waste: 10, label: 'פנלים' },
      ]
    },
  },
  livingroom: {
    name: 'סלון',
    icon: '🛋️',
    calc: ({ length, width, wallHeight }) => {
      const floor = length * width
      const perimeter = 2 * (length + width)
      const walls = perimeter * wallHeight + floor
      return [
        { key: 'ceramic',  qty: floor, waste: 10, label: 'ריצוף' },
        { key: 'adhesive', qty: floor * 0.2, waste: 5, label: 'דבק' },
        { key: 'grout',    qty: floor * 0.3, waste: 0, label: 'רובה' },
        { key: 'paint',    qty: walls * 0.1, waste: 10, label: 'צבע' },
        { key: 'primer',   qty: walls * 0.07, waste: 5, label: 'יסוד' },
        { key: 'skirting', qty: perimeter * 0.95, waste: 10, label: 'פנלים' },
      ]
    },
  },
}
