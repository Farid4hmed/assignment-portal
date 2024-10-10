const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');

chai.use(chaiHttp);
const { expect } = chai;

describe('Admin Endpoints', () => {
    let hashStub;
    let compareStub;

    before(() => {
        // Stub bcrypt.hash to always return 'hashedpassword'
        hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedpassword');

        // Stub bcrypt.compare to control password comparisons
        compareStub = sinon.stub(bcrypt, 'compare').callsFake((password, hashed) => {
            if (password === 'adminpassword' && hashed === 'hashedpassword') {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        });
    });

    after(() => {
        // Restore original bcrypt methods after tests
        hashStub.restore();
        compareStub.restore();
    });

    describe('POST /admin/register', () => {
        it('should register a new admin', (done) => {
            chai
                .request(app)
                .post('/admin/register')
                .send({ username: 'adminuser', password: 'adminpassword' })
                .end((err, res) => {
                    expect(res).to.have.status(201);
                    expect(res.body).to.have.property('message', 'Admin registered successfully');
                    done();
                });
        });

        it('should not register an admin with an existing username', (done) => {
            // Pre-save an admin user to simulate duplicate registration
            const admin = new User({ username: 'adminuser', password: 'hashedpassword', role: 'Admin' });
            admin.save().then(() => {
                chai
                    .request(app)
                    .post('/admin/register')
                    .send({ username: 'adminuser', password: 'adminpassword' })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('error', 'Admin already exists');
                        done();
                    });
            });
        });

        it('should not allow a regular user to register as an admin', (done) => {
            const user = new User({ username: 'john_doe', password: 'hashedpassword', role: 'User' });
            user.save().then(() => {
                chai
                    .request(app)
                    .post('/admin/register')
                    .send({ username: 'john_doe', password: 'adminpassword' })
                    .end((err, res) => {
                        expect(res).to.have.status(400);
                        expect(res.body).to.have.property('error', 'You are registered as a User');
                        done();
                    });
            });
        });
    });

    describe('POST /admin/login', () => {
        beforeEach((done) => {
            // Pre-save an admin user for login tests
            const admin = new User({ username: 'adminuser', password: 'hashedpassword', role: 'Admin' });
            admin.save().then(() => done());
        });

        it('should log in an admin', (done) => {
            chai
                .request(app)
                .post('/admin/login')
                .send({ username: 'adminuser', password: 'adminpassword' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('token');
                    done();
                });
        });

        it('should not log in with invalid credentials', (done) => {
            chai
                .request(app)
                .post('/admin/login')
                .send({ username: 'adminuser', password: 'wrongpassword' })
                .end((err, res) => {
                    expect(res).to.have.status(400);
                    expect(res.body).to.have.property('error', 'Invalid credentials');
                    done();
                });
        });
    });

    describe('GET /admin/assignments', () => {
        let adminToken;
        let assignmentId;

        beforeEach((done) => {
            // Create admin, user, and an assignment, then log in to get token
            const admin = new User({ username: 'adminuser', password: 'hashedpassword', role: 'Admin' });
            const user = new User({ username: 'johnuser', password: 'hashedpassword', role: 'User' });

            Promise.all([admin.save(), user.save()]).then(([savedAdmin, savedUser]) => {
                const assignment = new Assignment({
                    userId: savedUser._id,
                    adminId: savedAdmin._id,
                    task: 'Complete the project report',
                });

                assignment.save().then((savedAssignment) => {
                    assignmentId = savedAssignment._id;
                    chai
                        .request(app)
                        .post('/admin/login')
                        .send({ username: 'adminuser', password: 'adminpassword' })
                        .end((err, res) => {
                            expect(res).to.have.status(200);
                            expect(res.body).to.have.property('token');
                            adminToken = res.body.token;
                            done();
                        });
                });
            });
        });

        it('should view assignments tagged to the admin', (done) => {
            chai
                .request(app)
                .get('/admin/assignments')
                .set('Authorization', `Bearer ${adminToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('task', 'Complete the project report');
                    done();
                });
        });

        it('should return unauthorized without token', (done) => {
            chai
                .request(app)
                .get('/admin/assignments')
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('error', 'Unauthorized');
                    done();
                });
        });

        it('should accept an assignment', (done) => {
            chai
                .request(app)
                .post(`/admin/assignments/${assignmentId}/accept`)
                .set('Authorization', `Bearer ${adminToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Assignment accepted');
                    done();
                });
        });

        it('should not accept an assignment without proper authorization', (done) => {
            chai
                .request(app)
                .post(`/admin/assignments/${assignmentId}/accept`)
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('error', 'Unauthorized');
                    done();
                });
        });

        it('should reject an assignment', (done) => {
            chai
                .request(app)
                .post(`/admin/assignments/${assignmentId}/reject`)
                .set('Authorization', `Bearer ${adminToken}`)
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Assignment rejected');
                    done();
                });
        });

        it('should not reject an assignment without proper authorization', (done) => {
            chai
                .request(app)
                .post(`/admin/assignments/${assignmentId}/reject`)
                .end((err, res) => {
                    expect(res).to.have.status(401);
                    expect(res.body).to.have.property('error', 'Unauthorized');
                    done();
                });
        });
    });
});
