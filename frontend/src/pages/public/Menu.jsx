import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import MenuFilter from "../../components/menu/MenuFilter";
import MenuGrid from "../../components/menu/MenuGrid";
import menuService from "../../services/menuService";

const Menu = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Filter state
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeTags, setActiveTags] = useState([]);
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("default");

    // Fetch menu items + categories on mount
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [menuRes, catRes] = await Promise.all([
                    menuService.getAllItems(),
                    menuService.getCategories(),
                ]);
                setMenuItems(Array.isArray(menuRes) ? menuRes : menuRes.menuItems ?? [])
                setCategories(Array.isArray(catRes) ? catRes : catRes.categories ?? [])
            } catch (err) {
                setError(err.message || "Failed to load menu.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Client-side filtering + sorting
    const filteredItems = useMemo(() => {
        let result = [...menuItems];

        // Category filter
        if (activeCategory !== "all") {
            result = result.filter(
                (item) =>
                    item.category?._id === activeCategory ||
                    item.category === activeCategory
            );
        }

        // Dietary tag filter (must match ALL selected tags)
        if (activeTags.length > 0) {
            result = result.filter((item) =>
                activeTags.every((tag) => item.dietaryTags?.includes(tag))
            );
        }

        // Search filter
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(
                (item) =>
                    item.name.toLowerCase().includes(q) ||
                    item.description?.toLowerCase().includes(q)
            );
        }

        // Sort
        switch (sort) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // featured items first, then rest
                result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
                break;
        }

        return result;
    }, [menuItems, activeCategory, activeTags, search, sort]);

    const handleTagToggle = (tag) => {
        setActiveTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        );
    };

    const handleClearAll = () => {
        setActiveCategory("all");
        setActiveTags([]);
        setSearch("");
        setSort("default");
    };

    return (
        <div className="bg-[#0A0A0A] text-white min-h-screen pt-20">

            {/* ── Page header ──────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-6">
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-xs tracking-[0.4em] uppercase text-[#E85D04] mb-2"
                >
                    Our Menu
                </motion.p>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl lg:text-5xl font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    Explore the Kitchen
                </motion.h1>
            </div>

            {/* ── Sticky filter bar ────────────────────────── */}
            <div className="sticky top-16 z-30 bg-[#0A0A0A]/95 backdrop-blur-md
                      border-b border-[#1A1A1A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <MenuFilter
                        categories={categories}
                        activeCategory={activeCategory}
                        activeTags={activeTags}
                        search={search}
                        sort={sort}
                        onCategory={(id) => { setActiveCategory(id); }}
                        onTagToggle={handleTagToggle}
                        onSearch={setSearch}
                        onSort={setSort}
                        onClearAll={handleClearAll}
                        resultCount={filteredItems.length}
                    />
                </div>
            </div>

            {/* ── Grid ─────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <MenuGrid
                    items={filteredItems}
                    loading={loading}
                    error={error}
                />
            </div>
        </div>
    );
};

export default Menu;