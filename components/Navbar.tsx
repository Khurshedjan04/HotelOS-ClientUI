"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

const NAV_LINKS = [
  { href: "/rooms",   label: "Rooms & Suites" },
  { href: "/about",   label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname   = usePathname();
  const router     = useRouter();
  const user       = useAuthStore((s) => s.user);
  const clearUser  = useAuthStore((s) => s.clearUser);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const isHome = pathname === "/";

  useEffect(() => {
    if (!isHome) { setScrolled(true); return; }
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const logout = () => { clearUser(); router.push("/"); };

  const navCls = scrolled
    ? "bg-white shadow-sm border-b border-[var(--border)]"
    : "bg-transparent";

  const textCls = scrolled || !isHome ? "text-[var(--text-1)]" : "text-white";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${navCls}`}>
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="flex h-[72px] items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-[10px] bg-[var(--gold)] flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-base" style={{ fontFamily: "Georgia, serif" }}>G</span>
            </div>
            <div className="leading-none">
              <span className={`font-bold tracking-tight text-[17px] serif ${scrolled || !isHome ? "text-[var(--text-1)]" : "text-white"}`}
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                GrandStay
              </span>
              <p className={`text-[10px] tracking-widest uppercase ${scrolled || !isHome ? "text-[var(--text-3)]" : "text-white/60"}`}>
                Hotel & Suites
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href}
                className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                  pathname.startsWith(l.href)
                    ? "bg-[var(--gold-pale)] text-[var(--gold)]"
                    : `hover:bg-black/5 ${textCls}`
                }`}>
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link href="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-[var(--gold)] ${textCls}`}>
                  My Account
                </Link>
                <button onClick={logout}
                  className={`text-sm transition-colors hover:text-red-500 ${textCls}`}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className={`text-sm font-medium transition-colors hover:text-[var(--gold)] ${textCls}`}>
                  Sign in
                </Link>
                <Link href="/rooms" className="btn btn-primary text-sm px-5 py-2.5">
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu">
            <span className={`w-6 h-0.5 transition-all ${scrolled || !isHome ? "bg-[var(--text-1)]" : "bg-white"} ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`w-6 h-0.5 transition-all ${scrolled || !isHome ? "bg-[var(--text-1)]" : "bg-white"} ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-6 h-0.5 transition-all ${scrolled || !isHome ? "bg-[var(--text-1)]" : "bg-white"} ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-[var(--border)] px-6 pb-6 pt-2 shadow-lg">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 text-[var(--text-1)] font-medium border-b border-[var(--border-soft)] last:border-0">
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 mt-4">
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                  className="btn btn-outline text-sm flex-1">My Account</Link>
                <button onClick={logout} className="btn btn-ghost text-sm flex-1">Sign out</button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                  className="btn btn-outline text-sm flex-1">Sign in</Link>
                <Link href="/rooms" onClick={() => setMenuOpen(false)}
                  className="btn btn-primary text-sm flex-1">Book Now</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
