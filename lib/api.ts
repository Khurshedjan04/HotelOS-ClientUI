// const BASE = process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:5000";
const BASE = "https://hotelos-gateway.azurewebsites.net"

function token(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("hotelos_client_token");
}

async function req<T>(path: string, init: RequestInit = {}): Promise<T> {
  const t = token();
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
      ...(init.headers ?? {}),
    },
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const b = await res.json(); msg = b.message ?? msg; } catch { /* */ }
    throw new Error(msg);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const get  = <T>(p: string) => req<T>(p, { method: "GET" });
const post = <T>(p: string, body?: unknown) =>
  req<T>(p, { method: "POST", body: body !== undefined ? JSON.stringify(body) : undefined });

// ── Types ─────────────────────────────────────────────────────────────────────
export type RoomStyle = "Standard" | "Deluxe" | "FamilySuite" | "BusinessSuite";

export interface RoomResult {
  id: string; roomNumber: string; floor: number;
  style: RoomStyle; status: string;
  pricePerNight: number; capacity: number;
  isSmokingAllowed: boolean; description: string;
  nextAvailableFrom: string;
}

export interface BookingResponse {
  id: string; guestId: string; roomId: string; roomNumber: string;
  checkIn: string; checkOut: string; effectiveCheckout: string;
  status: string; totalPrice: number; expiresAt: string; createdAt: string;
  penaltyType: string;
}

export interface PaymentResponse {
  id: string; bookingId: string; amount: number; currency: string;
  status: string; clientSecret: string | null; gatewayRef: string | null; createdAt: string;
}

export interface OrderItemRes { menuItemId: string; menuItemName: string; quantity: number; unitPrice: number; subtotal: number; }
export interface OrderResponse  {
  id: string; bookingId: string; roomId: string; guestId: string;
  status: string; totalPrice: number; createdAt: string; items: OrderItemRes[];
}

export interface MenuItem {
  id: string; name: string; description: string;
  price: number; category: string; isAvailable: boolean;
}

export interface AuthUser {
  id: string; email: string; role: string; token: string; expiresAt: string;
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    post<AuthUser>("/api/auth/login", { email, password }),

  register: (b: { email: string; password: string; firstName: string; lastName: string; phone: string }) =>
    post<{ id: string; email: string; role: string }>("/api/users/client", b),

  changePassword: (userId: string, currentPassword: string, newPassword: string) =>
    post<{ message: string }>(`/api/users/${userId}/change-password`, { currentPassword, newPassword }),
};

// ── Rooms ─────────────────────────────────────────────────────────────────────
export const roomsApi = {
  search: (checkIn: string, checkOut: string, style?: RoomStyle) => {
    const p = new URLSearchParams({ checkIn, checkOut });
    if (style) p.set("style", style);
    return get<RoomResult[]>(`/api/rooms/search?${p}`);
  },
  getById: (id: string) => get<RoomResult>(`/api/rooms/${id}`),
};

// ── Bookings ──────────────────────────────────────────────────────────────────
export const bookingsApi = {
  create: (roomId: string, checkIn: string, checkOut: string) =>
    post<BookingResponse>("/api/bookings", { roomId, checkIn, checkOut }),

  getMyBookings: (guestId: string) =>
    get<BookingResponse[]>(`/api/bookings/guest/${guestId}`),

  getById: (id: string) => get<BookingResponse>(`/api/bookings/${id}`),

  confirm: (id: string) => post<BookingResponse>(`/api/bookings/${id}/confirm`),

  cancel: (id: string) => post<BookingResponse>(`/api/bookings/${id}/cancel`),
};

// ── Payments ──────────────────────────────────────────────────────────────────
export const paymentsApi = {
  initiate: (bookingId: string, amount: number) =>
    post<PaymentResponse>("/api/payments/initiate", { bookingId, amount, currency: "USD" }),

  getByBooking: (bookingId: string) =>
    get<PaymentResponse>(`/api/payments/booking/${bookingId}`),
};

// ── Menu & Orders ─────────────────────────────────────────────────────────────
export const menuApi = {
  getAll: () => get<MenuItem[]>("/api/menu"),
};

export const ordersApi = {
  create: (bookingId: string, roomId: string, items: { menuItemId: string; quantity: number }[]) =>
    post<OrderResponse>("/api/orders", { bookingId, roomId, items }),

  getByBooking: (bookingId: string) =>
    get<OrderResponse[]>(`/api/orders/booking/${bookingId}`),

  getById: (id: string) => get<OrderResponse>(`/api/orders/${id}`),
};
