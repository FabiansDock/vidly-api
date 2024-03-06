const mongoose = require('mongoose');
const { genresSchema } = require('./genres')


const moviesSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        trim: true, 
        minLength: 5,
        maxLength: 100,
    }, 
    genre: {
        type: genresSchema,
        required: true,
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0, 
        max: 25,
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 25,
    },
}); 

const Movie = mongoose.model('Movie', moviesSchema);

function moviesValidate(movie) {
    const schema = {
        title: Joi.string().min(5).max(50).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).required(),
        dailyRentalRate: Joi.number().min(0).required(),
    };

    return Joi.object(schema).validate(movie);
}

module.exports.Movie = Movie;
module.exports.moviesValidate = moviesValidate;