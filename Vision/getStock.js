// ⚠️ For demos only — don’t expose API keys in production frontends.
const API_KEY = '7a5bfb6b3217471fa3fdc3ac21481875';

const form = document.querySelector('#quote-form');
const input = document.querySelector('#ticker');

form.addEventListener('submit', async (e) => {
  e.preventDefault();                           // stop form navigation
  const symbol = input.value.trim().toUpperCase();
  if (!symbol) return console.warn('Enter a symbol');

  const url = new URL('https://api.twelvedata.com/quote');
  url.searchParams.set('symbol', symbol);
  // url.searchParams.set('exchange', 'NASDAQ'); // optional hint
  url.searchParams.set('apikey', API_KEY);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    const data = await res.json();

    if (data.status === 'error') {
      throw new Error(data.message || 'Twelve Data error');
    }

    const price = Number(data.price ?? data.close);
    if (!Number.isFinite(price)) throw new Error('No price in response');

    console.log(`${symbol} price:`, price);
  } catch (err) {
    console.error('Fetch failed:', err.message);
  }
});
