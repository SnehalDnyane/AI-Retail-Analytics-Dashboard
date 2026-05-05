import { useState } from "react";
import { useData } from "@/lib/DataContext";
import { PageHeader, Section } from "@/components/ui-bits";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Upload, FileCheck2, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";

export default function DataSource() {
  const { mode, setMode, uploadCsv, sales, loading } = useData();
  const [drag, setDrag] = useState(false);

  const handleFile = async (file: File) => {
    try {
      await uploadCsv(file);
      toast.success(`Loaded ${file.name}`);
    } catch (e: any) {
      toast.error("Failed to parse CSV: " + (e?.message ?? ""));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader eyebrow="Workspace" title="Data Source" subtitle="Switch between the curated default dataset and your own uploaded CSV." />

      <div className="grid gap-4 md:grid-cols-2">
        <Card className={`bg-gradient-card border-2 transition-smooth ${mode === "default" ? "border-primary shadow-elevated" : "border-border/60"}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl bg-secondary flex items-center justify-center"><Database className="size-5" /></div>
              <div>
                <div className="font-display text-lg font-semibold">Default Dataset</div>
                <div className="text-xs text-muted-foreground">3 years · 6 categories · 480 customers</div>
              </div>
              {mode === "default" && <Badge className="ml-auto">Active</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mb-4">Pre-loaded synthetic retail dataset matching the schema of <code>retail_cleaned.csv</code> for instant exploration.</p>
            <Button variant={mode === "default" ? "secondary" : "default"} onClick={() => setMode("default")}>
              Use Default
            </Button>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-card border-2 transition-smooth ${mode === "upload" ? "border-primary shadow-elevated" : "border-border/60"}`}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl bg-secondary flex items-center justify-center"><Upload className="size-5" /></div>
              <div>
                <div className="font-display text-lg font-semibold">Upload CSV</div>
                <div className="text-xs text-muted-foreground">Drag & drop your retail dataset</div>
              </div>
              {mode === "upload" && <Badge className="ml-auto">Active</Badge>}
            </div>
            <label
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => {
                e.preventDefault(); setDrag(false);
                const f = e.dataTransfer.files[0];
                if (f) handleFile(f);
              }}
              className={`block border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-smooth ${drag ? "border-primary bg-secondary/50" : "border-border hover:border-primary/50"}`}
            >
              <FileSpreadsheet className="size-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm font-medium">Drop CSV here or click to browse</div>
              <div className="text-xs text-muted-foreground mt-1">Required columns: date, category, product, quantity, unit_price, customer_id</div>
              <input type="file" accept=".csv" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
            </label>
          </CardContent>
        </Card>
      </div>

      <Section title="Current Dataset Summary" description="Live stats from active source">
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
