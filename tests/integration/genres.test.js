const request = require('supertest');
const { Genre } = require('../../models/genres');
const mongoose = require('mongoose');
const { User } = require('../models/users');

let server;

describe('api/genres', () => {
    beforeEach(async () => { 
        server = require('../../index'); 
    });
    afterEach(() => { 
        server.close();  
        Genre.remove({}); 
    });

    describe('GET /', async () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                { name: 'genre1'},
                { name: 'genre2'},
            ]);

            const res = await request(server).get('api/genres');
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'genre1').toBeTruthy());
            expect(res.body.some(g => g.name === 'genre2').toBeTruthy());
        });
    });

    describe('GET /:id', () => {

        it("throws an error if genre id doesn't exist", () => {
            const res = request(server).get('api/genres/1');
            expect(res.status).toBe(404);
        });

        it('returns a genre if valid id is passed', async () => {
            const genre = new Genre({ name: "genre1" }); 
            await genre.save();

            const res = request(server).get('api/genres/'+genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        const exec = async function() {
            await request(server)
                    .set('x-auth-token', token)
                    .post('/api/genres')
                    .send({ name });
        }

        beforeEach(() => {
            token = new User().generateAuthToken();
            name = 'genre1';
        });
        
        it('should return a 401 if client is not logged in', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('should return 400 if the genre name is more than 40 characters', async () => {
            name = new Array(42).join('a');

            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if the genre name is less than 3 characters', async () => {
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should save the genre if valid', async () => {
            const res = await exec();

            const genre = await Genre.findOne({ name: 'genre6' });
            expect(genre).not.toBeNull();
        });
        
        it('should return the genre if valid', async () => {
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});

