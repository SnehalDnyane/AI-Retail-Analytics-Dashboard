import { useData } from "@/lib/DataContext";
import { PageHeader, Section } from "@/components/ui-bits";
import { Card, CardContent } from "@/components/ui/card";
import { Database } from "lucide-react";

export default function DataSource() {
  const { sales } = useData();

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader eyebrow="Workspace" title="Data Source" subtitle="Curated synthetic retail dataset for instant exploration." />

      <Card className="bg-gradient-card border-2 border-primary shadow-elevated">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-xl bg-secondary flex items-center justify-center"><Database className="size-5" /></div>
            <div>
              <div className="font-display text-lg font-semibold">Default Dataset</div>
              <div className="text-xs text-muted-foreground">3 years · 6 categories · 480 customers</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Pre-loaded synthetic retail dataset matching the schema of <code>retail_cleaned.csv</code> for instant exploration.</p>
        </CardContent>
      </Card>

      <Section title="Dataset Summary" description="Live stats from the active source">
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          <Stat label="Records" value={sales.length.toLocaleString()} />
          <Stat label="Date range" value={`${sales[0]?.date.slice(0,7)} → ${sales[sales.length-1]?.date.slice(0,7)}`} />
          <Stat label="Customers" value={new Set(sales.map(s => s.customer_id)).size.toLocaleString()} />
          <Stat label="Total revenue" value={"$" + Math.round(sales.reduce((a,b) => a+b.total, 0)).toLocaleString()} />
        </div>
      </Section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-xl bg-muted/40 border border-border/40">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-lg font-semibold mt-1">{value}</div>
    </div>
  );
}

