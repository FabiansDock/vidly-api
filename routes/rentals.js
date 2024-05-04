const _ = require('lodash');
const express = require('express');
const router = express.Router();
const {Rental, validateRentals} = require('../models/rentals');
const Customer = require('../models/customers');
const Movie = require('../models/movies');
const auth = require('../middleware/auth');

//Get all rentals
router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

//Create new rental
router.post('/', auth, async (req, res) => {
    const {error} = validateRentals(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    const customer = Customer.findById(req.body.customerId);
    if(!customer) return res.status(400).send('Invalid customer !')
    const movie = Movie.findById(req.body.movieId);
    if(!movie) return res.status(400).send('Invalid movie !')
    
    let rental = new Rental({
        customer: _.pick(customer, ['_id', 'name', 'phone']),
        movie: _.pick(movie, ['_id', 'title', 'rentalFee']),
    });

    await rental.save();
    res.send(rental);
});

module.exports = router