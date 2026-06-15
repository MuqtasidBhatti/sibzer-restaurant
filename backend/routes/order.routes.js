import express from 'express'
import {
    placeOrder,
    getMyOrders,
    getAllOrders,
    getSingleOrder,
    updateOrderStatus
} from '../controllers/orderController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// customer
router.post('/', protect, placeOrder)
router.get('/my', protect, getMyOrders)
router.get('/:id', protect, getSingleOrder)

// admin only
router.get('/', protect, adminOnly, getAllOrders)
router.patch('/:id/status', protect, adminOnly, updateOrderStatus)

export default router