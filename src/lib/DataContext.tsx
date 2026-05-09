import { createContext, useContext, useMemo, ReactNode } from "react";
import { generateSales, Sale } from "./data";

type Ctx = {
  sales: Sale[];
  loading: boolean;
};

const DataContext = createContext<Ctx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const sales = useMemo(() => generateSales(), []);

  return (
    <DataContext.Provider value={{ sales, loading: false }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

