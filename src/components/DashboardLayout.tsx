import { Outlet, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/lib/AuthContext";
import { ChatWidget } from "./ChatWidget";
import { Skeleton } from "./ui/skeleton";

export function DashboardLayout() {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-32 w-64" /></div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border/60 px-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md">
            <SidebarTrigger />
            <div className="flex-1" />
            <div className="text-xs text-muted-foreground hidden md:block">FinSight AI · Retail Sales Intelligence</div>
          </header>
          <main className="flex-1 p-6 md:p-8 overflow-auto scrollbar-thin">
            <Outlet />
          </main>
        </div>
        <ChatWidget />
      </div>
    </SidebarProvider>
  );
}
