import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true
    },
    isApproved: {
        type: Boolean,
        default: false  // admin must approve before it shows publicly
    }
}, { timestamps: true })

const Review = mongoose.model('Review', reviewSchema)
export default Review