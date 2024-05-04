const mongoose = require('mongoose');
const { User } = require('../../../models/users');
const auth = require('../../../middleware/auth');

describe('auth middleware', () => {
    it('should store decode value returned from jwt.verify into req.user', () => {
        const user = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const token = new User(user).generateAuthToken();

        const res = {};
        const req = {
            header: jest.fn().mockReturnValue(token)
        };
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toMatchObject(user);
    });
});