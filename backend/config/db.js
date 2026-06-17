import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return
        }

        const conn = await mongoose.connect(
            process.env.MONGODB_URI
        )

        console.log(
            `MongoDB connected: ${conn.connection.host}`
        )

    } catch (error) {
        console.error(
            `Database connection error: ${error.message}`
        )

        throw error
    }
}

export default connectDB