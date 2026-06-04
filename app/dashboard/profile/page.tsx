"use client";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const user      = useAuthStore((s) => s.user)!;
  const clearUser = useAuthStore((s) => s.clearUser);
  const { bookings, fetchMyBookings } = useBookingStore();
  const router    = useRouter();

  const [showPwForm, setShowPwForm] = useState(false);
  const [pwForm, setPwForm]         = useState({ current: "", next: "", confirm: "" });
  const [pwLoading, setPwLoading]   = useState(false);

  useEffect(() => { fetchMyBookings(user.id); }, [user.id, fetchMyBookings]);

  const logout = () => {
    clearUser();
    router.push("/");
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { toast.error("New passwords don't match"); return; }
    if (pwForm.next.length < 6)         { toast.error("Password must be at least 6 characters"); return; }
    setPwLoading(true);
    try {
      await authApi.changePassword(user.id, pwForm.current, pwForm.next);
      toast.success("Password changed successfully");
      setShowPwForm(false);
      setPwForm({ current: "", next: "", confirm: "" });
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  const completed = bookings.filter((b) => b.status === "Completed").length;
  const total     = bookings.length;
  const initials  = user.email.slice(0, 2).toUpperCase();

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold text-stone-900 mb-6">My Profile</h1>

      {/* Avatar card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-5 mb-6 pb-6 border-b border-stone-100">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-400
                          flex items-center justify-center text-xl font-bold text-amber-900 shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-stone-900 text-lg leading-tight">
              {user.email.split("@")[0]}
            </p>
            <p className="text-stone-500 text-sm">{user.email}</p>
            <span className="inline-flex mt-1.5 text-xs bg-amber-100 text-amber-800
                             px-2.5 py-0.5 rounded-full font-semibold tracking-wide uppercase">
              {user.role}
            </span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-stone-100">
          {[
            { label: "Total Stays",     value: total },
            { label: "Completed Stays", value: completed },
            { label: "Loyalty Points",  value: completed * 100 },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold text-stone-900">{s.value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Account details */}
        <div className="space-y-4">
          <Row label="Email address" value={user.email} />
          <Row label="Account ID"   value={user.id}    mono />
          <Row label="Session expires"
            value={new Date(user.expiresAt).toLocaleString("en-US", {
              month: "long", day: "numeric", year: "numeric",
              hour: "2-digit", minute: "2-digit",
            })} />
        </div>
      </div>

      {/* Member benefits */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-2xl p-5 mb-4">
        <p className="font-semibold text-amber-900 mb-3">Guest Member Benefits</p>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Early check-in requests",
            "Exclusive member rates",
            "In-room dining access",
            "Concierge priority line",
          ].map((b) => (
            <div key={b} className="flex items-center gap-2 text-sm text-amber-800">
              <svg className="w-4 h-4 text-amber-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
              </svg>
              {b}
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div className="bg-white border border-stone-200 rounded-2xl p-5 mb-4">
        <div className="flex items-center justify-between">
          <p className="font-medium text-stone-900 text-sm">Password</p>
          <button onClick={() => { setShowPwForm((v) => !v); setPwForm({ current: "", next: "", confirm: "" }); }}
            className="text-xs text-amber-700 hover:text-amber-800 font-medium transition-colors">
            {showPwForm ? "Cancel" : "Change password"}
          </button>
        </div>

        {showPwForm && (
          <form onSubmit={handleChangePassword} className="mt-4 space-y-3">
            {(["current", "next", "confirm"] as const).map((field) => (
              <div key={field}>
                <label className="block text-xs text-stone-400 uppercase tracking-wide mb-1">
                  {field === "current" ? "Current password" : field === "next" ? "New password" : "Confirm new password"}
                </label>
                <input
                  type="password"
                  value={pwForm[field]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))}
                  required
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm
                             focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-amber-400"
                />
              </div>
            ))}
            <button type="submit" disabled={pwLoading}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60
                         text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {pwLoading
                ? <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"/>Saving…</>
                : "Update password"}
            </button>
          </form>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={logout}
          className="px-5 py-2 border border-red-200 text-red-600 hover:bg-red-50
                     rounded-xl text-sm font-medium transition-colors">
          Sign out
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs text-stone-400 uppercase tracking-wide mb-0.5">{label}</p>
      <p className={`text-stone-800 ${mono ? "font-mono text-xs break-all" : "text-sm"}`}>{value}</p>
    </div>
  );
}
