import Message from '../models/Message.js'

// POST /api/messages — contact form submission
export const sendMessage = async (req, res) => {
  const { name, email, subject, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'name, email and message are required' })
  }

  const newMessage = await Message.create({ name, email, subject, message })

  res.status(201).json({ success: true, data: newMessage })
}

// GET /api/messages — admin view all messages
export const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 })
  res.status(200).json({ success: true, data: messages })
}

// PATCH /api/messages/:id/read — mark as read
export const markAsRead = async (req, res) => {
  const message = await Message.findByIdAndUpdate(
    req.params.id,
    { read: true },
    { new: true }
  )
  res.status(200).json({ success: true, data: message })
}