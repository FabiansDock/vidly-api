const _ = require('lodash');
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const { Customer, validateCustomers } = require('../models/customers.js')
const auth = require('../middleware/auth');
const invalidObjectId = require('../middleware/invalidObjectId');
const validate = require('../middleware/validate.js');

// GET all customers
router.get('/', async (req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});

//GET a single customer
router.get('/:id', invalidObjectId, async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    res.send(customer);
});

//POST
router.post('/', [auth, validate(validateCustomers)], async (req, res) => {
    if (Customer.find({ name: req.body.name })) return res.status(409).send('Resource already exists');

    let customer = new Customer(_.pick(req.body, ['name', 'isGold', 'phone']));
    
    await customer.save();
    res.send(customer);    
});

//PATCH
router.patch('/:id', [invalidObjectId, validate(validateCustomers)], async (req, res) => {
    const customer = Customer.findByIdAndUpdate(req.params.id, { name:req.body.name }, {new: true});
    if (!customer) return res.status(404).send('Not found');

    res.send(customer); 
});

// DELETE
router.delete('/:id', invalidObjectId, async (req, res) => {

    const customer = await Customer.findByIdandRemove(req.params.id);
    if (!customer) return res.status(404).send('Not found');
    res.send(customer);
});

module.exports = router;