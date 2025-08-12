# eodhd_top10_by_market_cap.py
import os, sys, csv, requests

API_KEY = os.getenv("EODHD_API_KEY")
if not API_KEY:
    sys.exit("Set EODHD_API_KEY env var.")

URL = "https://eodhd.com/api/screener"
params = {
    "api_token": API_KEY,
    "sort": "market_capitalization.desc",
    "limit": 10,
    "filters": '[["exchange","=","US"]]'  # keep to US symbols; tweak as needed
}

r = requests.get(URL, params=params, timeout=30)
r.raise_for_status()
items = r.json().get("data") or r.json()  # API can return {data:[...]} or just [...]

out_file = "top10_by_market_cap.csv"
with open(out_file, "w", newline="", encoding="utf-8") as f:
    w = csv.writer(f)
    w.writerow(["symbol", "company_name", "market_capitalization"])
    for it in items:
        w.writerow([it.get("code"), it.get("name"), it.get("market_capitalization")])

print(f"Wrote {len(items)} rows to {out_file}")
print("Done.")