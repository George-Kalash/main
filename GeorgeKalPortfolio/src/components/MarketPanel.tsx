"use client";
import React, { useEffect, useMemo, useState } from "react";

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
    <div className={`relative rounded-xl p-3 md:p-4 transition-all duration-300 ${isLoading ? 'bg-white/5 animate-pulse' : 'bg-black/30 backdrop-blur-xl border border-white/10 shadow-lg hover:scale-105' }`}>
      <div className=" items-center justify-between mb-1">
        <div className="font-bold text-sm md:text-base text-white truncate">{symbol}</div>
      </div>
      <div className={`text-lg md:text-sm font-mono text-white ${isLoading ? 'h-8' : ''}`}>
        {isLoading ? '' : (hasPrice ? `$${formatPrice(price)}` : "--")}
      </div>
        {hasPercent && (
          <div className={`text-xs inline font-mono px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
            {formatPercent(percent)}
          </div>
        )}
    </div>
  );
}

// --- JSONP helper for Apps Script CORS ---
function jsonp(url) {
  return new Promise((resolve, reject) => {
    const cb = `__gfcb_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    window[cb] = (data) => { resolve(data); delete window[cb]; script.remove(); };
    const script = document.createElement("script");
    script.src = `${url}${url.includes("?") ? "&" : "?"}callback=${cb}`;
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
    let alive = true;
    const qs = `symbols=${encodeURIComponent(symbols.join(","))}`;

    const get = async () => {
      setErr(null); setLoading(true);
      const url = `${endpoint}?${qs}`;
      try {
        // Try normal JSON first
        const res = await fetch(url, { method: "GET" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (alive) setRows((json?.data || []).map(n => ({
          symbol: String(n.symbol || "").toUpperCase(),
          price: Number.isFinite(+n.price) ? +n.price : null,
          percent: Number.isFinite(+n.percent) ? +n.percent : null,
        })));
      } catch (e) {
        // Fallback to JSONP (Apps Script CORS workaround)
        try {
          const jsonpData = await jsonp(url);
          if (alive) setRows((jsonpData?.data || []).map(n => ({
            symbol: String(n.symbol || "").toUpperCase(),
            price: Number.isFinite(+n.price) ? +n.price : null,
            percent: Number.isFinite(+n.percent) ? +n.percent : null,
          })));
        } catch (ee) {
          if (alive) setErr(String(ee?.message || ee));
        }
      } finally {
        if (alive) setLoading(false);
      }
    };

    get();
    return () => { alive = false; };
  }, [endpoint, symbols]);

  const showing = (loading && rows.length === 0)
    ? symbols.map(s => ({ symbol: s, price: null, percent: null }))
    : rows;

  return (
    <div className="relative rounded-3xl p-5 md:p-6 bg-gray-900/50 backdrop-blur-xl border border-white/20 shadow-lg overflow-hidden min-h-[380px] font-sans text-white">
      <style>{`@keyframes float{0%{transform:translateY(-100px) translateX(-100px) scale(.8);opacity:.35}50%{transform:translateY(150px) translateX(150px) scale(1.08);opacity:.65}100%{transform:translateY(-100px) translateX(-100px) scale(.8);opacity:.35}} .animate-float{animation:float 10s ease-in-out infinite;}`}</style>

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
