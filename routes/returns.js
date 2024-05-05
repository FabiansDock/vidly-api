const express = require('express');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const { validateRentals, Rental } = require('../models/rentals');
const router = express.Router()

router.post('/', [auth, validate(validateRentals)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if(!rental) return res.status(404).send("Rental does not exist!");
    
    if(rental.dateReturned) return res.status(404).send("Rental already processed!");

    rental.return();
    await rental.save();

    await Movie.update({ _id: rental.movie._id }, { $inc: {numberInStock: 1}});

    return res.send(rental);    
});

module.exports = router;