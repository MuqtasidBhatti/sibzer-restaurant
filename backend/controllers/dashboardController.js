import Order from '../models/Order.js'
import User from '../models/User.js'
import Reservation from '../models/Reservation.js'
import MenuItem from '../models/MenuItem.js'

const getStats = async (req, res) => {
    try {
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const todayEnd = new Date()
        todayEnd.setHours(23, 59, 59, 999)

        // today's orders
        const todayOrders = await Order.find({
            createdAt: { $gte: todayStart, $lte: todayEnd }
        })

        const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)

        // total counts
        const totalOrders       = await Order.countDocuments()
        const totalUsers        = await User.countDocuments({ role: 'user' })
        const pendingOrders     = await Order.countDocuments({ status: 'pending' })
        const pendingReservations = await Reservation.countDocuments({ status: 'pending' })

        // top 5 selling menu items
        const topItems = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id:       '$items.menuItem',
                    name:      { $first: '$items.name' },
                    totalSold: { $sum: '$items.qty' }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 }
        ])

        // revenue for last 7 days
        const last7Days = []
        for (let i = 6; i >= 0; i--) {
            const start = new Date()
            start.setDate(start.getDate() - i)
            start.setHours(0, 0, 0, 0)

            const end = new Date()
            end.setDate(end.getDate() - i)
            end.setHours(23, 59, 59, 999)

            const dayOrders = await Order.find({
                createdAt: { $gte: start, $lte: end },
                status:    { $ne: 'cancelled' }
            })

            const revenue = dayOrders.reduce((sum, o) => sum + o.total, 0)

            last7Days.push({
                date:    start.toISOString().split('T')[0],
                revenue: parseFloat(revenue.toFixed(2)),
                orders:  dayOrders.length
            })
        }

        res.json({
            success: true,
            stats: {
                todayRevenue:       parseFloat(todayRevenue.toFixed(2)),
                todayOrders:        todayOrders.length,
                totalOrders,
                totalUsers,
                pendingOrders,
                pendingReservations,
                topItems,
                last7Days
            }
        })
    } catch (err) {
        res.status(500).json({ success: false, error: err.message })
    }
}

export { getStats }