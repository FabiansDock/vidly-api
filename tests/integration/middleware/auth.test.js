const request = require('supertest');
const server = require('../../../index');
const {User} = require('../models/users');

describe('auth middleware', () => {
    let token;

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await User.remove({});
        server.close();
    });

    const exec = () => {
        return request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({ name: 'genre1'});
    };

    describe('POST /api/genres', () => {
        it('should return 401 if no token is provided', async () => {
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });
        
        it('should return 400 if invalid token is provided', async () => {
            token = 'a';
            const res = await exec();
            expect(res.status).toBe(400);
        });
        
        it('should return 200 if valid token is provided', async () => {
            const res = await exec();
            expect(res.status).toBe(200);
        });
    });
});