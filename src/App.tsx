
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/ThemeContext";
import { DataProvider } from "@/lib/DataContext";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Trends from "./pages/dashboard/Trends";
import Forecast from "./pages/dashboard/Forecast";
import Recommendations from "./pages/dashboard/Recommendations";
import Segments from "./pages/dashboard/Segments";
import Products from "./pages/dashboard/Products";
import Insights from "./pages/dashboard/Insights";
import DataSource from "./pages/dashboard/DataSource";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <DataProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Redirect root straight to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/login" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Overview />} />
                <Route path="trends" element={<Trends />} />
                <Route path="forecast" element={<Forecast />} />
                <Route path="recommendations" element={<Recommendations />} />
                <Route path="segments" element={<Segments />} />
                <Route path="products" element={<Products />} />
                <Route path="insights" element={<Insights />} />
                <Route path="data" element={<DataSource />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </DataProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;