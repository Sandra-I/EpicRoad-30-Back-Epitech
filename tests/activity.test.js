
const request = require('supertest');
var CryptoJS = require("crypto-js");

const activityTest = (app) => {

    describe('Get /api/activities', function () {
        it('respond with json containing activities location', function (done) {
            this.timeout(10000);
            request(app)
                .get('/api/activities?city=paris')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(200)
                .then(() => done())
                .catch(err => done(err))
        });
    });

    describe('Get /api/activities', function () {
        it('respond with json containing activities location whithout location', function (done) {
            this.timeout(10000);
            request(app)
                .get('/api/activities')
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .expect(500)
                .then(() => done())
                .catch(err => done(err))
        });
    });
}

module.exports = activityTest;