"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import BookingCard from "@/components/BookingCard";

export default function DashboardPage() {
  const user          = useAuthStore((s) => s.user)!;
  const { bookings, loading, fetchMyBookings } = useBookingStore();

  useEffect(() => {
    fetchMyBookings(user.id);
  }, [user.id, fetchMyBookings]);

  const active    = bookings.filter((b) => b.status === "Active");
  const pending   = bookings.filter((b) => b.status === "PendingPayment");
  const confirmed = bookings.filter((b) => b.status === "Confirmed");
  const upcoming  = [...pending, ...confirmed].sort(
    (a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime()
  );

  return (
    <div>
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-900">
          Welcome back{user.email ? `, ${user.email.split("@")[0]}` : ""}
        </h1>
        <p className="text-stone-500 text-sm mt-1">Here's your current stay status.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Stay",   value: active.length,    color: "emerald" },
          { label: "Upcoming",      value: upcoming.length,  color: "amber" },
          { label: "Payment Due",   value: pending.length,   color: "red" },
          { label: "Total Stays",   value: bookings.filter(b => b.status === "Completed").length, color: "stone" },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-2xl p-4">
            <p className="text-2xl font-bold text-stone-900">{s.value}</p>
            <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Active stay banner */}
      {active.length > 0 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-6 flex items-center justify-between">
          <div>
            <p className="font-semibold text-emerald-900">You're currently checked in</p>
            <p className="text-sm text-emerald-700 mt-0.5">
              Room {active[0].roomNumber} · checking out {new Date(active[0].checkOut).toLocaleDateString()}
            </p>
          </div>
          <Link href="/dashboard/orders"
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl transition-colors">
            Order Room Service
          </Link>
        </div>
      )}

      {/* Payment-pending bookings */}
      {pending.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
            Awaiting Payment
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{pending.length}</span>
          </h2>
          <div className="space-y-3">
            {pending.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}

      {/* Upcoming confirmed bookings */}
      {confirmed.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-stone-900 mb-3">Confirmed Upcoming</h2>
          <div className="space-y-3">
            {confirmed.map((b) => <BookingCard key={b.id} booking={b} />)}
          </div>
        </div>
      )}

      {/* Empty */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border border-stone-200 rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-stone-100 rounded w-1/3 mb-2" />
              <div className="h-3 bg-stone-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : !loading && active.length === 0 && upcoming.length === 0 && (
        <div className="text-center py-16 bg-white border border-stone-200 rounded-2xl">
          <p className="text-stone-400 mb-3">No active or upcoming bookings</p>
          <Link href="/" className="text-sm text-amber-700 hover:underline font-medium">Browse available rooms →</Link>
        </div>
      )}
    </div>
  );
}
