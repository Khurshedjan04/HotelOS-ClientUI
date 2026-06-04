"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast.success("Message sent! Our concierge team will be in touch within 2 hours.");
    setForm({ name: "", email: "", subject: "", message: "" });
    setSending(false);
  };

  return (
    <>
      <Navbar />

      {/* Header */}
      <div className="pt-[72px]">
        <div className="relative h-[280px] flex items-end overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1714 0%, #3d2d20 100%)" }}>
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "repeating-linear-gradient(60deg,rgba(255,255,255,.3) 0,rgba(255,255,255,.3) 1px,transparent 0,transparent 50%)", backgroundSize: "16px 28px" }} />
          <div className="container max-w-[1200px] mx-auto px-6 pb-12 relative">
            <div className="flex items-center gap-2 mb-3 text-white/40 text-sm">
              <Link href="/" className="hover:text-white/70">Home</Link>
              <span>›</span>
              <span className="text-white/70">Contact</span>
            </div>
            <h1 className="serif text-4xl text-white font-light"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Get in Touch
            </h1>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Contact info */}
            <div className="space-y-6">
              <div>
                <h2 className="font-semibold text-[var(--text-1)] mb-1">Contact Details</h2>
                <p className="text-sm text-[var(--text-2)] leading-relaxed">
                  Our concierge team is available 24/7 to assist with reservations, special requests, and any questions.
                </p>
              </div>

              {[
                { icon: "📍", label: "Address",    value: "123 Grand Avenue\nCity Centre, ST 10001" },
                { icon: "📞", label: "Phone",      value: "+1 (800) GRAND-STAY\n+1 (800) 472-6378" },
                { icon: "✉️", label: "Email",      value: "reservations@grandstay.com\nconcierge@grandstay.com" },
                { icon: "🕐", label: "Concierge",  value: "Available 24 hours a day\n7 days a week" },
              ].map((c) => (
                <div key={c.label} className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--gold-pale)] flex items-center justify-center text-lg shrink-0">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-[var(--text-3)] uppercase tracking-wide mb-0.5">{c.label}</p>
                    <p className="text-sm text-[var(--text-1)] whitespace-pre-line leading-relaxed">{c.value}</p>
                  </div>
                </div>
              ))}

              {/* Map placeholder */}
              <div className="h-48 rounded-2xl overflow-hidden relative border border-[var(--border)]"
                style={{ background: "linear-gradient(135deg, #e5e0d5, #d0c8b8)" }}>
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='1' height='40' x='20' fill='rgba(0,0,0,.15)'/%3E%3Crect width='40' height='1' y='20' fill='rgba(0,0,0,.15)'/%3E%3C/svg%3E\")",
                  }} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-6 h-8 bg-[var(--gold)] rounded-full rounded-b-none mb-1 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <p className="text-xs font-semibold text-[var(--text-1)]">GrandStay Hotel</p>
                  <p className="text-[10px] text-[var(--text-3)]">123 Grand Avenue</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-[var(--border)] rounded-2xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-semibold text-[var(--text-1)] text-lg mb-1">Send a Message</h2>
                <p className="text-sm text-[var(--text-2)] mb-6">
                  We respond to all enquiries within 2 hours during business hours.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label>Full Name</label>
                      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Jane Smith" required />
                    </div>
                    <div>
                      <label>Email Address</label>
                      <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com" required />
                    </div>
                  </div>

                  <div>
                    <label>Subject</label>
                    <select value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required>
                      <option value="">Select a topic…</option>
                      <option>Reservation Enquiry</option>
                      <option>Special Occasion Planning</option>
                      <option>Corporate & Group Bookings</option>
                      <option>Feedback & Complaints</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div>
                    <label>Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      rows={5}
                      placeholder="How can we assist you?"
                      required
                    />
                  </div>

                  <button type="submit" disabled={sending}
                    className="btn btn-primary w-full sm:w-auto !px-8">
                    {sending ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending…</>
                    ) : "Send Message"}
                  </button>
                </form>
              </div>

              {/* Quick contact cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                {[
                  { icon: "🎉", title: "Events & Weddings", desc: "Plan your perfect celebration at GrandStay" },
                  { icon: "✈️", title: "Airport Transfer",  desc: "Complimentary luxury transfers available" },
                  { icon: "🎁", title: "Gift Vouchers",     desc: "The perfect gift for every occasion" },
                ].map((c) => (
                  <div key={c.title}
                    className="bg-[var(--bg-alt)] rounded-xl p-4 border border-[var(--border)] hover:border-[var(--gold)] transition-colors">
                    <p className="text-xl mb-2">{c.icon}</p>
                    <p className="font-medium text-sm text-[var(--text-1)] mb-0.5">{c.title}</p>
                    <p className="text-xs text-[var(--text-3)]">{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
