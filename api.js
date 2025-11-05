// api.js
const API_BASE = (typeof window !== "undefined" && window.API_BASE)
  ? window.API_BASE
  : "https://ecoserve-backend.onrender.com"; // fallback

async function api(path, { method = "GET", body = null } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  });
  const text = await res.text();
  try { return JSON.parse(text); } catch { return text; }
}

// helpers
async function requestOtp(email)  { return api("/api/login",  { method: "POST", body: { email } }); }
async function verifyOtp(email, code) { return api("/api/verify", { method: "POST", body: { email, code } }); }
async function createDeposit(user_id, item_type_id, qty) {
  return api("/api/deposit", { method: "POST", body: { user_id, item_type_id, qty } });
}
async function loadRewards() { return api("/api/reward/list"); }
