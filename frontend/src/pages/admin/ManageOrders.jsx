import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import orderService from '../../services/orderService'
import formatPrice from '../../utils/formatPrice'
import toast from 'react-hot-toast'

const STATUSES = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'completed', 'cancelled']

const STATUS_COLORS = {
    pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    confirmed: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    preparing: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    ready: 'text-green-400 bg-green-400/10 border-green-400/20',
    'out-for-delivery': 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    completed: 'text-green-500 bg-green-500/10 border-green-500/20',
    cancelled: 'text-red-400 bg-red-400/10 border-red-400/20',
}

function OrderRow({ order, onStatusChange }) {
    const [expanded, setExpanded] = useState(false)
    const [updating, setUpdating] = useState(false)

    const handleStatus = async (status) => {
        setUpdating(true)
        try {
            await orderService.updateStatus(order._id, status)
            onStatusChange()
            toast.success(`Status updated to ${status}.`)
        } catch {
            toast.error('Update failed.')
        } finally {
            setUpdating(false)
        }
    }


    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/2">
            <div
                className="flex flex-col gap-2 p-4 cursor-pointer hover:bg-white/2 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                {/* Row 1: ID + status + chevron */}
                <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-sm font-medium">
                        #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className={`text-xs px-2.5 py-1 rounded-full border capitalize ${STATUS_COLORS[order.status] || ''}`}>
                            {order.status}
                        </span>
                        {expanded
                            ? <ChevronUp size={14} className="text-white/30 shrink-0" />
                            : <ChevronDown size={14} className="text-white/30 shrink-0" />}
                    </div>
                </div>

                {/* Row 2: date + user + type + total */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-white/40">
                        <p>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                        <p>{order.user?.name || 'Guest'}</p>
                        <p className="capitalize">{order.orderType}</p>
                    </div>
                    <p className="text-white font-medium text-sm shrink-0">{formatPrice(order.total)}</p>
                </div>
            </div>

            {expanded && (
                <div className="border-t border-white/10 p-4 space-y-4">
                    {/* Items */}
                    <div className="space-y-1.5">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-white/60">
                                    {item.name} <span className="text-white/30">x{item.qty}</span>
                                </span>
                                <span className="text-white/50">{formatPrice(item.price * item.qty)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="text-xs text-white/40 space-y-1 border-t border-white/10 pt-3">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span>Discount</span>
                                <span>-{formatPrice(order.discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <span>Tax</span>
                            <span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-white font-medium text-sm pt-1 border-t border-white/10">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="text-xs text-white/40 space-y-1">
                        <p>Payment: <span className="text-white/60 capitalize">{order.paymentMethod}</span></p>
                        {order.deliveryAddress && (
                            <p>Address: <span className="text-white/60">{order.deliveryAddress}</span></p>
                        )}
                        {order.note && (
                            <p>Note: <span className="text-white/60 italic">{order.note}</span></p>
                        )}
                    </div>

                    {/* Status changer */}
                    <div className="border-t border-white/10 pt-4">
                        <p className="text-xs text-white/40 mb-2 uppercase tracking-widest">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUSES.map(s => (
                                <button
                                    key={s}
                                    onClick={() => handleStatus(s)}
                                    disabled={updating || order.status === s}
                                    className={`text-xs px-3 py-1.5 rounded-lg border capitalize transition-colors disabled:opacity-40 ${order.status === s
                                        ? STATUS_COLORS[s]
                                        : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default function ManageOrders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const load = async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const data = await orderService.adminGetAll()
            setOrders(Array.isArray(data) ? data : data.orders ?? [])
        } catch {
            if (!silent) toast.error('Failed to load orders.')
        } finally {
            if (!silent) setLoading(false)
        }
    }

    useEffect(() => {
        load()

        const interval = setInterval(() => {
            load(true) // silent background refresh, no skeleton flash
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Orders
                    </h1>
                    <p className="text-white/40 text-sm mt-1">{filtered.length} showing</p>
                </div>
                <button
                    onClick={load}
                    className="flex items-center gap-2 border border-white/10 text-white/50 hover:text-white text-sm px-4 py-2.5 rounded-lg transition-colors w-full sm:w-auto justify-center"
                >
                    <RefreshCw size={14} /> Refresh
                </button>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
                {['all', ...STATUSES].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`text-xs px-3 py-1.5 rounded-lg capitalize transition-colors border ${filter === s
                            ? 'bg-[#E85D04]/10 border-[#E85D04]/40 text-[#E85D04]'
                            : 'border-white/10 text-white/40 hover:text-white'
                            }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-20">No orders found.</p>
            ) : (
                <div className="space-y-3">
                    {filtered.map(order => (
                        <OrderRow key={order._id} order={order} onStatusChange={load} />
                    ))}
                </div>
            )}
        </div>
    )
}