import mongoose from 'mongoose'

const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'] },
    phone: { type: String, required: [true, 'Phone is required'] },
    date: { type: Date, required: [true, 'Date is required'] },
    time: { type: String, required: [true, 'Time is required'] },  // e.g. "7:30 PM"
    partySize: {
        type: Number,
        required: true,
        min: 1,
        max: 20
    },
    tableNumber: {
        type: Number  // assigned by admin
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },
    specialRequests: String
}, { timestamps: true })

const Reservation = mongoose.model('Reservation', reservationSchema)
export default Reservation