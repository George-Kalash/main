import React, { useEffect, useMemo, useRef, useState } from "react";
import CompanyDataBox from "./CompanyDataBox"; // <-- add this import

export function MarketPanel({
  apiKey = "",
  symbols = ["AAPL","MSFT","NVDA","GOOGL","AMZN","META"],
}) {
  const API_KEY = apiKey || import.meta.env?.VITE_TWELVE_API_KEY || "";
  const [rows, setRows] = useState([]);   // [{ symbol, price, percent }]
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const fetchedOnceRef = useRef(false);

  const styles = `
    @keyframes float {
      0% { transform: translateY(-100px) translateX(-100px) scale(0.8); opacity: .35 }
      50% { transform: translateY(150px) translateX(150px) scale(1.08); opacity: .65 }
      100% { transform: translateY(-100px) translateX(-100px) scale(0.8); opacity: .35 }
    }
    .animate-float { animation: float 10s ease-in-out infinite; }
  `;

  const floaters = useMemo(() => {
    const pool = [...symbols, "SPY","QQQ","DJI","IXIC","XAUUSD","EURUSD"];
    const out = [];
    for (let i = 0; i < 22; i++) {
      const s = pool[Math.floor(Math.random() * pool.length)];
      const val = (Math.random() * 1000).toFixed(2);
      const sign = Math.random() > 0.5 ? 1 : -1;
      const pct = (Math.random() * 2 * sign).toFixed(2);
      out.push({ id:i, s, val, pct, left: Math.random()*100+5, top: Math.random()*100+5, dur: 7+Math.random()*10, sign });
    }
    return out;
  }, [symbols]);

  const clsx = (...xs) => xs.filter(Boolean).join(" ");

  // ONE fetch once (batched /quote)
  useEffect(() => {
    if (fetchedOnceRef.current) return;
    fetchedOnceRef.current = true;

    let alive = true;
    (async () => {
      try {
        if (!API_KEY) throw new Error("Missing Twelve Data API key");
        setErr(null); setLoading(true);

        const joined = symbols.join(",");
        const res = await fetch(`https://api.twelvedata.com/quote?symbol=${encodeURIComponent(joined)}&apikey=${API_KEY}`);
        if (!res.ok) throw new Error(`Quote HTTP ${res.status}`);
        const data = await res.json();

        // Build plain array of objects in the same order as `symbols`
        const result = [];
        for (const s of symbols) {
          const k = s.toUpperCase();
          const row =
            data[k] ||
            data[s] ||
            (Array.isArray(data?.data)
              ? data.data.find(d => (d.symbol || d.name || "").toUpperCase() === k)
              : (data?.symbol ? data : null));

          const price = row ? Number(row.price ?? row.last ?? row.close ?? row.ask ?? row.bid) : NaN;
          const percent = row ? Number(row.percent_change ?? row.changes_percentage ?? row.change_percent ?? row.percent ?? 0) : NaN;
          const volume = row ? Number(row.volume ?? row.avg_volume ?? row.avgvolume ?? 0) : NaN;
          console.log(price, percent);
          result.push({
            symbol: k,
            price: price ,
            percent: percent,
            // market_cap: volume * price,
          });
        }
        if (alive) setRows(result);
      } catch (e) {
        if (alive) setErr(String(e?.message || e));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    console.log("API_KEY: ", API_KEY);
    return () => { alive = false; };
  }, [API_KEY, symbols]);

  // ===== Use a FOR LOOP to build the array of boxes =====
  const quotes = rows; // [{ symbol, price, percent }]
  console.log("quotes: ", quotes);
  const source =  quotes;

  const boxes = [];
  for (let i = 0; i < source.length; i++) {
    const q = source[i];
    console.log("company: ", q);
    boxes.push(
      <CompanyDataBox
        key={q.symbol || i}
        symbol={q.symbol || symbols[i]}
        price={q.price}
        percent={q.percent}
        // market_cap={q.volume * q.price}
      />
    );
  }
  console.log("boxes: ",boxes)
  // ======================================================

  return (
    <div className="relative rounded-3xl p-5 md:p-6 bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden min-h-[380px]">
      <style>{styles}</style>

      {/* Floating numbers layer */}
      <div className="pointer-events-none absolute inset-0">
        {floaters.map((f) => (
          <div
            key={f.id}
            className={clsx("absolute text-xs md:text-sm opacity-50 animate-float", f.sign > 0 ? "text-emerald-300" : "text-rose-300")}
            style={{ left: `${f.left}%`, top: `${f.top}%`, animationDuration: `${f.dur}s` }}
          >
            <span className="font-mono">{f.s}</span>{" "}
            <span className="font-mono">${f.val}</span>{" "}
            <span className="font-mono">{f.sign > 0 ? "+" : ""}{f.pct}%</span>
          </div>
        ))}
      </div>

      {/* Cards overlay */}
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm uppercase tracking-wide text-white/80">Live Watchlist</h3>
          <div className="text-[10px] md:text-xs text-white/60">Powered by Twelve Data</div>
        </div>

        {err && <div className="text-rose-300 text-xs mb-2">Error: {err}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {boxes}
        </div>
      </div>
    </div>
  );
}
