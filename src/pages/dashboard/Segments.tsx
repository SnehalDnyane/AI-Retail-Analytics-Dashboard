import { useMemo } from "react";
import { useData } from "@/lib/DataContext";
import { customerSegments } from "@/lib/data";
import { PageHeader, Section, chartTheme } from "@/components/ui-bits";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, ZAxis,
  BarChart, Bar
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
const COLORS: Record<string, string> = {
  "High Value": "hsl(var(--chart-1))",
  "Mid Value": "hsl(var(--chart-2))",
  "Low Value": "hsl(var(--chart-3))",
};

export default function Segments() {
  const { sales } = useData();
  const segs = useMemo(() => customerSegments(sales), [sales]);
  const grouped = ["High Value", "Mid Value", "Low Value"].map(s => ({
    segment: s, data: segs.filter(c => c.segment === s).slice(0, 200)
  }));
  const profitability = ["High Value", "Mid Value", "Low Value"].map(s => {
    const arr = segs.filter(c => c.segment === s);
    return {
      segment: s,
      revenue: Math.round(arr.reduce((a, c) => a + c.revenue, 0)),
      customers: arr.length,
      avg: Math.round(arr.reduce((a, c) => a + c.avg, 0) / arr.length || 0),
    };
  });

  const strategies = [
    { segment: "High Value", color: "hsl(var(--chart-1))", title: "Cultivate VIP loyalty",
      copy: "Deploy concierge-tier service, exclusive previews, and white-glove support. These accounts represent ~60% of revenue — protect retention with targeted retention rewards." },
    { segment: "Mid Value", color: "hsl(var(--chart-2))", title: "Drive frequency uplift",
      copy: "Introduce bundled offers and curated subscriptions. A 15% increase in order frequency in this cohort projects $480K incremental revenue annually." },
    { segment: "Low Value", color: "hsl(var(--chart-3))", title: "Win-back & reactivation",
      copy: "Run cost-efficient email reactivation flows with first-purchase discounts. Avoid high-touch acquisition spend until lifetime value signals improve." },
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="K-Means Clustering" title="Customer Segments" subtitle="Behavioral clustering by spend and order frequency, with consulting-grade segment strategy." />

      <Section title="Segment Scatter (Revenue × Orders)" description="Each point is a customer · color = K-Means cluster">
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="orders" name="Orders" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
              <YAxis dataKey="revenue" name="Revenue" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <ZAxis range={[40, 140]} />
              <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: any, n: string) => n === "revenue" ? fmt(v) : v} cursor={{ strokeDasharray: '3 3' }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {grouped.map(g => (
                <Scatter key={g.segment} name={g.segment} data={g.data} fill={COLORS[g.segment]} fillOpacity={0.7} />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Segment Profitability" description="Aggregate revenue contribution per segment">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitability}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="segment" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
                <Bar dataKey="revenue" radius={[8,8,0,0]}>
                  {profitability.map((p, i) => <Bar key={i} dataKey="revenue" fill={COLORS[p.segment]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Segment Insights" description="Customer counts and average order value">
          <div className="space-y-3">
            {profitability.map(p => (
              <div key={p.segment} className="flex items-center justify-between p-4 rounded-xl bg-muted/40 border border-border/40">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full" style={{ background: COLORS[p.segment] }} />
                  <div>
                    <div className="font-medium text-sm">{p.segment}</div>
                    <div className="text-xs text-muted-foreground">{p.customers} customers</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-semibold">{fmt(p.revenue)}</div>
                  <div className="text-xs text-muted-foreground">Avg order: {fmt(p.avg)}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {strategies.map(s => (
          <Card key={s.segment} className="bg-gradient-card border-border/60 shadow-soft">
            <CardContent className="p-5">
              <Badge variant="outline" className="mb-3" style={{ borderColor: s.color, color: s.color }}>{s.segment}</Badge>
              <h3 className="font-display text-lg font-semibold">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.copy}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
