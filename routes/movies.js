const Joi = require('joi');
const router = require('express').Router()
const {Movie, moviesValidate} = require('../models/movies.js');
const { Genre } = require('../models/genres.js');

//GET all genres
router.get('/', async ( req , res) => {
    const movies = await Movie.find();
    res.send(movies);
});

//GET a single genre
router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
});

//POST
router.post('/', async (req, res) => {
    const {error} = moviesValidate(req.body);
    if (error) return res.status(400).send('Bad request');

    const genre = Genre.findById(req.body.genreId);
    if (!genre) return res.status(409).send('Resource already exists');

    let movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name,
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate,
    });
    movie = await movie.save();
    res.send(movie);    
});

//PATCH
router.patch('/:id', async (req, res) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send('Bad request');

    const movie = Movie.findByIdAndUpdate(req.params.id, { title: req.body.title }, {new: true});
    if (!movie) return res.status(404).send('Not found');

    res.send(movie); 
});

// DELETE
router.delete('/:id', async (req, res) => {
    const movie = await Movie.findByIdandRemove(req.params.id);
    if (!movie) return res.status(404).send('Not found');
    res.send(movie);
});

module.exports = router;