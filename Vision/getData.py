import os, requests

UA = os.getenv("SEC_UA", "Your Name your@email (VisionApp/0.1)")
CIK10 = "0000320193"  # Apple

s = requests.Session()
s.headers.update({"User-Agent": UA, "Accept-Encoding": "gzip, deflate"})

subs = s.get(f"https://data.sec.gov/submissions/CIK{CIK10}.json", timeout=30).json()
recent = subs["filings"]["recent"]

out = []
for form, acc, prim in zip(recent["form"], recent["accessionNumber"], recent["primaryDocument"]):
    if form in ("10-K", "10-Q"):
        cik_nolead = str(int(CIK10))  # drop leading zeros for the path
        acc_nodash = acc.replace("-", "")
        url = f"https://www.sec.gov/Archives/edgar/data/{cik_nolead}/{acc_nodash}/{prim}"
        out.append((form, acc, url))

for row in out[:10]:
    print(row)
