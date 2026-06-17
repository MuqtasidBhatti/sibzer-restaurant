import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'

import connectDB from './config/db.js'
import errorHandler from './middleware/errorHandler.js'

// routes
import authRoutes from './routes/auth.routes.js'
import categoryRoutes from './routes/category.routes.js'
import menuRoutes from './routes/menu.routes.js'
import orderRoutes from './routes/order.routes.js'
import reservationRoutes from './routes/reservation.routes.js'
import couponRoutes from './routes/coupon.routes.js'
import reviewRoutes from './routes/review.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import dashboardRoutes from './routes/dashboard.routes.js'
import messageRoutes from './routes/message.routes.js'


dotenv.config()

connectDB()

const app = express()

// middleware
app.use(cors({
    origin: process.env.CLIENT_URL === '*' ? '*' : process.env.CLIENT_URL,
    credentials: process.env.CLIENT_URL !== '*'
}))
app.use(helmet())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// api routes
app.use('/api/auth', authRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/menu', menuRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/coupons', couponRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/dashboard', dashboardRoutes)
app.use('/api/messages', messageRoutes)

// health check route
app.get('/', (req, res) => {
    res.json({ message: 'Restaurant API is running' })
})

// 404 handler — for any route that does not exist
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
})

// global error handler — always last
app.use(errorHandler)

const PORT = process.env.PORT || 5000

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

export default app
