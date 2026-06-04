"use client";
import { useRouter } from "next/navigation";
import { useRoomStore } from "@/store/roomStore";
import type { RoomStyle } from "@/lib/api";

const STYLES: { value: RoomStyle | ""; label: string }[] = [
  { value: "",              label: "Any style"      },
  { value: "Standard",     label: "Standard"       },
  { value: "Deluxe",       label: "Deluxe"         },
  { value: "FamilySuite",  label: "Family Suite"   },
  { value: "BusinessSuite",label: "Business Suite" },
];

export default function SearchWidget({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { checkIn, checkOut, style, loading, setDates, setStyle, search } = useRoomStore();

  const today   = new Date().toISOString().split("T")[0];
  const minOut  = checkIn > today ? checkIn : today;

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await search();
    router.push("/rooms");
  };

  if (compact) {
    return (
      <form onSubmit={handleSearch}
        className="flex flex-wrap gap-2 items-end p-3 bg-white rounded-2xl border border-[var(--border)] shadow-md">
        <div className="flex-1 min-w-[120px]">
          <label className="text-[10px]">Check-in</label>
          <input type="date" value={checkIn} min={today}
            onChange={(e) => setDates(e.target.value, checkOut)}
            className="!py-1.5 !text-sm" required />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="text-[10px]">Check-out</label>
          <input type="date" value={checkOut} min={minOut}
            onChange={(e) => setDates(checkIn, e.target.value)}
            className="!py-1.5 !text-sm" required />
        </div>
        <div className="flex-1 min-w-[120px]">
          <label className="text-[10px]">Room Type</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as RoomStyle | "")}
            className="!py-1.5 !text-sm">
            {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <button type="submit" disabled={loading}
          className="btn btn-primary !py-2 !px-5 text-sm shrink-0">
          {loading ? <Spin /> : "Search"}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-sm rounded-2xl p-5 sm:p-6 shadow-xl border border-white/50">
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div>
          <label className="!text-[var(--text-2)]">Check-in</label>
          <input type="date" value={checkIn} min={today}
            onChange={(e) => setDates(e.target.value, checkOut)} required />
        </div>
        <div>
          <label className="!text-[var(--text-2)]">Check-out</label>
          <input type="date" value={checkOut} min={minOut}
            onChange={(e) => setDates(checkIn, e.target.value)} required />
        </div>
        <div>
          <label className="!text-[var(--text-2)]">Room Type</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as RoomStyle | "")}>
            {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={loading}
            className="btn btn-primary w-full h-[46px]">
            {loading ? <><Spin />Searching…</> : "Check Availability"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Spin() {
  return (
    <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
  );
}
