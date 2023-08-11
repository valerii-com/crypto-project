const BTC_ID = 1839;

export async function coinPriceFetcher() {
  const response = await fetch(import.meta.env.VITE_FETCH_USD_API as string);
  const { data } = await response.json();

  return data[BTC_ID].quotes.USD.price;
}
