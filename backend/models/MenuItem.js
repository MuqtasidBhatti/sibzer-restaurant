import mongoose from 'mongoose'

const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    images: [
        {
            type: String  // Cloudinary URLs
        }
    ],
    dietaryTags: [
        {
            type: String,
            enum: ['vegan', 'vegetarian', 'gluten-free', 'halal', 'spicy', 'bestseller']
        }
    ],
    preparationTime: {
        type: Number  // in minutes e.g. 15
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isFeatured: {
        type: Boolean,
        default: false  // shows on homepage featured section
    }
}, { timestamps: true })

const MenuItem = mongoose.model('MenuItem', menuItemSchema)
export default MenuItem