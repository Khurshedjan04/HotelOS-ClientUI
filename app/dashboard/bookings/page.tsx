"use client";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import BookingCard from "@/components/BookingCard";
import type { BookingResponse } from "@/lib/api";

const STATUS_GROUPS = ["PendingPayment", "Confirmed", "Active", "Completed", "Cancelled", "TimedOut"] as const;

export default function BookingsPage() {
  const user = useAuthStore((s) => s.user)!;
  const { bookings, loading, fetchMyBookings } = useBookingStore();
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => { fetchMyBookings(user.id); }, [user.id, fetchMyBookings]);

  const counts: Record<string, number> = { all: bookings.length };
  STATUS_GROUPS.forEach((s) => { counts[s] = bookings.filter((b: BookingResponse) => b.status === s).length; });

  const displayed = filter === "all" ? bookings : bookings.filter((b: BookingResponse) => b.status === filter);

  const LABELS: Record<string, string> = {
    all: "All", PendingPayment: "Pending Payment", Confirmed: "Confirmed",
    Active: "Active", Completed: "Completed", Cancelled: "Cancelled", TimedOut: "Timed Out",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-900">My Bookings</h1>
        <span className="text-sm text-stone-400">{bookings.length} total</span>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 flex-wrap mb-6">
        {["all", ...STATUS_GROUPS].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === s
                ? "bg-amber-600 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}>
            {LABELS[s]} ({counts[s] ?? 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-stone-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl">
          <p className="text-stone-400">No {filter !== "all" ? LABELS[filter].toLowerCase() : ""} bookings</p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayed.map((b: BookingResponse) => <BookingCard key={b.id} booking={b} />)}
        </div>
      )}
    </div>
  );
}
