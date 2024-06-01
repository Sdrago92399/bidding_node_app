const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); 
const { expect } = chai;
const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('./item.test');

chai.use(chaiHttp);

describe('Bid API', () => {
    let token;
    let itemId;

    before((done) => {
        chai.request(app)
            .post('/users/login')
            .send({ email: 'testuser@example.com', password: 'password123' })
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                token = res.body.token;
                done();
            });
    });

    before((done) => {
        chai.request(app)
            .post('/items')
            .set('Authorization', `${token}`)
            .field('name', 'Item 1')
            .field('description', 'Description 1')
            .field('startingPrice', 10.0)
            .field('endTime', moment().add(1, 'days').toISOString())
            .attach('image', fs.readFileSync(path.join(__dirname, 'test_image.png')), 'test_image.png')
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                itemId = res.body.id;
                done();
            });
    });

    it('should place a new bid', (done) => {
        chai.request(app)
            .post(`/items/${itemId}/bids`)
            .set('Authorization', `${token}`)
            .send({ bidAmount: 15.0 })
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('itemId', itemId.toString());
                expect(res.body).to.have.property('bidAmount', 15.0);
                done();
            });
    });

    it('should get all bids for an item', (done) => {
        chai.request(app)
            .get(`/items/${itemId}/bids`)
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
