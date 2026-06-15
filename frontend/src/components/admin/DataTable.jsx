import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronUp, ChevronDown, ChevronsUpDown,
    Search, X, ChevronLeft, ChevronRight,
} from "lucide-react";

/**
 * DataTable — reusable table for all admin pages
 *
 * Props:
 *   columns     — { key, label, sortable?, render?, width? }[]
 *   data        — object[]
 *   loading     — boolean
 *   searchable  — boolean (default true) — shows search bar
 *   searchKeys  — string[]  keys to search across  e.g. ["name","email"]
 *   pageSize    — number (default 10)
 *   emptyText   — string
 *   actions     — (row) => ReactNode  — renders action buttons per row
 */
const DataTable = ({
    columns = [],
    data = [],
    loading = false,
    searchable = true,
    searchKeys = [],
    pageSize = 10,
    emptyText = "No records found",
    actions,
}) => {
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState("asc");
    const [page, setPage] = useState(1);

    // ── Filter ───────────────────────────────────────────
    const filtered = useMemo(() => {
        if (!search.trim() || searchKeys.length === 0) return data;
        const q = search.toLowerCase();
        return data.filter((row) =>
            searchKeys.some((key) =>
                String(row[key] ?? "").toLowerCase().includes(q)
            )
        );
    }, [data, search, searchKeys]);

    // ── Sort ─────────────────────────────────────────────
    const sorted = useMemo(() => {
        if (!sortKey) return filtered;
        return [...filtered].sort((a, b) => {
            const av = a[sortKey] ?? "";
            const bv = b[sortKey] ?? "";
            const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
            return sortDir === "asc" ? cmp : -cmp;
        });
    }, [filtered, sortKey, sortDir]);

    // ── Paginate ─────────────────────────────────────────
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = Math.min(page, totalPages);
    const paginated = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
        setPage(1);
    };

    const handleSearch = (val) => {
        setSearch(val);
        setPage(1);
    };

    return (
        <div className="flex flex-col gap-4">

            {/* ── Search bar ──────────────────────────────── */}
            {searchable && (
                <div className="relative w-full sm:max-w-xs">
                    <Search
                        size={14}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search..."
                        className="w-full pl-9 pr-8 py-2.5 bg-[#111111] border border-[#2A2A2A]
                       rounded-xl text-sm text-white placeholder-gray-600
                       focus:outline-none focus:border-[#E85D04]/50 transition-colors"
                    />
                    {search && (
                        <button
                            onClick={() => handleSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                        >
                            <X size={13} />
                        </button>
                    )}
                </div>
            )}

            {/* ── Table wrapper ───────────────────────────── */}
            <div className="w-full overflow-x-auto rounded-xl border border-[#1E1E1E]">
                <table className="w-full text-sm border-collapse">

                    {/* Head */}
                    <thead>
                        <tr className="border-b border-[#1E1E1E] bg-[#0D0D0D]">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    style={{ width: col.width }}
                                    className={`px-4 py-3 text-left text-xs font-medium tracking-widest
                              uppercase text-gray-500 whitespace-nowrap
                              ${col.sortable ? "cursor-pointer select-none hover:text-gray-300" : ""}
                              transition-colors`}
                                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                >
                                    <span className="flex items-center gap-1.5">
                                        {col.label}
                                        {col.sortable && (
                                            <SortIcon
                                                active={sortKey === col.key}
                                                dir={sortDir}
                                            />
                                        )}
                                    </span>
                                </th>
                            ))}
                            {actions && (
                                <th className="px-4 py-3 text-right text-xs font-medium tracking-widest
                               uppercase text-gray-500">
                                    Actions
                                </th>
                            )}
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {loading ? (
                            /* Skeleton rows */
                            Array.from({ length: pageSize }).map((_, i) => (
                                <tr key={i} className="border-b border-[#1A1A1A] last:border-0">
                                    {columns.map((col) => (
                                        <td key={col.key} className="px-4 py-3.5">
                                            <div className="h-4 rounded bg-[#1A1A1A] animate-pulse" style={{ width: "60%" }} />
                                        </td>
                                    ))}
                                    {actions && (
                                        <td className="px-4 py-3.5">
                                            <div className="h-4 w-16 rounded bg-[#1A1A1A] animate-pulse ml-auto" />
                                        </td>
                                    )}
                                </tr>
                            ))
                        ) : paginated.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    className="px-4 py-16 text-center text-sm text-gray-600"
                                >
                                    {emptyText}
                                </td>
                            </tr>
                        ) : (
                            <AnimatePresence initial={false}>
                                {paginated.map((row, i) => (
                                    <motion.tr
                                        key={row._id ?? i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.15 }}
                                        className="border-b border-[#1A1A1A] last:border-0
                               hover:bg-[#161616] transition-colors"
                                    >
                                        {columns.map((col) => (
                                            <td
                                                key={col.key}
                                                className="px-4 py-3.5 text-gray-300 whitespace-nowrap"
                                            >
                                                {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                                            </td>
                                        ))}
                                        {actions && (
                                            <td className="px-4 py-3.5 text-right whitespace-nowrap">
                                                {actions(row)}
                                            </td>
                                        )}
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ──────────────────────────────── */}
            {!loading && sorted.length > pageSize && (
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                        Showing{" "}
                        <span className="text-gray-300">
                            {(safePage - 1) * pageSize + 1}–
                            {Math.min(safePage * pageSize, sorted.length)}
                        </span>{" "}
                        of <span className="text-gray-300">{sorted.length}</span>
                    </span>

                    <div className="flex items-center gap-1">
                        <PageBtn
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={safePage === 1}
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={14} />
                        </PageBtn>

                        {/* Page numbers — show max 5 */}
                        {getPageNumbers(safePage, totalPages).map((p) =>
                            p === "…" ? (
                                <span key={p + Math.random()} className="px-2 text-gray-600">…</span>
                            ) : (
                                <PageBtn
                                    key={p}
                                    onClick={() => setPage(p)}
                                    active={p === safePage}
                                >
                                    {p}
                                </PageBtn>
                            )
                        )}

                        <PageBtn
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage === totalPages}
                            aria-label="Next page"
                        >
                            <ChevronRight size={14} />
                        </PageBtn>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Sub: Sort icon ────────────────────────────────────────
const SortIcon = ({ active, dir }) => {
    if (!active) return <ChevronsUpDown size={12} className="text-gray-600" />;
    return dir === "asc"
        ? <ChevronUp size={12} className="text-[#E85D04]" />
        : <ChevronDown size={12} className="text-[#E85D04]" />;
};

// ── Sub: Page button ──────────────────────────────────────
const PageBtn = ({ children, onClick, disabled, active }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors text-xs
               ${active
                ? "bg-[#E85D04] text-white"
                : "text-gray-400 hover:text-white hover:bg-[#1E1E1E]"
            }
               disabled:opacity-30 disabled:cursor-not-allowed`}
    >
        {children}
    </button>
);

// ── Helper: smart page number array ──────────────────────
const getPageNumbers = (current, total) => {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 3) return [1, 2, 3, "…", total];
    if (current >= total - 2) return [1, "…", total - 2, total - 1, total];
    return [1, "…", current - 1, current, current + 1, "…", total];
};

export default DataTable;