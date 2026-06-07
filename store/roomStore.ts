import { create } from "zustand";
import type { RoomResult, RoomStyle } from "@/lib/api";
import { roomsApi } from "@/lib/api";

interface State {
  results: RoomResult[];
  loading: boolean;
  checkIn: string;
  checkOut: string;
  style: RoomStyle | "";
  searched: boolean;
  setDates: (checkIn: string, checkOut: string) => void;
  setStyle: (s: RoomStyle | "") => void;
  search: () => Promise<void>;
  updateRoomStatus: (roomId: string, newStatus: string) => void;
}

const today    = () => new Date().toISOString().split("T")[0];
const tomorrow = () => new Date(Date.now() + 86_400_000).toISOString().split("T")[0];

export const useRoomStore = create<State>((set, get) => ({
  results: [],
  loading: false,
  checkIn:  today(),
  checkOut: tomorrow(),
  style:    "",
  searched: false,

  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setStyle: (style) => set({ style }),

  search: async () => {
    const { checkIn, checkOut, style } = get();
    set({ loading: true });
    try {
      const r = await roomsApi.search(
        new Date(checkIn).toISOString(),
        new Date(checkOut).toISOString(),
        style || undefined,
      );
      set({ results: r, searched: true });
    } catch { /* */ }
    finally { set({ loading: false }); }
  },

  updateRoomStatus: (roomId, newStatus) =>
    set((s) => ({
      // Only Available rooms are shown; remove any room that becomes unavailable.
      results: newStatus === "Available"
        ? s.results.map((r) => r.id === roomId ? { ...r, status: newStatus } : r)
        : s.results.filter((r) => r.id !== roomId),
    })),
}));
