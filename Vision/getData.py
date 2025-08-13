# td_top10_basic_only.py
import os, csv, time, requests

API_KEY = os.getenv("TWELVE_DATA_API_KEY")
if not API_KEY:
    raise SystemExit("Set TWELVE_DATA_API_KEY")

BASE = "https://api.twelvedata.com"
TOP10 = ["NVDA","MSFT","AAPL","AMZN","META","AVGO","GOOGL","GOOG","TSLA","BRK.B"]
EXCH = {s: "NASDAQ" for s in TOP10}
EXCH["BRK.B"] = "NYSE"  # Berkshire B on NYSE

def _get(path, params, retries=3, backoff=1.7):
    url = f"{BASE}{path}"
    params = dict(params or {}); params["apikey"] = API_KEY
    for i in range(retries):
        r = requests.get(url, params=params, timeout=30)
        if r.status_code in (429,500,502,503,504):
            time.sleep(backoff**(i+1)); continue
        # if gated (401/402/403), return {}
        if r.status_code in (401,402,403):
            return {}
        try: return r.json()
        except: return {}
    return {}

def get_name(sym):
    d = _get("/stocks", {"symbol": sym, "exchange": EXCH[sym], "country":"United States"})
    arr = d.get("data") if isinstance(d, dict) else None
    return (arr[0]["name"] if isinstance(arr, list) and arr else "") or sym

def get_market_cap(sym):
    # Try new, light /market_cap first; if not available on your plan, this returns {}
    d = _get("/market_cap", {"symbol": sym, "exchange": EXCH[sym]})
    if isinstance(d, dict):
        # can be {"market_cap": "..."} or {"data":[{"market_cap":...}]}, handle both
        if "market_cap" in d: return d["market_cap"]
        if "data" in d and d["data"]: return d["data"][0].get("market_cap")
    return None  # Basic without access → None

rows=[]
for sym in TOP10:
    name = get_name(sym)
    mcap = get_market_cap(sym)
    rows.append({
        "symbol": sym,
        "name": name,
        "market_cap": mcap,
        "revenue_annual": None,
        "net_income_annual": None,
        "eps": None,
        "pe_ttm": None,
        "note": "Using Basic plan; fundamentals gated"
    })

with open("sp500_top10_fundamentals.csv","w",newline="",encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=rows[0].keys())
    w.writeheader(); w.writerows(rows)

print("Wrote", len(rows), "rows to sp500_top10_fundamentals.csv")
