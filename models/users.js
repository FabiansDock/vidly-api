const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const joiPassword = Joi.extend(joiPasswordExtendCore);
const mongoose = require('mongoose'); 

const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 5, 
        maxlength: 30,
        required: true,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
});

const User = mongoose.model('User', usersSchema);

function validateUser(user) {
    const schema = {
        name: Joi.string().min(6).max(30).required(),
        emailId: Joi.string().min(6).max(30).required(),
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

exports.User = User
exports.usersSchema = usersSchema
exports.validateUser = validateUser