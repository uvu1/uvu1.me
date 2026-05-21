const STORAGE_KEY = "uvu1-client-id";

function createClientId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getClientId() {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return stored;
  }

  const id = createClientId();
  window.localStorage.setItem(STORAGE_KEY, id);

  return id;
}
