"use client";
import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import { useBookingStore } from "@/store/bookingStore";
import { connect, joinChannel } from "@/lib/signalr";

export default function Providers({ children }: { children: React.ReactNode }) {
  const hydrate      = useAuthStore((s) => s.hydrate);
  const user         = useAuthStore((s) => s.user);
  const updateRoom   = useRoomStore((s) => s.updateRoomStatus);
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const connRef      = useRef<import("@microsoft/signalr").HubConnection | null>(null);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    let mounted = true;
    const setup = async () => {
      try {
        const c = await connect();
        if (!mounted) return;
        connRef.current = c;

        // join "rooms" group for live availability
        await joinChannel("rooms");

        // join personal channel for booking/payment events
        if (user) await joinChannel(`user-${user.id}`);

        // room availability
        c.on("RoomStatusUpdated", (d: { RoomId?: string; roomId?: string; NewStatus?: string; newStatus?: string }) => {
          const id  = d.RoomId ?? d.roomId ?? "";
          const st  = d.NewStatus ?? d.newStatus ?? "";
          if (id && st) updateRoom(id, st);
        });

        // personal channel events (booking confirmed / expired)
        c.on("ReservationCreated", () => {
          if (user) {
            import("@/store/bookingStore").then(({ useBookingStore: bs }) => {
              bs.getState().fetchMyBookings(user.id);
            });
          }
        });
        c.on("ReservationExpired", (d: { BookingId?: string; bookingId?: string }) => {
          const bid = d.BookingId ?? d.bookingId ?? "";
          if (bid) updateStatus(bid, "TimedOut");
        });
        c.on("PaymentConfirmed", (d: { BookingId?: string; bookingId?: string }) => {
          const bid = d.BookingId ?? d.bookingId ?? "";
          if (bid) updateStatus(bid, "Confirmed");
        });
        c.on("BookingStatusUpdated", (d: { BookingId?: string; bookingId?: string; NewStatus?: string; newStatus?: string }) => {
          const bid = d.BookingId ?? d.bookingId ?? "";
          const st  = d.NewStatus ?? d.newStatus ?? "";
          if (bid && st) updateStatus(bid, st);
        });
        c.on("OrderUpdated", () => { /* orders page refreshes on its own */ });
      } catch { /* SignalR unavailable */ }
    };
    setup();
    return () => {
      mounted = false;
      connRef.current?.off("RoomStatusUpdated");
      connRef.current?.off("ReservationCreated");
      connRef.current?.off("ReservationExpired");
      connRef.current?.off("PaymentConfirmed");
      connRef.current?.off("BookingStatusUpdated");
      connRef.current?.off("OrderUpdated");
    };
  }, [user, updateRoom, updateStatus]);

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
