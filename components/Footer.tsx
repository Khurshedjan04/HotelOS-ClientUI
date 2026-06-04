import Link from "next/link";

const FOOTER_LINKS = {
  "Hotel": [
    { label: "Our Story",      href: "/about" },
    { label: "Rooms & Suites", href: "/rooms" },
    { label: "Dining",         href: "/#dining" },
    { label: "Amenities",      href: "/#amenities" },
  ],
  "Guest Services": [
    { label: "Book a Room",    href: "/rooms" },
    { label: "My Bookings",    href: "/dashboard/bookings" },
    { label: "Room Service",   href: "/dashboard/orders" },
    { label: "Contact Us",     href: "/contact" },
  ],
  "Policies": [
    { label: "Privacy Policy",       href: "/contact" },
    { label: "Terms & Conditions",   href: "/contact" },
    { label: "Cancellation Policy",  href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer style={{ background: "#1a1714" }} className="text-white">
      <div className="container max-w-[1200px] mx-auto px-6 pt-16 pb-10">

        {/* Top */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-[10px] bg-[var(--gold)] flex items-center justify-center">
                <span className="text-white font-bold" style={{ fontFamily: "Georgia, serif" }}>G</span>
              </div>
              <div>
                <p className="font-bold text-white serif text-lg"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>GrandStay</p>
                <p className="text-[10px] tracking-widest text-white/40 uppercase">Hotel & Suites</p>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-[200px]">
              A sanctuary of elegance and comfort in the heart of the city.
            </p>
            <div className="flex gap-3 mt-5">
              {["Instagram", "Facebook", "Twitter"].map((s) => (
                <button key={s}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/40 hover:border-[var(--gold)] hover:text-[var(--gold-mid)] transition-colors text-xs">
                  {s[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-4">{group}</p>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href}
                      className="text-sm text-white/55 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-b border-white/10 text-sm text-white/50">
          <div className="flex items-center gap-3">
            <span className="text-[var(--gold-mid)]">📍</span>
            <span>123 Grand Avenue, City Center</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--gold-mid)]">📞</span>
            <span>+1 (800) 427-6378</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[var(--gold-mid)]">✉️</span>
            <span>reservations@grandstay.com</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8 text-xs text-white/30">
          <p>© {new Date().getFullYear()} GrandStay Hotel & Suites. All rights reserved.</p>
          <p>Powered by HotelOS</p>
        </div>
      </div>
    </footer>
  );
}
