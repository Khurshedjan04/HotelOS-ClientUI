"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import PaymentModal from "@/components/PaymentModal";
import { roomsApi, bookingsApi } from "@/lib/api";
import type { RoomResult, BookingResponse } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import toast from "react-hot-toast";
import { format } from "date-fns";

function ReservePage() {
  const router      = useRouter();
  const params      = useSearchParams();
  const user        = useAuthStore((s) => s.user);
  const upsert      = useBookingStore((s) => s.upsert);

  const roomId   = params.get("roomId")   ?? "";
  const checkIn  = params.get("checkIn")  ?? "";
  const checkOut = params.get("checkOut") ?? "";

  const [room, setRoom]         = useState<RoomResult | null>(null);
  const [booking, setBooking]   = useState<BookingResponse | null>(null);
  const [loadingRoom, setLoadingRoom] = useState(true);
  const [reserving, setReserving]     = useState(false);
  const [showPay, setShowPay]         = useState(false);

  const nights = Math.max(1, Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000
  ));

  useEffect(() => {
    if (!user) { router.push("/auth/login"); return; }
    if (!roomId) { router.push("/"); return; }
    roomsApi.getById(roomId).then(setRoom).catch(() => toast.error("Room has already been reserved")).finally(() => setLoadingRoom(false));
  }, [roomId, user, router]);

  const handleReserve = async () => {
    if (!room || !user) return;
    setReserving(true);
    try {
      const b = await bookingsApi.create(
        room.id,
        new Date(checkIn).toISOString(),
        new Date(checkOut).toISOString()
      );
      upsert(b);
      setBooking(b);
      setShowPay(true);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Reservation failed");
    } finally { setReserving(false); }
  };

  if (loadingRoom) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!room) return null;

  const total = (room.pricePerNight * nights).toFixed(2);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 pb-12 pt-[88px]">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
          </svg>
          Back to search
        </button>

        <h1 className="text-2xl font-semibold text-stone-900 mb-6">Confirm your reservation</h1>

        {/* Room summary */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden mb-6">
          <div className="h-48 relative overflow-hidden">
            <img
              src={`https://images.unsplash.com/photo-${{ Standard:"1631049307264-da0ec9d70304", Deluxe:"1590490360182-c33d57733427", FamilySuite:"1611892440504-42a792e24d32", BusinessSuite:"1522771739844-6a9f6d5f14af" }[room.style] ?? "1631049307264-da0ec9d70304"}?w=800&h=400&fit=crop&auto=format&q=80`}
              alt={room.style}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-semibold text-stone-900 text-lg">Room {room.roomNumber}</h2>
                <p className="text-stone-500 text-sm">{room.style.replace(/([A-Z])/g, " $1").trim()} · Floor {room.floor} · {room.capacity} guest{room.capacity !== 1 ? "s" : ""}</p>
              </div>
              <p className="text-amber-700 font-bold text-lg">${room.pricePerNight}<span className="text-xs font-normal text-stone-400">/night</span></p>
            </div>
            {room.description && <p className="text-sm text-stone-500 mb-4">{room.description}</p>}

            <div className="grid grid-cols-2 gap-3 bg-stone-50 rounded-xl p-4 text-sm">
              <div>
                <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Check-in</p>
                <p className="font-medium text-stone-900">{format(new Date(checkIn), "EEE, MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Check-out</p>
                <p className="font-medium text-stone-900">{format(new Date(checkOut), "EEE, MMM d, yyyy")}</p>
              </div>
              <div>
                <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Duration</p>
                <p className="font-medium text-stone-900">{nights} night{nights !== 1 ? "s" : ""}</p>
              </div>
              <div>
                <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Total</p>
                <p className="font-bold text-amber-700 text-base">${total}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation policy */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm">
          <p className="font-medium text-amber-800 mb-1">Cancellation policy</p>
          <ul className="text-amber-700 space-y-0.5 text-xs">
            <li>• Free cancellation more than 48 hours before check-in</li>
            <li>• Standard penalty 24–48 hours before check-in</li>
            <li>• No refund less than 24 hours before check-in</li>
          </ul>
        </div>

        <button onClick={handleReserve} disabled={reserving}
          className="w-full py-3.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white
                     font-semibold rounded-2xl transition-colors flex items-center justify-center gap-2">
          {reserving ? <><Spin/> Creating reservation…</> : `Reserve & Pay $${total}`}
        </button>

        <p className="text-center text-xs text-stone-400 mt-3">
          Your card will be charged after confirming payment. A 10-minute payment window applies.
        </p>
      </main>

      {showPay && booking && (
        <PaymentModal
          booking={booking}
          onClose={() => setShowPay(false)}
          onPaid={() => { setShowPay(false); router.push("/dashboard"); }}
        />
      )}
    </div>
  );
}

function Spin() {
  return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

export default function ReservePageWrapper() {
  return <Suspense><ReservePage /></Suspense>;
}
