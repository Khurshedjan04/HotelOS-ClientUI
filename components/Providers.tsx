"use client";
import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import { useBookingStore } from "@/store/bookingStore";
import { connect, joinChannel } from "@/lib/signalr";

const POLL_INTERVAL_MS = 20_000;

export default function Providers({ children }: { children: React.ReactNode }) {
  const hydrate         = useAuthStore((s) => s.hydrate);
  const user            = useAuthStore((s) => s.user);
  const updateRoom      = useRoomStore((s) => s.updateRoomStatus);
  const updateStatus    = useBookingStore((s) => s.updateStatus);
  const fetchMyBookings = useBookingStore((s) => s.fetchMyBookings);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    // ── Polling fallback ───────────────────────────────────────
    const pollTimer = setInterval(() => {
      fetchMyBookings(user.id);
    }, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        fetchMyBookings(user.id);
      }
    };
    document.addEventListener("visibilitychange", onVisible);

    // ── SignalR ────────────────────────────────────────────────
    const setup = async (attempt = 0) => {
      if (!mounted) return;
      try {
        const c = await connect();
        if (!mounted) return;

        await joinChannel("rooms");
        await joinChannel(`user:${user.id}`);

        c.on("RoomStatusUpdated", (d: { RoomId?: string; roomId?: string; NewStatus?: string; newStatus?: string }) => {
          const id = d.RoomId ?? d.roomId ?? "";
          const st = d.NewStatus ?? d.newStatus ?? "";
          if (id && st) updateRoom(id, st);
        });

        c.on("ReservationCreated", () => {
          fetchMyBookings(user.id);
        });

        c.on("ReservationExpired", (d: { BookingId?: string; bookingId?: string }) => {
          const bid = d.BookingId ?? d.bookingId ?? "";
          if (bid) updateStatus(bid, "TimedOut");
        });

        c.on("PaymentConfirmed", (d: { BookingId?: string; bookingId?: string }) => {
          const bid = d.BookingId ?? d.bookingId ?? "";
          if (bid) updateStatus(bid, "Confirmed");
        });

        c.on("BookingStatusUpdated", (d: { BookingId?: string; bookingId?: string; NewBookingStatus?: string; newBookingStatus?: string }) => {
          const bid = d.BookingId ?? d.bookingId ?? "";
          const st  = d.NewBookingStatus ?? d.newBookingStatus ?? "";
          if (bid && st) updateStatus(bid, st);
        });

        c.onreconnected(async () => {
          // Re-join channels — SignalR drops group membership on reconnect
          await joinChannel("rooms").catch(() => {});
          await joinChannel(`user:${user.id}`).catch(() => {});
          fetchMyBookings(user.id);
        });

      } catch {
        if (mounted && attempt < 5) {
          const delay = Math.min(2000 * 2 ** attempt, 30_000);
          setTimeout(() => setup(attempt + 1), delay);
        }
      }
    };

    setup();

    return () => {
      mounted = false;
      clearInterval(pollTimer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [user, updateRoom, updateStatus, fetchMyBookings]);

  return (
    <>
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#1c1917", color: "#fafaf9", border: "1px solid #44403c" },
          success: { iconTheme: { primary: "#d97706", secondary: "#1c1917" } },
          error:   { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
        }}
      />
    </>
  );
}
