import express from 'express'
import {
    createReservation,
    getMyReservations,
    getAllReservations,
    updateReservationStatus,
    assignTable
} from '../controllers/reservationController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// customer
router.post('/', protect, createReservation)
router.get('/my', protect, getMyReservations)

// admin only
router.get('/', protect, adminOnly, getAllReservations)
router.patch('/:id/status', protect, adminOnly, updateReservationStatus)
router.patch('/:id/table', protect, adminOnly, assignTable)

export default router