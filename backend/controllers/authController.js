import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    })
}

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' })
        }

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already in use' })
        }

        // just pass plain password — User.js pre('save') hook hashes it
        const user = await User.create({ name, email, password })

        const token = generateToken(user._id)

        res.status(201).json({
            success: true,
            message: 'Account created',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' })
        }

        // +password because select:false in model
        const user = await User.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' })
        }

        const token = generateToken(user._id)

        res.json({
            success: true,
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getMe = async (req, res) => {
    // req.user is set by authMiddleware
    res.json({ success: true, user: req.user })
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort({ createdAt: -1 })
        res.json({ success: true, users })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { register, login, getMe, getAllUsers }