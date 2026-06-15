import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Tag, CreditCard, ShoppingBag, ChevronRight, X, Bike, UtensilsCrossed, Store } from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import orderService from "../../services/orderService";
import couponService from "../../services/couponService";
import formatPrice from "../../utils/formatPrice";
import { TAX_RATE } from "../../constants";

// ── Constants ─────────────────────────────────────────────────
const ORDER_TYPES = [
  { value: "delivery", label: "Delivery", icon: Bike },
  { value: "pickup", label: "Pickup", icon: Store },
  { value: "dine-in", label: "Dine-In", icon: UtensilsCrossed },
];

const PAYMENT_METHODS = [
  { value: "cash", label: "Cash on Delivery" },
  { value: "card", label: "Credit / Debit Card" },
  { value: "jazzcash", label: "JazzCash" },
  { value: "easypaisa", label: "Easypaisa" },
];

// ── Small reusable components ─────────────────────────────────
const SectionLabel = ({ children }) => (
  <p className="text-xs tracking-[0.3em] uppercase text-white/30 mb-4">{children}</p>
);

const Field = ({ label, children }) => (
  <div className="space-y-2">
    <label className="block text-xs text-white/40 uppercase tracking-widest">{label}</label>
    {children}
  </div>
);

const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors";

// ── Main Component ────────────────────────────────────────────
export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotal, getCount, clearCart } = useCartStore();
  const { user } = useAuthStore();

  const [orderType, setOrderType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null); // { code, discountAmount }
  const [couponLoading, setCouponLoading] = useState(false);
  const [placing, setPlacing] = useState(false);

  const subtotal = getTotal();
  const tax = subtotal * TAX_RATE;
  const discount = coupon
    ? coupon.discountType === 'percentage'
      ? (subtotal * coupon.discountValue) / 100
      : coupon.discountValue
    : 0;
  const total = subtotal + tax - discount;
  const itemCount = getCount();

  // ── Coupon ────────────────────────────────────────────────
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const data = await couponService.validateCoupon(couponCode.trim().toUpperCase(), subtotal);
      if (data.valid) {
        setCoupon({
          code: couponCode.toUpperCase(),
          discountType: data.coupon.discountType,   // 'percentage' or 'fixed'
          discountValue: data.coupon.discountValue, // 30 (for 30%)
        });
        toast.success(`Coupon applied — ${data.coupon.discountValue}% off`);
      } else {
        toast.error(data.message || "Invalid coupon.");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Coupon not valid.");
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    setCouponCode("");
  };

  // ── Place Order ───────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (items.length === 0) return toast.error("Your cart is empty.");
    if (orderType === "delivery" && !address.trim()) {
      return toast.error("Please enter a delivery address.");
    }

    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({
          menuItem: i._id,
          name: i.name,
          price: i.price,
          qty: i.qty,
        })),
        orderType,
        paymentMethod,
        deliveryAddress: orderType === "delivery" ? address.trim() : undefined,
        couponCode: coupon?.code || undefined,
        note: note.trim() || undefined,
      };

      const data = await orderService.placeOrder(payload);
      clearCart();
      toast.success("Order placed successfully!");
      navigate(`/orders`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  // ── Empty cart state ──────────────────────────────────────
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-5">
            <ShoppingBag size={24} className="text-white/20" />
          </div>
          <h2
            className="text-2xl text-white mb-2"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Nothing to checkout
          </h2>
          <p className="text-white/30 text-sm mb-8">Add items from the menu first.</p>
          <button
            onClick={() => navigate("/menu")}
            className="px-6 py-3 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm rounded-xl transition-colors"
          >
            Browse Menu
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pt-20">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">

        {/* ── Page header ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-[#E85D04] mb-2">Almost there</p>
          <h1
            className="text-3xl lg:text-4xl font-bold text-white"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Complete Your Order
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Left — form (3 cols) ──────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-3 space-y-8"
          >

            {/* Order Type */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <SectionLabel>Order Type</SectionLabel>
              <div className="grid grid-cols-3 gap-3">
                {ORDER_TYPES.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    onClick={() => setOrderType(value)}
                    className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm transition-colors ${orderType === value
                      ? "border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]"
                      : "border-white/10 text-white/40 hover:text-white hover:border-white/20"
                      }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery Address — only for delivery */}
            {orderType === "delivery" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/3 border border-white/8 rounded-2xl p-6"
              >
                <SectionLabel>Delivery Address</SectionLabel>
                <Field label="Full Address">
                  <div className="relative">
                    <MapPin size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, area, city..."
                      className={`${inputCls} pl-11`}
                    />
                  </div>
                </Field>
              </motion.div>
            )}

            {/* Payment Method */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <SectionLabel>Payment Method</SectionLabel>
              <div className="space-y-2">
                {PAYMENT_METHODS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setPaymentMethod(value)}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border text-sm transition-colors ${paymentMethod === value
                      ? "border-[#E85D04] bg-[#E85D04]/10 text-white"
                      : "border-white/10 text-white/50 hover:text-white hover:border-white/20"
                      }`}
                  >
                    <span className="flex items-center gap-3">
                      <CreditCard size={15} className={paymentMethod === value ? "text-[#E85D04]" : "text-white/25"} />
                      {label}
                    </span>
                    {paymentMethod === value && (
                      <span className="w-2 h-2 rounded-full bg-[#E85D04]" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <SectionLabel>Coupon Code</SectionLabel>
              {coupon ? (
                <div className="flex items-center justify-between px-4 py-3 bg-green-400/10 border border-green-400/20 rounded-xl">
                  <span className="flex items-center gap-2 text-green-400 text-sm font-mono font-semibold">
                    <Tag size={14} />
                    {coupon.code}
                    <span className="text-green-400/60 font-normal">
                      — {formatPrice(coupon.discountAmount)} off
                    </span>
                  </span>
                  <button onClick={handleRemoveCoupon} className="text-white/30 hover:text-red-400 transition-colors">
                    <X size={15} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="SAVE20"
                      className={`${inputCls} pl-11 font-mono`}
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-5 py-3 bg-white/8 hover:bg-white/12 border border-white/10 text-white/60 hover:text-white text-sm rounded-xl transition-colors disabled:opacity-40"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
              )}
            </div>

            {/* Order Note */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <SectionLabel>Special Instructions</SectionLabel>
              <Field label="Note (optional)">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Allergies, special requests..."
                  rows={3}
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </motion.div>

          {/* ── Right — order summary (2 cols) ───────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6 sticky top-28">
              <SectionLabel>Your Order</SectionLabel>

              {/* Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{item.name}</p>
                      <p className="text-white/30 text-xs">x{item.qty}</p>
                    </div>
                    <p className="text-white/60 text-sm tabular-nums shrink-0">
                      {formatPrice(item.price * item.qty)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/8 mb-5" />

              {/* Price breakdown */}
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-white/50">
                  <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                  <span className="tabular-nums">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-white/50">
                  <span>Tax (5% GST)</span>
                  <span className="tabular-nums">{formatPrice(tax)}</span>
                </div>
                {coupon && discount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span className="flex items-center gap-1.5">
                      <Tag size={12} /> {coupon.code}
                    </span>
                    <span className="tabular-nums">− {formatPrice(discount)}</span>
                  </div>
                )}
                <div className="h-px bg-white/8" />
                <div className="flex justify-between items-center">
                  <span
                    className="text-white font-semibold text-base"
                    style={{ fontFamily: "Playfair Display, serif" }}
                  >
                    Total
                  </span>
                  <span className="text-[#E85D04] font-bold text-lg tabular-nums">
                    {formatPrice(total)}
                  </span>
                </div>
              </div>

              {/* Place order button */}
              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="group w-full flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white py-4 rounded-xl text-sm font-medium tracking-widest uppercase transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {placing ? (
                  "Placing Order..."
                ) : (
                  <>
                    Place Order
                    <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-white/20 text-xs text-center mt-4">
                By placing your order you agree to our terms of service.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}