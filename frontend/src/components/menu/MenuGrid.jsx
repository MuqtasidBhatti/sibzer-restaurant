import { AnimatePresence, motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import MenuCard from "./MenuCard";

/**
 * MenuGrid — renders the responsive card grid
 *
 * Props:
 *   items      — MenuItem[]
 *   loading    — boolean
 *   error      — string | null
 */
const MenuGrid = ({ items = [], loading = false, error = null }) => {

    // ── Error state ──────────────────────────────────────
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                    <UtensilsCrossed size={24} className="text-red-400" />
                </div>
                <p
                    className="text-base text-gray-300 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Failed to load menu
                </p>
                <p className="text-xs text-gray-600">{error}</p>
            </div>
        );
    }

    // ── Loading skeleton ─────────────────────────────────
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    // ── Empty state ──────────────────────────────────────
    if (items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center"
            >
                <div className="w-16 h-16 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4">
                    <UtensilsCrossed size={24} className="text-gray-600" />
                </div>
                <p
                    className="text-base text-gray-400 mb-1"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    No dishes found
                </p>
                <p className="text-xs text-gray-600">
                    Try adjusting your filters or search term
                </p>
            </motion.div>
        );
    }

    // ── Grid ─────────────────────────────────────────────
    return (
        <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
            <AnimatePresence mode="popLayout">
                {items.map((item, index) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, delay: index < 8 ? index * 0.05 : 0 }}
                    >
                        <MenuCard item={item} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </motion.div>
    );
};

// ── Skeleton card ────────────────────────────────────────
const SkeletonCard = () => (
    <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1E1E1E] animate-pulse">
        {/* Image placeholder */}
        <div className="aspect-4/3 bg-[#1A1A1A]" />
        {/* Body */}
        <div className="p-4 space-y-3">
            <div className="flex gap-2">
                <div className="h-4 w-14 rounded-full bg-[#1E1E1E]" />
                <div className="h-4 w-10 rounded-full bg-[#1E1E1E]" />
            </div>
            <div className="h-5 w-3/4 rounded bg-[#1E1E1E]" />
            <div className="h-3 w-full rounded bg-[#1E1E1E]" />
            <div className="h-3 w-2/3 rounded bg-[#1E1E1E]" />
            <div className="flex justify-between items-center pt-1">
                <div className="h-5 w-20 rounded bg-[#1E1E1E]" />
                <div className="h-7 w-16 rounded-full bg-[#1E1E1E]" />
            </div>
        </div>
    </div>
);

export default MenuGrid;