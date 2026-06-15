import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { RESTAURANT_INFO } from "../../constants";
import Loader from "../../components/common/Loader";
import api from '../../services/api'

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay },
});

const Contact = () => {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error("Please fill in all required fields.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/messages', form)
            toast.success("Message sent! We'll get back to you soon.");
            setForm({ name: "", email: "", subject: "", message: "" });
        } catch (err) {
            toast.error("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const contactItems = [
        {
            icon: <MapPin size={18} />,
            label: "Address",
            value: RESTAURANT_INFO.address,
            href: null,
        },
        {
            icon: <Phone size={18} />,
            label: "Phone",
            value: RESTAURANT_INFO.phone,
            href: `tel:${RESTAURANT_INFO.phone}`,
        },
        {
            icon: <Mail size={18} />,
            label: "Email",
            value: RESTAURANT_INFO.email,
            href: `mailto:${RESTAURANT_INFO.email}`,
        },
        {
            icon: <Clock size={18} />,
            label: "Hours",
            value: `Mon–Fri: ${RESTAURANT_INFO.hours.weekdays}`,
            sub: `Sat–Sun: ${RESTAURANT_INFO.hours.weekends}`,
            href: null,
        },
    ];

    return (
        <div className="bg-[#0A0A0A] text-white pt-20 min-h-screen">

            {/* ── Header ───────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-12">
                <motion.p {...fadeUp(0)} className="text-xs tracking-[0.4em] uppercase text-[#E85D04] mb-3">
                    Get In Touch
                </motion.p>
                <motion.h1
                    {...fadeUp(0.1)}
                    className="text-4xl lg:text-5xl font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                >
                    We'd Love to<br />
                    <span className="text-[#E85D04]">Hear From You</span>
                </motion.h1>
            </section>

            {/* ── Main grid ────────────────────────────────── */}
            <section className="max-w-7xl mx-auto px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* Left — contact info (2 cols) */}
                    <motion.div {...fadeUp(0)} className="lg:col-span-2 space-y-4">
                        {contactItems.map(({ icon, label, value, sub, href }) => (
                            <div
                                key={label}
                                className="flex items-start gap-4 bg-[#111111] border border-[#1E1E1E]
                           rounded-2xl p-5 hover:border-[#E85D04]/25 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 flex items-center
                                justify-center text-[#E85D04] shrink-0">
                                    {icon}
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 tracking-wider uppercase mb-1">
                                        {label}
                                    </p>
                                    {href ? (
                                        <a
                                            href={href}
                                            className="text-sm text-gray-300 hover:text-white transition-colors"
                                        >
                                            {value}
                                        </a>
                                    ) : (
                                        <p className="text-sm text-gray-300">{value}</p>
                                    )}
                                    {sub && <p className="text-sm text-gray-500 mt-0.5">{sub}</p>}
                                </div>
                            </div>
                        ))}
                    </motion.div>

                    {/* Right — contact form (3 cols) */}
                    <motion.div
                        {...fadeUp(0.15)}
                        className="lg:col-span-3 bg-[#111111] border border-[#1E1E1E] rounded-2xl p-7"
                    >
                        <h2
                            className="text-lg font-semibold text-white mb-6"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Send a Message
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Name */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-500 tracking-wider uppercase">
                                        Name <span className="text-[#E85D04]">*</span>
                                    </label>
                                    <input
                                        type="text" name="name" value={form.name}
                                        onChange={handleChange} placeholder="Ahmad Khan" required
                                        className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl
                               text-sm text-white placeholder-gray-600
                               focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                                    />
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs text-gray-500 tracking-wider uppercase">
                                        Email <span className="text-[#E85D04]">*</span>
                                    </label>
                                    <input
                                        type="email" name="email" value={form.email}
                                        onChange={handleChange} placeholder="you@example.com" required
                                        className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl
                               text-sm text-white placeholder-gray-600
                               focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-500 tracking-wider uppercase">
                                    Subject
                                </label>
                                <input
                                    type="text" name="subject" value={form.subject}
                                    onChange={handleChange} placeholder="How can we help?"
                                    className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl
                             text-sm text-white placeholder-gray-600
                             focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                                />
                            </div>

                            {/* Message */}
                            <div className="space-y-1.5">
                                <label className="text-xs text-gray-500 tracking-wider uppercase">
                                    Message <span className="text-[#E85D04]">*</span>
                                </label>
                                <textarea
                                    name="message" value={form.message}
                                    onChange={handleChange} placeholder="Tell us more…"
                                    rows={5} required
                                    className="w-full px-4 py-2.5 bg-[#0D0D0D] border border-[#2A2A2A] rounded-xl
                             text-sm text-white placeholder-gray-600 resize-none
                             focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl
                           bg-[#E85D04] hover:bg-[#C44D02] text-white text-sm
                           font-medium tracking-widest uppercase transition-colors
                           disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <><Loader inline size={4} /> Sending…</>
                                ) : (
                                    <><Send size={14} /> Send Message</>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Contact;