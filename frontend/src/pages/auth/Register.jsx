import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const FOOD_IMAGE = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'

const PERKS = [
    'Track all your orders in real-time',
    'Exclusive member discounts & coupons',
    'Save your favourite dishes',
]

export default function Register() {
    const navigate = useNavigate()
    const { register } = useAuthStore()

    const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
    const [showPass, setShowPass] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.password) return toast.error('Fill in all required fields.')
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters.')
        if (form.password !== form.confirmPassword) return toast.error('Passwords do not match.')
        setLoading(true)
        try {
            const data = await register({ name: form.name, email: form.email, phone: form.phone || undefined, password: form.password })
            toast.success(`Welcome to Sibzer, ${data.user?.name?.split(' ')[0]}!`)
            navigate('/')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Registration failed.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen bg-[#080808] flex overflow-hidden">

            {/* Left panel */}
            <div className="hidden lg:block lg:w-[48%] relative overflow-hidden">
                <img src={FOOD_IMAGE} alt="Fine dining" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-linear-to-r from-black/85 via-black/55 to-black/20" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />

                {/* Content pinned top + bottom */}
                <div className="absolute inset-0 flex flex-col justify-between p-14">
                    <Link to="/">
                        <span className="text-2xl font-bold tracking-wider text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            SIB<span className="text-[#E85D04]">ZER</span>
                        </span>
                    </Link>

                    <div>
                        <p className="text-xs tracking-[0.4em] uppercase text-[#E85D04] mb-4">Join the experience</p>
                        <h2 className="text-5xl font-bold text-white leading-tight mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Your table<br />awaits.
                        </h2>
                        <div className="space-y-3 mb-10">
                            {PERKS.map((perk) => (
                                <div key={perk} className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-[#E85D04]/20 border border-[#E85D04]/40 flex items-center justify-center shrink-0">
                                        <Check size={11} className="text-[#E85D04]" />
                                    </div>
                                    <p className="text-white/55 text-sm">{perk}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-px bg-[#E85D04]" />
                            <p className="text-white/30 text-xs tracking-widest uppercase">Karachi, Pakistan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-8 relative overflow-y-auto">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,93,4,0.07) 0%, transparent 70%)' }}
                />

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  className="w-full max-w-md relative"
                  >
                    <Link to="/" className="lg:hidden block mb-10">
                        <span className="text-2xl font-bold tracking-wider text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            SIB<span className="text-[#E85D04]">ZER</span>
                        </span>
                    </Link>

                    <div className="mb-8">
                        <p className="text-xs tracking-[0.35em] uppercase text-[#E85D04] mb-3">New member</p>
                        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Create account</h1>
                        <p className="text-white/40 text-sm mt-2">
                            Already have one?{' '}
                            <Link to="/login" className="text-[#E85D04] hover:text-[#ff6b1a] transition-colors">Sign in</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Full Name</label>
                            <div className="relative">
                                <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Ahmad Khan"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                    className="w-full border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="you@example.com"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                    className="w-full border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">
                                Phone <span className="text-white/20 normal-case tracking-normal">(optional)</span>
                            </label>
                            <div className="relative">
                                <Phone size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                                <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 0000000"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                    className="w-full border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/50 transition-all"
                                />
                            </div>
                        </div>

                        {/* Password + Confirm side by side */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Password</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                                    <input type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Min. 6 chars"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}
                                        className="w-full border border-white/10 rounded-xl pl-11 pr-9 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/50 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                                        {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Confirm</label>
                                <div className="relative">
                                    <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                                    <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Repeat"
                                        style={{ background: 'rgba(255,255,255,0.04)' }}
                                        className="w-full border border-white/10 rounded-xl pl-11 pr-9 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/50 transition-all"
                                    />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                                        {showConfirm ? <EyeOff size={13} /> : <Eye size={13} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Match indicator */}
                        {form.confirmPassword && (
                            <p className={`text-xs px-1 ${form.password === form.confirmPassword ? 'text-green-400' : 'text-red-400'}`}>
                                {form.password === form.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                            </p>
                        )}

                        <button
                            type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white font-medium py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 group"
                        >
                            {loading ? <span className="text-sm">Creating account...</span> : (
                                <>
                                    <span className="text-sm tracking-widest uppercase">Create Account</span>
                                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}