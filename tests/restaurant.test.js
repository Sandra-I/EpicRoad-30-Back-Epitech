
const request = require('supertest');
var CryptoJS = require("crypto-js");

const restaurantTest = (app) => {

    describe('Get /api/restaurants', function () {
        it('respond with json containing restaurants location', function (done) {
            this.timeout(10000);
            request(app)
                .get('/api/restaurants?city=paris')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Get /api/restaurants', function () {
        it('respond with json containing restaurants location whithout location', function (done) {
            this.timeout(10000);
            request(app)
                .get('/api/restaurants')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(500)
                .then(() => done())
                .catch(err => done(err))
        });
    });
}

module.exports = restaurantTest;