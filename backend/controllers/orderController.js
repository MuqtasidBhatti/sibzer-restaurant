import Order from '../models/Order.js'
import MenuItem from '../models/MenuItem.js'
import Coupon from '../models/Coupon.js'

const placeOrder = async (req, res) => {
    try {
        const { items, orderType, deliveryAddress, couponCode, paymentMethod, note } = req.body

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' })
        }

        if (!orderType) {
            return res.status(400).json({ success: false, message: 'Order type is required' })
        }

        if (orderType === 'delivery' && !deliveryAddress) {
            return res.status(400).json({ success: false, message: 'Delivery address is required' })
        }

        // build order items and calculate subtotal
        let subtotal = 0
        const orderItems = []

        for (const item of items) {
            const menuItem = await MenuItem.findById(item.menuItem)

            if (!menuItem) {
                return res.status(404).json({ success: false, message: `Item ${item.menuItem} not found` })
            }

            if (!menuItem.isAvailable) {
                return res.status(400).json({ success: false, message: `${menuItem.name} is currently unavailable` })
            }

            orderItems.push({
                menuItem: menuItem._id,
                name: menuItem.name,
                price: menuItem.price,
                qty: item.qty || 1,
                customizations: item.customizations || ''
            })

            subtotal += menuItem.price * (item.qty || 1)
        }

        // apply coupon if provided
        let discount = 0
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true })

            if (!coupon) {
                return res.status(400).json({ success: false, message: 'Invalid or expired coupon' })
            }

            if (coupon.usedCount >= coupon.maxUses) {
                return res.status(400).json({ success: false, message: 'Coupon usage limit reached' })
            }

            if (new Date() > coupon.expiresAt) {
                return res.status(400).json({ success: false, message: 'Coupon has expired' })
            }

            if (subtotal < coupon.minOrderAmount) {
                return res.status(400).json({
                    success: false,
                    message: `Minimum order amount for this coupon is ${coupon.minOrderAmount}`
                })
            }

            discount = coupon.discountType === 'percentage'
                ? (subtotal * coupon.discountValue) / 100
                : coupon.discountValue

            // increment coupon usage
            coupon.usedCount += 1
            await coupon.save()
        }

        const tax = parseFloat((subtotal * 0.05).toFixed(2)) // 5% tax
        const total = parseFloat((subtotal + tax - discount).toFixed(2))

        const order = await Order.create({
            user: req.user?._id || null,
            items: orderItems,
            orderType,
            status: 'pending',
            deliveryAddress: deliveryAddress || {},
            subtotal,
            tax,
            discount,
            total,
            couponCode: couponCode || '',
            paymentMethod: paymentMethod || 'cash',
            note: note || ''
        })

        res.status(201).json({ success: true, order })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.menuItem', 'name images')
            .sort({ createdAt: -1 })

        res.json({ success: true, orders })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getAllOrders = async (req, res) => {
    try {
        const filter = {}

        // filter by status: GET /api/orders?status=pending
        if (req.query.status) {
            filter.status = req.query.status
        }

        const orders = await Order.find(filter)
            .populate('user', 'name email')
            .populate('items.menuItem', 'name')
            .sort({ createdAt: -1 })

        res.json({ success: true, count: orders.length, orders })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.menuItem', 'name images price')

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        // customers can only see their own orders
        if (req.user.role !== 'admin' && order.user?._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: 'Not authorized' })
        }

        res.json({ success: true, order })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'completed', 'cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' })
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' })
        }

        res.json({ success: true, message: `Order status updated to ${status}`, order })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { placeOrder, getMyOrders, getAllOrders, getSingleOrder, updateOrderStatus }