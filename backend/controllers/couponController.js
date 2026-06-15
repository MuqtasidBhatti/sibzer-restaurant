import Coupon from '../models/Coupon.js'

const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxUses, expiresAt } = req.body

        if (!code || !discountType || !discountValue || !expiresAt) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        const existing = await Coupon.findOne({ code: code.toUpperCase() })
        if (existing) {
            return res.status(400).json({ success: false, message: 'Coupon code already exists' })
        }

        const coupon = await Coupon.create({
            code,
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxUses:        maxUses || 1,
            expiresAt
        })

        res.status(201).json({ success: true, coupon })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 })
        res.json({ success: true, coupons })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount: subtotal } = req.body

        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true })

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Invalid coupon code' })
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
                message: `Minimum order amount is ${coupon.minOrderAmount}`
            })
        }

        const discount = coupon.discountType === 'percentage'
            ? (subtotal * coupon.discountValue) / 100
            : coupon.discountValue

        res.json({ success: true, valid: true, discountAmount: discount, coupon })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id)

        if (!coupon) {
            return res.status(404).json({ success: false, message: 'Coupon not found' })
        }

        res.json({ success: true, message: 'Coupon deleted' })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { createCoupon, getAllCoupons, validateCoupon, deleteCoupon }