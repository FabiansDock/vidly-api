const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send("Access denied. No token provided.");

    try{
        const decoded = jwt.verify(token, config.get('localjwtkey'));
        req.user = decoded;
        next();
    }
    catch (ex) {
        return res.send("Invalid token.")
    }
}