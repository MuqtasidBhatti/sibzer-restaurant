import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { DIETARY_TAGS, SORT_OPTIONS } from "../../constants";

/**
 * MenuFilter — full filter bar for the Menu page
 *
 * Props:
 *   categories      — Category[] from backend
 *   activeCategory  — string (category _id or "all")
 *   activeTags      — string[]
 *   search          — string
 *   sort            — string
 *   onCategory      — (id) => void
 *   onTagToggle     — (tag) => void
 *   onSearch        — (value) => void
 *   onSort          — (value) => void
 *   onClearAll      — () => void
 *   resultCount     — number
 */
const MenuFilter = ({
    categories = [],
    activeCategory,
    activeTags = [],
    search = "",
    sort,
    onCategory,
    onTagToggle,
    onSearch,
    onSort,
    onClearAll,
    resultCount = 0,
}) => {
    const tabsRef = useRef(null);
    const searchRef = useRef(null);

    const hasActiveFilters =
        activeTags.length > 0 || search.trim() !== "" || sort !== "default";

    // Scroll active category tab into view
    useEffect(() => {
        if (!tabsRef.current) return;
        const active = tabsRef.current.querySelector("[data-active='true']");
        if (active) {
            active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        }
    }, [activeCategory]);

    return (
        <div className="space-y-4">

            {/* ── Row 1: Search + Sort ───────────────────────── */}
            <div className="flex gap-3 items-center">

                {/* Search */}
                <div className="relative flex-1">
                    <Search
                        size={15}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <input
                        ref={searchRef}
                        type="text"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        placeholder="Search dishes..."
                        className="w-full pl-9 pr-9 py-2.5 bg-[#111111] border border-[#2A2A2A]
                       rounded-xl text-sm text-white placeholder-gray-600
                       focus:outline-none focus:border-[#E85D04]/50 transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => onSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500
                         hover:text-white transition-colors"
                            aria-label="Clear search"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                    <SlidersHorizontal
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <select
                        value={sort}
                        onChange={(e) => onSort(e.target.value)}
                        className="pl-8 pr-8 py-2.5 bg-[#111111] border border-[#2A2A2A]
                       rounded-xl text-sm text-white appearance-none cursor-pointer
                       focus:outline-none focus:border-[#E85D04]/50 transition-colors
                       min-w-40"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value} className="bg-[#111111]">
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* ── Row 2: Category Tabs ───────────────────────── */}
            <div
                ref={tabsRef}
                className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {/* All tab */}
                <CategoryTab
                    label="All"
                    isActive={activeCategory === "all"}
                    onClick={() => onCategory("all")}
                />
                {categories.map((cat) => (
                    <CategoryTab
                        key={cat._id}
                        label={cat.name}
                        isActive={activeCategory === cat._id}
                        onClick={() => onCategory(cat._id)}
                    />
                ))}
            </div>

            {/* ── Row 3: Dietary Tag Pills ───────────────────── */}
            <div className="flex flex-wrap gap-2">
                {DIETARY_TAGS.map((tag) => {
                    const isActive = activeTags.includes(tag.value);
                    return (
                        <button
                            key={tag.value}
                            onClick={() => onTagToggle(tag.value)}
                            className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide
                         transition-all duration-200 border
                         ${isActive
                                    ? "bg-[#E85D04]/15 border-[#E85D04]/50 text-[#E85D04]"
                                    : "bg-transparent border-[#2A2A2A] text-gray-500 hover:border-[#E85D04]/30 hover:text-gray-300"
                                }`}
                        >
                            {tag.label}
                        </button>
                    );
                })}
            </div>

            {/* ── Row 4: Results count + Clear ──────────────── */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">
                    <span className="text-gray-400 font-medium">{resultCount}</span>{" "}
                    {resultCount === 1 ? "dish" : "dishes"} found
                </p>

                {hasActiveFilters && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={onClearAll}
                        className="flex items-center gap-1.5 text-xs text-[#E85D04]
                       hover:text-[#C44D02] transition-colors"
                    >
                        <X size={12} />
                        Clear filters
                    </motion.button>
                )}
            </div>
        </div>
    );
};

// ── Sub-component: single category tab ──────────────────
const CategoryTab = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        data-active={isActive}
        className={`relative shrink-0 px-4 py-2 rounded-full text-sm
               font-medium tracking-wide transition-all duration-200 whitespace-nowrap
               ${isActive
                ? "text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
    >
        {isActive && (
            <motion.span
                layoutId="activeCategory"
                className="absolute inset-0 rounded-full bg-[#E85D04]"
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
            />
        )}
        <span className="relative z-10">{label}</span>
    </button>
);

export default MenuFilter;