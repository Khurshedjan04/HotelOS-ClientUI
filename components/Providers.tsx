"use client";
import { useEffect, useRef } from "react";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import { useBookingStore } from "@/store/bookingStore";
import { connect, joinChannel } from "@/lib/signalr";

export default function Providers({ children }: { children: React.ReactNode }) {
  const hydrate          = useAuthStore((s) => s.hydrate);
  const user             = useAuthStore((s) => s.user);
  const updateRoom       = useRoomStore((s) => s.updateRoomStatus);
  const updateStatus     = useBookingStore((s) => s.updateStatus);
  const fetchMyBookings  = useBookingStore((s) => s.fetchMyBookings);
  const connRef          = useRef<import("@microsoft/signalr").HubConnection | null>(null);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!user) return;
    let mounted = true;

    const setup = async () => {
      try {
        const c = await connect();
        if (!mounted) return;
        connRef.current = c;

        // "rooms" — live room availability updates for all guests
        await joinChannel("rooms");
        // personal channel — Hub auto-joins user:{id} via OnConnectedAsync from JWT,
        // but we explicitly join to ensure it's registered even after reconnect.
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

      } catch { /* SignalR unavailable — degrade gracefully */ }
    };

    setup();

    return () => {
      mounted = false;
      const c = connRef.current;
      c?.off("RoomStatusUpdated");
      c?.off("ReservationCreated");
      c?.off("ReservationExpired");
      c?.off("PaymentConfirmed");
      c?.off("BookingStatusUpdated");
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
