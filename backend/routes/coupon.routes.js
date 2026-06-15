import express from 'express'
import {
    createCoupon,
    getAllCoupons,
    validateCoupon,
    deleteCoupon
} from '../controllers/couponController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// customer — validate a coupon code at checkout
router.post('/validate', protect, validateCoupon)

// admin only
router.get('/', protect, adminOnly, getAllCoupons)
router.post('/', protect, adminOnly, createCoupon)
router.delete('/:id', protect, adminOnly, deleteCoupon)

export default router