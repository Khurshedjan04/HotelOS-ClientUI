"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const router   = useRouter();
  const setUser  = useAuthStore((s) => s.setUser);
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await authApi.login(email, password);
      if (user.role !== "Client") {
        toast.error("This portal is for guests only.");
        return;
      }
      setUser(user);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a1714 0%,#3d2d20 50%,#2a2010 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(255,255,255,.5) 0,rgba(255,255,255,.5) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg" style={{ fontFamily: "Georgia,serif" }}>G</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>GrandStay</p>
            <p className="text-white/40 text-[10px] tracking-widest uppercase">Hotel & Suites</p>
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-amber-500" />
            <span className="text-amber-400 text-xs tracking-[0.25em] uppercase font-medium">Guest Portal</span>
          </div>
          <h1 className="text-white text-4xl font-light leading-snug mb-4" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            Welcome back to<br /><em className="not-italic text-amber-400">GrandStay.</em>
          </h1>
          <p className="text-white/45 max-w-xs text-sm leading-relaxed font-light">
            Manage reservations, order room service, and access exclusive guest benefits.
          </p>
        </div>
        <div className="relative flex flex-wrap gap-2">
          {["Reservations","Room Service","Dining","Concierge"].map((t) => (
            <span key={t} className="text-xs text-white/30 border border-white/10 rounded-full px-3 py-1">{t}</span>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-amber-700 flex items-center justify-center">
              <span className="text-white font-bold" style={{ fontFamily: "Georgia,serif" }}>G</span>
            </div>
            <span className="font-bold" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>GrandStay</span>
          </div>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-playfair),Georgia,serif", color: "var(--text-1)" }}>
              Sign in to your account
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>Enter your guest credentials below.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid var(--border)" }}>
            <div><label>Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div><label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ padding: ".75rem 1.5rem" }}>
              {loading ? <Spin /> : null} Sign In
            </button>
          </form>
          <p className="text-center text-sm mt-5" style={{ color: "var(--text-2)" }}>
            New guest?{" "}<Link href="/auth/register" style={{ color: "var(--gold)" }} className="font-medium hover:underline">Create account</Link>
          </p>
          <p className="text-center text-xs mt-2"><Link href="/" style={{ color: "var(--text-3)" }} className="hover:underline">← Back to website</Link></p>
        </div>
      </div>
    </div>
  );
}
function Spin() { return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />; }
