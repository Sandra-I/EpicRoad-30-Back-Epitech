
const request = require('supertest');
var CryptoJS = require("crypto-js");

const eatTest = (app) => {

    describe('Get /api/eats', function () {
        it('respond with json containing eats location', function (done) {
            request(app)
                .get('/api/eats?near=paris')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Get /api/eats', function () {
        it('respond with json containing eats location whithout location', function (done) {
            request(app)
                .get('/api/eats')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(500)
                .then(() => done())
                .catch(err => done(err))
        });
    });


    describe('Get /api/eats/:id', function () {
        it('respond with json containing eats location whithout location', function (done) {
            request(app)
                .get('/api/eats/aze')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Get /api/eats/:id/thumbnails', function () {
        it('respond with json containing eats location whithout location', function (done) {
            request(app)
                .get('/api/eats/aze/thumbnails')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => done())
                .catch(err => done(err))
        });
    });
}

module.exports = eatTest;