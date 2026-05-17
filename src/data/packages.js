// חבילות שיפוץ + עבודות מומלצות לפי חדר
// כל פריט מתייחס ל-id מ-workItems.js עם qty ברירת מחדל

export const ROOMS = [
  { id: 'bathroom',   name: 'אמבטיה', icon: '🛁' },
  { id: 'kitchen',    name: 'מטבח',   icon: '🍳' },
  { id: 'bedroom',    name: 'חדר שינה', icon: '🛏️' },
  { id: 'livingroom', name: 'סלון',    icon: '🛋️' },
]

export const PACKAGE_LEVELS = [
  { id: 'cosmetic', name: 'קוסמטי', icon: '🎨', desc: 'צבע, ריצוף, אביזרים' },
  { id: 'partial',  name: 'חלקי',   icon: '🔧', desc: 'כולל אינסטלציה / חשמל' },
  { id: 'full',     name: 'מלא',    icon: '🏗️', desc: 'כולל גבס, קירות ודלתות' },
]

// PACKAGES[roomId][levelId] = רשימת [{ itemId, qty }]
export const PACKAGES = {
  bathroom: {
    cosmetic: [
      { itemId: 'fl-ceramic',  qty: 15 },
      { itemId: 'pa-walls-2',  qty: 12 },
      { itemId: 'pl-faucet',   qty: 2 },
      { itemId: 'dr-handle',   qty: 1 },
    ],
    partial: [
      { itemId: 'fl-ceramic',  qty: 15 },
      { itemId: 'pa-walls-2',  qty: 12 },
      { itemId: 'pl-sink',     qty: 1 },
      { itemId: 'pl-toilet',   qty: 1 },
      { itemId: 'pl-faucet',   qty: 2 },
      { itemId: 'el-light',    qty: 2 },
      { itemId: 'el-outlet',   qty: 1 },
    ],
    full: [
      { itemId: 'fl-demo',     qty: 6 },
      { itemId: 'fl-ceramic',  qty: 15 },
      { itemId: 'pa-walls-2',  qty: 12 },
      { itemId: 'pl-sink',     qty: 1 },
      { itemId: 'pl-toilet',   qty: 1 },
      { itemId: 'pl-shower',   qty: 1 },
      { itemId: 'pl-pipes',    qty: 4 },
      { itemId: 'el-light',    qty: 2 },
      { itemId: 'el-outlet',   qty: 2 },
      { itemId: 'dw-niche',    qty: 1 },
      { itemId: 'dr-door',     qty: 1 },
    ],
  },
  kitchen: {
    cosmetic: [
      { itemId: 'fl-ceramic',  qty: 10 },
      { itemId: 'pa-walls-2',  qty: 20 },
      { itemId: 'pl-faucet',   qty: 1 },
    ],
    partial: [
      { itemId: 'fl-porcelain', qty: 10 },
      { itemId: 'pa-walls-2',   qty: 20 },
      { itemId: 'pl-sink',      qty: 1 },
      { itemId: 'pl-faucet',    qty: 1 },
      { itemId: 'el-outlet',    qty: 3 },
      { itemId: 'el-light',     qty: 2 },
    ],
    full: [
      { itemId: 'fl-demo',      qty: 10 },
      { itemId: 'fl-porcelain', qty: 10 },
      { itemId: 'pa-walls-2',   qty: 20 },
      { itemId: 'pl-sink',      qty: 1 },
      { itemId: 'pl-faucet',    qty: 1 },
      { itemId: 'pl-pipes',     qty: 3 },
      { itemId: 'el-panel',     qty: 1 },
      { itemId: 'el-outlet',    qty: 4 },
      { itemId: 'el-light',     qty: 3 },
      { itemId: 'dw-wall',      qty: 6 },
    ],
  },
  bedroom: {
    cosmetic: [
      { itemId: 'pa-walls-2',  qty: 40 },
      { itemId: 'pa-ceiling',  qty: 12 },
      { itemId: 'fl-skirting', qty: 14 },
    ],
    partial: [
      { itemId: 'pa-walls-2',  qty: 40 },
      { itemId: 'pa-ceiling',  qty: 12 },
      { itemId: 'fl-parquet',  qty: 12 },
      { itemId: 'fl-skirting', qty: 14 },
      { itemId: 'el-outlet',   qty: 3 },
      { itemId: 'el-light',    qty: 1 },
    ],
    full: [
      { itemId: 'pa-spakhtel', qty: 40 },
      { itemId: 'pa-walls-2',  qty: 40 },
      { itemId: 'pa-ceiling',  qty: 12 },
      { itemId: 'fl-parquet',  qty: 12 },
      { itemId: 'fl-skirting', qty: 14 },
      { itemId: 'el-outlet',   qty: 4 },
      { itemId: 'el-light',    qty: 2 },
      { itemId: 'dr-door',     qty: 1 },
      { itemId: 'dr-window',   qty: 1 },
    ],
  },
  livingroom: {
    cosmetic: [
      { itemId: 'pa-walls-2',  qty: 80 },
      { itemId: 'pa-ceiling',  qty: 25 },
      { itemId: 'fl-skirting', qty: 22 },
    ],
    partial: [
      { itemId: 'pa-walls-2',  qty: 80 },
      { itemId: 'pa-ceiling',  qty: 25 },
      { itemId: 'fl-porcelain', qty: 25 },
      { itemId: 'fl-skirting', qty: 22 },
      { itemId: 'el-outlet',   qty: 5 },
      { itemId: 'el-light',    qty: 3 },
    ],
    full: [
      { itemId: 'fl-demo',     qty: 25 },
      { itemId: 'fl-porcelain', qty: 25 },
      { itemId: 'pa-spakhtel', qty: 80 },
      { itemId: 'pa-walls-2',  qty: 80 },
      { itemId: 'pa-ceiling',  qty: 25 },
      { itemId: 'fl-skirting', qty: 22 },
      { itemId: 'el-outlet',   qty: 6 },
      { itemId: 'el-light',    qty: 4 },
      { itemId: 'dw-ceiling',  qty: 25 },
      { itemId: 'dr-door',     qty: 1 },
    ],
  },
}

// עבודות נפוצות שכדאי להציע ללקוח (לא חלק מהחבילה — תוספות נחמדות)
export const RECOMMENDED_ADDONS = {
  bathroom: [
    { itemId: 'pl-leak',   reason: 'איתור נזילות לפני שיפוץ' },
    { itemId: 'el-outlet', reason: 'שקע נוסף ליד הראי' },
    { itemId: 'dw-niche',  reason: 'גומחה לסבון/שמפו' },
  ],
  kitchen: [
    { itemId: 'el-outlet', reason: 'שקעים נוספים על השיש' },
    { itemId: 'el-light',  reason: 'תאורה תחת ארונות' },
    { itemId: 'pl-faucet', reason: 'ברז מסוג חדש' },
  ],
  bedroom: [
    { itemId: 'el-outlet', reason: 'שקעי USB ליד המיטה' },
    { itemId: 'dr-handle', reason: 'החלפת ידיות ארונות' },
  ],
  livingroom: [
    { itemId: 'el-outlet', reason: 'שקעים נסתרים מאחורי הטלוויזיה' },
    { itemId: 'dw-ceiling', reason: 'תקרת גבס עם תאורה' },
  ],
}
