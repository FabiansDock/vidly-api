const _ = require('lodash');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const {Genre, validateGenres} = require('../models/genres.js')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const invalidObjectId = require('../middleware/invalidObjectId');
const validate = require('../middleware/validate.js');

//GET all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
});

//GET a single genre
router.get('/:id', invalidObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if(!genre) return res.status(404).send('Genre with given id does not exist !');

    res.send(genre);
});

//POST
router.post('/', [auth, validate(validateGenres)], async (req, res) => {
    if (Genre.find({ name: req.body.name })) return res.status(409).send('Resource already exists');

    let genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);    
});

//PATCH
router.patch('/:id', [auth, invalidObjectId, validate(validateGenres)], async (req, res) => {
    const genre = Genre.findByIdAndUpdate(req.params.id, { name:req.body.name }, {new: true});
    if (!genre) return res.status(404).send('Not found');

    res.send(genre); 
});

// DELETE
router.delete('/:id', invalidObjectId, [auth, admin], async (req, res) => {

    const genre = await Genre.findByIdandRemove(req.params.id);
    if (!genre) return res.status(404).send('Not found');
    res.send(genre);
});

module.exports = router;