const express = require('express');
const moment = require('moment');
const auth = require('../middleware/auth');
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const { validateRentals, Rental } = require('../models/rentals');
const router = express.Router()

router.post('/', auth, async (req, res) => {
    const { error } = validateRentals(req.body);
    if(!error) return res.status(400).send(error.details[0].message);

    const rental = await Rental.find({ 'customer._id': req.body.customerId, 
                                        'movie._id': req.body.movieId });
    if(!rental) return res.status(404).send("Rental does not exist!");
    
    if(rental.dateReturned) return res.status(404).send("Rental already processed!");

    rental.dateReturned = new Date();
    rental.rentalFee = moment().diff(rental.dateOut, 'days') * rental.movie.dailyRentalRate;
    await rental.save();

    await Movie.update({ _id: rental.movie._id }, { $inc: {numberInStock: 1}});

    return res.status(200).send(rental);    
});

module.exports = router;