import cloudinary from '../config/cloudinary.js'

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' })
        }

        // multer-storage-cloudinary already uploads it
        // req.file.path is the Cloudinary URL
        res.json({
            success: true,
            imageUrl: req.file.path,
            publicId: req.file.filename
        })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const deleteImage = async (req, res) => {
    try {
        const { publicId } = req.body

        if (!publicId) {
            return res.status(400).json({ success: false, message: 'Public ID is required' })
        }

        await cloudinary.uploader.destroy(publicId)

        res.json({ success: true, message: 'Image deleted' })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { uploadImage, deleteImage }