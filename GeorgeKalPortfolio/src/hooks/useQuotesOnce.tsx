import { useEffect, useRef, useState } from "react";

export interface Quote {
  symbol: string;
  price: number | null;
  percent: number | null;
}

/**
 * Fetch latest quotes ONCE (one batched /quote call).
 * - Keeps array order identical to `symbols`
 * - Dev StrictMode-safe (guard + AbortController)
 */
export function useQuotesOnce(symbols: string[], apiKey: string) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchedOnceRef = useRef(false);

  useEffect(() => {
    if (fetchedOnceRef.current) return;           // dev StrictMode guard
    fetchedOnceRef.current = true;

    const ac = new AbortController();

    (async () => {
      try {
        if (!apiKey) throw new Error("Missing Twelve Data API key");
        setError(null);
        setLoading(true);

        const joined = symbols.join(",");
        const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(joined)}&apikey=${apiKey}`;
        const res = await fetch(url, { signal: ac.signal });
        if (!res.ok) throw new Error(`Quote HTTP ${res.status}`);
        const data = await res.json();

        const result: Quote[] = [];
        for (const s of symbols) {
          const sym = s.toUpperCase();

          // Handle keyed batch objects, arrays under data, or single object
          const row =
            data[sym] ||
            data[s] ||
            (Array.isArray(data?.data)
              ? data.data.find((d: any) => (d.symbol || d.name || "").toUpperCase() === sym)
              : (data?.symbol ? data : null));

          if (row && row.status === "error") {
            result.push({ symbol: sym, price: null, percent: null });
            continue;
          }

          const priceRaw   = row ? Number(row.price ?? row.last ?? row.close ?? row.ask ?? row.bid) : NaN;
          const percentRaw = row ? Number(row.percent_change ?? row.changes_percentage ?? row.change_percent ?? row.percent ?? 0) : NaN;

          result.push({
            symbol: sym,
            price: Number.isFinite(priceRaw) ? priceRaw : null,
            percent: Number.isFinite(percentRaw) ? percentRaw : null,
          });
        }

        setQuotes(result);
      } catch (e: any) {
        if (e?.name !== "AbortError") setError(e?.message || String(e));
      } finally {
        setLoading(false);
      }
    })();

    return () => ac.abort();
    // We intentionally don't re-fetch on prop changes; this is "once".
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("useQuotesOnce", { symbols, quotes, loading, error });
  return { quotes, loading, error };
}
