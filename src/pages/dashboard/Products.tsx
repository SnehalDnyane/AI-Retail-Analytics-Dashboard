import { useMemo } from "react";
import { useData } from "@/lib/DataContext";
import { aprioriRules, categoryBreakdown } from "@/lib/data";
import { PageHeader, Section, chartTheme } from "@/components/ui-bits";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });

export default function Products() {
  const { sales } = useData();
  const cats = useMemo(() => categoryBreakdown(sales).sort((a, b) => b.revenue - a.revenue), [sales]);
  const rules = aprioriRules();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Market Basket Analysis" title="Product Recommendations" subtitle="Apriori association rules and cross-sell intelligence to power merchandising decisions." />

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {cats.map((c, i) => (
          <Card key={c.category} className="bg-gradient-card border-border/60 shadow-soft hover:shadow-elevated transition-smooth">
            <CardContent className="p-4">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">#{i+1}</div>
              <div className="font-medium text-sm mt-1">{c.category}</div>
              <div className="font-display text-lg font-semibold mt-2">{fmt(c.revenue)}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Section title="Apriori Association Rules" description="Items frequently purchased together">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead className="text-right">Support</TableHead>
              <TableHead className="text-right">Confidence</TableHead>
              <TableHead className="text-right">Lift</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map(r => (
              <TableRow key={r.antecedent + r.consequent}>
                <TableCell>
                  <span className="font-medium">{r.antecedent}</span>
                  <ArrowRight className="size-3 inline mx-2 text-muted-foreground" />
                  <span className="font-medium">{r.consequent}</span>
                </TableCell>
                <TableCell className="text-right font-mono text-xs">{(r.support * 100).toFixed(1)}%</TableCell>
                <TableCell className="text-right font-mono text-xs">{(r.confidence * 100).toFixed(0)}%</TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-primary">{r.lift.toFixed(1)}×</span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section title="Rule Strength Bubble Chart" description="Confidence vs Support · bubble size = Lift">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} />
              <XAxis dataKey="support" name="Support" stroke={chartTheme.axis} fontSize={11} tickFormatter={v => `${(v*100).toFixed(0)}%`} />
              <YAxis dataKey="confidence" name="Confidence" stroke={chartTheme.axis} fontSize={11} tickFormatter={v => `${(v*100).toFixed(0)}%`} />
              <ZAxis dataKey="lift" range={[100, 800]} />
              <Tooltip contentStyle={chartTheme.tooltip}
                formatter={(v: any, n: string) => n === "lift" ? `${v.toFixed(1)}×` : `${(v*100).toFixed(1)}%`}
                labelFormatter={(_, p: any) => p?.[0] ? `${p[0].payload.antecedent} → ${p[0].payload.consequent}` : ""}
              />
              <Scatter data={rules} fill="hsl(var(--chart-1))" fillOpacity={0.7} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </Section>

      <Section title="Cross-Sell Opportunities" description="Top 3 actionable bundle recommendations">
        <div className="grid gap-4 md:grid-cols-3">
          {rules.slice(0, 3).map(r => (
            <div key={r.antecedent} className="p-5 rounded-xl bg-gradient-warm border border-border/40">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Bundle</div>
              <div className="mt-2 font-display text-base font-semibold">{r.antecedent} + {r.consequent}</div>
              <div className="mt-3 text-xs text-muted-foreground">
                Customers buying <span className="font-medium text-foreground">{r.antecedent}</span> are <span className="font-medium text-primary">{r.lift.toFixed(1)}× more likely</span> to also purchase <span className="font-medium text-foreground">{r.consequent}</span>.
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
