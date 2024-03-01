const mongoose = require('mongoose');

        
const Customer = mongoose.model('Customer', new mongoose.Schema({
    isGold: {
        type: Boolean
    },
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: Number,
        required: true,
        validate: function(v) { return String(v).length == 5}
    },
}));

module.exports = Customer