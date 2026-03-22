"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { authAPI } from "@/lib/api";

// ─── TYPES ────────────────────────────────────────────────
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
}

interface AuthContextValue {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;

  updateProfile: (data: { name: string; bio: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── PROVIDER ─────────────────────────────────────────────
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ Restore session
  useEffect(() => {
    const storedUser = localStorage.getItem("snip_user");
    const storedProfile = localStorage.getItem("snip_profile");

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedProfile) setProfile(JSON.parse(storedProfile));

    setIsLoading(false);
  }, []);

  // ─── LOGIN ─────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const res = await authAPI.login({ email, password });

      const token = res.token;
      localStorage.setItem("token", token);

      const userData: User = {
        id: token,
        email,
        name: email.split("@")[0],
      };

      const profileData: Profile = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        bio: "",
      };

      setUser(userData);
      setProfile(profileData);

      localStorage.setItem("snip_user", JSON.stringify(userData));
      localStorage.setItem("snip_profile", JSON.stringify(profileData));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── SIGNUP ─────────────────────────────────────────────
  const signup = useCallback(
    async (name: string, email: string, password: string) => {
      setIsLoading(true);

      try {
        const [firstName, ...rest] = name.trim().split(" ");
        const lastName = rest.join(" ") || "User";

        await authAPI.signup({
        firstName,
        lastName,
        email,
        password,
        });
        await login(email, password);
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  // ─── UPDATE PROFILE ─────────────────────────────────────
  const updateProfile = async ({
    name,
    bio,
  }: {
    name: string;
    bio: string;
  }) => {
    if (!profile) return;

    // 🔥 Local update (works now)
    const updated: Profile = {
      ...profile,
      name,
      bio,
    };

    setProfile(updated);
    localStorage.setItem("snip_profile", JSON.stringify(updated));

    // 🔌 FUTURE BACKEND (when ready)
    // await api.patch("/user/profile", { name, bio });
  };

  // ─── LOGOUT ─────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setProfile(null);

    localStorage.removeItem("token");
    localStorage.removeItem("snip_user");
    localStorage.removeItem("snip_profile");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ─── HOOK ────────────────────────────────────────────────
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};