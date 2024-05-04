const _ = require('lodash');
const router = require('express').Router()
const {Movie, moviesValidate} = require('../models/movies.js');
const { Genre } = require('../models/genres.js');
const auth = require('../middleware/auth');
const invalidObjectId = require('../middleware/invalidObjectId');
const validate = require('../middleware/validate.js');

//GET all genres
router.get('/', async ( req , res) => {
    const movies = await Movie.find();
    res.send(movies);
});

//GET a single genre
router.get('/:id', invalidObjectId, async (req, res) => {
    const movie = await Movie.findById(req.params.id);
    res.send(movie);
});

//POST
router.post('/', [auth, validate(moviesValidate)], async (req, res) => {
    const genre = Genre.findById(req.body.genreId);
    if (!genre) return res.status(409).send('Resource already exists');

    
    let movie = new Movie(_.pick(req.body, ['title', 'genre', 'numberInStock', 'dailyRentalRate']));
    await movie.save();
    res.send(movie);    
});

//PATCH
router.patch('/:id', [auth, invalidObjectId, validate(movies)], async (req, res) => {
    const movie = Movie.findByIdAndUpdate(req.params.id, { title: req.body.title }, {new: true});
    if (!movie) return res.status(404).send('Not found');

    res.send(movie); 
});

// DELETE
router.delete('/:id', [auth, admin, invalidObjectId], async (req, res) => {
    const movie = await Movie.findByIdandRemove(req.params.id);
    if (!movie) return res.status(404).send('Not found');
    res.send(movie);
});

module.exports = router;