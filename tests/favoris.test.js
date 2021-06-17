
const request = require('supertest');

const favorisTest = (app) => {

    describe('Get /api/favoris', function () {
        it('respond with json containing favoris location', function (done) {
            request(app)
                .get('/api/favoris')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Get /api/favoris/test', function () {
        it('respond with json containing favoris location whithout location', function (done) {
            request(app)
                .get('/api/favoris/test')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Get /api/favoris/drink', function () {
        it('respond with json containing favoris location whithout location', function (done) {
            request(app)
                .get('/api/favoris/test')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Post /api/favoris', function () {
        it('respond with json containing favoris location whithout location', function (done) {
            request(app)
                .post('/api/favoris')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(401)
                .then(() => done())
                .catch(err => done(err))
        });
    });
}

module.exports = favorisTest;