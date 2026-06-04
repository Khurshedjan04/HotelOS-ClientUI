"use client";
import { useEffect, useState } from "react";

export default function CountdownTimer({ expiresAt, onExpired }: { expiresAt: string; onExpired?: () => void }) {
  const [secs, setSecs] = useState(0);

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000));
      setSecs(diff);
      if (diff === 0) onExpired?.();
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [expiresAt, onExpired]);

  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const urgent = secs < 120;

  return (
    <span className={`font-mono font-bold tabular-nums ${urgent ? "text-red-600" : "text-amber-700"}`}>
      {m}:{String(s).padStart(2, "0")}
    </span>
  );
}
