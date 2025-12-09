import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      id: null,
      user: null,
      role: null,
      token: null,

      setUserId: (id) => set({ id }),
      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setToken: (token) => set({ token }),

      logout: () => {
        set({ id: null, user: null, role: null, token: null });
        useAuthStore.persist.clearStorage();
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
