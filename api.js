// api.js
const API_BASE =
  (typeof window !== "undefined" && window.API_BASE) ||
  "https://ecoserve-backend.onrender.com"; // fallback

// Generic API request
async function api(path, { method = "GET", body = null, headers = {} } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...headers },
    body: body ? JSON.stringify(body) : null,
  });

  const text = await res.text();
  if (!res.ok) throw new Error(text || `HTTP ${res.status}`);
  try { return JSON.parse(text); } catch { return text; }
}

// --- Auth & main endpoints ---
async function requestOtp(email) {
  return api("/api/auth/otp", { method: "POST", body: { email } });
}
async function verifyOtp(email, code) {
  return api("/api/auth/verify", { method: "POST", body: { email, code } });
}
async function createDeposit(user_id, item_type_id, qty) {
  return api("/api/deposits", {
    method: "POST",
    body: { user_id, item_type_id, qty },
  });
}
async function loadRewards() {
  return api("/api/rewards/list");
}

// --- Add this missing one ---
async function createItemType(payload) {
  return api("/api/item-types", { method: "POST", body: payload });
}

// --- Diagnostics ---
async function health() { return api("/healthz"); }
async function dbcheck() { return api("/dbcheck"); }

// Expose globally
window.ecoserveAPI = {
  api,
  requestOtp,
  verifyOtp,
  createDeposit,
  loadRewards,
  createItemType,  // ✅ now available
  health,
  dbcheck,
};

// Auto-test on load
document.addEventListener("DOMContentLoaded", async () => {
  try {
    console.log("[EcoServe] health:", await health());
    console.log("[EcoServe] dbcheck:", await dbcheck());
  } catch (e) {
    console.error("[EcoServe] API error:", e.message);
  }
});
