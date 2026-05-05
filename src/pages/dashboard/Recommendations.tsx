import { recommendations } from "@/lib/data";
import { PageHeader, Section } from "@/components/ui-bits";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Megaphone, ShieldCheck } from "lucide-react";

const ICONS: Record<string, any> = {
  "Increase Stock": TrendingUp,
  "Reduce Cost": DollarSign,
  "Run Promotion": Megaphone,
  "Maintain": ShieldCheck,
};
const TONES: Record<string, string> = {
  "Increase Stock": "bg-success/10 text-success border-success/20",
  "Reduce Cost": "bg-warning/10 text-warning border-warning/20",
  "Run Promotion": "bg-chart-2/10 text-chart-2 border-chart-2/20",
  "Maintain": "bg-muted text-muted-foreground border-border",
};

export default function Recommendations() {
  const recs = recommendations();
  const metrics = [
    { name: "Precision", value: 0.91 },
    { name: "Recall", value: 0.87 },
    { name: "Accuracy", value: 0.89 },
    { name: "F1 Score", value: 0.89 },
  ];
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Machine Learning" title="Action Recommendations" subtitle="Random Forest classifier outputs with operational confidence scores and reasoning." />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recs.map((r) => {
          const Icon = ICONS[r.action];
          return (
            <Card key={r.target} className="bg-gradient-card border-border/60 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-smooth">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`size-10 rounded-xl border flex items-center justify-center ${TONES[r.action]}`}>
                    <Icon className="size-5" />
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">{r.confidence}% conf.</Badge>
                </div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{r.action}</div>
                <div className="font-display text-xl font-semibold mt-1">{r.target}</div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.reason}</p>
                <div className="mt-4 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-cocoa transition-smooth" style={{ width: `${r.confidence}%` }} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Section title="Model Performance Metrics" description="Random Forest classifier · trained on 24 months of transaction data">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metrics.map(m => (
            <div key={m.name} className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium">{m.name}</span>
                <span className="font-display text-2xl font-semibold">{(m.value * 100).toFixed(1)}%</span>
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
