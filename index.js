const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const rentals = require('./routes/rentals.js');

mongoose.connect('mongodb://localhost/vidly')
        .then(() => console.log('Connecting to MongoDB...'))
        .catch(e => console.log(e))

app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
