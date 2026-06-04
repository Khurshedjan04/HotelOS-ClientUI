"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { authApi } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const router  = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [form, setForm] = useState({ firstName:"", lastName:"", email:"", phone:"", password:"", confirm:"" });
  const [loading, setLoading] = useState(false);
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f)=>({...f,[k]:e.target.value}));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error("Passwords do not match"); return; }
    if (form.password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      await authApi.register({ firstName:form.firstName, lastName:form.lastName, email:form.email, phone:form.phone, password:form.password });
      const user = await authApi.login(form.email, form.password);
      setUser(user);
      toast.success("Welcome to GrandStay!");
      router.push("/dashboard");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-5/12 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1a1714 0%,#3d2d20 50%,#2a2010 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(255,255,255,.5) 0,rgba(255,255,255,.5) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-700 flex items-center justify-center">
            <span className="text-white font-bold text-lg" style={{ fontFamily: "Georgia,serif" }}>G</span>
          </div>
          <div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>GrandStay</p>
            <p className="text-white/40 text-[10px] tracking-widest uppercase">Hotel & Suites</p>
          </div>
        </div>
        <div className="relative">
          <h1 className="text-white text-3xl font-light leading-snug mb-4" style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            Begin your<br /><em className="not-italic text-amber-400">GrandStay journey.</em>
          </h1>
          <p className="text-white/45 max-w-xs text-sm leading-relaxed">
            Create a free guest account to book rooms, track your stays, and unlock exclusive member benefits.
          </p>
          <div className="mt-8 space-y-3">
            {["Instant booking confirmations","Early check-in requests","Exclusive member rates","Concierge messaging"].map((b) => (
              <div key={b} className="flex items-center gap-3 text-sm text-white/60">
                <div className="w-5 h-5 rounded-full bg-amber-700/50 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                {b}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-white/25 text-xs">No credit card required to create an account</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: "var(--font-playfair),Georgia,serif", color: "var(--text-1)" }}>
              Create your guest account
            </h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.9rem" }}>Join GrandStay in under 2 minutes.</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-2xl p-6 shadow-sm" style={{ border: "1px solid var(--border)" }}>
            <div className="grid grid-cols-2 gap-3">
              <div><label>First Name</label><input value={form.firstName} onChange={set("firstName")} placeholder="Jane" required /></div>
              <div><label>Last Name</label><input value={form.lastName} onChange={set("lastName")} placeholder="Smith" required /></div>
            </div>
            <div><label>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required /></div>
            <div><label>Phone</label><input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 0100" required /></div>
            <div><label>Password</label><input type="password" value={form.password} onChange={set("password")} placeholder="Min. 6 characters" required /></div>
            <div><label>Confirm Password</label><input type="password" value={form.confirm} onChange={set("confirm")} placeholder="Repeat password" required /></div>
            <button type="submit" disabled={loading} className="btn btn-primary w-full" style={{ padding: ".75rem 1.5rem" }}>
              {loading ? <Spin /> : null} Create Account
            </button>
          </form>
          <p className="text-center text-sm mt-5" style={{ color: "var(--text-2)" }}>
            Already a member?{" "}<Link href="/auth/login" style={{ color: "var(--gold)" }} className="font-medium hover:underline">Sign in</Link>
          </p>
          <p className="text-center text-xs mt-2"><Link href="/" style={{ color: "var(--text-3)" }} className="hover:underline">← Back to website</Link></p>
        </div>
      </div>
    </div>
  );
}
function Spin() { return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />; }
