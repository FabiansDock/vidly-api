const mongoose = require('mongoose');


const loginSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5, 
        maxlength: 30,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});

const User = mongoose.model('User', usersSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(6).max(30).required(),
        emailId: Joi.string().min(6).max(30).unique().required(),
        password: joiPassword.minOfSpecialCharacters(2)
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

exports.Login = Login
exports.loginSchema = loginSchema
exports.validateUser = validateUser