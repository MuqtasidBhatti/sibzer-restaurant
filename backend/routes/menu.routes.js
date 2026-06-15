import express from 'express'
import {
    createMenuItem,
    getAllMenuItems,
    getAllMenuItemsAdmin,
    getSingleMenuItem,
    updateMenuItem,
    deleteMenuItem,
    toggleAvailability
} from '../controllers/menuController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

// public
router.get('/', getAllMenuItems)
router.get('/:id', getSingleMenuItem)

// admin only
router.get('/admin/all', protect, adminOnly, getAllMenuItemsAdmin)
router.post('/', protect, adminOnly, createMenuItem)
router.put('/:id', protect, adminOnly, updateMenuItem)
router.delete('/:id', protect, adminOnly, deleteMenuItem)
router.patch('/:id/toggle', protect, adminOnly, toggleAvailability)

export default router