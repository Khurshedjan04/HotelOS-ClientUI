"use client";
import { useRoomStore } from "@/store/roomStore";
import type { RoomStyle } from "@/lib/api";

const STYLES: { value: RoomStyle | ""; label: string }[] = [
  { value: "",             label: "Any style" },
  { value: "Standard",    label: "Standard" },
  { value: "Deluxe",      label: "Deluxe" },
  { value: "FamilySuite", label: "Family Suite" },
  { value: "BusinessSuite", label: "Business Suite" },
];

export default function SearchForm() {
  const { checkIn, checkOut, style, loading, setDates, setStyle, search } = useRoomStore();

  const today    = new Date().toISOString().split("T")[0];
  const minOut   = checkIn > today ? checkIn : today;

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); search(); };

  return (
    <form onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg border border-stone-200 p-4 sm:p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label>Check-in</label>
          <input type="date" value={checkIn} min={today}
            onChange={(e) => setDates(e.target.value, checkOut)} required />
        </div>
        <div>
          <label>Check-out</label>
          <input type="date" value={checkOut} min={minOut}
            onChange={(e) => setDates(checkIn, e.target.value)} required />
        </div>
        <div>
          <label>Room Type</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as RoomStyle | "")}>
            {STYLES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <button type="submit" disabled={loading}
            className="w-full h-[42px] bg-amber-600 hover:bg-amber-700 disabled:opacity-60
                       text-white font-semibold rounded-lg transition-colors text-sm flex items-center justify-center gap-2">
            {loading ? (
              <><Spinner /> Searching…</>
            ) : "Search Rooms"}
          </button>
        </div>
      </div>
    </form>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
  );
}
