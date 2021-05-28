
const request = require('supertest');
var CryptoJS = require("crypto-js");

const drinkTest = (app) => {

    describe('Get /api/drinks', function () {
        it('respond with json containing drinks location', function (done) {
            request(app)
                .get('/api/drinks?near=paris')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Get /api/drinks', function () {
        it('respond with json containing drinks location whithout location', function (done) {
            request(app)
                .get('/api/drinks')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(500)
                .then(() => done())
                .catch(err => done(err))
        });
    });
}

module.exports = drinkTest;