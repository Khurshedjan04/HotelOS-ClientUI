import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

function TeamCard({ name, role, bio }: { name: string; role: string; bio: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl p-6 text-center hover:border-[var(--gold)] hover:shadow-md transition-all">
      <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-amber-900"
        style={{ background: "linear-gradient(135deg, #fef3c7, #fde68a)" }}>
        {name.split(" ").map((n) => n[0]).join("")}
      </div>
      <h3 className="font-semibold text-[var(--text-1)]">{name}</h3>
      <p className="text-[var(--gold)] text-xs font-medium tracking-wide uppercase mt-0.5 mb-3">{role}</p>
      <p className="text-sm text-[var(--text-2)] leading-relaxed">{bio}</p>
    </div>
  );
}

function TimelineItem({ year, title, desc }: { year: string; title: string; desc: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-[var(--gold)] mt-1 shrink-0" />
        <div className="w-px flex-1 bg-[var(--border)] mt-2" />
      </div>
      <div className="pb-8">
        <span className="text-xs font-semibold text-[var(--gold)] tracking-widest">{year}</span>
        <h3 className="font-semibold text-[var(--text-1)] mt-1">{title}</h3>
        <p className="text-sm text-[var(--text-2)] leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="relative pt-[72px] overflow-hidden">
        <div className="h-[340px] relative flex items-end"
          style={{ background: "linear-gradient(135deg, #1a1714 0%, #3d2d20 50%, #2a2010 100%)" }}>
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "repeating-linear-gradient(45deg,rgba(255,255,255,.3) 0,rgba(255,255,255,.3) 1px,transparent 0,transparent 50%)", backgroundSize: "20px 20px" }} />
          <div className="container max-w-[1200px] mx-auto px-6 pb-12 relative">
            <div className="flex items-center gap-2 mb-3 text-white/40 text-sm">
              <Link href="/" className="hover:text-white/70">Home</Link>
              <span>›</span>
              <span className="text-white/70">About</span>
            </div>
            <h1 className="serif text-4xl text-white font-light"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Our Story
            </h1>
          </div>
        </div>

        {/* Offset card */}
        <div className="container max-w-[1200px] mx-auto px-6 -mt-6 relative z-10">
          <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-lg grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { n: "1987", l: "Year Founded" },
              { n: "150+", l: "Luxury Rooms" },
              { n: "50k+", l: "Guests Hosted" },
              { n: "30+",  l: "Awards Won" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold text-[var(--gold)] serif"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>{s.n}</p>
                <p className="text-sm text-[var(--text-2)] mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Est. 1987</p>
              <h2 className="serif text-3xl text-[var(--text-1)] mb-4"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                A Legacy of Luxury
              </h2>
              <div className="divider" />
              <p className="text-[var(--text-2)] leading-relaxed mb-4">
                GrandStay was founded in 1987 with a single vision: to create a hotel where every guest feels like royalty. What began as a 40-room boutique property in the heart of the city has grown into one of the region's most celebrated luxury destinations.
              </p>
              <p className="text-[var(--text-2)] leading-relaxed mb-4">
                Our founder, Eleanora Chase, believed that true hospitality is a deeply personal art form. That philosophy — that every guest has a story worth honoring — lives on in everything we do, from the handwritten welcome notes to the customized pillow menus.
              </p>
              <p className="text-[var(--text-2)] leading-relaxed">
                Today, GrandStay employs over 300 hospitality professionals who share that same commitment to excellence. We've grown, but we've never lost the warmth and attention to detail that made us who we are.
              </p>
            </div>

            {/* Timeline */}
            <div className="pl-4">
              <h3 className="font-semibold text-[var(--text-1)] mb-6">Our Journey</h3>
              <TimelineItem year="1987" title="The Beginning"
                desc="Eleanora Chase opens a 40-room boutique hotel on Grand Avenue with a vision for personal luxury." />
              <TimelineItem year="1995" title="First Expansion"
                desc="The West Wing opens, doubling capacity and introducing the award-winning Grand Table restaurant." />
              <TimelineItem year="2005" title="The Rooftop Era"
                desc="The rooftop pool and Terrace Bar transform the GrandStay skyline and guest experience." />
              <TimelineItem year="2015" title="Digital Reinvention"
                desc="A complete renovation introduces smart room technology while preserving classic elegance." />
              <TimelineItem year="2024" title="GrandStay Today"
                desc="150+ rooms, 5 dining options, and a full wellness spa — still family-owned, still personal." />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-sm" style={{ background: "var(--bg-alt)" }}>
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="serif text-2xl sm:text-3xl text-[var(--text-1)]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Our Values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: "🤝", title: "Genuine Warmth",   desc: "We treat every guest as we would a cherished friend — with care, honesty, and personal attention." },
              { icon: "💎", title: "Uncompromising Quality", desc: "From Egyptian cotton linens to freshly ground coffee — we never compromise on quality." },
              { icon: "🌱", title: "Sustainability",   desc: "Committed to eco-friendly practices: solar energy, local sourcing, zero single-use plastics." },
              { icon: "✨", title: "Timeless Elegance", desc: "Our aesthetic is timeless, not trendy — classic luxury that endures beyond any season." },
            ].map((v) => (
              <div key={v.title} className="bg-white rounded-2xl border border-[var(--border)] p-6">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-semibold text-[var(--text-1)] mb-2">{v.title}</h3>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-3">Leadership</p>
            <h2 className="serif text-3xl text-[var(--text-1)]"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Meet Our Team
            </h2>
            <div className="divider divider-center mt-4" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <TeamCard name="Eleanora Chase" role="Founder & Chairwoman"
              bio="The visionary behind GrandStay. 40 years of hotel excellence, still personally involved in every major decision." />
            <TeamCard name="Marcus Webb" role="General Manager"
              bio="15 years with leading luxury hotel chains. Marcus ensures every guest's stay is flawless from arrival to departure." />
            <TeamCard name="Isabelle Laurent" role="Executive Chef"
              bio="Classically trained in Paris, Isabelle leads the culinary team with a passion for seasonal and local ingredients." />
            <TeamCard name="David Park" role="Head of Guest Experience"
              bio="David's team ensures every touchpoint — from check-in to room service — exceeds the highest expectations." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm" style={{ background: "var(--gold-dark)" }}>
        <div className="container max-w-[1200px] mx-auto px-6 text-center">
          <h2 className="serif text-2xl sm:text-3xl text-white mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Ready to Experience GrandStay?
          </h2>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            Join thousands of guests who have made GrandStay their home away from home.
          </p>
          <Link href="/rooms" className="btn bg-white text-[var(--gold-dark)] hover:bg-[var(--gold-pale)] font-semibold !px-8 !py-3">
            Browse Rooms
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
