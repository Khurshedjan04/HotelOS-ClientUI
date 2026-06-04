"use client";
import { useState } from "react";
import { format } from "date-fns";
import { bookingsApi } from "@/lib/api";
import type { BookingResponse } from "@/lib/api";
import { useBookingStore } from "@/store/bookingStore";
import PaymentModal from "./PaymentModal";
import toast from "react-hot-toast";
import CountdownTimer from "./CountdownTimer";

const STATUS_STYLES: Record<string, string> = {
  PendingPayment: "bg-amber-100 text-amber-800",
  Confirmed:      "bg-blue-100  text-blue-800",
  Active:         "bg-emerald-100 text-emerald-800",
  Cancelled:      "bg-stone-100 text-stone-500",
  TimedOut:       "bg-red-100   text-red-700",
  Completed:      "bg-stone-100 text-stone-700",
};

export default function BookingCard({ booking }: { booking: BookingResponse }) {
  const upsert     = useBookingStore((s) => s.upsert);
  const updateSt   = useBookingStore((s) => s.updateStatus);
  const [showPay, setShowPay] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const nights = Math.max(1, Math.round(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86_400_000
  ));

  const handleCancel = async () => {
    if (!confirm("Cancel this booking? Cancellation penalties may apply.")) return;
    setCancelling(true);
    try {
      const updated = await bookingsApi.cancel(booking.id);
      upsert(updated);
      toast.success("Booking cancelled");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Cancel failed");
    } finally { setCancelling(false); }
  };

  const st = STATUS_STYLES[booking.status] ?? "bg-stone-100 text-stone-500";

  return (
    <>
      <div className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-amber-300 hover:shadow-sm transition-all">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <p className="font-semibold text-stone-900">Room {booking.roomNumber}</p>
            <p className="text-sm text-stone-500 mt-0.5">
              {format(new Date(booking.checkIn), "MMM d")} — {format(new Date(booking.checkOut), "MMM d, yyyy")} · {nights} night{nights !== 1 ? "s" : ""}
            </p>
          </div>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${st}`}>
            {booking.status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-bold text-amber-700">${booking.totalPrice.toFixed(2)}</p>
          <div className="flex items-center gap-2">
            {booking.status === "PendingPayment" && (
              <>
                <span className="text-xs text-stone-400">Expires in: <CountdownTimer expiresAt={booking.expiresAt} onExpired={() => updateSt(booking.id, "TimedOut")} /></span>
                <button onClick={() => setShowPay(true)}
                  className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
                  Pay Now
                </button>
              </>
            )}
            {["PendingPayment", "Confirmed"].includes(booking.status) && (
              <button onClick={handleCancel} disabled={cancelling}
                className="px-3 py-1.5 text-xs border border-stone-300 hover:border-red-400 hover:text-red-600 text-stone-500 rounded-lg transition-colors disabled:opacity-50">
                {cancelling ? "…" : "Cancel"}
              </button>
            )}
            {booking.status === "Active" && (
              <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2.5 py-1 rounded-full">Checked in</span>
            )}
          </div>
        </div>
      </div>

      {showPay && (
        <PaymentModal booking={booking} onClose={() => setShowPay(false)} onPaid={() => setShowPay(false)} />
      )}
    </>
  );
}
