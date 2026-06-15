import { useEffect, useState } from 'react'
import { CheckCircle, Trash2, Star } from 'lucide-react'
import reviewService from '../../services/reviewService'
import formatDate from '../../utils/formatDate'
import toast from 'react-hot-toast'

function StarRating({ rating }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={12}
                    className={i <= rating ? 'text-[#E85D04]' : 'text-white/10'}
                    fill={i <= rating ? '#E85D04' : 'transparent'}
                />
            ))}
        </div>
    )
}

function ReviewCard({ review, onApprove, onDelete }) {
    return (
        <div className={`p-5 border rounded-xl transition-colors ${review.isApproved
                ? 'border-white/10 bg-white/2'
                : 'border-yellow-400/20 bg-yellow-400/3'
            }`}>
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#E85D04]/10 flex items-center justify-center text-[#E85D04] text-sm font-semibold shrink-0">
                        {review.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium">{review.user?.name || 'Unknown'}</p>
                        <p className="text-white/30 text-xs">{formatDate(review.createdAt)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {!review.isApproved && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-400/10 text-yellow-400">
                            Pending
                        </span>
                    )}
                    {review.isApproved && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">
                            Approved
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-3">
                <StarRating rating={review.rating} />
                {review.comment && (
                    <p className="text-white/60 text-sm mt-2 leading-relaxed">{review.comment}</p>
                )}
            </div>

            <div className="flex gap-2 mt-4">
                {!review.isApproved && (
                    <button
                        onClick={() => onApprove(review._id)}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors"
                    >
                        <CheckCircle size={13} /> Approve
                    </button>
                )}
                <button
                    onClick={() => onDelete(review._id)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors"
                >
                    <Trash2 size={13} /> Delete
                </button>
            </div>
        </div>
    )
}

export default function ManageReviews() {
    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')

    const load = async () => {
        setLoading(true)
        try {
            const data = await reviewService.getAll()
            setReviews(data)
        } catch {
            toast.error('Failed to load reviews.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [])

    const handleApprove = async (id) => {
        try {
            await reviewService.approve(id)
            toast.success('Review approved.')
            load()
        } catch {
            toast.error('Approval failed.')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this review?')) return
        try {
            await reviewService.remove(id)
            toast.success('Deleted.')
            load()
        } catch {
            toast.error('Delete failed.')
        }
    }

    const filtered = reviews.filter(r => {
        if (filter === 'pending') return !r.isApproved
        if (filter === 'approved') return r.isApproved
        return true
    })

    const pendingCount = reviews.filter(r => !r.isApproved).length

    return (
        <div className="p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
                        Reviews
                    </h1>
                    <p className="text-white/40 text-sm mt-1">
                        {pendingCount > 0 ? `${pendingCount} pending approval` : 'All caught up'}
                    </p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6">
                {['all', 'pending', 'approved'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`text-xs px-3 py-1.5 rounded-lg capitalize border transition-colors ${filter === f
                                ? 'bg-[#E85D04]/10 border-[#E85D04]/40 text-[#E85D04]'
                                : 'border-white/10 text-white/40 hover:text-white'
                            }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-white/30 text-sm text-center py-20">No reviews found.</p>
            ) : (
                <div className="space-y-4">
                    {filtered.map(r => (
                        <ReviewCard
                            key={r._id}
                            review={r}
                            onApprove={handleApprove}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}