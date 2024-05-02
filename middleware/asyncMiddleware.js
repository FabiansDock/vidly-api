module.exports = function(handler) {
    return async (ex, req, res, next) => {
        try {
            await handler(req, res);
        }
        catch (ex) {
            next(err);
        }
    };
} 