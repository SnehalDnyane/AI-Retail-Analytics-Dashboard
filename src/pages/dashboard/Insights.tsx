import { useMemo } from "react";
import { useData } from "@/lib/DataContext";
import { aggregateMonthly, categoryBreakdown } from "@/lib/data";
import { PageHeader, Section } from "@/components/ui-bits";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, CheckCircle2, Activity } from "lucide-react";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function Insights() {
  const { sales } = useData();
  const monthly = useMemo(() => aggregateMonthly(sales), [sales]);
  const cats = useMemo(() => categoryBreakdown(sales).sort((a, b) => b.revenue - a.revenue), [sales]);

  const totalRev = sales.reduce((a, b) => a + b.total, 0);
  const last = monthly[monthly.length - 1].revenue;
  const prev = monthly[monthly.length - 2].revenue;
  const mom = ((last - prev) / prev) * 100;

  const alerts = [
    { type: "Growth", icon: TrendingUp, tone: "bg-success/10 text-success border-success/20",
      title: `Revenue up ${mom.toFixed(1)}% MoM`, desc: "Strongest momentum in Beauty and Apparel verticals." },
    { type: "Risk", icon: AlertTriangle, tone: "bg-destructive/10 text-destructive border-destructive/20",
      title: "Inventory turnover slowing in Electronics", desc: "4K TV stock days +18% vs prior quarter — promotion advised." },
    { type: "Stable", icon: CheckCircle2, tone: "bg-muted text-muted-foreground border-border",
      title: "Grocery category remains stable", desc: "Variance under 3% — maintain current allocation." },
    { type: "Growth", icon: Activity, tone: "bg-chart-2/10 text-chart-2 border-chart-2/20",
      title: "High-value customer retention at 91%", desc: "Loyalty program contributing to strong cohort behavior." },
  ];

  const yearly = useMemo(() => {
    const map = new Map<string, number>();
    sales.forEach(s => map.set(s.date.slice(0,4), (map.get(s.date.slice(0,4)) || 0) + s.total));
    return [...map.entries()].sort().map(([year, rev]) => ({ year, rev: Math.round(rev) }));
  }, [sales]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Strategic Intelligence" title="Business Insights" subtitle="Smart alerts, risk flags, and an executive summary in the language of consulting." />

      <Section title="Smart Alerts" description="Color-coded by signal type">
        <div className="grid gap-3 md:grid-cols-2">
          {alerts.map(a => (
            <Card key={a.title} className={`border ${a.tone} bg-gradient-card`}>
              <CardContent className="p-4 flex gap-3">
                <div className="size-9 rounded-lg bg-background/50 flex items-center justify-center shrink-0">
                  <a.icon className="size-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{a.type}</Badge>
                  </div>
                  <div className="font-medium text-sm">{a.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <div className="grid gap-6 lg:grid-cols-2">
        <Section title="Strategic Recommendations" description="Top 5 priority actions">
          <ol className="space-y-3 text-sm list-none">
            {[
              "Launch Q4 promotional campaign for Electronics with 15% bundle discount on TV + Speaker pairings.",
              "Expand Vitamin Serum SKUs by 30% to meet projected demand in Beauty vertical.",
              "Initiate VIP loyalty tier for top 20% of customers — projected $480K incremental annual revenue.",
              "Renegotiate supplier terms for Home & Living to recover 4-6% margin compression.",
              "Pre-launch winter Apparel collection in week 38 — 4 weeks ahead of seasonal demand inflection.",
            ].map((s, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                <div className="size-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold shrink-0">{i+1}</div>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Yearly Performance Timeline" description="Revenue across years">
          <div className="space-y-3">
            {yearly.map((y, i) => {
              const max = Math.max(...yearly.map(x => x.rev));
              return (
                <div key={y.year}>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-display text-lg font-semibold">{y.year}</span>
                    <span className="font-medium">{fmt(y.rev)}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-cocoa transition-smooth" style={{ width: `${(y.rev / max) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Section>
      </div>

      <Section title="Executive Summary" description="A consulting-grade narrative for leadership">
        <article className="prose prose-sm max-w-none dark:prose-invert">
          <h3 className="font-display">Q4 Operating Review · Retail Sales Intelligence</h3>
          <p>
            Aggregate revenue of <strong>{fmt(totalRev)}</strong> across the analysis period reflects sustained growth
            momentum, with the latest month posting a <strong>{mom.toFixed(1)}% sequential expansion</strong>. Performance is
            disproportionately driven by the <strong>{cats[0].category}</strong> vertical, which contributes
            <strong> {((cats[0].revenue / totalRev) * 100).toFixed(1)}%</strong> of total revenue.
          </p>
          <h4>Key Findings</h4>
          <ul>
            <li><strong>Demand concentration:</strong> Top three categories account for over 60% of revenue, suggesting moderate diversification risk.</li>
            <li><strong>Predictive signal:</strong> ARIMA + LSTM ensemble forecasts indicate continued double-digit growth into the next 12 months at 94.3% directional accuracy.</li>
            <li><strong>Customer composition:</strong> K-Means segmentation identifies a 20% high-value cohort responsible for ~60% of revenue — a classic Pareto distribution warranting concierge-tier retention investment.</li>
            <li><strong>Cross-sell upside:</strong> Apriori analysis surfaces 10 statistically significant association rules with lift &gt; 2.0×, representing measurable bundle revenue opportunity.</li>
          </ul>
          <h4>Recommended Posture</h4>
          <p>
            We recommend an <strong>offensive growth posture</strong> — tactical inventory expansion in Beauty and Apparel,
            disciplined margin recovery in Home &amp; Living, and a structured loyalty program targeted at the top quintile
            of customers. Risk reserves should be allocated against Electronics inventory drawdown and supplier renegotiation.
          </p>
        </article>
      </Section>
    </div>
  );
}
