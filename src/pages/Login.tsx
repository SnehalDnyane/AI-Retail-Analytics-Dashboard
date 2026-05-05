import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { user, signIn, signUp } = useAuth();
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = mode === "signin" ? await signIn(email, password) : await signUp(email, password, name);
    setLoading(false);
    if (error) { toast.error(error); return; }
    if (mode === "signup") toast.success("Account created — check your email or sign in.");
    nav("/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex flex-col p-8 lg:p-16 justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gradient-cocoa flex items-center justify-center"><Sparkles className="size-5 text-primary-foreground" /></div>
          <div>
            <div className="font-display text-lg font-semibold leading-tight">FinSight AI</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sales Intelligence</div>
          </div>
        </Link>

        <Card className="max-w-md w-full mx-auto p-8 bg-gradient-card border-border/60 shadow-elevated">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{mode === "signin" ? "Welcome back" : "Create account"}</h1>
          <p className="text-sm text-muted-foreground mt-2">{mode === "signin" ? "Sign in to access your dashboard." : "Start exploring your retail intelligence."}</p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" required />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            {mode === "signin" && (
              <div className="flex items-center gap-2">
                <Checkbox id="remember" defaultChecked />
                <Label htmlFor="remember" className="text-xs font-normal cursor-pointer">Remember me</Label>
              </div>
            )}
            <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="size-4 animate-spin" /> : <>{mode === "signin" ? "Sign in" : "Create account"} <ArrowRight className="size-4" /></>}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New to FinSight? " : "Already have an account? "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="text-primary font-medium hover:underline">
              {mode === "signin" ? "Create account" : "Sign in"}
            </button>
          </div>
        </Card>

        <div className="text-xs text-muted-foreground">© 2026 FinSight AI</div>
      </div>

      <div className="hidden lg:flex bg-gradient-hero relative overflow-hidden p-16 flex-col justify-end">
        <div className="absolute inset-0 bg-gradient-cocoa opacity-10" />
        <blockquote className="relative max-w-md">
          <div className="font-display text-3xl leading-tight text-primary">"FinSight turned three quarters of scattered spreadsheets into one decisive forecast in an afternoon."</div>
          <footer className="mt-6 text-sm text-muted-foreground">— VP of Analytics, Fortune 500 Retailer</footer>
        </blockquote>
      </div>
    </div>
  );
}
