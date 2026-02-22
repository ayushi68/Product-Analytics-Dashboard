import Cookies from "js-cookie";

const FILTER_COOKIE_KEY = "dashboard_filters";
const COOKIE_EXPIRES_DAYS = 7;

export function saveFiltersToCookies(filters) {
  Cookies.set(FILTER_COOKIE_KEY, JSON.stringify(filters), {
    expires: COOKIE_EXPIRES_DAYS,
    sameSite: "Lax"
  });
}

export function getFiltersFromCookies() {
  const value = Cookies.get(FILTER_COOKIE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export function clearFiltersCookie() {
  Cookies.remove(FILTER_COOKIE_KEY);
}
