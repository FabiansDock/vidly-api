const { User } = require('../../../models/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('returns jwt token', () => {
        const payload = { 
            _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true 
        };
        const user = new User(payload);
        const result = user.generateAuthToken();
        const decoded = jwt.verify(result, config.get('localjwtkey'));
        expect(decoded).toMatchObject(payload);
    });
});