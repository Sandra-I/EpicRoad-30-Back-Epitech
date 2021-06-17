
const request = require('supertest');
var CryptoJS = require("crypto-js");

const hotelTest = (app) => {

    describe('Get /api/hotels', function () {
        it('respond with json containing hotels location', function (done) {
            this.timeout(10000);
            request(app)
                .get('/api/hotels?city=paris')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => done())
                .catch(err => done(err))
        });
    });
}

module.exports = hotelTest;