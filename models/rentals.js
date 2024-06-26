const mongoose = require('mongoose');
const moment = require('moment');

const rentalsSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true, 
                minlength: 5,
                maxlength: 50,
            },
            isGold: {
                type: Boolean,
                default: false,
            },
            phone: { 
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50,
            },
        }),
        required: true,
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String, 
                required: true,
                trim: true, 
                minLength: 5,
                maxLength: 100,
            }, 
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 25,
            },
        }),
        required: true,
    },
    dateOut: {
        type: Date,
        default: Date.now,
    },
    dateReturned: {
        type: Date,
    },
    rentalFee: {
        type: Number,
        min: 0,
    }
});

const Rental = mongoose.model('Rental', rentalsSchema);

rentalsSchema.statics.lookup = function(customerId, movieId) {
    return this.find({ 
        'customer._id': customerId, 
        'movie._id': movieId 
    });
}

rentalsSchema.methods.return = function() {
    this.dateReturned = new Date();
    
    const rentalDays = moment().diff(rental.dateOut, 'days');
    this.rentalFee = rentalDays * rental.movie.dailyRentalRate;
}

function validateRentals(rental) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    };

    return Joi.object(schema).validate(rental)
}

module.exports.rentalsSchema = rentalsSchema;
module.exports.Rental = Rental;
module.exports.validateRentals = validateRentals;