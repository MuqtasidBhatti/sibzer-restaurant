import { useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { useCartStore } from "../../store/cartStore"
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

/**
 * CartDrawer — slide-in panel from the right
 * Lives in MainLayout so it's always mounted.
 *
 * Per project rule: useCartStore is called HERE (top level of CartDrawer),
 * and data is passed down as props to CartItem — never call the store
 * inside CartItem directly.
 */
const CartDrawer = () => {
    const {
        items,
        isOpen,
        closeCart,
        increaseQty,
        decreaseQty,
        removeItem,
        getCount,
        getTotal ,
    } = useCartStore();

    const drawerRef = useRef(null);
    const totalItems = getCount();
const subtotal = getTotal();

    // Lock body scroll when drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Close on Escape key
    useEffect(() => {
        const onKey = (e) => { if (e.key === "Escape") closeCart(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeCart]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* ── Backdrop ─────────────────────────────────── */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        onClick={closeCart}
                        aria-hidden="true"
                    />

                    {/* ── Drawer Panel ─────────────────────────────── */}
                    <motion.div
                        key="drawer"
                        ref={drawerRef}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 28, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-100
                       flex flex-col bg-[#111111] border-l border-[#1E1E1E] shadow-2xl"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Shopping cart"
                    >

                        {/* ── Header ───────────────────────────────────── */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1E1E1E]">
                            <div className="flex items-center gap-2.5">
                                <ShoppingBag size={18} className="text-[#E85D04]" />
                                <h2
                                    className="text-base font-semibold text-white tracking-wide"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    Your Order
                                </h2>
                                {totalItems > 0 && (
                                    <span className="text-xs bg-[#E85D04]/15 text-[#E85D04] px-2 py-0.5 rounded-full font-medium">
                                        {totalItems} {totalItems === 1 ? "item" : "items"}
                                    </span>
                                )}
                            </div>

                            <button
                                onClick={closeCart}
                                className="p-1.5 rounded-lg text-gray-500 hover:text-white
                           hover:bg-[#1E1E1E] transition-colors"
                                aria-label="Close cart"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* ── Body — scrollable item list ──────────────── */}
                        <div className="flex-1 overflow-y-auto px-5 py-2 scrollbar-thin
                            scrollbar-track-transparent scrollbar-thumb-[#2A2A2A]">

                            {items.length === 0 ? (
                                /* Empty state */
                                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                                    <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4">
                                        <ShoppingBag size={24} className="text-gray-600" />
                                    </div>
                                    <p
                                        className="text-base text-gray-400 mb-1"
                                        style={{ fontFamily: "'Playfair Display', serif" }}
                                    >
                                        Your cart is empty
                                    </p>
                                    <p className="text-xs text-gray-600 mb-6">
                                        Add something delicious from our menu
                                    </p>
                                    <Link
                                        to="/menu"
                                        onClick={closeCart}
                                        className="px-5 py-2.5 rounded-full bg-[#E85D04] hover:bg-[#C44D02]
                               text-white text-sm tracking-widest uppercase transition-colors"
                                    >
                                        Browse Menu
                                    </Link>
                                </div>
                            ) : (
                                /* Item list */
                                <AnimatePresence initial={false}>
                                    {items.map((item) => (
                                        <CartItem
                                            key={item._id}
                                            item={item}
                                            onIncrease={() => increaseQty(item._id)}
                                            onDecrease={() => decreaseQty(item._id)}
                                            onRemove={() => removeItem(item._id, item.name)}
                                        />
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* ── Footer — summary + checkout ──────────────── */}
                        {items.length > 0 && (
                            <div className="px-5 py-4 border-t border-[#1E1E1E] bg-[#0D0D0D]">
                                <CartSummary subtotal={subtotal} onClose={closeCart} />
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default CartDrawer;