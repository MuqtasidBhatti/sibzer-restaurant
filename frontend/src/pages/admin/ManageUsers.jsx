import { useEffect, useState } from 'react'
import { Users, Search, Shield, User } from 'lucide-react'
import authService from '../../services/authService'
import formatDate from '../../utils/formatDate'

function RoleBadge({ role }) {
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${role === 'admin'
                ? 'bg-[#E85D04]/10 text-[#E85D04]'
                : 'bg-white/5 text-white/40'
            }`}>
            {role === 'admin' ? <Shield size={11} /> : <User size={11} />}
            {role}
        </span>
    )
}

function UserRow({ user }) {
    return (
        <div className="flex flex-wrap items-center gap-4 p-4 border border-white/10 rounded-xl bg-white/2 hover:bg-white/4 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 flex items-center justify-center text-[#E85D04] font-semibold text-sm shrink-0">
                {user.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{user.name}</p>
                <p className="text-white/30 text-xs truncate">{user.email}</p>
            </div>
            <p className="text-white/40 text-xs hidden md:block">
                {user.phone || <span className="text-white/20">No phone</span>}
            </p>
            <p className="text-white/30 text-xs hidden lg:block shrink-0">
                Joined {formatDate(user.createdAt)}
            </p>
            <RoleBadge role={user.role} />
        </div>
    )
}

export default function ManageUsers() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [roleFilter, setRoleFilter] = useState('all')
    const [error, setError] = useState(null)

    useEffect(() => {
        authService.getAllUsers()
            .then(data => setUsers(Array.isArray(data) ? data : data.users || []))
            .catch(() => setError('Failed to load users.'))
            .finally(() => setLoading(false))
    }, [])

    const filtered = users.filter(u => {
        const matchesRole = roleFilter === 'all' || u.role === roleFilter
        const matchesSearch =
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
        return matchesRole && matchesSearch
    })

    const adminCount = users.filter(u => u.role === 'admin').length
    const userCount = users.filter(u => u.role === 'user').length

    return (
        <div className="p-6 lg:p-8">
            <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Users
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        {users.length} total &mdash; {adminCount} admin, {userCount} customer
                    </p>
                </div>
                <div className="relative w-full sm:w-auto">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search name or email..."
                        className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-[#E85D04]/60 transition-colors w-full sm:w-60"
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-8">
                {[
                    { label: 'Total', value: users.length, icon: Users },
                    { label: 'Admins', value: adminCount, icon: Shield },
                    { label: 'Customers', value: userCount, icon: User },
                ].map(({ label, value, icon: Icon }) => (
                    <div key={label} className="bg-white/2 border border-white/10 rounded-xl p-3 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#E85D04]/10 flex items-center justify-center shrink-0">
                            <Icon size={15} className="text-[#E85D04]" />
                        </div>
                        <div>
                            <p className="text-white font-semibold">{value}</p>
                            <p className="text-white/30 text-xs">{label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex gap-2 mb-5">
                {['all', 'user', 'admin'].map(r => (
                    <button
                        key={r}
                        onClick={() => setRoleFilter(r)}
                        className={`text-xs px-3 py-1.5 rounded-lg capitalize border transition-colors ${roleFilter === r
                                ? 'bg-[#E85D04]/10 border-[#E85D04]/40 text-[#E85D04]'
                                : 'border-white/10 text-white/40 hover:text-white'
                            }`}
                    >
                        {r}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
                    ))}
                </div>
            ) : error ? (
                <p className="text-red-400 text-sm text-center py-20">{error}</p>
            ) : filtered.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-20">No users found.</p>
            ) : (
                <div className="space-y-3">
                    {filtered.map(user => (
                        <UserRow key={user._id} user={user} />
                    ))}
                </div>
            )}
        </div>
    )
}