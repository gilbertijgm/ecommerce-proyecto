export const errorHandler = (error, req, res, next) => {
    console.error(`Error: ${error.message}`);
    const status = error.status || 500;
    res.status(status).send(error.message);
};

export const notFound = (req, res, next) => {
    const error = new Error(`Not Found: ${req.originalUrl}`)
    res.status(404)
    next(error);
}