import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true
    },
    image: {
        type: String  // Cloudinary URL
    },
    sortOrder: {
        type: Number,
        default: 0   // controls display order on menu page
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

// auto-generate slug from name before saving
categorySchema.pre('save', function () {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-')
    }
})

const Category = mongoose.model('Category', categorySchema)
export default Category