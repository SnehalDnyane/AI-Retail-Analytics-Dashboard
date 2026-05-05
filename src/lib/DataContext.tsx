import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { generateSales, Sale } from "./data";
import Papa from "papaparse";

type Mode = "default" | "upload";

type Ctx = {
  sales: Sale[];
  mode: Mode;
  setMode: (m: Mode) => void;
  uploadCsv: (file: File) => Promise<void>;
  loading: boolean;
};

const DataContext = createContext<Ctx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>("default");
  const [uploaded, setUploaded] = useState<Sale[] | null>(null);
  const [loading, setLoading] = useState(false);

  const defaultSales = useMemo(() => generateSales(), []);
  const sales = mode === "upload" && uploaded ? uploaded : defaultSales;

  const uploadCsv = async (file: File) => {
    setLoading(true);
    return new Promise<void>((resolve, reject) => {
      Papa.parse<any>(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => {
          try {
            const rows: Sale[] = res.data.map((r: any, i: number) => {
              const qty = Number(r.quantity ?? r.Quantity ?? 1);
              const price = Number(r.unit_price ?? r.UnitPrice ?? r.price ?? 0);
              const total = Number(r.total ?? r.Total ?? qty * price);
              return {
                id: r.id ?? `U${i}`,
                date: (r.date ?? r.Date ?? "").toString().slice(0, 10),
                customer_id: r.customer_id ?? r.CustomerID ?? `C${i}`,
                category: r.category ?? r.Category ?? "Other",
                product: r.product ?? r.Product ?? r.item ?? "Unknown",
                quantity: qty,
                unit_price: price,
                total,
                age: Number(r.age ?? r.Age ?? 30),
                gender: ((r.gender ?? r.Gender ?? "F").toString().toUpperCase().startsWith("M") ? "M" : "F") as "M" | "F",
              };
            }).filter((r) => r.date && !isNaN(r.total));
            setUploaded(rows);
            setMode("upload");
            setLoading(false);
            resolve();
          } catch (e) { setLoading(false); reject(e); }
        },
        error: (e) => { setLoading(false); reject(e); },
      });
    });
  };

  return (
    <DataContext.Provider value={{ sales, mode, setMode, uploadCsv, loading }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
