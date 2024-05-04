const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const bcrypt = require('bcrypt');
const router = require('express').Router()
const {User, validateUser} = require('../models/users.js');
const validate = require('../middleware/validate.js');

//POST
router.post('/', validate(validateUser), async (req, res) => {
    let user = User.findOne({ email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    bcrypt.compare(req.body.password, user.password);
    const token = user.generateAuthToken();
    res.send(token);    
});

module.exports = router;