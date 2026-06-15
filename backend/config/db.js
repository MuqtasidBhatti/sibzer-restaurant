import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`Database connection error: ${error.message}`)
        process.exit(1)  // exit with failure code, not 0
    }
}

export default connectDB