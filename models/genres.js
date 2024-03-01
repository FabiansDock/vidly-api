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

exports.Genre = Genre
exports.genresSchema = genresSchema