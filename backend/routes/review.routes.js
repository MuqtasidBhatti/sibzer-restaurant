import express from 'express'
import {
    createReview,
    getAllReviews,
    approveReview,
    deleteReview
} from '../controllers/reviewController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// public
router.get('/', getAllReviews)

// customer
router.post('/', protect, createReview)

// admin only
router.patch('/:id/approve', protect, adminOnly, approveReview)
router.delete('/:id', protect, adminOnly, deleteReview)

export default router