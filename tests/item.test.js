const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server'); 
const { expect } = chai;
const fs = require('fs');
const path = require('path');
const moment = require('moment');
require('./auth.test');

chai.use(chaiHttp);

describe('Item API', () => {
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

    it('should create a new item', (done) => {
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
                console.log(res.body);
                expect(res).to.have.status(201);
                expect(res.body).to.have.property('id');
                expect(res.body).to.have.property('name', 'Item 1');
                expect(res.body).to.have.property('description', 'Description 1');
                expect(res.body).to.have.property('startingPrice', 10.0);
                expect(res.body).to.have.property('currentPrice', 10.0);
                expect(res.body).to.have.property('endTime');
                expect(res.body).to.have.property('imageUrl');
                expect(res.body).to.have.property('ownerId');
                itemId = res.body.id;
                done();
            });
    });

    it('should fetch items with pagination and filtering', (done) => {
        chai.request(app)
            .get('/items')
            .set('Authorization', `${token}`)
            .query({ page: 1, limit: 10, search: 'Item', status: 'active' })
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('items');
                expect(res.body).to.have.property('totalItems');
                expect(res.body).to.have.property('totalPages');
                expect(res.body).to.have.property('currentPage', 1);
                done();
            });
    });

    it('should fetch a single item by ID', (done) => {
        chai.request(app)
            .get(`/items/${itemId}`)
            .set('Authorization', `${token}`)
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('id', itemId);
                done();
            });
    });

    it('should update an item', (done) => {
        chai.request(app)
            .put(`/items/${itemId}`)
            .set('Authorization', `${token}`)
            .send({ name: 'Updated Item', description: 'Updated Description', startingPrice: 15.0, endTime: moment().add(2, 'days').toISOString() })
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('name', 'Updated Item');
                expect(res.body).to.have.property('description', 'Updated Description');
                expect(res.body).to.have.property('startingPrice', 15.0);
                done();
            });
    });

    it('should delete an item', (done) => {
        chai.request(app)
            .delete(`/items/${itemId}`)
            .set('Authorization', `${token}`)
            .end((err, res) => {
                if (err) {
                    console.error(err);
                }
                expect(res).to.have.status(200);
                expect(res.body).to.have.property('message', 'Item deleted successfully');
                done();
            });
    });
});
