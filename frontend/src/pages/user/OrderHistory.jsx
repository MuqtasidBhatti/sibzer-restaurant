import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Package, ChevronDown, ChevronUp, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import orderService from '../../services/orderService'
import formatPrice from '../../utils/formatPrice'
import formatDate from '../../utils/formatDate'

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'text-orange-400', bg: 'bg-orange-400/10', icon: Clock },
    ready: { label: 'Ready', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
    'out-for-delivery': { label: 'Out for Delivery', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Truck },
    completed: { label: 'Completed', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
}

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
    const Icon = cfg.icon
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}>
            <Icon size={12} />
            {cfg.label}
        </span>
    )
}

function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false)

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/2 hover:bg-white/4 transition-colors">
            {/* Header */}
            <div
                className="flex items-center justify-between p-5 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#E85D04]/10 flex items-center justify-center">
                        <Package size={18} className="text-[#E85D04]" />
                    </div>
                    <div>
                        <p className="text-white font-medium text-sm">
                            Order #{order._id.slice(-6).toUpperCase()}
                        </p>
                        <p className="text-white/40 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <StatusBadge status={order.status} />
                    <p className="text-white font-semibold text-sm hidden sm:block">
                        {formatPrice(order.total)}
                    </p>
                    {expanded ? (
                        <ChevronUp size={16} className="text-white/40" />
                    ) : (
                        <ChevronDown size={16} className="text-white/40" />
                    )}
                </div>
            </div>

            {/* Expanded Details */}
            {expanded && (
                <div className="border-t border-white/10 p-5 space-y-4">
                    {/* Items */}
                    <div className="space-y-2">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center text-sm">
                                <span className="text-white/70">
                                    {item.name}
                                    <span className="text-white/40 ml-2">x{item.qty}</span>
                                </span>
                                <span className="text-white/70">{formatPrice(item.price * item.qty)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="border-t border-white/10 pt-4 space-y-1.5 text-sm">
                        <div className="flex justify-between text-white/50">
                            <span>Subtotal</span>
                            <span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span>Discount</span>
                                <span>- {formatPrice(order.discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-white/50">
                            <span>Tax</span>
                            <span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-white font-semibold pt-1 border-t border-white/10">
                            <span>Total</span>
                            <span>{formatPrice(order.total)}</span>
                        </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 text-xs text-white/40 pt-1">
                        <span>Type: <span className="text-white/60 capitalize">{order.orderType}</span></span>
                        <span>Payment: <span className="text-white/60 capitalize">{order.paymentMethod}</span></span>
                        {order.couponCode && (
                            <span>Coupon: <span className="text-[#E85D04]">{order.couponCode}</span></span>
                        )}
                    </div>

                    {order.note && (
                        <p className="text-xs text-white/40 italic">Note: {order.note}</p>
                    )}
                </div>
            )}
        </div>
    )
}

export default function OrderHistory() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrders = async (silent = false) => {
        if (!silent) setLoading(true)
        try {
            const data = await orderService.getMyOrders()
            setOrders(Array.isArray(data) ? data : data.orders ?? [])
            setError(null)
        } catch {
            if (!silent) setError('Failed to load orders.')
        } finally {
            if (!silent) setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()

        const interval = setInterval(() => {
            fetchOrders(true)
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="min-h-screen bg-black pt-24 pb-16 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Page Header */}
                <div className="mb-10">
                    <h1
                        className="text-3xl text-white mb-2"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        Order History
                    </h1>
                    <p className="text-white/40 text-sm">Track and review all your past orders.</p>
                </div>

                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-20 rounded-xl bg-white/5 animate-pulse" />
                        ))}
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div className="text-center py-20 border border-white/10 rounded-xl">
                        <Package size={40} className="text-white/20 mx-auto mb-4" />
                        <p className="text-white/40 text-sm">No orders yet.</p>
                        <Link
                            to="/menu"
                            className="inline-block mt-4 text-[#E85D04] text-sm hover:underline"
                        >
                            Browse the menu
                        </Link>
                    </div>
                )}

                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}