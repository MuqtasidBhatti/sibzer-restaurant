import Review from '../models/Review.js'

const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body

        if (!rating || !comment) {
            return res.status(400).json({ success: false, message: 'Rating and comment are required' })
        }

        // one review per user
        const existing = await Review.findOne({ user: req.user._id })
        if (existing) {
            return res.status(400).json({ success: false, message: 'You have already submitted a review' })
        }

        const review = await Review.create({
            user: req.user._id,
            rating,
            comment
        })

        res.status(201).json({ success: true, review })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getAllReviews = async (req, res) => {
    try {
        // public sees only approved reviews
        const filter = req.user?.role === 'admin' ? {} : { isApproved: true }

        const reviews = await Review.find(filter)
            .populate('user', 'name')
            .sort({ createdAt: -1 })

        res.json({ success: true, reviews })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const approveReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        )

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' })
        }

        res.json({ success: true, message: 'Review approved', review })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id)

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' })
        }

        res.json({ success: true, message: 'Review deleted' })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { createReview, getAllReviews, approveReview, deleteReview }