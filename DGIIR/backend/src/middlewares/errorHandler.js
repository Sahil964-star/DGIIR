import { AppError } from '../utils/AppError.js';
export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || err.status || 500;
    err.status = err.status || 'error';
    if (err.type === 'entity.parse.failed') {
        err.statusCode = 400;
        err.status = 'fail';
        err.isOperational = true;
        err.message = 'Invalid JSON payload passed.';
    }
    if (process.env.NODE_ENV !== 'production') {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }
    else {
        // Production
        if (err.isOperational) {
            res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        else {
            console.error('ERROR 💥', err);
            res.status(500).json({
                status: 'error',
                message: 'Something went very wrong!',
            });
        }
    }
};
//# sourceMappingURL=errorHandler.js.map