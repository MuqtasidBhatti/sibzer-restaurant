import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import { useCartStore } from "../../store/cartStore"
import formatPrice from "../../utils/formatPrice";

/**
 * CartItem — single item row inside CartDrawer
 * Receives item as prop from CartDrawer (never calls useCartStore itself
 * since it's a nested component — data flows down as props per project rule)
 *
 * Props:
 *   item        — { _id, name, price, image, qty }
 *   onIncrease  — () => void
 *   onDecrease  — () => void
 *   onRemove    — () => void
 */
const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex gap-3 py-4 border-b border-[#1E1E1E] last:border-0 group"
        >
            {/* ── Item Image ───────────────────────────────────── */}
            <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 bg-[#1A1A1A]">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">
                        🍽️
                    </div>
                )}
            </div>

            {/* ── Item Info ────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <p
                        className="text-sm font-medium text-white truncate leading-tight"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {item.name}
                    </p>

                    {/* Remove button — appears on hover */}
                    <button
                        onClick={onRemove}
                        className="shrink-0 p-1 text-gray-600 hover:text-red-400
                       transition-colors opacity-0 group-hover:opacity-100"
                        aria-label={`Remove ${item.name}`}
                    >
                        <Trash2 size={13} />
                    </button>
                </div>

                {/* Price per unit */}
                <p className="text-xs text-gray-500 mt-0.5">
                    {formatPrice(item.price)} each
                </p>

                {/* ── Qty Controls + Line Total ─────────────────── */}
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-1 py-0.5">
                        <button
                            onClick={onDecrease}
                            className="w-6 h-6 rounded-full flex items-center justify-center
                         text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
                            aria-label="Decrease quantity"
                        >
                            <Minus size={11} />
                        </button>

                        <span className="text-sm text-white font-medium w-4 text-center tabular-nums">
                            {item.qty}
                        </span>

                        <button
                            onClick={onIncrease}
                            className="w-6 h-6 rounded-full flex items-center justify-center
                         text-gray-400 hover:text-white hover:bg-[#E85D04] transition-colors"
                            aria-label="Increase quantity"
                        >
                            <Plus size={11} />
                        </button>
                    </div>

                    {/* Line total */}
                    <p className="text-sm font-semibold text-[#E85D04] tabular-nums">
                        {formatPrice(item.price * item.qty)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default CartItem;