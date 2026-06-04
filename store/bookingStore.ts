import { create } from "zustand";
import type { BookingResponse } from "@/lib/api";
import { bookingsApi } from "@/lib/api";

interface State {
  bookings: BookingResponse[];
  loading: boolean;
  fetchMyBookings: (guestId: string) => Promise<void>;
  upsert: (b: BookingResponse) => void;
  updateStatus: (bookingId: string, status: string) => void;
}

export const useBookingStore = create<State>((set) => ({
  bookings: [],
  loading: false,

  fetchMyBookings: async (guestId) => {
    set({ loading: true });
    try {
      const bs = await bookingsApi.getMyBookings(guestId);
      set({ bookings: bs });
    } catch { /* */ }
    finally { set({ loading: false }); }
  },

  upsert: (b) =>
    set((s) => {
      const exists = s.bookings.some((x) => x.id === b.id);
      return {
        bookings: exists
          ? s.bookings.map((x) => (x.id === b.id ? b : x))
          : [b, ...s.bookings],
      };
    }),

  updateStatus: (bookingId, status) =>
    set((s) => ({
      bookings: s.bookings.map((b) =>
        b.id === bookingId ? { ...b, status } : b
      ),
    })),
}));
