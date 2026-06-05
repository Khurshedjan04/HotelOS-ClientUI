"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { paymentsApi, bookingsApi } from "@/lib/api";
import type { BookingResponse, PaymentResponse } from "@/lib/api";
import { useBookingStore } from "@/store/bookingStore";
import toast from "react-hot-toast";
import CountdownTimer from "./CountdownTimer";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY ?? "");

interface Props {
  booking: BookingResponse;
  onClose: () => void;
  onPaid:  () => void;
}

/* ── Stripe card form ─────────────────────────────────────────── */
function StripeCardForm({ booking, payment, onPaid }: { booking: BookingResponse; payment: PaymentResponse; onPaid: () => void }) {
  const stripe       = useStripe();
  const elements     = useElements();
  const updateStatus = useBookingStore((s) => s.updateStatus);
  const [paying, setPaying] = useState(false);

  const pollConfirmation = (bookingId: string) => {
    let attempts = 0;
    const poll = setInterval(async () => {
      attempts++;
      try {
        const b = await bookingsApi.getById(bookingId);
        if (b.status === "Confirmed") {
          clearInterval(poll);
          updateStatus(bookingId, "Confirmed");
          toast.success("Booking confirmed!");
          onPaid();
        } else if (attempts >= 10) {
          clearInterval(poll);
          toast("Booking will update shortly.");
          onPaid();
        }
      } catch { clearInterval(poll); onPaid(); }
    }, 2000);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !payment.clientSecret) return;
    setPaying(true);
    try {
      const card = elements.getElement(CardElement);
      if (!card) return;
      const { error, paymentIntent } = await stripe.confirmCardPayment(payment.clientSecret, {
        payment_method: { card },
      });
      if (error) {
        toast.error(error.message ?? "Payment failed. Please try again.");
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment successful! Confirming your booking…");
        pollConfirmation(booking.id);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setPaying(false);
    }
  };

  return (
    <form onSubmit={handlePay} className="px-6 py-5 space-y-4">
      <div>
        <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
          Card Details
        </label>
        <div className="border border-stone-200 rounded-xl p-3.5 bg-white
                        focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-100 transition-all">
          <CardElement options={{
            style: {
              base: {
                fontSize: "15px", color: "#1a1714",
                fontFamily: "system-ui, -apple-system, sans-serif",
                "::placeholder": { color: "#a09388" },
              },
              invalid: { color: "#dc2626" },
            },
          }} />
        </div>
      </div>

      <SecureBadge />

      <button type="submit" disabled={paying || !stripe}
        className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white
                   font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
        {paying ? <><Spin /> Processing…</> : `Pay $${booking.totalPrice.toFixed(2)}`}
      </button>
    </form>
  );
}

/* ── Payment unavailable — shown when no clientSecret returned ── */
function PaymentUnavailable() {
  return (
    <div className="px-6 py-8 text-center space-y-3">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto">
        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <p className="font-semibold text-stone-800">Payment not available</p>
      <p className="text-sm text-stone-500">
        Stripe is not configured. Contact support to complete your booking.
      </p>
    </div>
  );
}

/* ── Modal shell ──────────────────────────────────────────────── */
export default function PaymentModal({ booking, onClose, onPaid }: Props) {
  const [payment, setPayment]       = useState<PaymentResponse | null>(null);
  const [initLoading, setInitLoading] = useState(true);

  const nights = Math.round(
    (new Date(booking.checkOut).getTime() - new Date(booking.checkIn).getTime()) / 86_400_000
  );

  useEffect(() => {
    const init = async () => {
      try {
        // Reuse an existing pending payment — avoids the "already initiated"
        // conflict when the modal is closed and reopened.
        const existing = await paymentsApi.getByBooking(booking.id).catch(() => null);
        if (existing?.clientSecret && existing.status === "Pending") {
          setPayment(existing);
          return;
        }
        // No usable payment yet — create one.
        const p = await paymentsApi.initiate(booking.id, booking.totalPrice);
        setPayment(p);
      } catch (e: unknown) {
        toast.error(e instanceof Error ? e.message : "Could not initialise payment");
      } finally {
        setInitLoading(false);
      }
    };
    init();
  }, [booking.id, booking.totalPrice]);

  const formContent = initLoading ? (
    <div className="px-6 py-10 flex justify-center">
      <div className="animate-spin w-7 h-7 border-2 border-amber-600 border-t-transparent rounded-full" />
    </div>
  ) : payment?.clientSecret ? (
    <Elements stripe={stripePromise}>
      <StripeCardForm booking={booking} payment={payment} onPaid={onPaid} />
    </Elements>
  ) : (
    <PaymentUnavailable />
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-stone-900 text-lg">Complete Payment</h2>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-600 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
              </svg>
            </button>
          </div>
          {booking.status === "PendingPayment" && (
            <p className="text-sm text-stone-500 mt-1">
              Reservation held for{" "}
              <CountdownTimer expiresAt={booking.expiresAt} onExpired={onClose} />
              {" "}— complete payment to confirm.
            </p>
          )}
        </div>

        {/* Booking summary */}
        <div className="px-6 py-4 bg-amber-50 border-b border-amber-100">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-stone-600">Room {booking.roomNumber}</span>
            <span className="text-stone-900 font-medium">{nights} night{nights !== 1 ? "s" : ""}</span>
          </div>
          <p className="text-stone-500 text-sm mb-1">
            {new Date(booking.checkIn).toLocaleDateString()} → {new Date(booking.checkOut).toLocaleDateString()}
          </p>
          <div className="flex justify-between font-bold mt-2 pt-2 border-t border-amber-200">
            <span className="text-stone-800">Total</span>
            <span className="text-amber-700 text-lg">${booking.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {formContent}
      </div>
    </div>
  );
}

function Spin() {
  return <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />;
}

function SecureBadge() {
  return (
    <p className="text-xs text-stone-400 flex items-center gap-1.5">
      <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
      </svg>
      Payments processed securely via Stripe
    </p>
  );
}
