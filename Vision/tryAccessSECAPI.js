// sec_aapl.js (Node 18+)
const ua = process.env.SEC_UA;
if (!ua) {
  console.error('Set SEC_UA, e.g. export SEC_UA="Your Name you@email (VisionApp/1.0)"');
  process.exit(1);
}

const url = "https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json";

(async () => {
  const res = await fetch(url, {
    headers: { "User-Agent": ua, "Accept-Encoding": "gzip, deflate" }
  });
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}: ${res.statusText}`);
  }
  const data = await res.json();
  const textData = JSON.stringify(data, null, 2);
  const fs = require('fs'); 
  fs.writeFile('output.txt', textData, 'utf8', (err) => { 
    if (err) { console.error('Error writing file:', err); } 
    else { console.log('File written successfully.'); }});
//   console.log('Data fetched successfully.');
  console.log(JSON.stringify(data, null, 2));
})();
