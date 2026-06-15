import { Clock, CheckCircle, ChefHat, Bell, Truck, PackageCheck, XCircle } from 'lucide-react'

// The full delivery pipeline. Pickup/dine-in won't show the delivery step.
const ALL_STEPS = [
    { key: 'pending', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
    { key: 'preparing', label: 'Preparing', icon: ChefHat },
    { key: 'ready', label: 'Ready', icon: Bell },
    { key: 'out-for-delivery', label: 'Out for Delivery', icon: Truck },
    { key: 'completed', label: 'Delivered', icon: PackageCheck },
]

const PICKUP_STEPS = ALL_STEPS.filter(s => s.key !== 'out-for-delivery')

export default function OrderTracker({ status, orderType }) {
    if (status === 'cancelled') {
        return (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-400/10 border border-red-400/20">
                <XCircle size={18} className="text-red-400 shrink-0" />
                <div>
                    <p className="text-red-400 text-sm font-medium">Order Cancelled</p>
                    <p className="text-white/30 text-xs mt-0.5">This order has been cancelled.</p>
                </div>
            </div>
        )
    }

    const steps = orderType === 'delivery' ? ALL_STEPS : PICKUP_STEPS

    const currentIndex = steps.findIndex(s => s.key === status)
    // If status doesn't map to a step (edge case), treat as first step
    const activeIndex = currentIndex === -1 ? 0 : currentIndex

    return (
        <div className="w-full">
            {/* Desktop: horizontal stepper */}
            <div className="hidden sm:flex items-center">
                {steps.map((step, i) => {
                    const Icon = step.icon
                    const done = i < activeIndex
                    const active = i === activeIndex
                    const upcoming = i > activeIndex

                    return (
                        <div key={step.key} className="flex items-center flex-1 last:flex-none">
                            {/* Step node */}
                            <div className="flex flex-col items-center gap-2">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${done ? 'bg-[#E85D04] border-[#E85D04]' :
                                        active ? 'bg-[#E85D04]/20 border-[#E85D04]' :
                                            'bg-white/5 border-white/10'
                                    }`}>
                                    <Icon size={15} className={
                                        done ? 'text-white' :
                                            active ? 'text-[#E85D04]' :
                                                'text-white/20'
                                    } />
                                </div>
                                <span className={`text-xs text-center whitespace-nowrap ${active ? 'text-[#E85D04]' :
                                        done ? 'text-white/60' :
                                            'text-white/20'
                                    }`}>
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector line */}
                            {i < steps.length - 1 && (
                                <div className="flex-1 h-px mx-2 mb-5 relative">
                                    <div className="absolute inset-0 bg-white/10 rounded-full" />
                                    <div
                                        className="absolute inset-y-0 left-0 bg-[#E85D04] rounded-full transition-all duration-500"
                                        style={{ width: done ? '100%' : active ? '50%' : '0%' }}
                                    />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Mobile: vertical stepper */}
            <div className="flex flex-col gap-0 sm:hidden">
                {steps.map((step, i) => {
                    const Icon = step.icon
                    const done = i < activeIndex
                    const active = i === activeIndex

                    return (
                        <div key={step.key} className="flex items-start gap-3">
                            {/* Icon + vertical line */}
                            <div className="flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${done ? 'bg-[#E85D04] border-[#E85D04]' :
                                        active ? 'bg-[#E85D04]/20 border-[#E85D04]' :
                                            'bg-white/5 border-white/10'
                                    }`}>
                                    <Icon size={13} className={
                                        done ? 'text-white' : active ? 'text-[#E85D04]' : 'text-white/20'
                                    } />
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="w-px flex-1 min-h-6 my-1 relative">
                                        <div className="absolute inset-0 bg-white/10" />
                                        <div
                                            className="absolute inset-x-0 top-0 bg-[#E85D04] transition-all duration-500"
                                            style={{ height: done ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Label */}
                            <p className={`text-sm pt-1.5 pb-6 ${active ? 'text-[#E85D04]' : done ? 'text-white/50' : 'text-white/20'
                                }`}>
                                {step.label}
                                {active && (
                                    <span className="ml-2 text-xs bg-[#E85D04]/10 text-[#E85D04] px-2 py-0.5 rounded-full">
                                        Current
                                    </span>
                                )}
                            </p>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}