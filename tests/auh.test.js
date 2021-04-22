
const request = require('supertest');
var CryptoJS = require("crypto-js");

const authTest = (app) => {

    describe('POST /auth/signin', function () {
        it('respond with json containing user login', function (done) {
            request(app)
                .post('/api/auth/signin')
                .send({email: "test@gmail.com", password: "test"})
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')
                .then(response => {
                    if(response.body.email != 'test@gmail.com') throw "Wrong email";
                    if(response.body.password != CryptoJS.AES.decrypt("test", process.env.AES_ENCRYPTION_KEY)) throw "Wrong password"
                    done();
                })
                .catch(err => done(err))
        });
    });
}

module.exports = authTest;