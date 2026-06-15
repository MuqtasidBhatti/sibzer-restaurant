import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Leaf, Clock, Star } from "lucide-react";
import { RESTAURANT_INFO } from "../../constants";

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay },
});

const values = [
    {
        icon: <Flame size={20} />,
        title: "Crafted with Passion",
        desc: "Every dish is prepared from scratch using time-honoured techniques and the finest local ingredients.",
    },
    {
        icon: <Leaf size={20} />,
        title: "Fresh & Seasonal",
        desc: "We source directly from local farms — no frozen shortcuts, no compromise on quality.",
    },
    {
        icon: <Clock size={20} />,
        title: "Always On Time",
        desc: "Hot food, delivered fast. We respect your time as much as we respect our recipes.",
    },
    {
        icon: <Star size={20} />,
        title: "Guest-First Always",
        desc: "From your first order to your hundredth, every experience is crafted to exceed expectations.",
    },
];

const About = () => {
    return (
        <div className="bg-[#0A0A0A] text-white pt-20">

            {/* ── Hero ─────────────────────────────────────── */}
            <section className="relative min-h-[55vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(ellipse at 30% 60%, rgba(232,93,4,0.10) 0%, transparent 65%),
                              radial-gradient(ellipse at 80% 20%, rgba(232,93,4,0.05) 0%, transparent 55%)`,
                    }}
                />
                {/* Grid texture */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `linear-gradient(#fff 1px, transparent 1px),
                              linear-gradient(90deg, #fff 1px, transparent 1px)`,
                        backgroundSize: "80px 80px",
                    }}
                />

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20">
                    <motion.p
                        {...fadeUp(0)}
                        className="text-xs tracking-[0.4em] uppercase text-[#E85D04] mb-4"
                    >
                        Our Story
                    </motion.p>
                    <motion.h1
                        {...fadeUp(0.1)}
                        className="text-5xl lg:text-7xl font-bold text-white leading-tight max-w-2xl"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Where Every<br />
                        <span className="text-[#E85D04]">Bite Tells</span><br />
                        a Story.
                    </motion.h1>
                    <motion.p
                        {...fadeUp(0.25)}
                        className="mt-6 text-gray-400 text-base leading-relaxed max-w-md"
                    >
                        Sibzer was born from a simple belief — that extraordinary food
                        shouldn't require a special occasion. We bring the fine dining
                        experience to your everyday table.
                    </motion.p>
                </div>
            </section>

            {/* ── Origin story ─────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <motion.div {...fadeUp(0)}>
                        <p className="text-xs tracking-[0.35em] uppercase text-[#E85D04] mb-4">
                            Founded in Karachi
                        </p>
                        <h2
                            className="text-3xl lg:text-4xl font-bold text-white mb-6 leading-snug"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            A Kitchen Built on<br />Obsession
                        </h2>
                        <div className="space-y-4 text-gray-400 text-sm leading-relaxed">
                            <p>
                                Sibzer started in a small kitchen in Karachi with one
                                chef, one menu, and an uncompromising standard — every
                                dish had to be something we'd be proud to serve to family.
                            </p>
                            <p>
                                That standard hasn't changed. What started as a passion
                                project has grown into a full restaurant experience, but
                                the heart of it remains the same: real food, made properly,
                                for people who care.
                            </p>
                            <p>
                                We believe the best meals are ones that feel personal.
                                Every recipe has a story. Every ingredient has a source.
                                Every guest matters.
                            </p>
                        </div>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        {...fadeUp(0.15)}
                        className="grid grid-cols-2 gap-4"
                    >
                        {[
                            { value: "50+", label: "Menu Items" },
                            { value: "10K+", label: "Orders Delivered" },
                            { value: "4.9★", label: "Average Rating" },
                            { value: "3yr", label: "Serving Karachi" },
                        ].map(({ value, label }) => (
                            <div
                                key={label}
                                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6
                           hover:border-[#E85D04]/25 transition-colors"
                            >
                                <p
                                    className="text-3xl font-bold text-[#E85D04]"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {value}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 tracking-wide">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Values ───────────────────────────────────── */}
            <section className="bg-[#080808] border-y border-[#1A1A1A]">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
                    <motion.div {...fadeUp(0)} className="text-center mb-12">
                        <p className="text-xs tracking-[0.35em] uppercase text-[#E85D04] mb-3">
                            What Drives Us
                        </p>
                        <h2
                            className="text-3xl font-bold text-white"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Our Values
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {values.map(({ icon, title, desc }, i) => (
                            <motion.div
                                key={title}
                                {...fadeUp(i * 0.1)}
                                className="bg-[#111111] border border-[#1E1E1E] rounded-2xl p-6
                           hover:border-[#E85D04]/25 hover:shadow-[0_0_30px_rgba(232,93,4,0.06)]
                           transition-all duration-300"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 flex items-center justify-center
                                text-[#E85D04] mb-4">
                                    {icon}
                                </div>
                                <h3
                                    className="text-sm font-semibold text-white mb-2"
                                    style={{ fontFamily: "'Playfair Display', serif" }}
                                >
                                    {title}
                                </h3>
                                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 text-center">
                <motion.div {...fadeUp(0)}>
                    <h2
                        className="text-3xl lg:text-4xl font-bold text-white mb-4"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                        Ready to Experience <span className="text-[#E85D04]">Sibzer?</span>
                    </h2>
                    <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto">
                        Browse our full menu and order your first meal today.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link
                            to="/menu"
                            className="px-8 py-3.5 rounded-full bg-[#E85D04] hover:bg-[#C44D02]
                         text-white text-sm font-medium tracking-widest uppercase
                         transition-colors duration-200"
                        >
                            View Menu
                        </Link>
                        <Link
                            to="/contact"
                            className="px-8 py-3.5 rounded-full border border-[#2A2A2A]
                         hover:border-[#E85D04]/40 text-gray-300 hover:text-white
                         text-sm tracking-widest uppercase transition-all duration-200"
                        >
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
};

export default About;