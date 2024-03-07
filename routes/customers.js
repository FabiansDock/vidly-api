const _ = require('lodash');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const Customer = require('../models/customers.js')

// GET all customers
router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

//GET a single customer
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
});

//POST
router.post('/', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    if (Customer.find({ name: req.body.name })) return res.status(409).send('Resource already exists');

    let customer = new Customer(_.pick(req.body, ['name', 'isGold', 'phone']));
    
    await customer.save();
    res.send(customer);    
});

//PATCH
router.patch('/:id', async (req, res) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    const {error} = schema.validate(req.body);
    if (error) return res.status(400).send('Bad request');

    const customer = Customer.findByIdAndUpdate(req.params.id, { name:req.body.name }, {new: true});
    if (!customer) return res.status(404).send('Not found');

    res.send(customer); 
});

// DELETE
router.delete('/:id', async (req, res) => {

    const customer = await Customer.findByIdandRemove(req.params.id);
    if (!customer) return res.status(404).send('Not found');
    res.send(customer);
});

module.exports = router;