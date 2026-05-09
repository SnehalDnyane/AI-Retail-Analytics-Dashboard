import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, TrendingUp, LineChart, Sparkles, Users, ShoppingBag, FileBarChart,
  Database, LogOut, Sun, Moon, MessageCircle
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar, SidebarHeader, SidebarFooter,
} from "@/components/ui/sidebar";
import { useTheme } from "@/lib/ThemeContext";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Sales Trends", url: "/dashboard/trends", icon: TrendingUp },
  { title: "Forecast", url: "/dashboard/forecast", icon: LineChart },
  { title: "Recommendations", url: "/dashboard/recommendations", icon: Sparkles },
  { title: "Customer Segments", url: "/dashboard/segments", icon: Users },
  { title: "Products", url: "/dashboard/products", icon: ShoppingBag },
  { title: "Insights", url: "/dashboard/insights", icon: FileBarChart },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const { theme, toggle } = useTheme();
  const { signOut, user } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-5">
        <NavLink to="/" className="flex items-center gap-2.5">
          <div className="size-9 rounded-xl bg-gradient-cocoa flex items-center justify-center shadow-soft">
            <Sparkles className="size-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">FinSight AI</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Sales Intelligence</div>
            </div>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} className="rounded-lg transition-smooth">
                      <NavLink to={item.url} className="flex items-center gap-3">
                        <item.icon className="size-4" />
                        {!collapsed && <span className="text-sm">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest">Data</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="rounded-lg">
                  <NavLink to="/dashboard/data" className="flex items-center gap-3">
                    <Database className="size-4" />
                    {!collapsed && <span className="text-sm">Data Source</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 gap-2">
        {!collapsed && user && (
          <div className="px-2 py-2 rounded-lg bg-sidebar-accent/60">
            <div className="text-xs font-medium truncate">{user.email}</div>
            <div className="text-[10px] text-muted-foreground">Signed in</div>
          </div>
        )}
        <div className="flex gap-2">
          <Button variant="soft" size="icon" onClick={toggle} className="flex-1" title="Toggle theme">
            {theme === "light" ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <Button variant="soft" size="icon" onClick={signOut} className="flex-1" title="Sign out">
            <LogOut className="size-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
