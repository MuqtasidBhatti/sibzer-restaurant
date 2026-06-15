import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema({
    image: {
        type: String,
        required: true  // Cloudinary URL
    },
    caption: {
        type: String,
        trim: true
    },
    category: {
        type: String,
        enum: ['food', 'interior', 'events', 'team'],
        default: 'food'
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Gallery = mongoose.model('Gallery', gallerySchema)
export default Gallery