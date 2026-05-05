import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, ArrowRight, Database, BrainCircuit, BarChart3, Layers } from "lucide-react";

const stack = [
  { name: "React + Vite + TypeScript", role: "Frontend foundation" },
  { name: "Tailwind CSS + Radix UI", role: "Design system" },
  { name: "Recharts", role: "Data visualization" },
  { name: "Lovable Cloud", role: "Auth & data backend" },
  { name: "Lovable AI Gateway", role: "Streaming chat assistant" },
  { name: "ARIMA · LSTM · K-Means · Apriori · Random Forest", role: "ML model layer" },
];

const timeline = [
  { phase: "Data Acquisition", desc: "Raw retail transactions cleaned and normalized into a unified schema." },
  { phase: "Feature Engineering", desc: "Temporal, categorical and customer features extracted for downstream models." },
  { phase: "Model Training", desc: "ARIMA + LSTM forecasting, K-Means segmentation, Apriori MBA, RF classifier." },
  { phase: "Insight Synthesis", desc: "Outputs aggregated into KPIs, alerts, and consulting-grade narrative." },
  { phase: "Decision Delivery", desc: "Real-time dashboard, AI assistant, and actionable recommendations." },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <header className="container flex items-center justify-between py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gradient-cocoa flex items-center justify-center"><Sparkles className="size-5 text-primary-foreground" /></div>
          <div className="font-display text-lg font-semibold">FinSight AI</div>
        </Link>
        <Link to="/dashboard"><Button variant="hero">Open Dashboard <ArrowRight className="size-4" /></Button></Link>
      </header>

      <section className="container py-16 max-w-4xl">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-3">About the Platform</div>
        <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight text-balance leading-[1.05]">
          A consulting-grade retail intelligence platform.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
          FinSight AI was built to compress the gap between raw transactional data and executive-ready
          recommendations. It blends classical statistical forecasting with modern deep learning, market
          basket analysis, and behavioral segmentation — all surfaced in a single, beautifully crafted workspace.
        </p>
      </section>

      <section className="container py-12">
        <h2 className="font-display text-3xl font-semibold mb-8">Methodology</h2>
        <div className="space-y-4">
          {timeline.map((t, i) => (
            <div key={t.phase} className="flex gap-5">
              <div className="flex flex-col items-center">
                <div className="size-10 rounded-full bg-gradient-cocoa text-primary-foreground flex items-center justify-center font-display font-semibold">{i+1}</div>
                {i < timeline.length - 1 && <div className="w-0.5 flex-1 bg-border mt-1" />}
              </div>
              <Card className="flex-1 mb-2 bg-gradient-card border-border/60 shadow-soft">
                <CardContent className="p-5">
                  <div className="font-display text-lg font-semibold">{t.phase}</div>
                  <p className="text-sm text-muted-foreground mt-1">{t.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <h2 className="font-display text-3xl font-semibold mb-8">Datasets & Models</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { icon: Database, title: "Datasets", items: ["retail_cleaned.csv", "monthly_data.csv", "daily_data.csv", "customer_segments.csv", "apriori_rules.csv"] },
            { icon: BrainCircuit, title: "ML Models", items: ["ARIMA (1,1,1) — monthly forecasting", "LSTM 3-layer — daily forecasting", "K-Means — customer segments", "Apriori — market basket", "Random Forest — recommendations"] },
          ].map(b => (
            <Card key={b.title} className="bg-gradient-card border-border/60 shadow-soft">
              <CardContent className="p-6">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center mb-4"><b.icon className="size-5 text-primary" /></div>
                <h3 className="font-display text-lg font-semibold">{b.title}</h3>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {b.items.map(i => <li key={i} className="flex gap-2"><span className="text-primary">›</span> {i}</li>)}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-12">
        <h2 className="font-display text-3xl font-semibold mb-8">Tech Stack</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {stack.map(s => (
            <Card key={s.name} className="bg-gradient-card border-border/60">
              <CardContent className="p-4">
                <div className="font-medium text-sm">{s.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.role}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="container py-10 text-center text-xs text-muted-foreground">© 2026 FinSight AI</footer>
    </div>
  );
}
