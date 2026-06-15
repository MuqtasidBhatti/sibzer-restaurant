import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const FOOD_IMAGE = 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuthStore()

    const [form, setForm] = useState({ email: '', password: '' })
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) =>
        setForm((p) => ({ ...p, [e.target.name]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) return toast.error('Fill in all fields.')
        setLoading(true)
        try {
            const data = await login(form)
            console.log('login response:', data)
            toast.success(`Welcome back, ${data.user?.name?.split(' ')[0]}!`)
            navigate(data.user?.role === 'admin' ? '/admin' : '/')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Invalid credentials.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="h-screen bg-[#080808] flex overflow-hidden">

            {/* Left panel */}
            <div className="hidden lg:block lg:w-[52%] relative overflow-hidden">
                <img
                    src={FOOD_IMAGE}
                    alt="Fine dining"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/10" />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-black/20" />

                {/* Content pinned top + bottom */}
                <div className="absolute inset-0 flex flex-col justify-between p-14">
                    <Link to="/">
                        <span className="text-2xl font-bold tracking-wider text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                            SIB<span className="text-[#E85D04]">ZER</span>
                        </span>
                    </Link>

                    <div>
                        <p className="text-xs tracking-[0.4em] uppercase text-[#E85D04] mb-4">Fine Dining Experience</p>
                        <h2 className="text-5xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
                            Every meal<br />tells a story.
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed max-w-xs">
                            Sign in to track your orders, manage your profile, and enjoy an elevated dining experience.
                        </p>
                        <div className="flex items-center gap-3 mt-8">
                            <div className="w-12 h-px bg-[#E85D04]" />
                            <p className="text-white/30 text-xs tracking-widest uppercase">Karachi, Pakistan</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right panel */}
            <div className="flex-1 flex items-center justify-center px-8 relative">
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

                    <div className="mb-10">
                        <p className="text-xs tracking-[0.35em] uppercase text-[#E85D04] mb-3">Welcome back</p>
                        <h1 className="text-4xl font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>Sign in</h1>
                        <p className="text-white/40 text-sm mt-2">
                            No account?{' '}
                            <Link to="/register" className="text-[#E85D04] hover:text-[#ff6b1a] transition-colors">Create one</Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                                <input
                                    type="email" name="email" value={form.email} onChange={handleChange}
                                    placeholder="you@example.com"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                    className="w-full border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/50 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs text-white/40 uppercase tracking-widest mb-2">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
                                <input
                                    type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                                    placeholder="••••••••"
                                    style={{ background: 'rgba(255,255,255,0.04)' }}
                                    className="w-full border border-white/10 rounded-xl pl-11 pr-11 py-3.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/50 transition-all"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit" disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white font-medium py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 group"
                        >
                            {loading ? <span className="text-sm">Signing in...</span> : (
                                <>
                                    <span className="text-sm tracking-widest uppercase">Sign In</span>
                                    <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-4 py-1">
                            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                            <span className="text-white/20 text-xs">or</span>
                            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
                        </div>

                        <Link to="/menu" className="w-full flex items-center justify-center border border-white/10 hover:border-white/20 text-white/40 hover:text-white/70 text-sm py-3.5 rounded-xl transition-all">
                            Browse Menu as Guest
                        </Link>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}