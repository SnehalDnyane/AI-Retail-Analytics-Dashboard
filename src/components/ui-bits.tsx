import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function Section({ title, description, children, action }: { title: string; description?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Card className="bg-gradient-card border-border/60 shadow-soft animate-fade-up">
      <CardHeader className="flex flex-row items-start justify-between gap-4 pb-3">
        <div>
          <CardTitle className="font-display text-lg font-semibold tracking-tight">{title}</CardTitle>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function KpiCard({ label, value, delta, hint, icon: Icon }: {
  label: string; value: string; delta?: number; hint?: string; icon?: any;
}) {
  const positive = (delta ?? 0) >= 0;
  return (
    <Card className="bg-gradient-card border-border/60 shadow-soft transition-smooth hover:shadow-elevated hover:-translate-y-0.5">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground font-medium">{label}</div>
          {Icon && <div className="size-8 rounded-lg bg-secondary flex items-center justify-center"><Icon className="size-4 text-primary" /></div>}
        </div>
        <div className="mt-3 font-display text-2xl md:text-3xl font-semibold tracking-tight">{value}</div>
        <div className="mt-2 flex items-center gap-2 text-xs">
          {delta !== undefined && (
            <span className={cn("inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-medium",
              positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
              {positive ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(delta).toFixed(1)}%
            </span>
          )}
          {hint && <span className="text-muted-foreground">{hint}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

export function PageHeader({ title, subtitle, eyebrow }: { title: string; subtitle?: string; eyebrow?: string }) {
  return (
    <div className="mb-8 animate-fade-up">
      {eyebrow && <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{eyebrow}</div>}
      <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-balance">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-2 max-w-3xl">{subtitle}</p>}
    </div>
  );
}

export const chartTheme = {
  axis: "hsl(var(--muted-foreground))",
  grid: "hsl(var(--border))",
  tooltip: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(var(--border))",
    borderRadius: "10px",
    color: "hsl(var(--popover-foreground))",
    fontSize: "12px",
    boxShadow: "var(--shadow-soft)",
  } as React.CSSProperties,
};
