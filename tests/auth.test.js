const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); 
const { expect } = chai;
require('./setup');

chai.use(chaiHttp);

describe('User API', () => {
    let token;

    it('should register a new user', (done) => {
        chai.request(app)
            .post('/users/register')
            .send({ username: 'testuser', email: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('username', 'testuser');
                done();
            });
    });

    it('should log in a user and return a token', (done) => {
        chai.request(app)
            .post('/users/login')
            .send({ email: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('token');
                token = res.body.token;
                done();
            });
    });

    it('should get the user profile', (done) => {
        chai.request(app)
            .get('/users/profile')
            .set('Authorization', `${token}`)
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('username', 'testuser');
                done();
            });
    });
});
