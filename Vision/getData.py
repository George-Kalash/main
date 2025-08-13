import os, csv, time, requests
TOP10 = ["NVDA","MSFT","AAPL","AMZN","META","AVGO","GOOGL","GOOG","TSLA","BRK.B"]
ALIASES = {"BRK.B": ["BRK.B","BRK-B","BRKB"]}

FMP_KEY = os.getenv("FMP_API_KEY")
FINN = os.getenv("FINNHUB_TOKEN")

def _get(url, params, retries=4, backoff=1.7):
  for i in range(retries):
    r = requests.get(url, params=params, timeout=30)
    if r.status_code in (429,500,502,503,504):
      time.sleep(backoff**(i+1)); continue
    r.raise_for_status(); return r.json()
  raise RuntimeError(f"Failed after {retries} tries: {url}")

def try_aliases(sym, fn):
  last=None
  for s in ALIASES.get(sym,[sym]):
    try: return fn(s)
    except Exception as e: last=e
  if last: raise last

def fmp_profile(sym):
  return _get(f"https://financialmodelingprep.com/api/v3/profile/{sym}", {"apikey": FMP_KEY})[0]
def fmp_income(sym):
  return _get(f"https://financialmodelingprep.com/api/v3/income-statement/{sym}", {"limit":1,"apikey":FMP_KEY})[0]
def fmp_quote(sym):
  return _get(f"https://financialmodelingprep.com/api/v3/quote/{sym}", {"apikey": FMP_KEY})[0]

def finnhub_profile(sym):
  return _get("https://finnhub.io/api/v1/stock/profile2", {"symbol": sym, "token": FINN})
def finnhub_financials(sym):
  return _get("https://finnhub.io/api/v1/stock/financials",
              {"symbol": sym, "statement":"ic", "freq":"annual", "token": FINN})
def finnhub_metric(sym):
  return _get("https://finnhub.io/api/v1/stock/metric",
              {"symbol": sym, "metric":"all", "token": FINN})

def num(x):
  if x is None: return None
  try: return float(x)
  except: 
    s=str(x).replace(",","").upper()
    m=1.0
    if s.endswith("T"): m,s=1e12,s[:-1]
    elif s.endswith("B"): m,s=1e9,s[:-1]
    elif s.endswith("M"): m,s=1e6,s[:-1]
    try: return float(s)*m
    except: return None

rows=[]
for sym in TOP10:
  try:
    if not FMP_KEY: raise RuntimeError("skip fmp")
    prof = try_aliases(sym, fmp_profile)
    inc  = try_aliases(sym, fmp_income)
    quo  = try_aliases(sym, fmp_quote)
    rows.append({
      "symbol": sym,
      "name": prof.get("companyName",""),
      "market_cap": num(prof.get("mktCap")),
      "revenue_annual": num(inc.get("revenue") or inc.get("totalRevenue")),
      "net_income_annual": num(inc.get("netIncome")),
      "eps": num(inc.get("eps") or inc.get("epsdiluted")),
      "pe_ttm": num(quo.get("pe")),
      "source": "FMP"
    })
  except requests.HTTPError as e:
    if e.response is not None and e.response.status_code==401 and FINN:
      pro = try_aliases(sym, finnhub_profile)
      fin = try_aliases(sym, finnhub_financials)
      met = try_aliases(sym, finnhub_metric)
      latest = (fin.get("data") or [])[:1]
      rev = latest[0].get("revenue") if latest else None
      ni  = latest[0].get("netIncome") if latest else None
      eps = latest[0].get("eps") if latest else None
      pe  = (met.get("metric") or {}).get("peTTM")
      rows.append({
        "symbol": sym,
        "name": pro.get("name",""),
        "market_cap": num(pro.get("marketCapitalization")),
        "revenue_annual": num(rev),
        "net_income_annual": num(ni),
        "eps": num(eps),
        "pe_ttm": num(pe),
        "source": "Finnhub"
      })
    else:
      raise

with open("sp500_top10_fundamentals.csv","w",newline="",encoding="utf-8") as f:
  w=csv.DictWriter(f, fieldnames=rows[0].keys())
  w.writeheader(); [w.writerow(r) for r in rows]

print(f"Wrote {len(rows)} rows to sp500_top10_fundamentals.csv")
