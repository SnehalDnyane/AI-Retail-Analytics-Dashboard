import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, BrainCircuit, Users, ArrowRight, BarChart3, Target } from "lucide-react";
import hero from "@/assets/hero.jpg";
import { useAuth } from "@/lib/AuthContext";

const features = [
  { icon: TrendingUp, title: "Forecasting", desc: "ARIMA + LSTM ensemble forecasts with 94% directional accuracy and confidence intervals." },
  { icon: Users, title: "Customer Segmentation", desc: "K-Means clustering surfaces high-value cohorts and retention opportunities." },
  { icon: BrainCircuit, title: "ML Recommendations", desc: "Random Forest classifier outputs precise stock, pricing, and promotion actions." },
  { icon: BarChart3, title: "Market Basket", desc: "Apriori association rules quantify cross-sell strength with lift, support and confidence." },
];

export default function Index() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      <header className="container flex items-center justify-between py-6">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gradient-cocoa flex items-center justify-center"><Sparkles className="size-5 text-primary-foreground" /></div>
          <div>
            <div className="font-display text-lg font-semibold leading-tight">FinSight AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sales Intelligence</div>
          </div>
        </Link>
        <nav className="flex items-center gap-2">
          <Link to="/about"><Button variant="ghost">About</Button></Link>
          {user ? (
            <Link to="/dashboard"><Button variant="hero">Open Dashboard <ArrowRight className="size-4" /></Button></Link>
          ) : (
            <>
              <Link to="/login"><Button variant="ghost">Sign in</Button></Link>
              <Link to="/login"><Button variant="hero">Get Started <ArrowRight className="size-4" /></Button></Link>
            </>
          )}
        </nav>
      </header>

      <section className="container grid lg:grid-cols-2 gap-12 items-center py-16 lg:py-24">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs uppercase tracking-widest mb-6">
            <Target className="size-3" /> Retail Intelligence Platform
          </div>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-balance leading-[1.05]">
            Turn raw retail data into <span className="italic text-primary">decisive action</span>.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 max-w-xl leading-relaxed">
            FinSight AI fuses ARIMA, LSTM, K-Means and Apriori models into one consulting-grade dashboard — built for analysts who need answers, not noise.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={user ? "/dashboard" : "/login"}>
              <Button variant="hero" size="xl">Enter Dashboard <ArrowRight className="size-4" /></Button>
            </Link>
            <Link to="/about"><Button variant="soft" size="xl">Learn more</Button></Link>
          </div>
          <div className="mt-10 flex gap-8 text-sm">
            <div><div className="font-display text-2xl font-semibold">94.3%</div><div className="text-muted-foreground text-xs">Forecast accuracy</div></div>
            <div><div className="font-display text-2xl font-semibold">10+</div><div className="text-muted-foreground text-xs">ML signals</div></div>
            <div><div className="font-display text-2xl font-semibold">7</div><div className="text-muted-foreground text-xs">Dashboard modules</div></div>
          </div>
        </div>
        <div className="relative animate-fade-up">
          <div className="absolute -inset-4 bg-gradient-warm rounded-3xl blur-2xl opacity-60" />
          <img src={hero} alt="FinSight AI dashboard preview with warm beige analytics visuals" className="relative rounded-3xl shadow-elevated w-full" />
        </div>
      </section>

      <section className="container py-16">
        <div className="text-center mb-12">
          <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Capabilities</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold">Everything an analyst needs, in one workspace.</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map(f => (
            <Card key={f.title} className="bg-gradient-card border-border/60 shadow-soft hover:shadow-elevated hover:-translate-y-1 transition-smooth">
              <CardContent className="p-6">
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center mb-4"><f.icon className="size-5 text-primary" /></div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <div className="rounded-3xl bg-gradient-cocoa p-12 md:p-16 text-primary-foreground text-center shadow-elevated">
          <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight">Ready to see your data come alive?</h2>
          <p className="mt-4 max-w-xl mx-auto opacity-80">Sign in and explore the full dashboard — or upload your own CSV.</p>
          <Link to={user ? "/dashboard" : "/login"} className="inline-block mt-8">
            <Button size="xl" className="bg-background text-foreground hover:bg-background/90">Enter Dashboard <ArrowRight className="size-4" /></Button>
          </Link>
        </div>
      </section>

      <footer className="container py-10 text-center text-xs text-muted-foreground">© 2026 FinSight AI · Retail Sales Intelligence</footer>
    </div>
  );
}
