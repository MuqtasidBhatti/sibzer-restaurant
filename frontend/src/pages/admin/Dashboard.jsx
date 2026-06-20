import { useEffect, useState } from 'react'
import { ShoppingBag, Users, Clock, CalendarCheck, TrendingUp, Star } from 'lucide-react'
import {
    AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import api from '../../services/api'
import formatPrice from '../../utils/formatPrice'

function StatCard({ label, value, icon: Icon, sub }) {
    return (
        <div className="bg-white/3 border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
                <span className="text-white/40 text-xs uppercase tracking-widest">{label}</span>
                <div className="w-8 h-8 rounded-lg bg-[#E85D04]/10 flex items-center justify-center">
                    <Icon size={15} className="text-[#E85D04]" />
                </div>
            </div>
            <p className="text-2xl font-semibold text-white">{value}</p>
            {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
        </div>
    )
}

const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs">
            <p className="text-white/50 mb-1">{label}</p>
            {payload.map((p) => (
                <p key={p.name} style={{ color: p.color }}>
                    {p.name === 'revenue' ? formatPrice(p.value) : p.value}
                </p>
            ))}
        </div>
    )
}

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get('/dashboard/stats')
            .then((res) => setStats(res.data.stats))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="p-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-28 rounded-xl bg-white/5 animate-pulse" />
                ))}
            </div>
        )
    }

    if (!stats) {
        return <p className="p-8 text-white/40 text-sm">Failed to load dashboard data.</p>
    }

    return (
        <div className="p-6 lg:p-8 space-y-8">
            <div>
                <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                    Dashboard
                </h1>
                <p className="text-white/40 text-sm mt-1">Today's overview</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Today's Revenue" value={formatPrice(stats.todayRevenue)} icon={TrendingUp} sub="Cash + Card" />
                <StatCard label="Today's Orders" value={stats.todayOrders} icon={ShoppingBag} sub="All types" />
                <StatCard label="Total Orders" value={stats.totalOrders} icon={CalendarCheck} />
                <StatCard label="Total Users" value={stats.totalUsers} icon={Users} />
            </div>

            {/* Pending row */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-yellow-400/5 border border-yellow-400/20 rounded-xl p-5 flex items-center gap-4">
                    <Clock size={20} className="text-yellow-400 shrink-0" />
                    <div>
                        <p className="text-yellow-400 text-xl font-semibold">{stats.pendingOrders}</p>
                        <p className="text-white/40 text-xs">Pending Orders</p>
                    </div>
                </div>
                <div className="bg-blue-400/5 border border-blue-400/20 rounded-xl p-5 flex items-center gap-4">
                    <CalendarCheck size={20} className="text-blue-400 shrink-0" />
                    <div>
                        <p className="text-blue-400 text-xl font-semibold">{stats.pendingReservations}</p>
                        <p className="text-white/40 text-xs">Pending Reservations</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue chart */}
                <div className="bg-white/2 border border-white/10 rounded-xl p-5">
                    <p className="text-white/60 text-sm mb-5">Revenue — Last 7 Days</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={stats.last7Days}>
                            <defs>
                                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#E85D04" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#E85D04" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid stroke="#ffffff08" />
                            <XAxis
                                dataKey="date"
                                tick={{ fill: '#ffffff40', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickFormatter={(d) => {
                                    const date = new Date(d)
                                    return `${date.getDate()} ${date.toLocaleString('default', { month: 'short' })}`
                                }}
                            />
                            <YAxis
                                tick={{ fill: '#ffffff40', fontSize: 11 }}
                                axisLine={false}
                                tickLine={false}
                                tickCount={5}
                                tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" stroke="#E85D04" fill="url(#rev)" strokeWidth={2} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders chart */}
                <div className="bg-white/2 border border-white/10 rounded-xl p-5">
                    <p className="text-white/60 text-sm mb-5">Orders — Last 7 Days</p>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={stats.last7Days}>
                            <CartesianGrid stroke="#ffffff08" />
                            <XAxis dataKey="date" tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#ffffff40', fontSize: 11 }} axisLine={false} tickLine={false} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="orders" fill="#E85D04" radius={[4, 4, 0, 0]} opacity={0.8} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Items */}
            <div className="bg-white/2 border border-white/10 rounded-xl p-5">
                <p className="text-white/60 text-sm mb-5 flex items-center gap-2">
                    <Star size={14} className="text-[#E85D04]" /> Top 5 Items
                </p>
                <div className="space-y-3">
                    {stats.topItems?.map((item, i) => (
                        <div key={item._id} className="flex items-center gap-4">
                            <span className="text-white/20 text-xs w-4">{i + 1}</span>
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-white/70">{item.name}</span>
                                    <span className="text-white/40">{item.totalSold} sold</span>
                                </div>
                                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                                    <div
                                        className="h-full bg-[#E85D04] rounded-full"
                                        style={{ width: `${(item.totalQty / (stats.topItems[0]?.totalQty || 1)) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}