# aapl_quote.py
import os, sys, requests

key = os.getenv("TWELVE_DATA_API_KEY")
if not key:
    sys.exit("Set TWELVE_DATA_API_KEY")

url = "https://api.twelvedata.com/quote"
params = {"symbol": "AAPL", "apikey": key}

r = requests.get(url, params=params, timeout=15)
r.raise_for_status()
print(r.text)  # print EXACTLY what the API returned
