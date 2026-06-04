"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import Navbar from "@/components/Navbar";

const NAV = [
  { href: "/dashboard",          label: "Overview" },
  { href: "/dashboard/bookings", label: "My Bookings" },
  { href: "/dashboard/orders",   label: "Room Service" },
  { href: "/dashboard/profile",  label: "Profile" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuthStore();
  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.push("/auth/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 pb-10 pt-[88px]">
        {/* Sub-nav */}
        <nav className="flex gap-1 mb-8 border-b border-stone-200 pb-0">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link key={n.href} href={n.href}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  active
                    ? "border-amber-600 text-amber-700"
                    : "border-transparent text-stone-500 hover:text-stone-700"
                }`}>
                {n.label}
              </Link>
            );
          })}
        </nav>
        {children}
      </div>
    </div>
  );
}
