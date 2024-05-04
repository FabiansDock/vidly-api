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

const validateCustomers = (customer) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return Joi.object(schema).validate(customer);
}

module.exports.Customer = Customer;
module.exports.validateCustomers = validateCustomers;