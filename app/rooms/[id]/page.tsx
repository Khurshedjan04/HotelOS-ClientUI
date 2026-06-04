"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchWidget from "@/components/SearchWidget";
import { roomsApi } from "@/lib/api";
import type { RoomResult } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import toast from "react-hot-toast";
import Link from "next/link";

const AMENITIES_BY_STYLE: Record<string, { icon: string; label: string }[]> = {
  Standard: [
    { icon: "🛏️", label: "King Bed" }, { icon: "🌐", label: "Free WiFi" },
    { icon: "📺", label: '32" Smart TV' }, { icon: "🚿", label: "Rain Shower" },
    { icon: "☕", label: "Coffee Machine" }, { icon: "❄️", label: "Climate Control" },
  ],
  Deluxe: [
    { icon: "🛏️", label: "King Bed" }, { icon: "🌐", label: "Free WiFi" },
    { icon: "📺", label: '55" Smart TV' }, { icon: "🛁", label: "Soaking Tub" },
    { icon: "🥂", label: "Mini Bar" }, { icon: "🛋️", label: "Lounge Sofa" },
    { icon: "☕", label: "Nespresso" }, { icon: "🪟", label: "Garden View" },
  ],
  FamilySuite: [
    { icon: "🛏️", label: "2 King Beds" }, { icon: "🌐", label: "Free WiFi" },
    { icon: "📺", label: '65" Smart TV' }, { icon: "🛁", label: "Jacuzzi" },
    { icon: "🍳", label: "Kitchenette" }, { icon: "🛋️", label: "Living Room" },
    { icon: "🪟", label: "Private Balcony" }, { icon: "🧸", label: "Kids Welcome" },
  ],
  BusinessSuite: [
    { icon: "🛏️", label: "King Bed" }, { icon: "🌐", label: "Fibre WiFi" },
    { icon: "💼", label: "Work Desk" }, { icon: "🖨️", label: "Printer Access" },
    { icon: "🛋️", label: "Meeting Area" }, { icon: "☕", label: "Coffee Station" },
    { icon: "⚡", label: "Express Check-in" }, { icon: "🎩", label: "Butler Service" },
  ],
};

function RoomDetailContent() {
  const params  = useParams();
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);
  const { checkIn, checkOut } = useRoomStore();
  const [room, setRoom] = useState<RoomResult | null>(null);
  const [loading, setLoading] = useState(true);

  const nights = Math.max(1, Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000
  ));

  useEffect(() => {
    if (params?.id) {
      roomsApi.getById(String(params.id))
        .then(setRoom)
        .catch(() => toast.error("Room not found"))
        .finally(() => setLoading(false));
    }
  }, [params?.id]);

  const handleBook = () => {
    if (!user) { toast.error("Please sign in to reserve"); router.push("/auth/login"); return; }
    if (!room) return;
    const p = new URLSearchParams({ roomId: room.id, checkIn, checkOut });
    router.push(`/reserve?${p}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!room) return null;

  const amenities = AMENITIES_BY_STYLE[room.style] ?? AMENITIES_BY_STYLE.Standard;
  const totalStr  = (room.pricePerNight * nights).toFixed(0);

  const STYLE_PHOTOS: Record<string, string[]> = {
    Standard:      ["1631049307264-da0ec9d70304","1618773928121-c32242e63f39","1566665797739-1674de7a421a"],
    Deluxe:        ["1590490360182-c33d57733427","1560347876-aeef00ee58a1","1582719478250-c89cae4dc85b"],
    FamilySuite:   ["1611892440504-42a792e24d32","1578683010236-d716f9a3f461"],
    BusinessSuite: ["1522771739844-6a9f6d5f14af","1520250497591-112f2f40a3f4"],
  };
  const stylePhotos = STYLE_PHOTOS[room.style] ?? STYLE_PHOTOS.Standard;
  const mainPhoto   = `https://images.unsplash.com/photo-${stylePhotos[0]}?w=900&h=500&fit=crop&auto=format&q=80`;
  const thumbPhoto1 = `https://images.unsplash.com/photo-${stylePhotos[1] ?? stylePhotos[0]}?w=450&h=280&fit=crop&auto=format&q=75`;
  const thumbPhoto2 = `https://images.unsplash.com/photo-${stylePhotos[2] ?? stylePhotos[0]}?w=450&h=280&fit=crop&auto=format&q=75`;

  return (
    <div className="pt-[72px]">
      {/* Breadcrumb */}
      <div className="border-b border-[var(--border)] bg-white">
        <div className="container max-w-[1200px] mx-auto px-6 py-3 flex items-center gap-2 text-sm text-[var(--text-3)]">
          <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/rooms" className="hover:text-[var(--gold)] transition-colors">Rooms</Link>
          <span>›</span>
          <span className="text-[var(--text-2)]">Room {room.roomNumber}</span>
        </div>
      </div>

      <div className="container max-w-[1200px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: details */}
          <div className="lg:col-span-2">
            {/* Gallery */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="col-span-2 h-72 rounded-2xl overflow-hidden">
                <img src={mainPhoto} alt={`${room.style} room`} className="w-full h-full object-cover" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden">
                <img src={thumbPhoto1} alt="Room view" className="w-full h-full object-cover" />
              </div>
              <div className="h-40 rounded-xl overflow-hidden">
                <img src={thumbPhoto2} alt="Room detail" className="w-full h-full object-cover" />
              </div>
            </div>

            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="badge bg-[var(--gold-pale)] text-[var(--gold-dark)] text-[11px]">
                    {room.style.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                  <span className="text-xs text-[var(--text-3)]">Room {room.roomNumber}</span>
                </div>
                <h1 className="serif text-2xl sm:text-3xl text-[var(--text-1)]"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
                  {room.style === "FamilySuite" ? "Family Suite" :
                   room.style === "BusinessSuite" ? "Business Suite" :
                   room.style} — Floor {room.floor}
                </h1>
                <p className="text-[var(--text-3)] mt-1">
                  Up to {room.capacity} guests
                  {room.isSmokingAllowed ? " · Smoking allowed" : " · Non-smoking"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-[var(--gold)]">${room.pricePerNight}</p>
                <p className="text-sm text-[var(--text-3)]">per night</p>
              </div>
            </div>

            {room.description && (
              <p className="text-[var(--text-2)] leading-relaxed mb-8 text-base">
                {room.description}
              </p>
            )}

            {/* Amenities */}
            <div className="mb-8">
              <h2 className="font-semibold text-[var(--text-1)] mb-4">Room Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {amenities.map((a) => (
                  <div key={a.label}
                    className="flex flex-col items-center gap-2 py-4 px-3 bg-white border border-[var(--border)] rounded-xl text-center hover:border-[var(--gold)] hover:bg-[var(--gold-pale)] transition-all group">
                    <span className="text-2xl">{a.icon}</span>
                    <span className="text-xs text-[var(--text-2)] group-hover:text-[var(--gold-dark)]">{a.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Policies */}
            <div className="bg-[var(--bg-alt)] rounded-2xl p-5">
              <h2 className="font-semibold text-[var(--text-1)] mb-3 text-sm">Policies</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                {[
                  { icon: "🕐", label: "Check-in",    value: "from 3:00 PM" },
                  { icon: "🚪", label: "Check-out",   value: "until 12:00 PM" },
                  { icon: "↩️", label: "Cancellation", value: "48hrs free" },
                ].map((p) => (
                  <div key={p.label}>
                    <p className="text-[var(--text-3)] text-xs mb-0.5">{p.icon} {p.label}</p>
                    <p className="text-[var(--text-1)] font-medium text-sm">{p.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: booking widget */}
          <div>
            <div className="bg-white border border-[var(--border)] rounded-2xl p-6 shadow-md sticky top-20">
              <p className="font-semibold text-[var(--text-1)] mb-1">Check Availability</p>
              <p className="text-xs text-[var(--text-3)] mb-4">Select dates to reserve this room</p>

              <SearchWidget compact />

              <div className="mt-4 bg-[var(--bg-alt)] rounded-xl p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-[var(--text-2)]">${room.pricePerNight} × {nights} night{nights !== 1 ? "s" : ""}</span>
                  <span className="font-semibold">${totalStr}</span>
                </div>
                <div className="flex justify-between text-[var(--text-3)]">
                  <span>Taxes & fees</span>
                  <span>Included</span>
                </div>
                <div className="flex justify-between border-t border-[var(--border)] pt-2 font-bold text-[var(--text-1)]">
                  <span>Total</span>
                  <span className="text-[var(--gold)]">${totalStr}</span>
                </div>
              </div>

              <button onClick={handleBook}
                className="btn btn-primary w-full mt-4">
                Reserve This Room
              </button>

              <p className="text-center text-xs text-[var(--text-3)] mt-3">
                Free cancellation · No hidden fees
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RoomDetailPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <RoomDetailContent />
      </Suspense>
      <Footer />
    </>
  );
}
