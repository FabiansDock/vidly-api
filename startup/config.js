const config = require('config');

module.exports = function() {
    if(!config.get('localjwtkey')) {
        throw new Error("FATAL error: localjwtkey is not defined.");
    }
}