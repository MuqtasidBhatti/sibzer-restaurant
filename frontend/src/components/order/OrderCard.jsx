import { useState } from 'react'
import { ChevronDown, ChevronUp, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'
import { formatPrice } from '../../utils/formatPrice'
import { formatDate } from '../../utils/formatDate'

const STATUS_CONFIG = {
    pending: { label: 'Pending', color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-400/10', icon: CheckCircle },
    preparing: { label: 'Preparing', color: 'text-orange-400', bg: 'bg-orange-400/10', icon: Clock },
    ready: { label: 'Ready', color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle },
    'out-for-delivery': { label: 'Out for Delivery', color: 'text-purple-400', bg: 'bg-purple-400/10', icon: Truck },
    completed: { label: 'Completed', color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
    cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-400/10', icon: XCircle },
}

export default function OrderCard({ order }) {
    const [expanded, setExpanded] = useState(false)

    const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
    const Icon = cfg.icon

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-white/2 hover:bg-white/4 transition-colors">
            {/* Header row — always visible */}
            <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="w-10 h-10 rounded-lg bg-[#E85D04]/10 flex items-center justify-center shrink-0">
                    <Package size={17} className="text-[#E85D04]" />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">
                        Order #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="text-white/40 text-xs mt-0.5">{formatDate(order.createdAt)}</p>
                </div>

                {/* Status badge */}
                <span className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}>
                    <Icon size={11} />
                    {cfg.label}
                </span>

                <p className="text-white font-semibold text-sm shrink-0">{formatPrice(order.total)}</p>

                {expanded
                    ? <ChevronUp size={15} className="text-white/30 shrink-0" />
                    : <ChevronDown size={15} className="text-white/30 shrink-0" />
                }
            </div>

            {/* Expanded body */}
            {expanded && (
                <div className="border-t border-white/10 p-5 space-y-4">
                    {/* Mobile status */}
                    <div className="sm:hidden">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${cfg.color} ${cfg.bg}`}>
                            <Icon size={11} />
                            {cfg.label}
                        </span>
                    </div>

                    {/* Line items */}
                    <div className="space-y-2">
                        {order.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center">
                                <span className="text-white/60 text-sm">
                                    {item.name}
                                    <span className="text-white/30 ml-2 text-xs">x{item.qty}</span>
                                </span>
                                <span className="text-white/50 text-sm">{formatPrice(item.price * item.qty)}</span>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-white/10 pt-4 space-y-1.5 text-sm">
                        <div className="flex justify-between text-white/40">
                            <span>Subtotal</span><span>{formatPrice(order.subtotal)}</span>
                        </div>
                        {order.discount > 0 && (
                            <div className="flex justify-between text-green-400">
                                <span>Discount</span><span>-{formatPrice(order.discount)}</span>
                            </div>
                        )}
                        <div className="flex justify-between text-white/40">
                            <span>Tax</span><span>{formatPrice(order.tax)}</span>
                        </div>
                        <div className="flex justify-between text-white font-semibold border-t border-white/10 pt-2">
                            <span>Total</span><span>{formatPrice(order.total)}</span>
                        </div>
                    </div>

                    {/* Meta info */}
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-white/30">
                        <span>Type: <span className="text-white/50 capitalize">{order.orderType}</span></span>
                        <span>Payment: <span className="text-white/50 capitalize">{order.paymentMethod}</span></span>
                        {order.couponCode && (
                            <span>Coupon: <span className="text-[#E85D04]">{order.couponCode}</span></span>
                        )}
                    </div>

                    {order.note && (
                        <p className="text-xs text-white/30 italic">"{order.note}"</p>
                    )}
                </div>
            )}
        </div>
    )
}