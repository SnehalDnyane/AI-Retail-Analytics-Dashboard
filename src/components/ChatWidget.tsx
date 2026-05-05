import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Sparkles, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { useData } from "@/lib/DataContext";
import { aggregateMonthly, categoryBreakdown } from "@/lib/data";

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "What is the top performing category?",
  "Show me revenue trend insights",
  "Explain the customer segments",
  "Which products should I promote?",
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi — I'm **FinSight AI**. Ask me anything about your retail KPIs, forecasts, or customer segments." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { sales } = useData();

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const buildContext = () => {
    const monthly = aggregateMonthly(sales);
    const cat = categoryBreakdown(sales).sort((a, b) => b.revenue - a.revenue);
    const totalRev = sales.reduce((a, b) => a + b.total, 0);
    const last = monthly.slice(-3);
    return `Total Revenue: $${Math.round(totalRev).toLocaleString()}
Total Transactions: ${sales.length.toLocaleString()}
Top Category: ${cat[0]?.category} ($${cat[0]?.revenue.toLocaleString()})
Last 3 months revenue: ${last.map(m => `${m.month}: $${m.revenue.toLocaleString()}`).join(", ")}
All categories: ${cat.map(c => `${c.category}=$${c.revenue.toLocaleString()}`).join(", ")}`;
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: next, context: buildContext() }),
      });
      if (!resp.ok || !resp.body) {
        const txt = await resp.text();
        setMessages(m => [...m, { role: "assistant", content: `⚠️ ${txt || "Failed to reach AI."}` }]);
        setLoading(false);
        return;
      }
      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = "";
      let acc = "";
      let done = false;
      setMessages(m => [...m, { role: "assistant", content: "" }]);
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, i);
          buf = buf.slice(i + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const j = line.slice(6).trim();
          if (j === "[DONE]") { done = true; break; }
          try {
            const p = JSON.parse(j);
            const delta = p.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setMessages(m => m.map((msg, idx) => idx === m.length - 1 ? { ...msg, content: acc } : msg));
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e) {
      setMessages(m => [...m, { role: "assistant", content: "⚠️ Network error. Please retry." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "fixed bottom-6 right-6 z-50 size-14 rounded-full bg-gradient-cocoa shadow-elevated flex items-center justify-center text-primary-foreground transition-smooth hover:scale-110",
          open && "scale-90"
        )}
        aria-label="Toggle chat"
      >
        {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
      </button>

      <div className={cn(
        "fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-3rem))] h-[600px] max-h-[calc(100vh-8rem)] rounded-2xl bg-card border border-border shadow-elevated flex flex-col overflow-hidden transition-smooth origin-bottom-right",
        open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
      )}>
        <div className="px-4 py-3 border-b border-border bg-gradient-warm flex items-center gap-2">
          <div className="size-8 rounded-lg bg-gradient-cocoa flex items-center justify-center">
            <Sparkles className="size-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-display font-semibold text-sm">FinSight AI Assistant</div>
            <div className="text-[10px] text-muted-foreground">Powered by Lovable AI · live data context</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                m.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-secondary text-secondary-foreground rounded-bl-sm"
              )}>
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 dark:prose-invert">
                  <ReactMarkdown>{m.content || "…"}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {loading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-2xl px-4 py-2.5"><Loader2 className="size-4 animate-spin" /></div>
            </div>
          )}
        </div>

        {messages.length <= 2 && (
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
            {STARTERS.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-muted hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-smooth">
                {s}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="p-3 border-t border-border flex gap-2">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your data..." disabled={loading} />
          <Button type="submit" size="icon" disabled={loading || !input.trim()}>
            <Send className="size-4" />
          </Button>
        </form>
      </div>
    </>
  );
}
