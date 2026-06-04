import { format } from "date-fns";
import type { OrderResponse } from "@/lib/api";

const STATUS_STYLES: Record<string, string> = {
  Received:        "bg-amber-100 text-amber-800",
  Preparing:       "bg-blue-100  text-blue-800",
  OutForDelivery:  "bg-violet-100 text-violet-800",
  Delivered:       "bg-emerald-100 text-emerald-800",
};

export default function OrderCard({ order }: { order: OrderResponse }) {
  const st = STATUS_STYLES[order.status] ?? "bg-stone-100 text-stone-600";
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-semibold text-stone-900 text-sm">Order #{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-xs text-stone-500 mt-0.5">{format(new Date(order.createdAt), "MMM d, h:mm a")}</p>
        </div>
        <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${st}`}>{order.status}</span>
      </div>
      <ul className="space-y-1 mb-3">
        {order.items.map((item, i) => (
          <li key={i} className="flex justify-between text-sm">
            <span className="text-stone-700">{item.quantity}× {item.menuItemName}</span>
            <span className="text-stone-500">${item.subtotal.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between pt-2 border-t border-stone-100">
        <span className="text-sm text-stone-500">Total</span>
        <span className="font-semibold text-amber-700">${order.totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
}
