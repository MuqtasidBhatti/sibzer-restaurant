import { Link } from "react-router-dom";
import { ArrowRight, Tag } from "lucide-react";
import formatPrice from "../../utils/formatPrice";
import { TAX_RATE } from "../../constants";

/**
 * CartSummary — price breakdown shown at the bottom of CartDrawer
 *
 * Props:
 *   subtotal    — number (Rs.)
 *   onClose     — () => void  (closes drawer before navigating)
 *   coupon      — { code, discountAmount } | null  (optional, from checkout)
 */
const CartSummary = ({ subtotal = 0, onClose, coupon = null }) => {
    const tax = subtotal * TAX_RATE;
    const discount = coupon?.discountAmount ?? 0;
    const total = subtotal + tax - discount;

    return (
        <div className="border-t border-[#1E1E1E] pt-4 space-y-3">

            {/* ── Line Items ───────────────────────────────────── */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="text-white tabular-nums">{formatPrice(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Tax (5% GST)</span>
                    <span className="text-white tabular-nums">{formatPrice(tax)}</span>
                </div>

                {/* Coupon discount — only shown when applied */}
                {coupon && discount > 0 && (
                    <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-green-400">
                            <Tag size={12} />
                            {coupon.code}
                        </span>
                        <span className="text-green-400 tabular-nums">
                            − {formatPrice(discount)}
                        </span>
                    </div>
                )}
            </div>

            {/* ── Divider ──────────────────────────────────────── */}
            <div className="h-px bg-[#2A2A2A]" />

            {/* ── Total ────────────────────────────────────────── */}
            <div className="flex justify-between items-center">
                <span
                    className="text-base font-semibold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Total
                </span>
                <span className="text-lg font-bold text-[#E85D04] tabular-nums">
                    {formatPrice(total)}
                </span>
            </div>

            {/* ── Checkout CTA ─────────────────────────────────── */}
            <Link
                to="/checkout"
                onClick={onClose}
                className="group flex items-center justify-center gap-2 w-full py-3.5 mt-2
                   bg-[#E85D04] hover:bg-[#C44D02] text-white rounded-xl
                   text-sm font-medium tracking-widest uppercase
                   transition-colors duration-200"
            >
                Proceed to Checkout
                <ArrowRight
                    size={15}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                />
            </Link>

            {/* Continue shopping */}
            <button
                onClick={onClose}
                className="w-full py-2.5 text-sm text-gray-500 hover:text-gray-300
                   transition-colors tracking-wider"
            >
                Continue Shopping
            </button>
        </div>
    );
};

export default CartSummary;