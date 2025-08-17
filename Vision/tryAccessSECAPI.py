#!/usr/bin/env python3
"""
Pull latest QUARTERLY revenue for selected tickers from the SEC XBRL API
and save to a CSV with columns: company_name,ticker,quarter_end,revenue_usd.

Requires: requests
Usage:
    export SEC_UA="Your Name your@email (YourApp/1.0)"
    python3 tryAccessSECAPI.py
"""

import csv
import json
import os
import time
from datetime import datetime
from typing import Dict, Any, List, Optional

import requests

# ---- Config ----
# Tickers you asked for. We'll auto-correct APPL -> AAPL.
TICKERS_INPUT = ["APPL", "NVDA", "GOOGL"]

# Preferred GAAP revenue tags in order (companies differ in which they use)
# We'll scan these in order and pick the first tag with usable quarterly facts.
REVENUE_TAGS = [
    "RevenueFromContractWithCustomerExcludingAssessedTax",  # post-ASC 606 (common)
    "SalesRevenueNet",                                      # legacy/common
    "Revenues",                                             # sometimes used
    "Revenue"                                               # rare fallback
]

SEC_TICKERS_URL = "https://www.sec.gov/files/company_tickers.json"
COMPANYFACTS_URL_TMPL = "https://data.sec.gov/api/xbrl/companyfacts/{cik10}.json"

# Respect SEC guidance: declare a contactable User-Agent.
SEC_UA = os.getenv("SEC_UA", "").strip()
if not SEC_UA:
    raise SystemExit(
        "Set SEC_UA, e.g.:\n"
        '  export SEC_UA="Your Name your@email (YourApp/1.0)"'
    )

SESSION = requests.Session()
SESSION.headers.update({"User-Agent": SEC_UA, "Accept-Encoding": "gzip, deflate"})

# ---- Helpers ----
def to_cik10(cik_str: str) -> str:
    """Zero-pad CIK to 10 digits."""
    return str(int(cik_str)).zfill(10)

def load_ticker_index() -> Dict[str, Dict[str, str]]:
    """
    Returns {TICKER: {"cik10": "...", "title": "..."}}
    Using company_tickers.json as documented by SEC.
    """
    r = SESSION.get(SEC_TICKERS_URL, timeout=30)
    r.raise_for_status()
    data = r.json()  # dict with numeric string keys -> {ticker, cik_str, title}
    out: Dict[str, Dict[str, str]] = {}
    for _k, row in data.items():
        t = (row.get("ticker") or "").upper()
        if not t:
            continue
        out[t] = {
            "cik10": to_cik10(str(row.get("cik_str", "") or "0")),
            "title": row.get("title") or ""
        }
    return out

def canonicalize_ticker(t: str) -> str:
    t = t.upper().strip()
    # Common slip: APPL -> AAPL
    if t == "APPL":
        return "AAPL"
    return t

def pick_latest_quarterly_revenue(companyfacts: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    From companyfacts JSON, find the latest quarterly revenue (USD if possible).
    We look across preferred REVENUE_TAGS, filter to fp in Q1/Q2/Q3/Q4, and
    pick the one with the most recent 'end' date.
    Returns dict: {"end": "YYYY-MM-DD", "val": float, "tag": "...", "unit": "..."} or None.
    """
    facts = (companyfacts or {}).get("facts", {})
    usgaap = facts.get("us-gaap", {})

    def iter_facts_for_tag(tag: str):
        tag_obj = usgaap.get(tag)
        if not isinstance(tag_obj, dict):
            return
        units = tag_obj.get("units", {})
        # Prefer USD if available, otherwise any unit.
        unit_order = ["USD"] + [u for u in units.keys() if u != "USD"]
        for unit in unit_order:
            arr = units.get(unit)
            if not isinstance(arr, list):
                continue
            for item in arr:
                # Quarter-only
                fp = item.get("fp")
                form = item.get("form", "")
                if fp not in ("Q1", "Q2", "Q3", "Q4"):
                    continue
                # Guard against weird non-numeric values
                val = item.get("val")
                try:
                    val_f = float(val)
                except Exception:
                    continue
                end = item.get("end")  # YYYY-MM-DD
                yield {
                    "tag": tag, "unit": unit, "val": val_f, "end": end,
                    "fy": item.get("fy"), "fp": fp, "form": form
                }

    # Gather candidates across tags
    candidates: List[Dict[str, Any]] = []
    for tag in REVENUE_TAGS:
        for fact in iter_facts_for_tag(tag):
            candidates.append(fact)

    if not candidates:
        return None

    # Pick the most recent by end date; tie-break by fy/fp then form (10-Q preferred)
    def sort_key(x):
        try:
            d = datetime.strptime(x.get("end") or "1900-01-01", "%Y-%m-%d")
        except Exception:
            d = datetime(1900, 1, 1)
        # Prefer 10-Q over others if same end date
        q_pref = 0 if (x.get("form") or "").startswith("10-Q") else 1
        return (d, - (x.get("fy") or 0), q_pref)

    candidates.sort(key=sort_key, reverse=True)
    return candidates[0]

# ---- Main ----
def main():
    # Build ticker -> (cik10, title)
    idx = load_ticker_index()

    results = []
    for raw_t in TICKERS_INPUT:
        t = canonicalize_ticker(raw_t)
        info = idx.get(t)
        if not info:
            print(f"[warn] Ticker not found in SEC index: {raw_t} (after canon: {t})")
            continue

        cik10 = info["cik10"]
        title = info["title"] or t

        # companyfacts call (free, no key; SEC-recommended endpoint)
        url = COMPANYFACTS_URL_TMPL.format(cik10=cik10)
        r = SESSION.get(url, timeout=30)
        if r.status_code == 404:
            print(f"[warn] Company facts not found for {t} ({title}). URL: {url}")
            continue
        r.raise_for_status()
        cf = r.json()

        latest = pick_latest_quarterly_revenue(cf)
        if latest is None:
            print(f"[warn] No quarterly revenue found for {t} ({title}).")
            continue

        results.append({
            "company_name": title,
            "ticker": t,
            "quarter_end": latest["end"],
            "revenue_usd": f'{latest["val"]:.2f}'
        })

        # Be polite; nowhere near 10 req/sec but keep it civilized
        time.sleep(0.2)

    if not results:
        raise SystemExit("No results written (no quarterly revenue found).")

    # Write CSV
    out = "latest_quarterly_revenue.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["company_name", "ticker", "quarter_end", "revenue_usd"])
        w.writeheader()
        w.writerows(results)

    print(f"Wrote {len(results)} rows to {out}")

if __name__ == "__main__":
    main()
