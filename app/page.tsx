"use client";
import { useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchWidget from "@/components/SearchWidget";
import RoomCard from "@/components/RoomCard";
import { useRoomStore } from "@/store/roomStore";

/* ── Amenity icon ─────────────────────────────────────────── */
function AmenityItem({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-white border border-[var(--border)] hover:border-[var(--gold)] hover:shadow-md transition-all group">
      <div className="w-14 h-14 rounded-full bg-[var(--gold-pale)] flex items-center justify-center text-2xl mb-4 group-hover:bg-[var(--gold)] group-hover:text-white transition-all">
        {icon}
      </div>
      <h3 className="font-semibold text-[var(--text-1)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--text-2)] leading-relaxed">{desc}</p>
    </div>
  );
}

/* ── Testimonial card ─────────────────────────────────────── */
function Testimonial({ name, country, text, stars }: { name: string; country: string; text: string; stars: number }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-sm">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: stars }).map((_, i) => (
          <span key={i} className="text-[var(--gold-mid)] text-lg">★</span>
        ))}
      </div>
      <p className="text-[var(--text-2)] text-sm leading-relaxed mb-5 italic">"{text}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center font-bold text-amber-900 text-sm">
          {name[0]}
        </div>
        <div>
          <p className="font-semibold text-[var(--text-1)] text-sm">{name}</p>
          <p className="text-[var(--text-3)] text-xs">{country}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Stat ─────────────────────────────────────────────────── */
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-3xl sm:text-4xl font-bold text-white serif mb-1"
        style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{value}</p>
      <p className="text-white/55 text-sm tracking-wide">{label}</p>
    </div>
  );
}

export default function LandingPage() {
  const { results, loading, search } = useRoomStore();

  useEffect(() => { search(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const featured = results.slice(0, 3);

  return (
    <>
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1a1714 0%, #2d2420 35%, #3d3028 60%, #2a2218 100%)",
          }} />
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
        {/* Gold accent blob */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: "radial-gradient(circle, #d97706, transparent)" }} />

        <div className="relative container max-w-[1200px] mx-auto px-6 pt-28 pb-16">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-[var(--gold-mid)]" />
              <span className="text-[var(--gold-mid)] text-xs font-semibold tracking-[0.25em] uppercase">
                Luxury Hotel & Suites
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-white leading-[1.1] mb-6 font-light"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}>
              Where Every Stay
              <br />
              <em className="not-italic text-[var(--gold-mid)]">Becomes a Memory</em>
            </h1>

            <p className="text-white/55 text-lg leading-relaxed mb-10 max-w-xl font-light">
              Experience the perfect blend of timeless elegance and modern comfort.
              From city-view rooms to family suites — your sanctuary awaits.
            </p>

            {/* Search widget */}
            <SearchWidget />

            {/* Scroll hint */}
            <div className="flex items-center gap-4 mt-10">
              <Link href="/rooms" className="text-white/40 text-sm hover:text-white/70 transition-colors flex items-center gap-2">
                <span>Explore all rooms</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </Link>
              <span className="text-white/15">·</span>
              <Link href="/about" className="text-white/40 text-sm hover:text-white/70 transition-colors">
                Our Story
              </Link>
            </div>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute bottom-8 right-6 hidden lg:flex flex-col gap-3">
          {[
            { n: "4.9★",   l: "Guest Rating" },
            { n: "150+",   l: "Rooms & Suites" },
            { n: "24/7",   l: "Concierge Service" },
          ].map((s) => (
            <div key={s.l} className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-xl px-4 py-2.5 text-right">
              <p className="text-white font-bold text-lg leading-none">{s.n}</p>
              <p className="text-white/45 text-xs mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section style={{ background: "var(--gold-dark)" }}>
        <div className="container max-w-[1200px] mx-auto px-6 py-12">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <Stat value="150+"  label="Luxury Rooms" />
            <Stat value="98%"   label="Guest Satisfaction" />
            <Stat value="25yrs" label="Of Excellence" />
            <Stat value="4.9★"  label="Average Rating" />
          </div>
        </div>
      </section>

      {/* ── Featured Rooms ────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Accommodation</p>
            <h2 className="serif text-3xl sm:text-4xl text-[var(--text-1)] mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Rooms & Suites
            </h2>
            <div className="divider divider-center" />
            <p className="text-[var(--text-2)] max-w-lg mx-auto mt-4 leading-relaxed">
              Every room is a thoughtfully designed sanctuary, blending contemporary luxury with warm hospitality.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map((i) => (
                <div key={i} className="card animate-pulse overflow-hidden">
                  <div className="h-52 bg-[var(--bg-alt)]" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-[var(--bg-alt)] rounded w-2/3" />
                    <div className="h-3 bg-[var(--bg-alt)] rounded w-1/2" />
                    <div className="h-10 bg-[var(--bg-alt)] rounded-xl mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((r) => <RoomCard key={r.id} room={r} />)}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-[var(--border)]">
              <p className="text-[var(--text-3)]">Loading available rooms…</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link href="/rooms" className="btn btn-outline">
              View All Rooms
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Experience split ──────────────────────────────────── */}
      <section className="section" style={{ background: "var(--bg-alt)" }}>
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">The GrandStay Way</p>
              <h2 className="serif text-3xl sm:text-4xl text-[var(--text-1)] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                An Experience Beyond a Stay
              </h2>
              <div className="divider" />
              <p className="text-[var(--text-2)] leading-relaxed mb-6">
                At GrandStay, we believe true luxury lies in the details — the freshly brewed coffee delivered to your room at dawn, the turndown service with handwritten notes, the concierge who remembers your preferences.
              </p>
              <p className="text-[var(--text-2)] leading-relaxed mb-8">
                Our team of hospitality professionals work around the clock to ensure that every moment of your stay exceeds expectations. We don't just provide a room; we craft an experience.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { n: "1987", l: "Established" },
                  { n: "30+", l: "Awards Won" },
                  { n: "50k+", l: "Happy Guests" },
                  { n: "5★", l: "Forbes Rating" },
                ].map((s) => (
                  <div key={s.l} className="bg-white rounded-xl p-4 border border-[var(--border)]">
                    <p className="text-2xl font-bold text-[var(--gold)] serif"
                      style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{s.n}</p>
                    <p className="text-sm text-[var(--text-2)] mt-0.5">{s.l}</p>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn btn-primary">
                Discover Our Story
              </Link>
            </div>

            {/* Decorative grid of photo blocks */}
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
              <div className="space-y-3">
                <div className="h-48 rounded-2xl overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1590490360182-c33d57733427?w=400&h=300&fit=crop&auto=format&q=80"
                    alt="Deluxe room" className="w-full h-full object-cover" />
                </div>
                <div className="h-32 rounded-2xl bg-[var(--gold)] flex items-center justify-center p-5">
                  <p className="text-white font-light text-center text-sm leading-relaxed serif italic"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                    "Crafting memories since 1987"
                  </p>
                </div>
              </div>
              <div className="space-y-3 mt-6">
                <div className="h-32 rounded-2xl overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&h=200&fit=crop&auto=format&q=80"
                    alt="Business suite" className="w-full h-full object-cover" />
                </div>
                <div className="h-48 rounded-2xl overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=400&h=300&fit=crop&auto=format&q=80"
                    alt="Family suite" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Amenities ─────────────────────────────────────────── */}
      <section id="amenities" className="section" style={{ background: "var(--bg)" }}>
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">What We Offer</p>
            <h2 className="serif text-3xl sm:text-4xl text-[var(--text-1)] mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              World-Class Amenities
            </h2>
            <div className="divider divider-center" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: "🌐", title: "Free WiFi",      desc: "High-speed throughout" },
              { icon: "🍽️", title: "Fine Dining",    desc: "Award-winning cuisine" },
              { icon: "🏊", title: "Rooftop Pool",   desc: "Open year-round" },
              { icon: "💆", title: "Spa & Wellness", desc: "Full-service spa" },
              { icon: "🏋️", title: "Fitness Center", desc: "24/7 access" },
              { icon: "🚗", title: "Valet Parking",  desc: "Complimentary" },
            ].map((a) => (
              <AmenityItem key={a.title} {...a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Dining ────────────────────────────────────────────── */}
      <section id="dining" style={{ background: "var(--bg-alt)" }}>
        <div className="container max-w-[1200px] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="h-[420px] rounded-3xl overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&h=500&fit=crop&auto=format&q=80"
                alt="Fine dining restaurant"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
                <span className="text-5xl mb-4">🍷</span>
                <h3 className="serif text-2xl font-light mb-2" style={{ fontFamily: "var(--font-playfair), serif" }}>
                  The Grand Table
                </h3>
                <p className="text-white/75 text-sm">Fine dining restaurant</p>
                <div className="mt-4 flex gap-2">
                  {["Breakfast", "Lunch", "Dinner"].map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-white/15 text-white/80">{t}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Culinary Excellence</p>
              <h2 className="serif text-3xl sm:text-4xl text-[var(--text-1)] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                Dining Redefined
              </h2>
              <div className="divider" />
              <p className="text-[var(--text-2)] leading-relaxed mb-6">
                From the handcrafted breakfast menu to our celebrated five-course dinner, every meal at GrandStay is a culinary journey. Our executive chef sources the finest local and seasonal ingredients.
              </p>

              <div className="space-y-4 mb-8">
                {[
                  { name: "The Grand Table",    desc: "Fine dining, Floors 1–2 · Daily 7am–11pm" },
                  { name: "The Terrace Bar",    desc: "Cocktails & light bites · Rooftop level" },
                  { name: "In-Room Dining",     desc: "24/7 room service for active stays" },
                ].map((d) => (
                  <div key={d.name} className="flex gap-4 items-start p-4 bg-white rounded-xl border border-[var(--border)]">
                    <div className="w-2 h-2 rounded-full bg-[var(--gold)] mt-1.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-[var(--text-1)] text-sm">{d.name}</p>
                      <p className="text-[var(--text-3)] text-xs mt-0.5">{d.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-sm text-[var(--text-3)] italic">
                Room service available for guests with active check-in via the guest portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="section" style={{ background: "var(--bg)" }}>
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Guest Stories</p>
            <h2 className="serif text-3xl sm:text-4xl text-[var(--text-1)] mb-4"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              What Our Guests Say
            </h2>
            <div className="divider divider-center" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <Testimonial
              name="Sophia Williams" country="United Kingdom" stars={5}
              text="Absolutely breathtaking. The Business Suite exceeded every expectation — the views, the service, the dining. We'll be back for our anniversary." />
            <Testimonial
              name="Marco Delgado" country="Spain" stars={5}
              text="The concierge team remembered our preferences from our last visit. That level of personal attention is rare. GrandStay is our home away from home." />
            <Testimonial
              name="Aiko Tanaka" country="Japan" stars={5}
              text="The Family Suite was perfect for our children. Spacious, spotlessly clean, and the in-room dining menu was excellent. Highly recommended." />
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden py-24"
        style={{ background: "linear-gradient(135deg, #1a1714 0%, #3d2d20 50%, #1a1714 100%)" }}>
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E\")" }} />
        <div className="relative container max-w-[1200px] mx-auto px-6 text-center">
          <p className="text-[var(--gold-mid)] text-xs font-semibold tracking-[0.25em] uppercase mb-4">Limited Availability</p>
          <h2 className="serif text-3xl sm:text-5xl text-white mb-6 font-light"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Your Perfect Stay Awaits
          </h2>
          <p className="text-white/50 text-lg mb-10 max-w-xl mx-auto leading-relaxed font-light">
            Reserve your room today and receive complimentary breakfast for two, early check-in, and welcome amenities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rooms" className="btn btn-primary !px-8 !py-3.5 text-base">
              Reserve Your Room
            </Link>
            <Link href="/contact" className="btn text-white border border-white/25 hover:bg-white/10 !px-8 !py-3.5 text-base">
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
