const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const bcrypt = require('bcrypt');
const router = require('express').Router()
const {User} = require('../models/users.js');

//POST
router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = User.findOne({ email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    bcrypt.compare(req.body.password, user.password);
    const token = jwt.sign({ _id: user._id }, config.get('localjwtkey'))
    res.send(token);    
});

function validateUser(user) {
    const schema = {
        email: Joi.string().min(6).max(30).required(),
        password: joiPassword.string()
                                .minOfSpecialCharacters(2)
                                .minOfLowercase(2)
                                .minOfUppercase(2)
                                .minOfNumeric(2)
                                .noWhiteSpaces()
                                .onlyLatinCharacters()
                                .doesNotInclude(['password'])
                                .required()
                                ,
    }

    return Joi.object(schema).validate(user)
}

module.exports = router;