


import { useMemo, useEffect, useState } from "react";
import { KpiCard, PageHeader, Section, chartTheme } from "@/components/ui-bits";
import { DollarSign, ShoppingCart, TrendingUp, Award, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, RadialBarChart, RadialBar, PolarAngleAxis, Legend
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
const COLORS = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))"
];

export default function Overview() {
  const [sales,   setSales]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/cleaned")
      .then(r => r.json())
      .then(data => { setSales(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const data = useMemo(() => {
    if (!sales.length) return null;

    const totalRev = sales.reduce((a: number, b: any) => a + (b["Total Spent"] ?? 0), 0);
    const tx       = sales.length;
    const avg      = totalRev / tx;

    // Category breakdown with year splits
    const catYearMap: Record<string, Record<string, number>> = {};
    sales.forEach((s: any) => {
      const cat  = s["Product Category"] ?? "Unknown";
      const year = String(s["Year"] ?? "");
      const rev  = s["Total Spent"] ?? 0;
      if (!catYearMap[cat]) catYearMap[cat] = {};
      catYearMap[cat][year] = (catYearMap[cat][year] ?? 0) + rev;
    });
    const cats = Object.entries(catYearMap).map(([category, years]) => ({
      category,
      revenue: Object.values(years).reduce((a, b) => a + b, 0),
      ...years,
    })).sort((a, b) => b.revenue - a.revenue);

    const top = cats[0]?.category ?? "—";

    // Unique customers
    const customers = new Set(sales.map((s: any) => s["Customer ID"])).size;

    // MoM from Year + Month_Num
    const monthMap: Record<string, number> = {};
    sales.forEach((s: any) => {
      const key = `${s.Year}-${String(s.Month_Num).padStart(2, "0")}`;
      monthMap[key] = (monthMap[key] ?? 0) + (s["Total Spent"] ?? 0);
    });
    const mv   = Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([, v]) => v);
    const last = mv[mv.length - 1] ?? 0;
    const prev = mv[mv.length - 2] ?? 1;
    const mom  = ((last - prev) / prev) * 100;
    const health = Math.min(100, Math.round(60 + mom * 1.5 + (cats.length / 8) * 10));

    // Age distribution
    const ageBuckets: Record<string, number> = {};
    sales.forEach((s: any) => {
      const age = s["Age"];
      if (!age) return;
      const bucket = `${Math.floor(age / 10) * 10}s`;
      ageBuckets[bucket] = (ageBuckets[bucket] ?? 0) + 1;
    });
    const ages = Object.entries(ageBuckets)
      .map(([bucket, count]) => ({ bucket, count }))
      .sort((a, b) => a.bucket.localeCompare(b.bucket));

    // Gender split
    const genderMap: Record<string, number> = {};
    sales.forEach((s: any) => {
      const g = s["Gender"] ?? "Unknown";
      genderMap[g] = (genderMap[g] ?? 0) + 1;
    });
    const genders = Object.entries(genderMap).map(([name, value]) => ({ name, value }));

    // Top customers
    const custMap: Record<string, { orders: number; revenue: number }> = {};
    sales.forEach((s: any) => {
      const id  = String(s["Customer ID"] ?? "Unknown");
      const rev = s["Total Spent"] ?? 0;
      if (!custMap[id]) custMap[id] = { orders: 0, revenue: 0 };
      custMap[id].orders++;
      custMap[id].revenue += rev;
    });
    const topCustomers = Object.entries(custMap)
      .map(([customer, v]) => ({ customer, ...v }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8);

    return { totalRev, tx, avg, top, customers, cats, mom, health, ages, genders, topCustomers };
  }, [sales]);

  const insights = useMemo(() => {
    if (!data) return [];
    return [
      `**${data.top}** is the top revenue category, generating ${fmt(data.cats[0]?.revenue ?? 0)} across the period.`,
      `Month-over-month revenue ${data.mom >= 0 ? "grew" : "fell"} **${Math.abs(data.mom).toFixed(1)}%** in the latest period.`,
      `Customer base of **${data.customers.toLocaleString()}** unique buyers with average order value of **${fmt(data.avg)}**.`,
      `Business Health Score sits at **${data.health}/100**, indicating ${data.health > 75 ? "strong" : "moderate"} operational momentum.`,
    ];
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      Loading overview data...
    </div>
  );
  if (!data) return (
    <div className="flex items-center justify-center h-64 text-destructive">
      Failed to load. Is Flask running on port 5000?
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive Dashboard" title="Overview & KPIs"
        subtitle="Real-time pulse of your retail operation — revenue, demand, customers, and signals." />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Revenue"    value={fmt(data.totalRev)}             delta={data.mom} hint="vs last month"    icon={DollarSign} />
        <KpiCard label="Transactions"     value={data.tx.toLocaleString()}                        hint="completed orders" icon={ShoppingCart} />
        <KpiCard label="Avg Sale Value"   value={fmt(data.avg)}                                   hint="per transaction"  icon={TrendingUp} />
        <KpiCard label="Top Category"     value={data.top}                                        hint={fmt(data.cats[0]?.revenue ?? 0)} icon={Award} />
        <KpiCard label="Unique Customers" value={data.customers.toLocaleString()}                 hint="active buyers"    icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Revenue by Category" description="Year-over-year comparison">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cats}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="category" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false}
                  tickFormatter={v => `$${(v/1000000).toFixed(0)}M`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="2023" fill="hsl(var(--chart-3))" radius={[6,6,0,0]} />
                <Bar dataKey="2024" fill="hsl(var(--chart-2))" radius={[6,6,0,0]} />
                <Bar dataKey="2025" fill="hsl(var(--chart-1))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Business Health Score" description="Composite signal across growth, margin & retention">
          <div className="h-72 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%"
                data={[{ name: "Health", value: data.health, fill: "hsl(var(--chart-1))" }]}
                startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "hsl(var(--muted))" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-5xl font-semibold">{data.health}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">/ 100</div>
              <div className="text-xs text-success mt-2">
                {data.health > 75 ? "Excellent" : data.health > 50 ? "Healthy" : "Watch"}
              </div>
            </div>
          </div>
        </Section>

        <Section title="AI-Generated Insights" description="Auto-summarized from current data">
          <ul className="space-y-3 text-sm">
            {insights.map((s, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{
                  __html: s.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>')
                }} />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Age Distribution" description="Unique customer demographics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ages}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="bucket" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Gender Split" description="Customer demographics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.genders} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {data.genders.map((_: any, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Top Customers" description="By lifetime revenue">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.topCustomers.map((c: any) => (
                <TableRow key={c.customer}>
                  <TableCell className="font-mono text-xs">{c.customer}</TableCell>
                  <TableCell className="text-right">{c.orders}</TableCell>
                  <TableCell className="text-right font-medium">{fmt(c.revenue)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      </div>
    </div>
  );
}