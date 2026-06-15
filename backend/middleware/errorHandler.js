const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500
    let message    = err.message    || 'Internal Server Error'

    // Mongoose bad ObjectId (e.g. /api/menu/abc123invalid)
    if (err.name === 'CastError') {
        statusCode = 404
        message    = 'Resource not found'
    }

    // Mongoose duplicate key (e.g. email already exists)
    if (err.code === 11000) {
        statusCode = 400
        message    = `${Object.keys(err.keyValue)[0]} already exists`
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        statusCode = 400
        message    = Object.values(err.errors).map(e => e.message).join(', ')
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    })
}

export default errorHandler