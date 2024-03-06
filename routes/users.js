const router = require('express').Router()
const {User, validateUser} = require('../models/users.js');

//POST
router.post('/', async (req, res) => {
    const {error} = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = User.findOne(req.body.emailId);
    if (user) return res.status(409).send('User already exists');

    user = new User({
        name: req.body.name,
        email: req.body.emailId,
        password: req.body.password,
    });
    await user.save();
    res.send(user);    
});

module.exports = router;