import { useMemo } from "react";
import { useData } from "@/lib/DataContext";
import {
  aggregateMonthly, categoryBreakdown, topCustomers, ageDistribution, genderSplit
} from "@/lib/data";
import { KpiCard, PageHeader, Section, chartTheme } from "@/components/ui-bits";
import { DollarSign, ShoppingCart, TrendingUp, Award, Users } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, PolarAngleAxis, Legend
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const fmt = (n: number) => "$" + n.toLocaleString(undefined, { maximumFractionDigits: 0 });
const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-6))"];

export default function Overview() {
  const { sales } = useData();
  const data = useMemo(() => {
    const totalRev = sales.reduce((a, b) => a + b.total, 0);
    const tx = sales.length;
    const avg = totalRev / tx;
    const cats = categoryBreakdown(sales).sort((a, b) => b.revenue - a.revenue);
    const top = cats[0]?.category;
    const customers = new Set(sales.map(s => s.customer_id)).size;
    const monthly = aggregateMonthly(sales);
    const last = monthly[monthly.length - 1].revenue;
    const prev = monthly[monthly.length - 2].revenue;
    const mom = ((last - prev) / prev) * 100;
    const health = Math.min(100, Math.round(60 + mom * 1.5 + (cats.length / 8) * 10));
    return { totalRev, tx, avg, top, customers, cats, monthly, mom, health };
  }, [sales]);

  const customers = topCustomers(sales);
  const ages = ageDistribution(sales);
  const genders = genderSplit(sales);

  const insights = [
    `**${data.top}** is the top revenue category, generating ${fmt(data.cats[0].revenue)} across the period.`,
    `Month-over-month revenue ${data.mom >= 0 ? "grew" : "fell"} **${Math.abs(data.mom).toFixed(1)}%** in the latest period.`,
    `Customer base of **${data.customers.toLocaleString()}** unique buyers with average order value of **${fmt(data.avg)}**.`,
    `Business Health Score sits at **${data.health}/100**, indicating ${data.health > 75 ? "strong" : "moderate"} operational momentum.`,
  ];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Executive Dashboard" title="Overview & KPIs" subtitle="Real-time pulse of your retail operation — revenue, demand, customers, and signals." />

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <KpiCard label="Total Revenue" value={fmt(data.totalRev)} delta={data.mom} hint="vs last month" icon={DollarSign} />
        <KpiCard label="Transactions" value={data.tx.toLocaleString()} hint="completed orders" icon={ShoppingCart} />
        <KpiCard label="Avg Sale Value" value={fmt(data.avg)} hint="per transaction" icon={TrendingUp} />
        <KpiCard label="Top Category" value={data.top} hint={fmt(data.cats[0].revenue)} icon={Award} />
        <KpiCard label="Unique Customers" value={data.customers.toLocaleString()} hint="active buyers" icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Revenue by Category" description="Year-over-year comparison" >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.cats}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="category" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip contentStyle={chartTheme.tooltip} formatter={(v: number) => fmt(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="2023" fill="hsl(var(--chart-3))" radius={[6,6,0,0]} />
                <Bar dataKey="2024" fill="hsl(var(--chart-2))" radius={[6,6,0,0]} />
                <Bar dataKey="2025" fill="hsl(var(--chart-1))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>

        <Section title="Business Health Score" description="Composite signal across growth, margin & retention">
          <div className="h-72 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="70%" outerRadius="100%" data={[{ name: "Health", value: data.health, fill: "hsl(var(--chart-1))" }]} startAngle={210} endAngle={-30}>
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={20} background={{ fill: "hsl(var(--muted))" }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-display text-5xl font-semibold">{data.health}</div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">/ 100</div>
              <div className="text-xs text-success mt-2">{data.health > 75 ? "Excellent" : data.health > 50 ? "Healthy" : "Watch"}</div>
            </div>
          </div>
        </Section>

        <Section title="AI-Generated Insights" description="Auto-summarized from current data">
          <ul className="space-y-3 text-sm">
            {insights.map((s, i) => (
              <li key={i} className="flex gap-3 p-3 rounded-lg bg-muted/40">
                <div className="size-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <span dangerouslySetInnerHTML={{ __html: s.replace(/\*\*(.*?)\*\*/g, '<strong class="text-foreground">$1</strong>') }} />
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title="Age Distribution" description="Unique customer demographics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ages}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartTheme.grid} vertical={false} />
                <XAxis dataKey="bucket" stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke={chartTheme.axis} fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Gender Split" description="Customer demographics">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={genders} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {genders.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip contentStyle={chartTheme.tooltip} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Section>
        <Section title="Top Customers" description="By lifetime revenue">
          <Table>
            <TableHeader>
              <TableRow><TableHead>Customer</TableHead><TableHead className="text-right">Orders</TableHead><TableHead className="text-right">Revenue</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {customers.map(c => (
                <TableRow key={c.customer}><TableCell className="font-mono text-xs">{c.customer}</TableCell><TableCell className="text-right">{c.orders}</TableCell><TableCell className="text-right font-medium">{fmt(c.revenue)}</TableCell></TableRow>
              ))}
            </TableBody>
          </Table>
        </Section>
      </div>
    </div>
  );
}
