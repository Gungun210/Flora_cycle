// src/api.js
// Central file for all API calls to your backend

const BASE_URL = "https://floracycle-production.up.railway.app/api";

// ── Get stored token ──
export const getToken = () => localStorage.getItem("fc_token");
export const getUser  = () => JSON.parse(localStorage.getItem("fc_user") || "{}");
export const getRole  = () => localStorage.getItem("fc_role");

// ── Clear session (logout) ──
export const logout = () => {
  localStorage.removeItem("fc_token");
  localStorage.removeItem("fc_user");
  localStorage.removeItem("fc_role");
  window.location.href = "/";
};

// ── Register ──
export const register = async (role, formData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, ...formData }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");

  // Save to localStorage
  localStorage.setItem("fc_token", data.token);
  localStorage.setItem("fc_user", JSON.stringify(data.user));
  localStorage.setItem("fc_role", data.role);

  return data;
};

// ── Login ──
export const login = async (role, identifier, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");

  // Save to localStorage
  localStorage.setItem("fc_token", data.token);
  localStorage.setItem("fc_user", JSON.stringify(data.user));
  localStorage.setItem("fc_role", data.role);

  return data;
};

// ── Get dashboard data (protected) ──
export const getDashboard = async () => {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
