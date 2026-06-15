import { useEffect, useState } from 'react'
import { Plus, Trash2, X, Save, Tag, Calendar, AlertCircle } from 'lucide-react'
import couponService from '../../services/couponService'
import formatDate from '../../utils/formatDate'
import formatPrice from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxUses: '',
    expiresAt: '',
    isActive: true,
}

function CouponRow({ coupon, onDelete }) {
    const expired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date()

    return (
        <div className="flex flex-wrap items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#E85D04]/10 flex items-center justify-center shrink-0">
                    <Tag size={15} className="text-[#E85D04]" />
                </div>
                <div>
                    <p className="text-white font-mono font-semibold text-sm">{coupon.code}</p>
                    <p className="text-white/30 text-xs">
                        {coupon.discountType === 'percentage'
                            ? `${coupon.discountValue}% off`
                            : `${formatPrice(coupon.discountValue)} off`}
                        {coupon.minOrderAmount > 0 && ` · Min ${formatPrice(coupon.minOrderAmount)}`}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-6 text-xs text-white/40">
                <div>
                    <p className="text-white/20 mb-0.5">Uses</p>
                    <p className="text-white/60">{coupon.usedCount} / {coupon.maxUses || '∞'}</p>
                </div>
                <div>
                    <p className="text-white/20 mb-0.5">Expires</p>
                    <p className={expired ? 'text-red-400' : 'text-white/60'}>
                        {coupon.expiresAt ? formatDate(coupon.expiresAt) : 'Never'}
                    </p>
                </div>
                <span className={`px-2 py-0.5 rounded-full ${!coupon.isActive || expired
                    ? 'bg-white/5 text-white/30'
                    : 'bg-green-400/10 text-green-400'
                    }`}>
                    {!coupon.isActive || expired ? 'Inactive' : 'Active'}
                </span>
            </div>

            <button
                onClick={() => onDelete(coupon._id)}
                className="p-1.5 rounded-lg hover:bg-red-400/10 text-white/30 hover:text-red-400 transition-colors"
            >
                <Trash2 size={14} />
            </button>
        </div>
    )
}

function SlidePanel({ open, onClose, form, setForm, onSave, saving }) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="w-full max-w-md bg-[#0d0d0d] border-l border-white/10 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h2 className="text-white font-medium" style={{ fontFamily: 'Playfair Display, serif' }}>
                        New Coupon
                    </h2>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Code */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Code</label>
                        <input
                            value={form.code}
                            onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                            placeholder="SAVE20"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                    </div>

                    {/* Discount Type */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Discount Type</label>
                        <div className="grid grid-cols-2 gap-2">
                            {['percentage', 'fixed'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setForm(p => ({ ...p, discountType: type }))}
                                    className={`py-2.5 rounded-lg text-sm capitalize border transition-colors ${form.discountType === type
                                        ? 'border-[#E85D04] bg-[#E85D04]/10 text-[#E85D04]'
                                        : 'border-white/10 text-white/40 hover:text-white'
                                        }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Discount Value */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">
                            Value {form.discountType === 'percentage' ? '(%)' : '(Rs.)'}
                        </label>
                        <input
                            type="number"
                            value={form.discountValue}
                            onChange={e => setForm(p => ({ ...p, discountValue: e.target.value }))}
                            placeholder={form.discountType === 'percentage' ? '20' : '500'}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                    </div>

                    {/* Min Order */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Min Order Amount (Rs.)</label>
                        <input
                            type="number"
                            value={form.minOrderAmount}
                            onChange={e => setForm(p => ({ ...p, minOrderAmount: e.target.value }))}
                            placeholder="0"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                    </div>

                    {/* Max Uses */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Max Uses (leave blank for unlimited)</label>
                        <input
                            type="number"
                            value={form.maxUses}
                            onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                            placeholder="∞"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors"
                        />
                    </div>

                    {/* Expiry */}
                    <div>
                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-widest">Expiry Date</label>
                        <input
                            type="date"
                            value={form.expiresAt}
                            onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#E85D04]/60 transition-colors scheme-dark"
                        />
                    </div>

                    {/* Active */}
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                        <p className="text-white text-sm">Active</p>
                        <button
                            onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))}
                            className={`w-10 h-6 rounded-full transition-colors ${form.isActive ? 'bg-[#E85D04]' : 'bg-white/10'}`}
                        >
                            <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-1 ${form.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10">
                    <button
                        onClick={onSave}
                        disabled={saving || !form.code.trim() || !form.discountValue}
                        className="w-full flex items-center justify-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm font-medium py-3 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save size={15} />
                        {saving ? 'Saving...' : 'Create Coupon'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ManageCoupons() {
    const [coupons, setCoupons] = useState([])
    const [loading, setLoading] = useState(true)
    const [panelOpen, setPanelOpen] = useState(false)
    const [form, setForm] = useState(EMPTY_FORM)
    const [saving, setSaving] = useState(false)

    const load = async () => {
        try {
            const data = await couponService.adminGetAll()
            setCoupons(Array.isArray(data) ? data : data.coupons ?? [])
        } catch {
            toast.error('Failed to load coupons.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleSave = async () => {
        if (!form.code.trim() || !form.discountValue) return toast.error('Code and value are required.')
        setSaving(true)
        try {
            await couponService.create({
                ...form,
                discountValue: Number(form.discountValue),
                minOrderAmount: Number(form.minOrderAmount) || 0,
                maxUses: form.maxUses ? Number(form.maxUses) : undefined,
                expiresAt: form.expiresAt || undefined,
            })
            toast.success('Coupon created.')
            setPanelOpen(false)
            setForm(EMPTY_FORM)
            load()
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Save failed.')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return
        try {
            await couponService.remove(id)
            toast.success('Deleted.')
            load()
        } catch {
            toast.error('Delete failed.')
        }
    }

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Coupons
                    </h1>
                    <p className="text-white/40 text-sm mt-1">{coupons.length} total</p>
                </div>
                <button
                    onClick={() => { setForm(EMPTY_FORM); setPanelOpen(true) }}
                    className="flex items-center gap-2 bg-[#E85D04] hover:bg-[#d44f00] text-white text-sm px-4 py-2.5 rounded-lg transition-colors"
                >
                    <Plus size={15} /> New Coupon
                </button>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />)}
                </div>
            ) : coupons.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-20">No coupons yet.</p>
            ) : (
                <div className="space-y-3">
                    {coupons.map(c => (
                        <CouponRow key={c._id} coupon={c} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            <SlidePanel
                open={panelOpen}
                onClose={() => setPanelOpen(false)}
                form={form}
                setForm={setForm}
                onSave={handleSave}
                saving={saving}
            />
        </div>
    )
}