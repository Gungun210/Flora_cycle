<<<<<<< HEAD
// src/api.js
// Central file for all API calls to your backend

const BASE_URL = "https://floracycle-production.up.railway.app/api";

// ── Get stored token ──
=======
const BASE_URL = "http://localhost:5000/api";

// ── Auth helpers ──
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
export const getToken = () => localStorage.getItem("fc_token");
export const getUser  = () => JSON.parse(localStorage.getItem("fc_user") || "{}");
export const getRole  = () => localStorage.getItem("fc_role");

<<<<<<< HEAD
// ── Clear session (logout) ──
=======
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
export const logout = () => {
  localStorage.removeItem("fc_token");
  localStorage.removeItem("fc_user");
  localStorage.removeItem("fc_role");
  window.location.href = "/";
};

<<<<<<< HEAD
// ── Register ──
=======
// ── Shared fetch helper ──
const authFetch = async (url, options = {}) => {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// ────────────────────────────────────────
// AUTH
// ────────────────────────────────────────
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
export const register = async (role, formData) => {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, ...formData }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Registration failed");
<<<<<<< HEAD

  // Save to localStorage
  localStorage.setItem("fc_token", data.token);
  localStorage.setItem("fc_user", JSON.stringify(data.user));
  localStorage.setItem("fc_role", data.role);

  return data;
};

// ── Login ──
=======
  localStorage.setItem("fc_token", data.token);
  localStorage.setItem("fc_user", JSON.stringify(data.user));
  localStorage.setItem("fc_role", data.role);
  return data;
};

>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
export const login = async (role, identifier, password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, identifier, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
<<<<<<< HEAD

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
=======
  localStorage.setItem("fc_token", data.token);
  localStorage.setItem("fc_user", JSON.stringify(data.user));
  localStorage.setItem("fc_role", data.role);
  return data;
};

// ────────────────────────────────────────
// TEMPLE APIs
// ────────────────────────────────────────
export const getTempleDashboard = () =>
  authFetch("/temple/dashboard");

export const getTemplePickups = () =>
  authFetch("/temple/pickups");

export const acceptPickup = (id, scheduledDate) =>
  authFetch(`/temple/pickups/${id}/accept`, {
    method: "PATCH",
    body: JSON.stringify({ scheduledDate }),
  });

export const rejectPickup = (id) =>
  authFetch(`/temple/pickups/${id}/reject`, { method: "PATCH" });

export const completePickupTemple = (id) =>
  authFetch(`/temple/pickups/${id}/complete`, { method: "PATCH" });

export const getTempleListings = () =>
  authFetch("/temple/listings");

export const addListing = (listingData) =>
  authFetch("/temple/listings", {
    method: "POST",
    body: JSON.stringify(listingData),
  });

export const removeListing = (id) =>
  authFetch(`/temple/listings/${id}`, { method: "DELETE" });

// ────────────────────────────────────────
// VENDOR APIs
// ────────────────────────────────────────
export const getVendorDashboard = () =>
  authFetch("/vendor/dashboard");

export const getVendorPickups = () =>
  authFetch("/vendor/pickups");

export const getVendorRequests = () =>
  authFetch("/vendor/requests");

export const sendPickupRequest = (templeId, flowerType, quantity, listingId) =>
  authFetch("/vendor/request", {
    method: "POST",
    body: JSON.stringify({ templeId, flowerType, quantity, listingId }),
  });

export const completePickupVendor = (id) =>
  authFetch(`/vendor/pickups/${id}/complete`, { method: "PATCH" });

export const getAllListings = () =>
  authFetch("/vendor/listings");
>>>>>>> 514c23e (Added backend to temples and vendors dashboard)
