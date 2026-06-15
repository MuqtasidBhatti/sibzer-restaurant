import MenuItem from '../models/MenuItem.js'

const createMenuItem = async (req, res) => {
    try {
        const { name, description, price, category, dietaryTags, preparationTime, isFeatured } = req.body

        if (!name || !price || !category) {
            return res.status(400).json({ success: false, message: 'Name, price and category are required' })
        }

        const menuItem = await MenuItem.create({
            name,
            description,
            price,
            category,
            images:          req.body.images || [],
            dietaryTags:     dietaryTags || [],
            preparationTime: preparationTime || 0,
            isFeatured:      isFeatured || false
        })

        res.status(201).json({ success: true, menuItem })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getAllMenuItems = async (req, res) => {
    try {
        const filter = { isAvailable: true }

        // filter by category: GET /api/menu?category=64abc123
        if (req.query.category) {
            filter.category = req.query.category
        }

        // filter by dietary tag: GET /api/menu?tag=vegan
        if (req.query.tag) {
            filter.dietaryTags = req.query.tag
        }

        const menuItems = await MenuItem.find(filter)
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })

        res.json({ success: true, count: menuItems.length, menuItems })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getSingleMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id).populate('category', 'name slug')

        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' })
        }

        res.json({ success: true, menuItem })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const updateMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' })
        }

        res.json({ success: true, menuItem })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const deleteMenuItem = async (req, res) => {
    try {
        const menuItem = await MenuItem.findByIdAndDelete(req.params.id)

        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' })
        }

        res.json({ success: true, message: 'Menu item deleted' })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const toggleAvailability = async (req, res) => {
    try {
        const menuItem = await MenuItem.findById(req.params.id)

        if (!menuItem) {
            return res.status(404).json({ success: false, message: 'Menu item not found' })
        }

        menuItem.isAvailable = !menuItem.isAvailable
        await menuItem.save()

        res.json({
            success: true,
            message: `Item marked as ${menuItem.isAvailable ? 'available' : 'unavailable'}`,
            isAvailable: menuItem.isAvailable
        })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

// admin only — returns all items including unavailable ones
const getAllMenuItemsAdmin = async (req, res) => {
    try {
        const menuItems = await MenuItem.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 })

        res.json({ success: true, count: menuItems.length, menuItems })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export {
    createMenuItem,
    getAllMenuItems,
    getSingleMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability,
    getAllMenuItemsAdmin
}