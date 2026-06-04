import { create } from "zustand";
import type { AuthUser } from "@/lib/api";

interface State {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (u: AuthUser) => void;
  clearUser: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<State>((set) => ({
  user: null,
  isLoading: true,

  setUser: (u) => {
    localStorage.setItem("hotelos_client_token", u.token);
    localStorage.setItem("hotelos_client_user",  JSON.stringify(u));
    set({ user: u });
  },

  clearUser: () => {
    localStorage.removeItem("hotelos_client_token");
    localStorage.removeItem("hotelos_client_user");
    set({ user: null });
  },

  hydrate: () => {
    try {
      const raw = localStorage.getItem("hotelos_client_user");
      if (raw) {
        const u: AuthUser = JSON.parse(raw);
        if (new Date(u.expiresAt) > new Date()) {
          set({ user: u, isLoading: false });
          return;
        }
      }
    } catch { /* */ }
    set({ isLoading: false });
  },
}));
