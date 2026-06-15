import Reservation from '../models/Reservation.js'

const createReservation = async (req, res) => {
    try {
        const { name, email, phone, date, time, partySize, specialRequests } = req.body

        if (!name || !email || !phone || !date || !time || !partySize) {
            return res.status(400).json({ success: false, message: 'All required fields must be filled' })
        }

        const reservation = await Reservation.create({
            user: req.user?._id || null,
            name,
            email,
            phone,
            date,
            time,
            partySize,
            specialRequests: specialRequests || ''
        })

        res.status(201).json({ success: true, reservation })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getMyReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user._id }).sort({ date: -1 })
        res.json({ success: true, reservations })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const getAllReservations = async (req, res) => {
    try {
        const filter = {}

        // filter by status: GET /api/reservations?status=pending
        if (req.query.status) {
            filter.status = req.query.status
        }

        // filter by date: GET /api/reservations?date=2025-12-25
        if (req.query.date) {
            const start = new Date(req.query.date)
            const end = new Date(req.query.date)
            end.setDate(end.getDate() + 1)
            filter.date = { $gte: start, $lt: end }
        }

        const reservations = await Reservation.find(filter)
            .populate('user', 'name email')
            .sort({ date: 1 })

        res.json({ success: true, count: reservations.length, reservations })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body

        const validStatuses = ['pending', 'confirmed', 'cancelled']
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' })
        }

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )

        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' })
        }

        res.json({ success: true, reservation })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

const assignTable = async (req, res) => {
    try {
        const { tableNumber } = req.body

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            { tableNumber },
            { new: true }
        )

        if (!reservation) {
            return res.status(404).json({ success: false, message: 'Reservation not found' })
        }

        res.json({ success: true, reservation })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { createReservation, getMyReservations, getAllReservations, updateReservationStatus, assignTable }