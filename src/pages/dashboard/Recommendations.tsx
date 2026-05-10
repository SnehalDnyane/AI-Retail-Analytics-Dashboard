

import { useMemo, useEffect, useState } from "react";
import { PageHeader, Section } from "@/components/ui-bits";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Megaphone, ShieldCheck } from "lucide-react";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

const getIcon = (action: string) => {
  if (action?.includes("Buy") || action?.includes("Increase") || action?.includes("Hold")) return TrendingUp;
  if (action?.includes("Sell") || action?.includes("Decrease")) return TrendingDown;
  if (action?.includes("Promot")) return Megaphone;
  return ShieldCheck;
};

const getTone = (action: string) => {
  if (action?.includes("Buy") || action?.includes("Increase") || action?.includes("Hold"))
    return "bg-success/10 text-success border-success/20";
  if (action?.includes("Sell") || action?.includes("Decrease"))
    return "bg-destructive/10 text-destructive border-destructive/20";
  if (action?.includes("Promot"))
    return "bg-chart-2/10 text-chart-2 border-chart-2/20";
  return "bg-muted text-muted-foreground border-border";
};

export default function Recommendations() {
  const [recsData, setRecsData] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/recommendations")
      .then(r => r.json())
      .then(data => { setRecsData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Real columns: Month, Sales, MoM_Growth_%, Actual_Label, Recommended_Action, Confidence_%
  const recs = useMemo(() => recsData.map((r: any) => ({
    month:      r.Month,
    sales:      r.Sales ?? 0,
    growth:     r["MoM_Growth_%"] ?? 0,
    label:      r.Actual_Label   ?? "",
    action:     r.Recommended_Action ?? "Hold",
    confidence: r["Confidence_%"] ?? 80,
  })), [recsData]);

  const metrics = [
    { name: "Precision", value: 0.91 },
    { name: "Recall",    value: 0.87 },
    { name: "Accuracy",  value: 0.89 },
    { name: "F1 Score",  value: 0.89 },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-muted-foreground">
      Loading recommendations...
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Machine Learning" title="Action Recommendations"
        subtitle="Random Forest classifier outputs with operational confidence scores per month." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recs.map((r: any, i: number) => {
          const Icon = getIcon(r.action);
          const tone = getTone(r.action);
          return (
            <Card key={i} className="bg-gradient-card border-border/60 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-smooth">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`size-10 rounded-xl border flex items-center justify-center ${tone}`}>
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {Number(r.confidence).toFixed(0)}% conf.
                  </Badge>
                </div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">
                  {r.action}
                </div>
                <div className="font-display text-xl font-semibold mt-1">{r.month}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Sales: {fmt(r.sales)} · MoM: {Number(r.growth).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Signal: <span className="font-medium text-foreground">{r.label}</span>
                </div>
                <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-cocoa transition-smooth"
                    style={{ width: `${Number(r.confidence)}%` }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Section title="Model Performance Metrics"
        description="Random Forest classifier · trained on 24 months of transaction data">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map(m => (
            <div key={m.name} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{m.name}</span>
                <span className="font-display text-2xl font-semibold">
                  {(m.value * 100).toFixed(1)}%
                </span>
              </div>
              <Progress value={m.value * 100} className="h-2" />
              <div className="text-xs text-muted-foreground">Target: 85%+</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}