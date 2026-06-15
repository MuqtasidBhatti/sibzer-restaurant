import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        // not required — allow guest orders
    },
    items: [
        {
            menuItem: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'MenuItem',
                required: true
            },
            name: String,  // store name at time of order (price can change later)
            price: Number,
            qty: {
                type: Number,
                default: 1,
                min: 1
            },
            customizations: String  // e.g. "no onions, extra sauce"
        }
    ],
    orderType: {
        type: String,
        enum: ['delivery', 'pickup', 'dine-in'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'completed', 'cancelled'],
        default: 'pending'
    },
    deliveryAddress: {
        street: String,
        city: String,
    },
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    couponCode: String,
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'jazzcash', 'easypaisa'],
        default: 'cash'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    note: String  // special instructions from customer
}, { timestamps: true })

const Order = mongoose.model('Order', orderSchema)
export default Order