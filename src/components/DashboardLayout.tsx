
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { ChatWidget } from "./ChatWidget";

export function DashboardLayout() {
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
