import axios from "axios";

const COUNTRIES_URL = process.env.EXTERNAL_COUNTRIES;
const EXCHANGE_URL = process.env.EXCHANGE_RATE_API;

export async function fetchCountries() {
  try {
    const res = await axios.get(COUNTRIES_URL, { timeout: 15000 });
    return res.data;
  } catch {
    throw new Error("Countries API");
  }
}

export async function fetchExchangeRates() {
  try {
    const res = await axios.get(EXCHANGE_URL, { timeout: 15000 });
    if (!res.data?.rates) throw new Error("Exchange rates format");
    return res.data.rates;
  } catch {
    throw new Error("Exchange Rates API");
  }
}
