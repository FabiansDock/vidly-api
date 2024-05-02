require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const error = require('./middleware/error');


winston.handleExceptions(new winston.transports.File({ filename: 'uncaughtExceptions.log'}));

process.on('unhandledRejection', (err) => {
        throw err;
});

winston.add(winston.transports.File, { filename: "logfile.log"});
winston.add(winston.transports.MongoDB, { 
        db: "mongodb://localhost/vidly", 
        level: "error",
});

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
app.use(error);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
