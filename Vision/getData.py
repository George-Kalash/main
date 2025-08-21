import os, sys, time, csv, requests
from typing import Dict, Any, List


API_KEY = os.getenv("TWELVE_DATA_API_KEY")
if not API_KEY:
    sys.exit("Set TWELVE_DATA_API_KEY environment variable.")

BASE = "https://api.twelvedata.com"

def td_get(path: str, params: Dict[str, Any], retries=4, backoff=1.6):
    url = f"{BASE}{path}"
    q = dict(params or {}); q["apikey"] = API_KEY
    for i in range(retries):
        r = requests.get(url, params=q, timeout=20)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(backoff ** (i + 1)); continue
        if r.status_code in (401, 402, 403):
            # plan-gated or unauthorized; return an empty dict for graceful handling
            return {}
        try:
            data = r.json()
        except Exception:
            return {}
        if isinstance(data, dict) and data.get("status") == "error":
            return {}
        return data
    return {}

def parse_num(x):
    if x in (None, "", []): return None
    if isinstance(x, (int, float)): return float(x)
    s = str(x).replace(",", "").upper()
    mult = 1.0
    if s.endswith("T"): mult, s = 1e12, s[:-1]
    elif s.endswith("B"): mult, s = 1e9, s[:-1]
    elif s.endswith("M"): mult, s = 1e6, s[:-1]
    try: return float(s) * mult
    except ValueError: return None

def get_exchange_common_stocks(exchange: str, country="United States") -> List[Dict[str, Any]]:
    # Reference list of symbols on an exchange; filter to common stocks to avoid funds/DRs.  :contentReference[oaicite:4]{index=4}
    d = td_get("/stocks", {"exchange": exchange, "country": country, "type": "Common Stock"})
    arr = d.get("data") if isinstance(d, dict) else None
    if isinstance(arr, list) and arr:
        return arr
    # fallback if type filter is gated/ignored
    d2 = td_get("/stocks", {"exchange": exchange, "country": country})
    arr2 = d2.get("data") if isinstance(d2, dict) else None
    if not isinstance(arr2, list):
        return []
    # manual filter
    common = [it for it in arr2 if str(it.get("type","")).lower() in ("stock","common stock")]
    return common or arr2

def get_market_cap(symbol: str, exchange: str):
    # New lightweight endpoint; returns numeric or stringified values.  :contentReference[oaicite:5]{index=5}
    d = td_get("/market_cap", {"symbol": symbol, "exchange": exchange})
    if not isinstance(d, dict): return None
    if "market_cap" in d:
        return parse_num(d["market_cap"])
    if "data" in d and isinstance(d["data"], list) and d["data"]:
        return parse_num(d["data"][0].get("market_cap"))
    return None

def get_quotes_batch(symbols: List[str], exchange: str) -> Dict[str, Dict[str, Any]]:
    # Batch query for quotes (<= ~120 per request).  :contentReference[oaicite:6]{index=6}
    out: Dict[str, Dict[str, Any]] = {}
    CHUNK = 100
    for i in range(0, len(symbols), CHUNK):
        chunk = symbols[i:i+CHUNK]
        d = td_get("/quote", {"symbol": ",".join(chunk), "exchange": exchange})
        if isinstance(d, dict) and "data" in d and isinstance(d["data"], list):
            for it in d["data"]:
                sym = it.get("symbol"); out[sym] = it
        elif isinstance(d, dict) and d.get("symbol"):
            out[d.get("symbol")] = d
        time.sleep(0.05)
    return out

def main():
    if len(sys.argv) < 3:
        sys.exit("Usage: python3 td_topN_by_exchange_mcap.py <COUNT> <EXCHANGE>\n"
                 "Example: python3 td_topN_by_exchange_mcap.py 30 NASDAQ")

    try:
        top_n = int(sys.argv[1])
    except ValueError:
        sys.exit("COUNT must be an integer, e.g., 30 or 100")

    exchange = sys.argv[2].upper()
    print(f"[info] Listing symbols on {exchange} …")
    symbols_info = get_exchange_common_stocks(exchange)
    if not symbols_info:
        sys.exit(f"No symbols found for exchange={exchange}. Check the exchange code (e.g., NASDAQ, NYSE).")

    ranked = []
    missing = 0
    print("[info] Fetching market caps (ranking by market cap) …")
    for idx, it in enumerate(symbols_info, 1):
        sym = it.get("symbol")
        name = it.get("name") or ""
        mcap = get_market_cap(sym, exchange)
        if mcap is None: missing += 1
        ranked.append({"symbol": sym, "name": name, "exchange": exchange, "market_cap": mcap})
        if idx % 20 == 0:
            time.sleep(0.25)  # gentle pacing for free plans

    have = [r for r in ranked if r["market_cap"] is not None]
    if not have:
        sys.exit("[error] Could not retrieve market caps (plan may not include /market_cap). "
                 "Enable /market_cap on your Twelve Data plan to rank by market cap. :contentReference[oaicite:7]{index=7}")

    have.sort(key=lambda r: r["market_cap"], reverse=True)
    top = have[:top_n]
    symbols = [r["symbol"] for r in top]
    quotes = get_quotes_batch(symbols, exchange)

    # build rows
    rows = []
    for r in top:
        q = quotes.get(r["symbol"], {})
        rows.append({
            "rank": len(rows)+1,
            "symbol": r["symbol"],
            "name": r["name"],
            "exchange": r["exchange"],
            "market_cap": r["market_cap"],
            "datetime": q.get("datetime"),
            "currency": q.get("currency"),
            "open": q.get("open"),
            "high": q.get("high"),
            "low": q.get("low"),
            "close": q.get("close"),
            "previous_close": q.get("previous_close"),
            "change": q.get("change"),
            "percent_change": q.get("percent_change"),
            "volume": q.get("volume"),
        })

    out = f"top_{top_n}_{exchange}_by_market_cap.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)

    print(f"[done] Wrote {len(rows)} rows to {out}")
    if missing:
        print(f"[note] {missing} symbols had no market_cap available and were excluded from ranking.")

if __name__ == "__main__":
    main()
