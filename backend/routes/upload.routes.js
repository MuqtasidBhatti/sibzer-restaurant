import express from 'express'
import { uploadImage, deleteImage } from '../controllers/uploadController.js'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'
import upload from '../middleware/uploadMiddleware.js'

const router = express.Router()

// admin only — upload.single('image') means we expect one file with field name "image"
router.post('/', protect, adminOnly, upload.single('image'), uploadImage)
router.delete('/', protect, adminOnly, deleteImage)

export default router