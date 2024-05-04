const mongoose = require('mongoose');

const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        minLength: 3,
        maxLength: 40
    },
});

const Genre = mongoose.model('Genre', genresSchema);

const validateGenres = (genre) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return Joi.object(schema).validate(genre);
}

exports.Genre = Genre;
exports.genresSchema = genresSchema;
exports.validateGenres = validateGenres;