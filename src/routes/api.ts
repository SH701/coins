const BASE_URL = `https://api.coinpaprika.com/v1`;
const HISTORY_BASE_URL = "https://ohlcv-api.nomadcoders.workers.dev";

export async function fetchCoins() {
  const response = await fetch(`${BASE_URL}/coins`);
  const json = await response.json();
  return json;
}
export function fetchCoinInfo(coinId: string) {
  return fetch(`${BASE_URL}/coins/${coinId}`).then((response) =>
    response.json()
  );
}
export async function fetchCoinHistory(coinId: string) {
  const response = await fetch(`${HISTORY_BASE_URL}?coinId=${coinId}`);
  const json = await response.json();
  return json;
}
export async function fetchCoinPrice(coinId: string) {
  const response = await fetch(`${BASE_URL}/tickers/${coinId}`);
  const json = await response.json();
  return json;
}