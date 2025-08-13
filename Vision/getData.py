# td_sp500_top10_quotes_to_csv.py
import os, sys, csv, time, requests

API_KEY = os.getenv("TWELVE_DATA_API_KEY")
if not API_KEY:
    sys.exit("Set TWELVE_DATA_API_KEY environment variable.")

BASE = "https://api.twelvedata.com"

# Top 10 S&P 500 by index weight (as of today); update as needed. :contentReference[oaicite:2]{index=2}
TOP10 = ["NVDA","MSFT","AAPL","AMZN","META","AVGO","GOOGL","GOOG","TSLA","BRK.B"]

# Exchange mapping to avoid wrong listings (US only)
EXCH = {s: "NASDAQ" for s in TOP10}
EXCH["BRK.B"] = "NYSE"

def td_get(path, params, retries=4, backoff=1.6):
    """GET helper with gentle backoff on 429/5xx. Returns {} on TD error payloads."""
    url = f"{BASE}{path}"
    q = dict(params or {})
    q["apikey"] = API_KEY
    for i in range(retries):
        r = requests.get(url, params=q, timeout=20)
        if r.status_code in (429, 500, 502, 503, 504):
            time.sleep(backoff ** (i + 1))
            continue
        r.raise_for_status()
        try:
            data = r.json()
        except Exception:
            return {}
        if isinstance(data, dict) and data.get("status") == "error":
            # plan-gated/bad param -> treat as empty so script never crashes
            return {}
        return data
    return {}

def get_name(sym):
    # Use reference data to get the correct US company name. :contentReference[oaicite:3]{index=3}
    d = td_get("/stocks", {"symbol": sym, "exchange": EXCH[sym], "country": "United States"})
    arr = d.get("data") if isinstance(d, dict) else None
    return (arr[0].get("name") if isinstance(arr, list) and arr else "") or sym

def get_quote(sym):
    # Basic snapshot quote (works on Basic). :contentReference[oaicite:4]{index=4}
    return td_get("/quote", {"symbol": sym, "exchange": EXCH[sym]})

def flatten_quote(qobj, sym):
    """Flatten the quote JSON into CSV-ready fields."""
    out = {
        "symbol": sym,
        "name": "",                         # fill in separately
        "exchange": qobj.get("exchange"),
        "currency": qobj.get("currency"),
        "datetime": qobj.get("datetime"),
        "open": qobj.get("open"),
        "high": qobj.get("high"),
        "low": qobj.get("low"),
        "close": qobj.get("close"),
        "previous_close": qobj.get("previous_close"),
        "change": qobj.get("change"),
        "percent_change": qobj.get("percent_change"),
        "volume": qobj.get("volume"),
        "fifty_two_week_low": None,
        "fifty_two_week_high": None,
    }
    ftw = qobj.get("fifty_two_week")
    if isinstance(ftw, dict):
        out["fifty_two_week_low"]  = ftw.get("low")
        out["fifty_two_week_high"] = ftw.get("high")
    return out

rows = []
for sym in TOP10:
    q = get_quote(sym) or {}
    rec = flatten_quote(q, sym)
    rec["name"] = get_name(sym)
    rows.append(rec)

# Write CSV
out_path = "sp500_top10_quotes.csv"
fieldnames = [
    "symbol","name","exchange","currency","datetime",
    "open","high","low","close","previous_close",
    "change","percent_change","volume",
    "fifty_two_week_low","fifty_two_week_high"
]
with open(out_path, "w", newline="", encoding="utf-8") as f:
    w = csv.DictWriter(f, fieldnames=fieldnames)
    w.writeheader()
    w.writerows(rows)

print(f"Wrote {len(rows)} rows to {out_path}")
