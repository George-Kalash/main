import React from "react";

export default function CompanyDataBox({ symbol, price, percent, region = "US" }) {
  const up = (percent ?? 0) >= 0;
  return (
    <div className="rounded-xl p-3 md:p-4 bg-black/40 border border-white/10 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{(symbol || "").toUpperCase()}</div>
        <div className="text-xs text-white/60">{region}</div>
      </div>

      <div className="mt-1 text-lg md:text-xl font-bold">
        {price != null
          ? `$${Number(price).toLocaleString(undefined, { maximumFractionDigits: 2 })}`
          : "—"}
      </div>

      <div className="mt-1 text-xs">
        <span
          className={[
            "px-1.5 py-0.5 rounded-full",
            up ? "bg-emerald-400/15 text-emerald-300" : "bg-rose-400/15 text-rose-300",
          ].join(" ")}
        >
          {up ? "▲" : "▼"}{" "}
          {Number(percent).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
