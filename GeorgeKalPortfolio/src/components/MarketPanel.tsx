"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

// --- Your existing CompanyDataBox unchanged ---
function CompanyDataBox({ symbol, price, percent }) {
  const hasPrice = Number.isFinite(price);
  const hasPercent = Number.isFinite(percent);
  const isLoading = !hasPrice && !hasPercent;
  const isPositive = hasPercent && percent >= 0;
  const formatPrice = (p) =>
    p == null ? "--" : p.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const formatPercent = (p) =>
    p == null || !Number.isFinite(p) ? "--" : `${p >= 0 ? "+" : ""}${p.toFixed(2)}%`;
  return (
    <a href={`https://finance.yahoo.com/quote/${symbol}`} target="_blank" rel="noreferrer" className="no-underline cursor-none">
    <div className={`cursor-enlarge relative rounded-xl p-3 md:p-4 backdrop-blur-lg transition-all duration-300 ${isLoading ? 'bg-black/30 backdrop-blur-sm'  : 'bg-black/60 backdrop-blur-[90px] border border-white/10 hover:scale-102' }`}>
      <div className="cursor-enlarge items-center justify-between mb-1">
        <div className="cursor-enlarge font-bold text-sm md:text-base text-white truncate">{symbol}</div>
      </div>
      <div className={`cursor-enlarge text-lg md:text-sm font-mono text-white ${isLoading ? 'h-8' : ''}`}>
        {isLoading ? (
          <div className="flex items-end gap-1 h-6 cursor-enlarge">
            {[0,1,2,3,4].map((n) => (
              <span key={n} className="cursor-enlarge eq-bar bg-white/70 rounded-sm" style={{ width: n===1?4: n===3?3:2, height: `${8 + (n*4)}px`, animationDelay: `${n * 120}ms` }} />
            ))}
          </div>
        ) : (hasPrice ? `$${formatPrice(price)}` : "--")}
      </div>
        {hasPercent && (
          <div className={`cursor-enlarge text-xs inline font-mono px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
            {formatPercent(percent)}
          </div>
        )}
    </div>
    </a>
  );
}

// --- JSONP helper for Apps Script CORS ---
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = `__gfcb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window[cb] = (data) => { resolve(data); delete window[cb]; script.remove(); };
    const script = document.createElement("script");
    // Support both ?prefix= and ?callback=
    const sep = url.includes("?") ? "&" : "?";
    script.src = `${url}${sep}prefix=${cb}`;
    script.onerror = (e) => { delete window[cb]; script.remove(); reject(e); };
    document.body.appendChild(script);
  });
}


export default function MarketPanel({
  // Paste your Apps Script Web App URL here:
  endpoint = "https://script.google.com/macros/s/AKfycbxZaY5JzGSDvqn84RGOOEtkEhMP3bi8xl8k8WwzC8kmUtoq_EIlSFGrNQV1LbtEOn3Z/exec",
  symbols = ["AAPL","MSFT","NVDA","GOOGL","AMZN","META"],
}) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // keep latest rows in a ref so the interval callback always sees current state
  const rowsRef = useRef(rows);
  useEffect(() => { rowsRef.current = rows; }, [rows]);

  // bg floaters (unchanged)
  const floaters = useMemo(() => {
    const pool = [...symbols, "SPY", "QQQ", "DJI", "IXIC", "XAUUSD", "EURUSD"];
    return Array.from({ length: 22 }, (_, i) => {
      const s = pool[Math.floor(Math.random() * pool.length)];
      const val = (Math.random() * 1000).toFixed(2);
      const sign = Math.random() > 0.5 ? 1 : -1;
      const pct = (Math.random() * 2 * sign).toFixed(2);
      return { id: i, s, val, pct, left: Math.random() * 100 + 5, top: Math.random() * 100 + 5, dur: 7 + Math.random() * 10, sign };
    });
  }, [symbols]);

  useEffect(() => {
    // poller that: (a) fetches only symbols on screen, (b) runs every 5s, (c) cleans up correctly
    let alive = true;
    let controller = new AbortController();

    const fetchOnce = async (isInitial = false) => {
      if (!alive) return;

      // Only request tickers that are currently on screen
      // If we haven't loaded yet, fall back to the incoming `symbols` prop.
      const onScreen = rowsRef.current?.length
        ? rowsRef.current.map(r => r.symbol)
        : symbols;

      // Ensure stable order & no duplicates
      const requested = Array.from(new Set(onScreen.map(s => String(s || "").toUpperCase())));
      const qs = `symbols=${encodeURIComponent(requested.join(","))}`;
      const url = `${endpoint}?${qs}`;

      try {
        if (isInitial) { setLoading(true); setErr(null); }

        // Try standard fetch first (abortable)
        const res = await fetch(url, { method: "GET", signal: controller.signal });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json: any = await res.json();

        if (!alive) return;

        const data: any[] = Array.isArray(json?.data) ? json.data : [];
        const map = new Map<string, { price: number | null; percent: number | null }>(
          data.map((n: any) => [
            String(n.symbol || "").toUpperCase(),
            {
              price: Number.isFinite(+n.price) ? +n.price : null,
              percent: Number.isFinite(+n.percent) ? +n.percent : null,
            },
          ])
        );

        // Preserve the UI order by mapping over `requested`
        const nextRows = requested.map(sym => ({
          symbol: sym,
          price: map.get(sym)?.price ?? null,
          percent: map.get(sym)?.percent ?? null,
        }));

        setRows(nextRows);
      } catch (e) {
        // Ignore aborts; otherwise try JSONP as a CORS fallback
        if (e?.name === "AbortError") return;
        try {
          const jsonpData: any = await jsonp(url);
          if (!alive) return;

          const data: any[] = Array.isArray(jsonpData?.data) ? jsonpData.data : [];
          const map = new Map<string, { price: number | null; percent: number | null }>(
            data.map((n: any) => [
              String(n.symbol || "").toUpperCase(),
              {
                price: Number.isFinite(+n.price) ? +n.price : null,
                percent: Number.isFinite(+n.percent) ? +n.percent : null,
              },
            ])
          );

          const nextRows = requested.map(sym => ({
            symbol: sym,
            price: map.get(sym)?.price ?? null,
            percent: map.get(sym)?.percent ?? null,
          }));

          setRows(nextRows);
        } catch (ee) {
          setErr(String(ee?.message || ee));
        }
      } finally {
        if (isInitial && alive) setLoading(false);
      }
    };

    // Initial load
    fetchOnce(true);

    // Every 5 seconds, abort any in-flight fetch and start a new one
    const timer = setInterval(() => {
      controller.abort(); // cancel prior fetch to avoid overlaps
      controller = new AbortController();
      fetchOnce(false);
    }, 10000);

    // Cleanup: stop interval and abort any in-flight request
    return () => {
      alive = false;
      clearInterval(timer);
      controller.abort();
    };
  }, [endpoint, symbols]); // re-create poller if endpoint or symbols prop changes

  const showing = (loading && rows.length === 0)
    ? symbols.map(s => ({ symbol: s, price: null, percent: null }))
    : rows;

  return (
    <div className="relative rounded-3xl p-5 md:p-6 bg-black/30 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden min-h-[380px] font-sans text-white">
      <style>{`
        @keyframes float{0%{transform:translateY(-100px) translateX(-100px) scale(.8);opacity:.35}50%{transform:translateY(150px) translateX(150px) scale(1.08);opacity:.65}100%{transform:translateY(-100px) translateX(-100px) scale(.8);opacity:.35}}
        .animate-float{animation:float 10s ease-in-out infinite;}

        /* Equalizer bars for loading state */
        @keyframes eqRise { 0% { transform: scaleY(0.4); opacity: 0.6 } 50% { transform: scaleY(1.0); opacity: 1 } 100% { transform: scaleY(0.5); opacity: 0.7 } }
        .eq-bar { display:inline-block; transform-origin: bottom; animation: eqRise 700ms ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .eq-bar { animation: none; opacity: 0.7 } }
      `}</style>

      <div className="pointer-events-none absolute inset-0">
        {floaters.map(f => (
          <div key={f.id} className={`absolute text-xs md:text-sm opacity-50 animate-float ${f.sign>0?'text-emerald-400':'text-rose-400'}`} style={{ left: `${f.left}%`, top: `${f.top}%`, animationDuration: `${f.dur}s` }}>
            <span className="font-mono">{f.s}</span>{" "}
            <span className="font-mono">${f.val}</span>{" "}
            <span className="font-mono">{f.sign>0?"+":""}{f.pct}%</span>
          </div>
        ))}
      </div>

      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm uppercase tracking-wider text-white/80">Live Watchlist</h3>
          <div className="text-[10px] md:text-xs text-white/60">Google Finance</div>
        </div>

        {err && <div className="text-rose-400 text-xs mb-2 p-3 bg-rose-500/10 rounded-lg">Error: {err}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
          {showing.map((q, i) => (
            <CompanyDataBox key={q.symbol || i} symbol={q.symbol} price={q.price} percent={q.percent} />
          ))}
        </div>
      </div>
    </div>
  );
}
