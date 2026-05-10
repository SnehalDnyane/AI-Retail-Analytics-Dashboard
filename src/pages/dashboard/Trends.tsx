
import { useMemo, useEffect, useState } from "react";
import { PageHeader, Section, chartTheme } from "@/components/ui-bits";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, ComposedChart, Area
} from "recharts";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function Trends() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [catData,     setCatData]     = useState<any[]>([]);
  const [heatData,    setHeatData]    = useState<any[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/monthly")
  .then(r => r.json())
  .then(data => { setMonthlyData(data); })
  .catch(console.error);
    fetch("http://127.0.0.1:5000/categories")
      .then(r => r.json()).then(setCatData).catch(console.error);
    fetch("http://127.0.0.1:5000/monthly-by-category")
      .then(r => r.json()).then(setHeatData).catch(console.error);
  }, []);

  const withMA = useMemo(() => {
    if (!monthlyData.length) return [];
    return monthlyData.map((m: any, i: number, a: any[]) => {
      const window = a.slice(Math.max(0, i - 2), i + 1);
      const ma = window.reduce((s: number, x: any) => s + (x.Sales ?? 0), 0) / window.length;
      return {
        month:   m.Month?.slice(0, 7) ?? "",
        revenue: m.Sales ?? 0,
        ma:      Math.round(ma),
        growth:  m["MoM_Growth_%"] ?? 0,
      };
    });
  }, [monthlyData]);

  const peak = useMemo(() => {
    if (!withMA.length) return null;
    return withMA.reduce((p, c) => c.revenue > p.revenue ? c : p, withMA[0]);
  }, [withMA]);

  const mom = useMemo(() =>
    withMA.map((m: any) => ({ month: m.month, growth: m.growth ?? 0 }))
  , [withMA]);

  const yoy = useMemo(() => {
    if (!monthlyData.length) return [];
    const map: Record<string, Record<string, number>> = {};
    monthlyData.forEach((m: any) => {
      const month = m.Month?.slice(5, 7);
      const year  = String(m.YoY_Label ?? "");
      if (!month || !year) return;
      if (!map[month]) map[month] = {};
      map[month][year] = m.Sales ?? 0;
    });
    return Object.entries(map).sort().map(([month, years]) => ({ month, ...years }));
  }, [monthlyData]);

  const categories = useMemo(() => [...new Set(heatData.map((h: any) => h.category))], [heatData]);
  const heatMonths = useMemo(() => [...new Set(heatData.map((h: any) => h.month))].sort() as string[], [heatData]);
  const maxHeat    = useMemo(() => Math.max(...heatData.map((h: any) => h.revenue), 1), [heatData]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Time-series Analysis" title="Sales Trends"
        subtitle="Track momentum across months and years with smoothed signals and seasonal context." />

      <Section title="Monthly Revenue with 3-Month Moving Average"
        description={peak ? `Peak month: ${peak.month} · ${fmt(peak.revenue)}` : "Loading..."}>
        <div className="h-80">
          {withMA.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading chart...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={withMA}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="hsl(var(--chart-1))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false}
                  tickFormatter={v => `$${(v/1000000000).toFixed(1)}B`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(var(--chart-1))"
                  strokeWidth={2.5} fill="url(#rev)" name="Revenue" />
                <Line type="monotone" dataKey="ma" stroke="hsl(var(--chart-4))"
                  strokeWidth={2} strokeDasharray="5 4" dot={false} name="3-Month MA" />
              </ComposedChart>
            </ResponsiveContainer>
          )}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Month-over-Month Growth" description="% change from prior month">
          <div className="h-72">
            {mom.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mom.slice(1)}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={10}
                    tickLine={false} axisLine={false} interval={2} />
                  <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={v => `${v.toFixed(0)}%`} />
                  <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => `${v.toFixed(1)}%`} />
                  <Bar dataKey="growth" radius={[4,4,0,0]} fill="hsl(var(--chart-1))" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Section>

        <Section title="Year-over-Year Comparison" description="Same months across years">
          <div className="h-72">
            {yoy.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yoy}>
                  <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                  <XAxis dataKey="month" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false}
                    tickFormatter={v => `$${(v/1000000000).toFixed(1)}B`} />
                  <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line dataKey="2023" stroke="hsl(var(--chart-3))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="2024" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ r: 3 }} />
                  <Line dataKey="2025" stroke="hsl(var(--chart-1))" strokeWidth={2.5} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </Section>
      </div>

      <Section title="Category Performance" description="Total revenue by category">
        <div className="h-64">
          {catData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">Loading...</div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={catData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} horizontal={false} />
                <XAxis type="number" stroke={chartTheme.axis} fontSize={11}
                  tickFormatter={v => `$${(v/1000000000).toFixed(0)}B`} />
                <YAxis type="category" dataKey="category" stroke={chartTheme.axis} fontSize={11} width={110} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" radius={[0,8,8,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </Section>

      <Section title="Monthly Category Heatmap" description="Revenue intensity by month and category">
        {heatData.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground">Loading...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left p-2 text-muted-foreground font-medium">Category</th>
                  {heatMonths.map((m) => (
                    <th key={m} className="p-2 text-muted-foreground font-medium">{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((cat: any) => (
                  <tr key={cat}>
                    <td className="p-2 font-medium">{cat}</td>
                    {heatMonths.map((m) => {
                      const cell = heatData.find((h: any) => h.category === cat && h.month === m);
                      const rev  = cell?.revenue ?? 0;
                      const intensity = rev / maxHeat;
                      return (
                        <td key={m} className="p-1">
                          <div className="aspect-square rounded-md flex items-center justify-center text-[9px] font-medium"
                            style={{
                              background: `hsl(var(--chart-1) / ${0.1 + intensity * 0.8})`,
                              color: intensity > 0.5 ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"
                            }}
                            title={`${cat} · ${m} · ${fmt(rev)}`}>
                            ${(rev/1000000).toFixed(0)}M
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
}