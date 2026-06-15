import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Star, Truck, Clock } from "lucide-react";
import menuService from "../../services/menuService";
import formatPrice from "../../utils/formatPrice";
import { useCartStore } from "../../store/cartStore";
import { RESTAURANT_INFO } from "../../constants";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ── Featured Card ─────────────────────────────────────────────
const FeaturedCard = ({ item }) => {
  const { addItem } = useCartStore();

  const handleAdd = () => {
    addItem({
      _id: item._id,
      name: item.name,
      price: item.price,
      image: item.images?.[0] ?? null,
    });
  };

  return (
    <motion.div
      {...fadeUp(0.05)}
      className="group bg-[#111111] border border-[#1E1E1E] rounded-2xl overflow-hidden
        hover:border-[#E85D04]/25 hover:shadow-[0_8px_40px_rgba(232,93,4,0.07)]
        transition-all duration-500 w-full flex flex-col h-full"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#1A1A1A] shrink-0" style={{ height: "220px" }}>
        {item.images?.[0] ? (
          <img
            src={item.images[0]}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#111111]/70 via-transparent to-transparent" />

        {/* Chef's Pick badge */}
        {item.isFeatured && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1
            bg-[#E85D04] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            <Star size={9} fill="white" />
            Chef's Pick
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-base font-semibold text-white mb-1 group-hover:text-[#E85D04] transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {item.name}
        </h3>
        {item.description && (
          <p className="text-xs text-white/30 line-clamp-2 mb-4 leading-relaxed flex-1">
            {item.description}
          </p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-sm font-bold text-[#E85D04]">
            {formatPrice(item.price)}
          </span>
          <button
            onClick={handleAdd}
            className="px-4 py-1.5 rounded-full bg-[#E85D04] hover:bg-[#C44D02]
              text-white text-xs font-medium tracking-wider uppercase
              transition-colors duration-200"
          >
            Add
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Skeleton Card ─────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-[#111111] rounded-2xl overflow-hidden border border-[#1E1E1E] animate-pulse">
    <div className="bg-[#1A1A1A]" style={{ height: "220px" }} />
    <div className="p-5 space-y-3">
      <div className="h-4 w-2/3 bg-[#1A1A1A] rounded" />
      <div className="h-3 w-full bg-[#1A1A1A] rounded" />
      <div className="h-3 w-4/5 bg-[#1A1A1A] rounded" />
    </div>
  </div>
);

// ── Main Home ─────────────────────────────────────────────────
const Home = () => {
  const [featuredItems, setFeaturedItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    menuService
      .getAllItems({ featured: true })
      .then((res) => {
        const all = res.menuItems ?? res;
        const feat = all.filter((i) => i.isFeatured && i.isAvailable).slice(0, 6);
        setFeaturedItems(feat.length ? feat : all.slice(0, 6));
      })
      .catch(() => {})
      .finally(() => setLoadingItems(false));
  }, []);

  const perks = [
    { icon: Truck, title: "Fast Delivery", desc: "30-45 min city-wide" },
    { icon: Star, title: "Premium Quality", desc: "Finest local ingredients" },
    { icon: Clock, title: "Open Late", desc: "Till midnight on weekends" },
  ];

  const steps = [
    { n: "01", title: "Browse the menu", desc: "Filter by category or search for what you're craving." },
    { n: "02", title: "Add to cart", desc: "Build your order, apply a coupon, choose delivery or pickup." },
    { n: "03", title: "Sit back", desc: "Ready in under 45 minutes." },
  ];

  return (
    <div className="bg-[#0A0A0A] text-white overflow-x-hidden">

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen grid lg:grid-cols-2 overflow-hidden"
      >
        {/* Left — text */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex flex-col justify-center px-8 sm:px-14 lg:px-20
            pt-32 pb-20 lg:pt-0 lg:pb-0"
        >
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[10px] tracking-[0.5em] uppercase text-[#E85D04] mb-8"
          >
            {RESTAURANT_INFO.tagline}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-[clamp(3.2rem,7vw,6rem)] font-bold leading-none mb-8"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            <span className="block text-white">Where every</span>
            <span className="block text-[#E85D04] italic">bite tells</span>
            <span className="block text-white">a story.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="text-white/40 text-sm leading-relaxed max-w-xs mb-10"
          >
            Premium dishes, finest local ingredients, delivered to your door
            or served in our dining room in Karachi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              to="/menu"
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full
                bg-[#E85D04] hover:bg-[#C44D02] text-white text-xs font-medium
                tracking-widest uppercase transition-colors duration-200"
            >
              Explore Menu
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center px-7 py-3.5 rounded-full border
                border-white/10 hover:border-white/30 text-white/50 hover:text-white
                text-xs tracking-widest uppercase transition-all duration-200"
            >
              Our Story
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
            className="absolute bottom-8 left-8 sm:left-14 lg:left-20 flex items-center gap-3"
          >
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.8 }}
            >
              <ChevronDown size={14} className="text-white/20 -rotate-90" />
            </motion.div>
            <span className="text-[10px] text-white/20 tracking-[0.3em] uppercase">Scroll</span>
          </motion.div>
        </motion.div>

        {/* Right — food image */}
        <motion.div style={{ y: heroY }} className="relative hidden lg:block">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=85"
            alt="Signature dish"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#0A0A0A] via-[#0A0A0A]/10 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-[#0A0A0A]/60 via-transparent to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-12 left-8 bg-[#0D0D0D]/90 backdrop-blur-md
              border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E85D04]/15 flex items-center justify-center text-[#E85D04]">
              <Star size={18} fill="currentColor" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm" style={{ fontFamily: "'Playfair Display', serif" }}>
                4.9 / 5
              </p>
              <p className="text-white/30 text-xs">From 1,200+ orders</p>
            </div>
          </motion.div>
        </motion.div>

        {/* Mobile glow */}
        <div
          className="absolute inset-0 lg:hidden pointer-events-none"
          style={{ background: `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(232,93,4,0.07) 0%, transparent 70%)` }}
        />
      </section>

      {/* PERKS */}
      <section className="border-y border-[#1A1A1A] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#1A1A1A]">
            {perks.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 px-6 first:pl-0 last:pr-0 py-2 sm:py-0">
                <div className="w-9 h-9 rounded-xl bg-[#E85D04]/10 flex items-center justify-center text-[#E85D04] shrink-0">
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {title}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED DISHES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <motion.p {...fadeUp(0)} className="text-[10px] tracking-[0.4em] uppercase text-[#E85D04] mb-2">
              Chef's Selections
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="text-3xl lg:text-4xl font-bold text-white"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Featured Dishes
            </motion.h2>
          </div>
          <Link
            to="/menu"
            className="hidden sm:flex items-center gap-1.5 text-xs text-white/40
              hover:text-[#E85D04] transition-colors group tracking-widest uppercase"
          >
            View all
            <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loadingItems ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-stretch">
            {featuredItems.map((item) => (
              <div key={item._id} className="flex">
                <FeaturedCard item={item} />
              </div>
            ))}
          </div>
        )}

        <div className="flex sm:hidden justify-center mt-8">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full
              border border-white/10 hover:border-[#E85D04]/40 text-white/40
              hover:text-white text-xs tracking-widest uppercase transition-all"
          >
            View Full Menu <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-[#1A1A1A] bg-[#080808]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
          <motion.p {...fadeUp(0)} className="text-[10px] tracking-[0.4em] uppercase text-[#E85D04] mb-2 text-center">
            Simple process
          </motion.p>
          <motion.h2
            {...fadeUp(0.08)}
            className="text-2xl lg:text-3xl font-bold text-white text-center mb-14"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Order in 3 steps
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 relative">
            <div className="hidden sm:block absolute top-5 left-[16.6%] right-[16.6%]
              h-px bg-linear-to-r from-transparent via-[#E85D04]/20 to-transparent" />
            {steps.map(({ n, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.12)} className="relative text-center">
                <div className="w-10 h-10 rounded-full border border-[#E85D04]/30
                  flex items-center justify-center mx-auto mb-5 bg-[#0A0A0A]">
                  <span className="text-[10px] text-[#E85D04] font-bold tracking-wider">{n}</span>
                </div>
                <p className="text-sm font-semibold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {title}
                </p>
                <p className="text-xs text-white/30 leading-relaxed max-w-45 mx-auto">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <motion.div
          {...fadeUp(0)}
          className="relative rounded-3xl overflow-hidden bg-[#E85D04]
            flex flex-col sm:flex-row items-center justify-between gap-8 px-10 py-12"
        >
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-white/50 mb-2">Ready to order?</p>
            <h2 className="text-2xl lg:text-3xl font-bold text-white" style={{ fontFamily: "'Playfair Display', serif" }}>
              Order Now, Eat Well.
            </h2>
            <p className="text-white/60 text-sm mt-2">Delivered in under 45 minutes. No compromise.</p>
          </div>
          <Link
            to="/menu"
            className="group shrink-0 inline-flex items-center gap-2 px-8 py-4
              rounded-full bg-[#0A0A0A] hover:bg-[#111111] text-white
              text-xs font-medium tracking-widest uppercase transition-colors"
          >
            Start Your Order
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />
        </motion.div>
      </section>

    </div>
  );
};

export default Home;