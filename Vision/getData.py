import os, csv, time, requests
from typing import Dict, Any, List

API_KEY = os.getenv("TWELVE_DATA_API_KEY")
if not API_KEY:
    raise SystemExit("Set TWELVE_DATA_API_KEY environment variable.")

BASE = "https://api.twelvedata.com"

TOP10 = ["NVDA","MSFT","AAPL","AMZN","META","AVGO","GOOGL","GOOG","TSLA","BRK.B"]
ALIASES = {"BRK.B": ["BRK.B","BRK-B","BRKB"]}

def _get(path: str, params: Dict[str, Any], retries=3, backoff=1.7):
    """GET helper that returns {} on gated endpoints (401/402/403) so the script never crashes."""
    url = f"{BASE}{path}"
    params = dict(params or {})
    params["apikey"] = API_KEY
    for i in range(retries):
        r = requests.get(url, params=params, timeout=30)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(backoff ** (i+1))
            continue
        if r.status_code in (401, 402, 403):
            return {}  # likely plan-gated on Basic; degrade gracefully
        try:
            data = r.json()
        except Exception:
            return {}
        if isinstance(data, dict) and data.get("status") == "error":
            # TD returns {"status":"error","message":"..."} on plan gates / bad params
            return {}
        return data
    return {}

def try_aliases(sym: str, fn):
    last = {}
    for s in ALIASES.get(sym, [sym]):
        data = fn(s)
        if data:
            return data, s
        last = data
    return last, sym

def get_name(sym: str) -> str:
    # Use /stocks (reference data) to resolve the company name. (Supports filtering by symbol.)
    # Docs show it returns objects with "symbol" and "name".  :contentReference[oaicite:3]{index=3}
    data = _get("/stocks", {"symbol": sym})
    items = data.get("data") if isinstance(data, dict) else None
    if isinstance(items, list) and items:
        return items[0].get("name") or ""
    return ""

def get_profile(sym: str) -> Dict[str, Any]:
    # General company info. May be gated on Basic.  :contentReference[oaicite:4]{index=4}
    return _get("/profile", {"symbol": sym}) or {}

def get_statistics(sym: str) -> Dict[str, Any]:
    # Valuation metrics incl. market cap, P/E (plan-dependent).  :contentReference[oaicite:5]{index=5}
    return _get("/statistics", {"symbol": sym}) or {}

def get_income_latest_annual(sym: str) -> Dict[str, Any]:
    # Latest annual income statement.  :contentReference[oaicite:6]{index=6}
    data = _get("/income_statement", {"symbol": sym, "period": "annual"})
    lst = data.get("income_statement") if isinstance(data, dict) else None
    if isinstance(lst, list) and lst:
        return lst[0]  # TD returns newest first
    return {}

def num(x):
    if x in (None, "", []): return None
    if isinstance(x, (int, float)): return float(x)
    s = str(x).replace(",", "").upper()
    m = 1.0
    if s.endswith("T"): m, s = 1e12, s[:-1]
    elif s.endswith("B"): m, s = 1e9, s[:-1]
    elif s.endswith("M"): m, s = 1e6, s[:-1]
    try: return float(s) * m
    except: return None

rows: List[Dict[str, Any]] = []

for sym in TOP10:
    # Resolve name from reference data (works on Basic)
    name = get_name(sym) or sym

    # Pull fundamentals where available on your plan
    prof, _ = try_aliases(sym, get_profile)
    stats, _ = try_aliases(sym, get_statistics)
    inc   , _ = try_aliases(sym, get_income_latest_annual)

    # Map common fields (if a gating returns {}, these stay None)
    market_cap = num(stats.get("market_cap") or stats.get("market_capitalization"))
    pe_ttm     = num(stats.get("trailing_pe") or stats.get("pe_ratio") or stats.get("pe_ttm"))
    revenue    = num(inc.get("total_reported_revenue") or inc.get("total_revenue") or inc.get("revenue"))
    net_income = num(inc.get("net_income") or inc.get("net_income_common"))
    eps        = num(inc.get("diluted_eps") or inc.get("basic_eps") or inc.get("eps"))

    rows.append({
        "symbol": sym,
        "name": name,
        "market_cap": market_cap,
        "revenue_annual": revenue,
        "net_income_annual": net_income,
        "eps": eps,
        "pe_ttm": pe_ttm,
        "note": "fields may be blank if your plan does not include fundamentals"
    })

# Write CSV
out = "sp500_top10_fundamentals.csv"
with open(out, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
    w.writeheader()
    w.writerows(rows)

print(f"Wrote {len(rows)} rows to {out}")
