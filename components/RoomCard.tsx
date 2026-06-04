"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { RoomResult } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import toast from "react-hot-toast";

const ROOM_PHOTOS: Record<string, string[]> = {
  Standard: [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=500&fit=crop&auto=format&q=80",
  ],
  Deluxe: [
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=500&fit=crop&auto=format&q=80",
  ],
  FamilySuite: [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=500&fit=crop&auto=format&q=80",
  ],
  BusinessSuite: [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&h=500&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=500&fit=crop&auto=format&q=80",
  ],
};

function getRoomPhoto(style: string, roomNumber: string): string {
  const photos = ROOM_PHOTOS[style] ?? ROOM_PHOTOS.Standard;
  const idx = roomNumber.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % photos.length;
  return photos[idx];
}

const AMENITIES: Record<string, string[]> = {
  Standard:      ["King Bed", "City View", "Free WiFi", "32\" TV"],
  Deluxe:        ["King Bed", "Garden View", "Mini Bar", "Sofa"],
  FamilySuite:   ["2 King Beds", "Living Room", "Kitchenette", "Balcony"],
  BusinessSuite: ["King Bed", "Work Desk", "Lounge Area", "Express Check-in"],
};

interface Props {
  room: RoomResult;
  nights?: number;
  featured?: boolean;
}

export default function RoomCard({ room, nights = 1, featured = false }: Props) {
  const router  = useRouter();
  const user    = useAuthStore((s) => s.user);
  const { checkIn, checkOut } = useRoomStore();

  const total     = (room.pricePerNight * nights).toFixed(0);
  const amenities = AMENITIES[room.style] ?? ["King Bed", "Free WiFi"];

  const handleBook = () => {
    if (!user) {
      toast.error("Please sign in to reserve a room");
      router.push("/auth/login");
      return;
    }
    const p = new URLSearchParams({ roomId: room.id, checkIn, checkOut });
    router.push(`/reserve?${p}`);
  };

  return (
    <div className={`card group ${featured ? "lg:flex" : ""}`}>
      {/* Photo */}
      <div className={`relative overflow-hidden flex-shrink-0 ${featured ? "lg:w-5/12 min-h-[260px]" : "h-52"}`}>
        <Image
          src={getRoomPhoto(room.style, room.roomNumber)}
          alt={`${room.style} room`}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/92 text-[var(--text-1)] text-[11px] shadow-sm backdrop-blur-sm">
            {room.style.replace(/([A-Z])/g, " $1").trim()}
          </span>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="badge bg-[var(--gold)] text-white text-[11px]">
            ${room.pricePerNight}/night
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`flex flex-col justify-between ${featured ? "flex-1 p-7" : "p-5"}`}>
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className={`font-semibold text-[var(--text-1)] ${featured ? "text-xl serif" : "text-base"}`}>
                Room {room.roomNumber}
              </h3>
              <p className="text-xs text-[var(--text-3)] mt-0.5">
                Floor {room.floor} · {room.capacity} guest{room.capacity !== 1 ? "s" : ""}
                {room.isSmokingAllowed ? " · Smoking" : ""}
              </p>
            </div>
            <div className="text-right shrink-0 ml-3">
              <p className="text-[var(--gold)] font-bold text-lg leading-none">${room.pricePerNight}</p>
              <p className="text-[var(--text-3)] text-[11px]">/ night</p>
            </div>
          </div>

          {room.description && (
            <p className="text-sm text-[var(--text-2)] mb-3 line-clamp-2 leading-relaxed">
              {room.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities.map((a) => (
              <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-[var(--bg-alt)] text-[var(--text-2)]">
                {a}
              </span>
            ))}
          </div>

          {nights > 1 && (
            <p className="text-sm text-[var(--text-2)] mb-3">
              {nights} night{nights !== 1 ? "s" : ""} ·{" "}
              <strong className="text-[var(--text-1)]">${total} total</strong>
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-2">
          <Link href={`/rooms/${room.id}`}
            className="btn btn-outline text-sm flex-1 !py-2">
            Details
          </Link>
          <button onClick={handleBook}
            className="btn btn-primary text-sm flex-1 !py-2">
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}
