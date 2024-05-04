const _ = require('lodash');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const {Genre} = require('../models/genres.js')
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const invalidObjectId = require('../middleware/invalidObjectId');

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
router.post('/', auth, async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(40).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (Genre.find({ name: req.body.name })) return res.status(409).send('Resource already exists');

    let genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);    
});

//PATCH
router.patch('/:id', [auth, invalidObjectId], async (req, res) => {
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
router.delete('/:id', invalidObjectId, [auth, admin], async (req, res) => {

    const genre = await Genre.findByIdandRemove(req.params.id);
    if (!genre) return res.status(404).send('Not found');
    res.send(genre);
});

module.exports = router;