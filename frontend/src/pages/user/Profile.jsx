import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import authService from '../../services/authService'
import { User, Mail, Phone, Lock, Save, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

function Field({ label, icon: Icon, children }) {
    return (
        <div>
            <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">
                {label}
            </label>
            <div className="relative">
                <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                {children}
            </div>
        </div>
    )
}

export default function Profile() {
    const { user, updateUser } = useAuthStore()

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
    })
    const [saving, setSaving] = useState(false)

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSave = async (e) => {
        e.preventDefault()
        if (!form.name.trim()) return toast.error('Name is required.')
        setSaving(true)
        try {
            const updated = await authService.updateProfile(form)
            updateUser(updated.user || updated)
            toast.success('Profile updated.')
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Update failed.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="min-h-screen bg-black pt-24 pb-16 px-4">
            <div className="max-w-xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1
                        className="text-3xl text-white mb-2"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        My Profile
                    </h1>
                    <p className="text-white/40 text-sm">Manage your account details.</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-10 p-5 border border-white/10 rounded-xl bg-white/2">
                    <div className="w-14 h-14 rounded-full bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04] text-xl font-bold">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-medium">{user?.name}</p>
                        <p className="text-white/40 text-sm">{user?.email}</p>
                        <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full bg-[#E85D04]/10 text-[#E85D04] capitalize">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-5">
                    <Field label="Full Name" icon={User}>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                    </Field>

                    <Field label="Phone" icon={Phone}>
                        <input
                            type="tel"
                            name="phone"
                            value={form.phone}
                            onChange={handleChange}
                            placeholder="+92 300 0000000"
                            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                    </Field>

                    {/* Read-only email */}
                    <Field label="Email" icon={Mail}>
                        <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full bg-white/3 border border-white/5 rounded-lg pl-11 pr-4 py-3 text-white/30 text-sm cursor-not-allowed"
                        />
                    </Field>

                    <div className="flex items-center gap-2 text-xs text-white/30 px-1">
                        <AlertCircle size={12} />
                        <span>Email cannot be changed.</span>
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                    >
                        <Save size={15} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>

                {/* Security note */}
                <div className="mt-8 p-4 border border-white/10 rounded-xl bg-white/2">
                    <div className="flex items-center gap-2 text-white/50 text-sm mb-1">
                        <Lock size={14} className="text-[#E85D04]" />
                        <span className="font-medium text-white/70">Password</span>
                    </div>
                    <p className="text-white/30 text-xs">
                        Password changes are not supported from this page. Contact support if you need to reset it.
                    </p>
                </div>
            </div>
        </div>
    )
}