// frontend/src/lib/api.ts

import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── AXIOS INSTANCE ───────────────────────────────────────
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ─── RESPONSE INTERCEPTOR ────────────────────────────────
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(
      error.response?.data?.error || error.message || "Something went wrong"
    );
  }
);


// ============================================
// AUTH API
// ============================================

export const authAPI = {
  signup: async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    const payload = {
      firstname: data.firstName,
      lastname: data.lastName,
      email: data.email,
      password: data.password,
    };

    const res = await api.post("/user/signup", payload);
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post("/user/login", data);

    const token = res.data.token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }

    return res.data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  },

  getToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  },

  isAuthenticated: () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("token");
  },
};


// ============================================
// URL API
// ============================================

export const urlAPI = {
  shorten: async (url: string, code?: string) => {
    const payload = code ? { url, code } : { url };

    const res = await api.post("/shorten", payload);
    return res.data;
  },

  getUserUrls: async () => {
    const res = await api.get("/codes");
    return res.data.codes || [];
  },

  deleteUrl: async (id: string) => {
    const res = await api.delete(`/${id}`);
    return res.data;
  },

  visitShortUrl: (shortCode: string) => {
    if (typeof window !== "undefined") {
      window.location.href = `${BASE_URL}/${shortCode}`;
    }
  },
};

export default api;