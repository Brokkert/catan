export const STORAGE_KEY = 'catan_config_v1';
export const PRINTED_KEY = 'catan_printed_v1';
export const BANK_KEY = 'catan_bank_v1';
export const CUSTOM_KEY = 'catan_custom_rules_v1';

export function load(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch { return fallback; }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

// Simple QR code - use Google Charts API URL or implement a small one
// Use https://quickchart.io/qr?text=... as a fallback source
export function qrCodeURL(text) {
  const encoded = encodeURIComponent(text);
  return `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encoded}&bgcolor=0d1117&color=e8b923`;
}
