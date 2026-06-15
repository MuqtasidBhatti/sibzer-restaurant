import express from 'express'
import { sendMessage, getMessages, markAsRead } from '../controllers/messageController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'

const router = express.Router()

router.post('/', sendMessage)                          // public — contact form
router.get('/', protect, adminOnly, getMessages)       // admin only
router.patch('/:id/read', protect, adminOnly, markAsRead) // admin only

export default router