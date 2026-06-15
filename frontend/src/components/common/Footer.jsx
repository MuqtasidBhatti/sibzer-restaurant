import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { NAV_LINKS, RESTAURANT_INFO } from "../../constants";

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-[#080808] border-t border-[#1A1A1A]">

            {/* ── Top Divider Line ─────────────────────────────── */}
            <div className="h-px bg-linear-to-r from-transparent via-[#E85D04]/40 to-transparent" />

            {/* ── Main Grid ────────────────────────────────────── */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

                    {/* Col 1 — Brand ─────────────────────────────── */}
                    <div className="lg:col-span-1">
                        <Link to="/">
                            <span
                                className="text-3xl font-bold tracking-wider text-white"
                                style={{ fontFamily: "'Playfair Display', serif" }}
                            >
                                SIB<span className="text-[#E85D04]">ZER</span>
                            </span>
                        </Link>
                        <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                            {RESTAURANT_INFO.tagline}. Fine dining crafted with passion,
                            served with pride in the heart of Karachi.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3 mt-6">
                            <a
                                href={RESTAURANT_INFO.social.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-[#2A2A2A] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#E85D04] hover:bg-[#E85D04]/10 transition-all duration-200"
                                aria-label="Instagram"
                            >
                                <FaInstagram size={15} />
                            </a>

                            <a
                                href={RESTAURANT_INFO.social.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 rounded-full border border-[#2A2A2A] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#E85D04] hover:bg-[#E85D04]/10 transition-all duration-200"
                                aria-label="Facebook"
                            >
                                <FaFacebookF size={15} />
                            </a>
                        </div>
                    </div>

                    {/* Col 2 — Navigation ─────────────────────────── */}
                    <div>
                        <h4
                            className="text-xs tracking-[0.3em] uppercase text-[#E85D04] mb-6 font-medium"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Explore
                        </h4>
                        <ul className="space-y-3">
                            {NAV_LINKS.map(({ label, path }) => (
                                <li key={path}>
                                    <Link
                                        to={path}
                                        className="text-sm text-gray-400 hover:text-white transition-colors
                               hover:translate-x-1 inline-block duration-200"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link
                                    to="/orders"
                                    className="text-sm text-gray-400 hover:text-white transition-colors
                             hover:translate-x-1 inline-block duration-200"
                                >
                                    Track Order
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3 — Contact ─────────────────────────────── */}
                    <div>
                        <h4
                            className="text-xs tracking-[0.3em] uppercase text-[#E85D04] mb-6 font-medium"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Contact
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin size={15} className="text-[#E85D04] mt-0.5 shrink-0" />
                                <span>{RESTAURANT_INFO.address}</span>
                            </li>
                            <li>
                                <a
                                    href={`tel:${RESTAURANT_INFO.phone}`}
                                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    <Phone size={15} className="text-[#E85D04] shrink-0" />
                                    <span>{RESTAURANT_INFO.phone}</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href={`mailto:${RESTAURANT_INFO.email}`}
                                    className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    <Mail size={15} className="text-[#E85D04] shrink-0" />
                                    <span>{RESTAURANT_INFO.email}</span>
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4 — Hours ───────────────────────────────── */}
                    <div>
                        <h4
                            className="text-xs tracking-[0.3em] uppercase text-[#E85D04] mb-6 font-medium"
                            style={{ fontFamily: "'Playfair Display', serif" }}
                        >
                            Hours
                        </h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Clock size={15} className="text-[#E85D04] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Mon – Fri</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{RESTAURANT_INFO.hours.weekdays}</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Clock size={15} className="text-[#E85D04] mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-sm text-white font-medium">Sat – Sun</p>
                                    <p className="text-xs text-gray-500 mt-0.5">{RESTAURANT_INFO.hours.weekends}</p>
                                </div>
                            </li>
                        </ul>

                        {/* CTA */}
                        <Link
                            to="/menu"
                            className="inline-block mt-8 px-5 py-2.5 rounded-full bg-[#E85D04] hover:bg-[#C44D02]
                         text-white text-sm tracking-wider uppercase transition-colors duration-200"
                        >
                            Order Now
                        </Link>
                    </div>
                </div>
            </div>

            {/* ── Bottom Bar ───────────────────────────────────── */}
            <div className="border-t border-[#1A1A1A]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs text-gray-600">
                        © {year} Sibzer. All rights reserved.
                    </p>
                    <p className="text-xs text-gray-700">
                        Crafted with care in Karachi, Pakistan
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;