import Category from '../models/Category.js'

const createCategory = async (req, res) => {
    try {
        const { name, sortOrder } = req.body

        if (!name) {
            return res.status(400).json({ success: false, message: 'Category name is required' })
        }

        const existing = await Category.findOne({ name })
        if (existing) {
            return res.status(400).json({ success: false, message: 'Category already exists' })
        }

        const category = await Category.create({
            name,
            image:     req.body.image || '',
            sortOrder: sortOrder || 0
        })

        res.status(201).json({ success: true, category })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).sort({ sortOrder: 1 })
        res.json({ success: true, categories })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' })
        }

        res.json({ success: true, category })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id)

        if (!category) {
            return res.status(404).json({ success: false, message: 'Category not found' })
        }

        res.json({ success: true, message: 'Category deleted' })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { createCategory, getAllCategories, updateCategory, deleteCategory }