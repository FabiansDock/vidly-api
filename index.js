const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const rentals = require('./routes/rentals.js');
const users = require('./routes/users.js');
const auth = require('./routes/auth.js');

if(!config.get('localjwtkey')) {
        console.error("FATAL error: localjwtkey is not defined.")
        process.exit(1);
}


mongoose.connect('mongodb://localhost/vidly')
        .then(() => console.log('Connecting to MongoDB...'))
        .catch(e => console.log(e))

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/login', auth);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
