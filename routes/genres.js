const Joi = require('joi');
const express = require('express');
const router = express.Router();
const {Genre} = require('../models/genres.js')

//GET all genres
router.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
});

//GET a single genre
router.get('/:id', async (req, res) => {
    const genre = await Genre.findById(req.params.id);
    res.send(genre);
});

//POST
router.post('/', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send('Bad request');

    if (Genre.find({ name: req.body.name })) return res.status(409).send('Resource already exists');

    let genre = new Genre({
        name: req.body.name,
    });
    genre = await genre.save();
    res.send(genre);    
});

//PATCH
router.patch('/:id', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send('Bad request');

    const genre = Genre.findByIdAndUpdate(req.params.id, { name:req.body.name }, {new: true});
    if (!genre) return res.status(404).send('Not found');

    res.send(genre); 
});

// DELETE
router.delete('/:id', async (req, res) => {

    const genre = await Genre.findByIdandRemove(req.params.id);
    if (!genre) return res.status(404).send('Not found');
    res.send(genre);
});

module.exports = router;