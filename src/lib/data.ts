// Mock data generation for FinSight AI default mode
export type Sale = {
  id: string;
  date: string;
  customer_id: string;
  category: string;
  product: string;
  quantity: number;
  unit_price: number;
  total: number;
  age: number;
  gender: "M" | "F";
};

const CATEGORIES = ["Electronics", "Apparel", "Home & Living", "Beauty", "Sports", "Grocery"];
const PRODUCTS: Record<string, string[]> = {
  Electronics: ["Wireless Earbuds", "Smart Watch", "4K TV", "Laptop Stand", "Bluetooth Speaker"],
  Apparel: ["Linen Shirt", "Wool Coat", "Denim Jeans", "Cashmere Scarf", "Leather Boots"],
  "Home & Living": ["Ceramic Vase", "Linen Throw", "Oak Side Table", "Brass Lamp", "Wool Rug"],
  Beauty: ["Vitamin Serum", "Hair Oil", "Lipstick Set", "Face Cream", "Perfume"],
  Sports: ["Yoga Mat", "Running Shoes", "Dumbbells", "Cycling Helmet", "Tennis Racket"],
  Grocery: ["Olive Oil", "Espresso Beans", "Honey Jar", "Pasta Set", "Truffle Salt"],
};

// Seeded RNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateSales(): Sale[] {
  const rng = mulberry32(42);
  const sales: Sale[] = [];
  const start = new Date("2023-01-01");
  const end = new Date("2025-12-31");
  const days = Math.floor((+end - +start) / 86400000);

  // ~6 sales per day average
  for (let d = 0; d <= days; d++) {
    const date = new Date(+start + d * 86400000);
    const month = date.getMonth();
    // seasonal multiplier (Q4 boost)
    const seasonal = 1 + 0.4 * Math.sin(((month - 2) / 12) * Math.PI * 2) + (month >= 9 ? 0.3 : 0);
    const yearTrend = 1 + (date.getFullYear() - 2023) * 0.18;
    const count = Math.max(2, Math.round(5 * seasonal * yearTrend + rng() * 4));
    for (let i = 0; i < count; i++) {
      const category = CATEGORIES[Math.floor(rng() * CATEGORIES.length)];
      const product = PRODUCTS[category][Math.floor(rng() * PRODUCTS[category].length)];
      const qty = 1 + Math.floor(rng() * 3);
      const unit = Math.round((20 + rng() * 380) * 100) / 100;
      sales.push({
        id: `S${d}-${i}`,
        date: date.toISOString().slice(0, 10),
        customer_id: `C${1000 + Math.floor(rng() * 480)}`,
        category,
        product,
        quantity: qty,
        unit_price: unit,
        total: Math.round(qty * unit * 100) / 100,
        age: 18 + Math.floor(rng() * 55),
        gender: rng() > 0.48 ? "F" : "M",
      });
    }
  }
  return sales;
}

export type MonthlyPoint = { month: string; revenue: number; transactions: number };
export function aggregateMonthly(sales: Sale[]): MonthlyPoint[] {
  const map = new Map<string, { revenue: number; transactions: number }>();
  for (const s of sales) {
    const k = s.date.slice(0, 7);
    const v = map.get(k) || { revenue: 0, transactions: 0 };
    v.revenue += s.total;
    v.transactions += 1;
    map.set(k, v);
  }
  return [...map.entries()].sort().map(([month, v]) => ({ month, revenue: Math.round(v.revenue), transactions: v.transactions }));
}

export function categoryBreakdown(sales: Sale[]) {
  const map = new Map<string, { revenue: number; year: Record<string, number> }>();
  for (const s of sales) {
    const yr = s.date.slice(0, 4);
    const v = map.get(s.category) || { revenue: 0, year: {} };
    v.revenue += s.total;
    v.year[yr] = (v.year[yr] || 0) + s.total;
    map.set(s.category, v);
  }
  return [...map.entries()].map(([category, v]) => ({
    category,
    revenue: Math.round(v.revenue),
    "2023": Math.round(v.year["2023"] || 0),
    "2024": Math.round(v.year["2024"] || 0),
    "2025": Math.round(v.year["2025"] || 0),
  }));
}

export function topCustomers(sales: Sale[], n = 8) {
  const map = new Map<string, { revenue: number; orders: number }>();
  for (const s of sales) {
    const v = map.get(s.customer_id) || { revenue: 0, orders: 0 };
    v.revenue += s.total;
    v.orders += 1;
    map.set(s.customer_id, v);
  }
  return [...map.entries()]
    .map(([customer, v]) => ({ customer, revenue: Math.round(v.revenue), orders: v.orders }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, n);
}

export function ageDistribution(sales: Sale[]) {
  const buckets = ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"];
  const counts = new Map<string, number>(buckets.map((b) => [b, 0]));
  const seen = new Set<string>();
  for (const s of sales) {
    if (seen.has(s.customer_id)) continue;
    seen.add(s.customer_id);
    const a = s.age;
    const b = a < 25 ? "18-24" : a < 35 ? "25-34" : a < 45 ? "35-44" : a < 55 ? "45-54" : a < 65 ? "55-64" : "65+";
    counts.set(b, (counts.get(b) || 0) + 1);
  }
  return buckets.map((b) => ({ bucket: b, count: counts.get(b) || 0 }));
}

export function genderSplit(sales: Sale[]) {
  const seen = new Set<string>();
  let m = 0, f = 0;
  for (const s of sales) {
    if (seen.has(s.customer_id)) continue;
    seen.add(s.customer_id);
    if (s.gender === "M") m++; else f++;
  }
  return [{ name: "Female", value: f }, { name: "Male", value: m }];
}

export function monthlyForecast(monthly: MonthlyPoint[]) {
  // Simple moving-trend forecast for next 12 months with confidence bands
  const last = monthly.slice(-12);
  const avg = last.reduce((a, b) => a + b.revenue, 0) / last.length;
  const trend = (last[last.length - 1].revenue - last[0].revenue) / 12;
  const lastDate = new Date(monthly[monthly.length - 1].month + "-01");
  const out: { month: string; arima: number; lstm: number; lower: number; upper: number; actual?: number }[] = [];
  for (let i = 1; i <= 12; i++) {
    const d = new Date(lastDate.getFullYear(), lastDate.getMonth() + i, 1);
    const base = avg + trend * i;
    const arima = Math.round(base * (1 + 0.05 * Math.sin(i / 2)));
    const lstm = Math.round(base * (1 + 0.07 * Math.cos(i / 3) + 0.02));
    const variance = base * 0.12;
    out.push({
      month: d.toISOString().slice(0, 7),
      arima,
      lstm,
      lower: Math.round(arima - variance),
      upper: Math.round(arima + variance),
    });
  }
  return out;
}

export function categoryHeatmap(sales: Sale[]) {
  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const out: { category: string; month: string; revenue: number }[] = [];
  for (const cat of CATEGORIES) {
    for (const m of months) {
      const total = sales
        .filter((s) => s.category === cat && s.date.slice(5, 7) === m)
        .reduce((a, b) => a + b.total, 0);
      out.push({ category: cat, month: m, revenue: Math.round(total) });
    }
  }
  return out;
}

export function customerSegments(sales: Sale[]) {
  const map = new Map<string, { revenue: number; orders: number }>();
  for (const s of sales) {
    const v = map.get(s.customer_id) || { revenue: 0, orders: 0 };
    v.revenue += s.total;
    v.orders += 1;
    map.set(s.customer_id, v);
  }
  const arr = [...map.entries()].map(([id, v]) => ({
    id, revenue: v.revenue, orders: v.orders,
    avg: v.revenue / v.orders,
  }));
  // simple thresholds
  const sorted = [...arr].sort((a, b) => b.revenue - a.revenue);
  const high = sorted.length * 0.2;
  const mid = sorted.length * 0.6;
  return arr.map((c, i) => {
    const rank = sorted.findIndex((x) => x.id === c.id);
    const segment = rank < high ? "High Value" : rank < mid ? "Mid Value" : "Low Value";
    return { ...c, segment };
  });
}

export function aprioriRules() {
  return [
    { antecedent: "Espresso Beans", consequent: "Honey Jar", support: 0.082, confidence: 0.61, lift: 3.4 },
    { antecedent: "Yoga Mat", consequent: "Running Shoes", support: 0.054, confidence: 0.48, lift: 2.9 },
    { antecedent: "Linen Shirt", consequent: "Denim Jeans", support: 0.071, confidence: 0.55, lift: 2.6 },
    { antecedent: "Wireless Earbuds", consequent: "Smart Watch", support: 0.063, confidence: 0.52, lift: 2.4 },
    { antecedent: "Vitamin Serum", consequent: "Face Cream", support: 0.094, confidence: 0.67, lift: 3.1 },
    { antecedent: "Olive Oil", consequent: "Pasta Set", support: 0.077, confidence: 0.58, lift: 2.7 },
    { antecedent: "Ceramic Vase", consequent: "Brass Lamp", support: 0.041, confidence: 0.39, lift: 2.1 },
    { antecedent: "Cashmere Scarf", consequent: "Wool Coat", support: 0.058, confidence: 0.51, lift: 2.5 },
    { antecedent: "Hair Oil", consequent: "Vitamin Serum", support: 0.066, confidence: 0.49, lift: 2.3 },
    { antecedent: "4K TV", consequent: "Bluetooth Speaker", support: 0.038, confidence: 0.42, lift: 2.0 },
  ];
}

export function recommendations() {
  return [
    { action: "Increase Stock", target: "Vitamin Serum", confidence: 92, reason: "Demand growing 24% MoM with strong cross-sell to Face Cream." },
    { action: "Run Promotion", target: "4K TV", confidence: 78, reason: "Inventory turnover slowing; bundling with speakers projected to lift sales 18%." },
    { action: "Reduce Cost", target: "Ceramic Vase", confidence: 64, reason: "Margin compression detected; supplier renegotiation recommended." },
    { action: "Maintain", target: "Espresso Beans", confidence: 88, reason: "Stable demand and high lift with Honey Jar — keep current strategy." },
    { action: "Increase Stock", target: "Linen Shirt", confidence: 81, reason: "Q3 seasonal trend strong; confirmed by ARIMA + LSTM consensus." },
    { action: "Run Promotion", target: "Wool Coat", confidence: 73, reason: "Pre-winter campaign window opens in 4 weeks." },
  ];
}

export function modelComparison() {
  return [
    { model: "ARIMA (1,1,1)", mae: 12340, rmse: 18920, mape: "6.4%", r2: 0.91 },
    { model: "LSTM (3-layer)", mae: 10870, rmse: 16240, mape: "5.7%", r2: 0.93 },
    { model: "Prophet", mae: 13720, rmse: 20110, mape: "7.1%", r2: 0.89 },
    { model: "XGBoost Regressor", mae: 11920, rmse: 17800, mape: "6.2%", r2: 0.92 },
  ];
}
