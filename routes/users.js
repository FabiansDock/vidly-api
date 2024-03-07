const config = require('config');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const router = require('express').Router()
const {User, validateUser} = require('../models/users.js');

//POST
router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = User.find({ email: req.body.email})[0];
    if (user) return res.status(400).send('User already exists');

    
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt())
    await user.save();

    const token = jwt.sign({ _id: user._id }, config.get('localjwtkey'));
    res.header('x-auth-token', token).send(_.pick(req.body, ['name', 'email']));    
});

module.exports = router;