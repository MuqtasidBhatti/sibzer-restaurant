import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, Clock, Star, Flame } from "lucide-react";
import { useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import formatPrice from "../../utils/formatPrice";

/**
 * MenuCard — displays a single menu item
 * useCartStore + useAuthStore called at TOP LEVEL of this component (per project rule)
 *
 * Props:
 *   item — MenuItem object from backend
 */
const MenuCard = ({ item }) => {
    const [imgError, setImgError] = useState(false);
    const [justAdded, setJustAdded] = useState(false);

    // ── Zustand hooks at top level ───────────────────────
    const { items, addItem, increaseQty, decreaseQty } = useCartStore();
    const { isAuthenticated } = useAuthStore();

    // Find this item in cart
    const cartItem = items.find((i) => i._id === item._id);
    const qty = cartItem?.qty ?? 0;
    const inCart = qty > 0;

    const handleAdd = () => {
        addItem({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.images?.[0] ?? null,
        });
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1200);
    };

    const dietaryColors = {
        vegetarian: "text-green-400 bg-green-400/10",
        vegan: "text-emerald-400 bg-emerald-400/10",
        halal: "text-blue-400 bg-blue-400/10",
        spicy: "text-red-400 bg-red-400/10",
        "gluten-free": "text-yellow-400 bg-yellow-400/10",
        "nut-free": "text-purple-400 bg-purple-400/10",
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="group relative flex flex-col bg-[#111111] rounded-2xl overflow-hidden
                 border border-[#1E1E1E] hover:border-[#E85D04]/30
                 transition-all duration-300 hover:shadow-[0_0_30px_rgba(232,93,4,0.08)]"
        >
            {/* ── Image ─────────────────────────────────────── */}
            <div className="relative overflow-hidden aspect-4/3 bg-[#1A1A1A]">
                {item.images?.[0] && !imgError ? (
                    <img
                        src={item.images[0]}
                        alt={item.name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-cover transition-transform duration-500
                       group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">
                        🍽️
                    </div>
                )}

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-[#111111]/60 via-transparent to-transparent" />

                {/* Featured badge */}
                {item.isFeatured && (
                    <div className="absolute top-3 left-3 flex items-center gap-1
                          bg-[#E85D04] text-white text-[10px] font-bold
                          px-2 py-1 rounded-full tracking-wider uppercase">
                        <Star size={9} fill="white" />
                        Chef's Pick
                    </div>
                )}

                {/* Unavailable overlay */}
                {!item.isAvailable && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-sm text-gray-400 tracking-widest uppercase
                             border border-gray-700 px-4 py-1.5 rounded-full">
                            Unavailable
                        </span>
                    </div>
                )}

                {/* Prep time — bottom right of image */}
                {item.preparationTime && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1
                          bg-black/60 backdrop-blur-sm text-gray-300 text-[10px]
                          px-2 py-1 rounded-full">
                        <Clock size={9} />
                        {item.preparationTime} min
                    </div>
                )}
            </div>

            {/* ── Body ──────────────────────────────────────── */}
            <div className="flex flex-col flex-1 p-4">

                {/* Dietary tags */}
                {item.dietaryTags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                        {item.dietaryTags.slice(0, 3).map((tag) => (
                            <span
                                key={tag}
                                className={`text-[10px] px-2 py-0.5 rounded-full font-medium capitalize
                            ${dietaryColors[tag] ?? "text-gray-400 bg-gray-400/10"}`}
                            >
                                {tag === "spicy" && <Flame size={8} className="inline mr-0.5" />}
                                {tag}
                            </span>
                        ))}
                    </div>
                )}

                {/* Name */}
                <h3
                    className="text-base font-semibold text-white leading-snug mb-1
                     group-hover:text-[#E85D04]/90 transition-colors duration-200"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    {item.name}
                </h3>

                {/* Description */}
                {item.description && (
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                        {item.description}
                    </p>
                )}

                {/* ── Price + Cart Controls ──────────────────── */}
                <div className="flex items-center justify-between mt-4 gap-2">
                    <span
                        className="text-base font-bold text-[#E85D04] tabular-nums"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        {formatPrice(item.price)}
                    </span>

                    {/* Add / Qty stepper */}
                    {item.isAvailable && (
                        <AnimatePresence mode="wait">
                            {!inCart ? (
                                /* Add button */
                                <motion.button
                                    key="add"
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.15 }}
                                    onClick={handleAdd}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                             font-medium tracking-wider uppercase transition-all duration-200
                             ${justAdded
                                            ? "bg-green-500 text-white"
                                            : "bg-[#E85D04] hover:bg-[#C44D02] text-white"
                                        }`}
                                >
                                    <Plus size={12} />
                                    {justAdded ? "Added!" : "Add"}
                                </motion.button>
                            ) : (
                                /* Qty stepper */
                                <motion.div
                                    key="stepper"
                                    initial={{ opacity: 0, scale: 0.85 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.85 }}
                                    transition={{ duration: 0.15 }}
                                    className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-1 py-0.5
                             border border-[#E85D04]/30"
                                >
                                    <button
                                        onClick={() => decreaseQty(item._id)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center
                               text-gray-400 hover:text-white hover:bg-[#2A2A2A] transition-colors"
                                        aria-label="Decrease"
                                    >
                                        <Minus size={11} />
                                    </button>
                                    <span className="text-sm font-semibold text-white w-4 text-center tabular-nums">
                                        {qty}
                                    </span>
                                    <button
                                        onClick={() => increaseQty(item._id)}
                                        className="w-6 h-6 rounded-full flex items-center justify-center
                               text-gray-400 hover:text-white hover:bg-[#E85D04] transition-colors"
                                        aria-label="Increase"
                                    >
                                        <Plus size={11} />
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default MenuCard;