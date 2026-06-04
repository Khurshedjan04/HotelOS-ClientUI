"use client";
import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { useBookingStore } from "@/store/bookingStore";
import { menuApi, ordersApi } from "@/lib/api";
import type { MenuItem, OrderResponse, BookingResponse } from "@/lib/api";
import OrderCard from "@/components/OrderCard";
import { connect } from "@/lib/signalr";

export default function OrdersPage() {
  const user    = useAuthStore((s) => s.user)!;
  const { bookings, fetchMyBookings } = useBookingStore();

  const [menu, setMenu]         = useState<MenuItem[]>([]);
  const [orders, setOrders]     = useState<OrderResponse[]>([]);
  const [cart, setCart]         = useState<Record<string, number>>({});
  const [placing, setPlacing]   = useState(false);
  const [menuLoading, setMenuLoading] = useState(true);

  // Active booking = room service is enabled
  const activeBooking: BookingResponse | undefined = bookings.find((b) => b.status === "Active");

  useEffect(() => {
    fetchMyBookings(user.id);
    menuApi.getAll().then((items) => setMenu(items.filter((i) => i.isAvailable))).finally(() => setMenuLoading(false));
  }, [user.id, fetchMyBookings]);

  // Poll bookings every 20 s so the page activates as soon as receptionist checks the guest in
  useEffect(() => {
    const id = setInterval(() => fetchMyBookings(user.id), 20_000);
    return () => clearInterval(id);
  }, [user.id, fetchMyBookings]);

  // Load existing orders for the active booking
  const loadOrders = useCallback(async () => {
    if (!activeBooking) return;
    try {
      const os = await ordersApi.getByBooking(activeBooking.id);
      setOrders(os);
    } catch { /* */ }
  }, [activeBooking]);

  useEffect(() => { loadOrders(); }, [loadOrders]);

  // Real-time order status via SignalR
  useEffect(() => {
    let conn: import("@microsoft/signalr").HubConnection | null = null;
    const setup = async () => {
      try {
        conn = await connect();
        conn.on("OrderUpdated", async () => { await loadOrders(); });
      } catch { /* */ }
    };
    setup();
    return () => { conn?.off("OrderUpdated"); };
  }, [loadOrders]);

  const addToCart = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  const removeFromCart = (id: string) => setCart((c) => {
    if ((c[id] ?? 0) <= 1) { const n = { ...c }; delete n[id]; return n; }
    return { ...c, [id]: c[id] - 1 };
  });

  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = menu.find((m) => m.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const placeOrder = async () => {
    if (!activeBooking || cartCount === 0) return;
    setPlacing(true);
    try {
      const items = Object.entries(cart).map(([menuItemId, quantity]) => ({ menuItemId, quantity }));
      const order = await ordersApi.create(activeBooking.id, activeBooking.roomId, items);
      setOrders((prev) => [order, ...prev]);
      setCart({});
      toast.success("Order placed! Kitchen is preparing your items.");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order");
    } finally { setPlacing(false); }
  };

  // Group menu by category
  const categories = Array.from(new Set(menu.map((m) => m.category)));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-stone-900">Room Service</h1>
        {activeBooking && (
          <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
            Room {activeBooking.roomNumber} · Active
          </span>
        )}
      </div>

      {!activeBooking ? (
        <div className="text-center py-20 bg-white border border-stone-200 rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <p className="font-medium text-stone-700 mb-1">Room service is available after check-in</p>
          <p className="text-stone-400 text-sm">You need an active booking to order from our menu.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu */}
          <div className="lg:col-span-2 space-y-6">
            {menuLoading ? (
              <div className="space-y-3">
                {[1,2,3].map((i) => (
                  <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 animate-pulse">
                    <div className="h-4 bg-stone-100 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-stone-100 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : categories.map((cat) => (
              <div key={cat}>
                <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-widest mb-3">{cat}</h3>
                <div className="space-y-2">
                  {menu.filter((m) => m.category === cat).map((item) => (
                    <div key={item.id}
                      className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-900 text-sm">{item.name}</p>
                        <p className="text-xs text-stone-500 truncate">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-semibold text-amber-700 text-sm">${item.price.toFixed(2)}</span>
                        {cart[item.id] ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => removeFromCart(item.id)}
                              className="w-7 h-7 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 text-sm font-bold">−</button>
                            <span className="text-sm font-semibold text-stone-900 w-4 text-center">{cart[item.id]}</span>
                            <button onClick={() => addToCart(item.id)}
                              className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white text-sm font-bold hover:bg-amber-700">+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item.id)}
                            className="px-3 py-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar: cart + recent orders */}
          <div className="space-y-4">
            {/* Cart */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5">
              <h3 className="font-semibold text-stone-900 mb-3 flex items-center justify-between">
                Your Order
                {cartCount > 0 && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{cartCount} item{cartCount !== 1 ? "s" : ""}</span>}
              </h3>
              {cartCount === 0 ? (
                <p className="text-sm text-stone-400 text-center py-4">Add items from the menu</p>
              ) : (
                <>
                  <div className="space-y-2 mb-4">
                    {Object.entries(cart).map(([id, qty]) => {
                      const item = menu.find((m) => m.id === id);
                      if (!item) return null;
                      return (
                        <div key={id} className="flex justify-between text-sm">
                          <span className="text-stone-700">{qty}× {item.name}</span>
                          <span className="text-stone-500">${(item.price * qty).toFixed(2)}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between font-semibold border-t border-stone-100 pt-3 mb-4">
                    <span className="text-stone-800">Total</span>
                    <span className="text-amber-700">${cartTotal.toFixed(2)}</span>
                  </div>
                  <button onClick={placeOrder} disabled={placing}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
                    {placing ? <Spin/> : null} Place Order
                  </button>
                </>
              )}
            </div>

            {/* Recent orders */}
            {orders.length > 0 && (
              <div>
                <h3 className="font-medium text-stone-700 text-sm mb-2">Recent Orders</h3>
                <div className="space-y-2">
                  {orders.slice(0, 4).map((o) => <OrderCard key={o.id} order={o} />)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Spin() {
  return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}
