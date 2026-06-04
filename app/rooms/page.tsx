"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SearchWidget from "@/components/SearchWidget";
import RoomCard from "@/components/RoomCard";
import { useRoomStore } from "@/store/roomStore";
import type { RoomResult, RoomStyle } from "@/lib/api";

const SORT_OPTIONS = ["default", "price-asc", "price-desc", "capacity"] as const;
type SortKey = typeof SORT_OPTIONS[number];

function sortRooms(rooms: RoomResult[], key: SortKey): RoomResult[] {
  return [...rooms].sort((a, b) => {
    if (key === "price-asc")   return a.pricePerNight - b.pricePerNight;
    if (key === "price-desc")  return b.pricePerNight - a.pricePerNight;
    if (key === "capacity")    return b.capacity - a.capacity;
    return 0;
  });
}

export default function RoomsPage() {
  const { results, loading, search, checkIn, checkOut } = useRoomStore();
  const [sort, setSort] = useState<SortKey>("default");
  const [capacityMin, setCapacityMin] = useState(1);
  const [priceMax, setPriceMax] = useState(2000);

  useEffect(() => { if (results.length === 0) search(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const nights = Math.max(1, Math.round(
    (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86_400_000
  ));

  const filtered = sortRooms(
    results.filter((r) => r.capacity >= capacityMin && r.pricePerNight <= priceMax),
    sort
  );

  return (
    <>
      <Navbar />
      <div className="pt-[72px]">

        {/* Page header */}
        <div className="relative py-16 mb-6 overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1a1714 0%, #2d2420 100%)" }}>
          <div className="absolute inset-0 opacity-[0.05]"
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }} />
          <div className="container max-w-[1200px] mx-auto px-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <a href="/" className="text-white/40 text-sm hover:text-white/70 transition-colors">Home</a>
              <span className="text-white/20">›</span>
              <span className="text-white/70 text-sm">Rooms & Suites</span>
            </div>
            <h1 className="serif text-3xl sm:text-4xl text-white mb-2 font-light"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              Rooms & Suites
            </h1>
            <p className="text-white/45 text-sm">
              {loading ? "Finding available rooms…" : `${results.length} rooms available · ${nights} night${nights !== 1 ? "s" : ""}`}
            </p>
          </div>
        </div>

        <div className="container max-w-[1200px] mx-auto px-6 py-8">
          {/* Search */}
          <div className="mb-6">
            <SearchWidget compact />
          </div>

          <div className="flex flex-col lg:flex-row gap-6">

            {/* Sidebar filters */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-white rounded-2xl border border-[var(--border)] p-5 sticky top-20 space-y-6">
                <h3 className="font-semibold text-[var(--text-1)] text-sm">Filters</h3>

                <div>
                  <label className="!normal-case !tracking-normal !text-xs !text-[var(--text-2)] mb-2 block">
                    Sort by
                  </label>
                  <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}
                    className="!text-sm !py-2">
                    <option value="default">Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="capacity">Most Guests First</option>
                  </select>
                </div>

                <div>
                  <label className="!normal-case !tracking-normal !text-xs !text-[var(--text-2)] block mb-2">
                    Min. Capacity: {capacityMin} guest{capacityMin !== 1 ? "s" : ""}
                  </label>
                  <input type="range" min={1} max={6} value={capacityMin}
                    onChange={(e) => setCapacityMin(Number(e.target.value))}
                    className="!border-0 !shadow-none !p-0 accent-amber-600 cursor-pointer" />
                </div>

                <div>
                  <label className="!normal-case !tracking-normal !text-xs !text-[var(--text-2)] block mb-2">
                    Max Price: ${priceMax}/night
                  </label>
                  <input type="range" min={50} max={2000} step={50} value={priceMax}
                    onChange={(e) => setPriceMax(Number(e.target.value))}
                    className="!border-0 !shadow-none !p-0 accent-amber-600 cursor-pointer" />
                </div>

                {(capacityMin > 1 || priceMax < 2000) && (
                  <button onClick={() => { setCapacityMin(1); setPriceMax(2000); }}
                    className="text-xs text-[var(--gold)] hover:underline">
                    Clear filters
                  </button>
                )}

                {/* Live badge */}
                <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-soft)]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-[var(--text-3)]">Live availability</span>
                </div>
              </div>
            </aside>

            {/* Room grid */}
            <div className="flex-1">
              {loading ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-52 bg-[var(--bg-alt)]" />
                      <div className="p-5 space-y-2">
                        <div className="h-4 bg-[var(--bg-alt)] rounded w-1/2" />
                        <div className="h-3 bg-[var(--bg-alt)] rounded w-1/3" />
                        <div className="h-10 bg-[var(--bg-alt)] rounded-xl mt-3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-[var(--border)]">
                  <p className="text-[var(--text-2)] mb-2">No rooms match your filters.</p>
                  <button onClick={() => { setCapacityMin(1); setPriceMax(2000); }}
                    className="text-sm text-[var(--gold)] hover:underline">Reset filters</button>
                </div>
              ) : (
                <>
                  <p className="text-sm text-[var(--text-3)] mb-4">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
                  <div className="grid sm:grid-cols-2 gap-5">
                    {filtered.map((r) => <RoomCard key={r.id} room={r} nights={nights} />)}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
