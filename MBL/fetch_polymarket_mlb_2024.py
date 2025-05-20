"""
-----------------------------------------------------------
Polymarket – MLB 2024 season (all games)
Produces: mlb_polymarket_2024.csv with columns
Trades, P1, P2, Whale preference, Outcome/Win
-----------------------------------------------------------
"""
import requests, csv, pendulum, time, json   
from tqdm import tqdm

BASE = "https://gamma-api.polymarket.com"
TAG  = "mlb"
SEASON_START = pendulum.datetime(2024, 1, 1, tz='UTC')
SEASON_END   = pendulum.datetime(2024, 12, 31, 23, 59, tz='UTC')

SNAP_PRE  = 3      # minutes before first pitch
SNAP_POST = 5      # minutes after market closed
OUTFILE   = "mlb_polymarket_2024.csv"

def events_2024():
    url = f"{BASE}/events"
    params = {
        "tag_slug": TAG,
        "start_date_min": SEASON_START.to_iso8601_string(),
        "start_date_max": SEASON_END.to_iso8601_string(),
        "limit": 1000,
        "archived": True       # includes resolved markets
    }
    return requests.get(url, params=params, timeout=30).json()

def market_for(event_id):
    r = requests.get(f"{BASE}/markets", params={"event_id": event_id}, timeout=30)
    # outright market always has exactly 2 outcomes and “Who will win?” in the question
    return next(m for m in r.json() if "win" in m["question"].lower())

def price_at(cond_id, ts_from, ts_to):
    """
    Hit the timeseries endpoint once and keep only points in [ts_from, ts_to].
    We down-sample to the closest datum to 'ts_from' (or 'ts_to').
    """
    url = f"{BASE}/markets/timeseries"
    params = {"condition_id": cond_id,
              "from": int(ts_from), "to": int(ts_to)}
    series = requests.get(url, params=params, timeout=30).json()
    if not series:                       # no data in the window
        return None
    # pick the record closest to the left edge
    return min(series, key=lambda x: abs(x["timestamp"] - ts_from))["price"]

def whale_pref(market):
    # crude liquidity proxy: book depth / volume (feel free to refine)
    return round(market["liquidity"] / max(market["volume"], 1), 3)

rows = []
for ev in tqdm(events_2024(), desc="Games"):
    start = pendulum.parse(ev['startDate'])
    mkt   = market_for(ev["id"])
    cond1, cond2 = mkt["outcomes"][0]["condition_id"], mkt["outcomes"][1]["condition_id"]

    # --- before first pitch ---
    pre_start = int(start.subtract(minutes=SNAP_PRE).timestamp())
    p1_pre = price_at(cond1, pre_start, int(start.timestamp()))
    p2_pre = price_at(cond2, pre_start, int(start.timestamp()))

    # --- after the market resolves ---
    if not mkt["closed"]:
        # skip post-game snapshot now, we’ll back-fill later
        p1_post = p2_post = outcome = None
    else:
        ts_close = pendulum.parse(mkt["end_date"])
        post_end = int(ts_close.add(minutes=SNAP_POST).timestamp())
        p1_post  = price_at(cond1, int(ts_close.timestamp()), post_end)
        p2_post  = price_at(cond2, int(ts_close.timestamp()), post_end)
        outcome  = mkt["winning_outcome"]

    rows.append({
        "Trades": ev["slug"],
        "P1": p1_pre if p1_pre is not None else "",
        "P2": p2_pre if p2_pre is not None else "",
        "Whale preference": whale_pref(mkt),
        "Outcome/Win": outcome if outcome else ""
    })

with open(OUTFILE, "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=rows[0].keys())
    writer.writeheader()
    writer.writerows(rows)

print(f"\n✅  Saved {len(rows)} rows → {OUTFILE}")
