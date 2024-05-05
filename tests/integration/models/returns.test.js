const request = require('supertest');
const mongoose = require('mongoose');
const moment = require('moment');
const { Rental } = require('../../../models/rentals');
const { User } = require('../../../models/users');
const { Movie } = require('../../../models/movies');

describe('/api/returns', () => {
    let server;
    let rental;
    let token;
    let payload;
    let movie;
    let customerId = mongoose.Types.ObjectId();
    let movieId = mongoose.Types.ObjectId();

    const exec = () => {
        return request(server)
                    .post('/api/returns')
                    .set('x-auth-token', token)
                    .setEncoding(payload)
    };


    beforeEach(async () => {
        token = new User().generateAuthToken();
        server = require('../../../index');
        payload = { customerId, movieId };

        rental = new Rental({
            customer : {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 10
            }
        });
        await rental.save();

        movie = new Movie({
            _id: movieId,
            title: rental.movie.title,
            genre: {
                name: '123'
            },
            numberInStock: 1,
            dailyRentalRate: rental.movie.dailyRentalRate
        });
        await movie.save();
    });

    afterEach(async () => {
        await Rental.remove({});
        await Movie.remove({});
        await server.close();
    });

    it('should work !', async () => {
        const res = await Rental.findById(rental._id);

        expect(res).not.toBeNull();
    });

    it('should return 401 if the client is not logged in', async () => {
        token = '';

        const res = await exec();
        
        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        delete payload.customerId;

        const res = await exec();
            
        expect(res.status).toBe(400);
    });
    
    it('should return 400 if movieId is not provided', async () => {
        delete payload.movieId;

        const res = await exec();
            
        expect(res.status).toBe(400);
    });
    
    it('should return 404 if no rental is found for this customer', async () => {
        customerId = mongoose.Types.ObjectId();

        const res = await exec();
            
        expect(res.status).toBe(404);
    });
    
    it('should return 404 if no rental is found for this movie', async () => {
        movieId = mongoose.Types.ObjectId();

        const res = await exec();
            
        expect(res.status).toBe(404);
    });
    
    it('should return 400 if rental already processed', async () => {
        rental.dateReturned = new Date();
        await rental.save();
        
        const res = await exec();
            
        expect(res.status).toBe(400);
    });
    
    it('should return 200 if valid request', async () => {
        const res = await exec();
            
        expect(res.status).toBe(200);
    });
    
    it('should set the return date if input is valid', async () => {
        await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned;
        expect(diff).toBeLessThan(10 * 1000);
    });
    
    it('should set the rental fee if input is valid', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();
        
        const rentalInDb = await Rental.findById(rental._id);
        
        expect(rentalInDb.rentalFee).toBe(70);
    });
    
    it('should increase the movie stock if input is valid', async () => {
        await exec();
        
        const movieInDb = await Movie.findById(movieId);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock+1);
    });
    
    it('should return the rental if input is valid', async () => {
        const res = await exec();

        expect(Object.keys(res.body)).toBeEqual(expect.arrayContaining(['cutomer', 'movie', 'dateOut', 'dateReturned', 'rentalFee']));
    });
});