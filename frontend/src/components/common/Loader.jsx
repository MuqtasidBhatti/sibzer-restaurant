/**
 * Loader — two variants:
 *   <Loader />              full-screen overlay (page loads)
 *   <Loader inline />       small inline spinner (buttons, sections)
 *   <Loader inline size={6} />   custom size
 */
const Loader = ({ inline = false, size = 8 }) => {
    // ── Inline spinner ───────────────────────────────────────
    if (inline) {
        return (
            <span
                className="inline-block rounded-full border-2 border-[#2A2A2A] border-t-[#E85D04] animate-spin"
                style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
                aria-label="Loading"
            />
        );
    }

    // ── Full-screen loader ───────────────────────────────────
    return (
        <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-[#0A0A0A]">
            {/* Outer ring */}
            <div className="relative flex items-center justify-center w-20 h-20">
                <span className="absolute inset-0 rounded-full border border-[#2A2A2A]" />
                <span className="absolute inset-0 rounded-full border-t-2 border-[#E85D04] animate-spin" />

                {/* Inner dot */}
                <span className="w-2 h-2 rounded-full bg-[#E85D04] animate-pulse" />
            </div>

            {/* Brand name */}
            <p
                className="mt-6 text-sm tracking-[0.4em] uppercase text-[#9CA3AF]"
                style={{ fontFamily: "'Playfair Display', serif" }}
            >
                Sibzer
            </p>
        </div>
    );
};

export default Loader;