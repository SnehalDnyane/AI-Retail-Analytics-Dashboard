import { useMemo } from "react";
import { useData } from "@/lib/DataContext";
import { aggregateMonthly, categoryBreakdown, categoryHeatmap } from "@/lib/data";
import { PageHeader, Section, chartTheme } from "@/components/ui-bits";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceDot, Legend,
  ComposedChart, Area
} from "recharts";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function Trends() {
  const { sales } = useData();

  const monthly = useMemo(() => aggregateMonthly(sales), [sales]);
  const withMA = useMemo(() => monthly.map((m, i, a) => {
    const window = a.slice(Math.max(0, i - 2), i + 1);
    const ma = window.reduce((s, x) => s + x.revenue, 0) / window.length;
    return { ...m, ma: Math.round(ma) };
  }), [monthly]);

  const peak = useMemo(() => monthly.reduce((p, c) => c.revenue > p.revenue ? c : p, monthly[0]), [monthly]);

  const mom = useMemo(() => monthly.map((m, i) => ({
    month: m.month, growth: i === 0 ? 0 : ((m.revenue - monthly[i-1].revenue) / monthly[i-1].revenue) * 100
  })), [monthly]);

  const yoy = useMemo(() => {
    const byYearMonth: Record<string, Record<string, number>> = {};
    monthly.forEach(m => {
      const [y, mm] = m.month.split("-");
      byYearMonth[mm] = byYearMonth[mm] || {};
      byYearMonth[mm][y] = m.revenue;
    });
    return Object.entries(byYearMonth).map(([mm, ys]) => ({
      month: mm, "2023": ys["2023"] || 0, "2024": ys["2024"] || 0, "2025": ys["2025"] || 0,
    }));
  }, [monthly]);

  const cats = categoryBreakdown(sales).sort((a, b) => b.revenue - a.revenue);
  const heat = categoryHeatmap(sales);
  const categories = [...new Set(heat.map(h => h.category))];
  const months = [...new Set(heat.map(h => h.month))].sort();
  const maxHeat = Math.max(...heat.map(h => h.revenue));

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Time-series Analysis" title="Sales Trends" subtitle="Track momentum across months and years with smoothed signals and seasonal context." />

      <Section title="Monthly Revenue with 3-Month Moving Average" description={`Peak month: ${peak.month} · ${fmt(peak.revenue)}`}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={withMA}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
              <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))" strokeWidth={2.5} fill="url(#rev)" name="Revenue" />
              <Line type="monotone" dataKey="ma" stroke="hsl(var(--chart-4))" strokeWidth={2} strokeDasharray="5 4" dot={false} name="3-Month MA" />
              <ReferenceDot x={peak.month} y={peak.revenue} r={6} fill="hsl(var(--warning))" stroke="hsl(var(--background))" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Month-over-Month Growth" description="% change from prior month">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mom.slice(1)}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={10} tickLine={false} axisLine={false} interval={2} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `${v.toFixed(0)}%`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => `${v.toFixed(1)}%`} />
                <Bar dataKey="growth" radius={[4,4,0,0]}>
                  {mom.slice(1).map((d, i) => (
                    <Bar key={i} fill={d.growth >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"} dataKey="growth" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Year-over-Year Comparison" description="Same months across years">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yoy}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="2023" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} />
                <Line dataKey="2024" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                <Line dataKey="2025" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Section>
      </div>

      <Section title="Category Performance" description="Total revenue by category">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={cats} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} horizontal={false} />
              <XAxis type="number" stroke={chartTheme.axis} fontSize={11} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="category" stroke={chartTheme.axis} fontSize={11} width={110} />
              <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
              <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[0,8,8,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Monthly Category Heatmap" description="Revenue intensity by month and category">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr><th className="text-left p-2 text-muted-foreground font-medium">Category</th>
                {months.map(m => <th key={m} className="p-2 text-muted-foreground font-medium">{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat}>
                  <td className="p-2 font-medium">{cat}</td>
                  {months.map(m => {
                    const cell = heat.find(h => h.category === cat && h.month === m)!;
                    const intensity = cell.revenue / maxHeat;
                    return (
                      <td key={m} className="p-1">
                        <div className="aspect-square rounded-md flex items-center justify-center text-[9px] font-medium transition-smooth hover:scale-110"
                          style={{
                            background: `hsl(var(--chart-1) / ${0.1 + intensity * 0.8})`,
                            color: intensity > 0.5 ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"
                          }}
                          title={`${cat} · ${m} · ${fmt(cell.revenue)}`}
                        >
                          ${(cell.revenue/1000).toFixed(0)}k
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
