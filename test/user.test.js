const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon'); 
const bcrypt = require('bcrypt'); 
const app = require('../app'); 
const User = require('../models/userModel');
const Assignment = require('../models/assignmentModel');
const mongoose = require('mongoose');

chai.use(chaiHttp);
const { expect } = chai;

describe('User Endpoints', () => {
  let hashStub;
  let compareStub;

  before(() => {
    // Stub bcrypt.hash to always return 'hashedpassword'
    hashStub = sinon.stub(bcrypt, 'hash').resolves('hashedpassword');

    // Stub bcrypt.compare
    // For valid password comparisons, resolve to true
    // For invalid ones, resolve to false
    compareStub = sinon.stub(bcrypt, 'compare').callsFake((password, hashed) => {
      if (password === 'userpassword' && hashed === 'hashedpassword') {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });
  });

  after(() => {
    // Restore the original methods
    hashStub.restore();
    compareStub.restore();
  });

  describe('POST /register', () => {
    it('should register a new user', (done) => {
      chai
        .request(app)
        .post('/register')
        .send({ username: 'johnuser', password: 'userpassword' }) // Plaintext password
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message', 'User registered successfully');
          done();
        });
    });

    it('should not register a user with an existing username', function (done) {
      
      // Create and save a user with username 'johnuser' and password 'hashedpassword'
      const user = new User({ username: 'johnuser', password: 'hashedpassword', role: 'User' });
      user.save().then(() => {
        // Attempt to register the same username again
        chai
          .request(app)
          .post('/register')
          .send({ username: 'johnuser', password: 'userpassword' }) // Plaintext password
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.have.property('error', 'User already exists');
            done();
          });
      });
    });

    it('should validate input data', (done) => {
      chai
        .request(app)
        .post('/register')
        .send({ username: 'jd', password: '123' }) // Invalid data: username too short, password too short
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error');
          done();
        });
    });
  });

  describe('POST /login', () => {
    beforeEach((done) => {
      // Create and save a user with username 'johnuser' and password 'hashedpassword'
      const user = new User({ username: 'johnuser', password: 'hashedpassword', role: 'User' });
      user.save().then(() => done());
    });

    it('should log in a user', (done) => {
      chai
        .request(app)
        .post('/login')
        .send({ username: 'johnuser', password: 'userpassword' }) // Correct plaintext password
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property('token');
          done();
        });
    });

    it('should not log in with invalid credentials', (done) => {
      chai
        .request(app)
        .post('/login')
        .send({ username: 'johnuser', password: 'wrongpassword' }) // Incorrect password
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('error', 'Invalid credentials');
          done();
        });
    });
  });


  describe('GET /admins', () => {
    let userToken;

    beforeEach((done) => {
      // Create and save a user with username 'johnuser' and password 'hashedpassword'
      const user = new User({ username: 'johnuser', password: 'hashedpassword', role: 'User' });
      user.save().then(() => {
        // Log in to get token
        chai
          .request(app)
          .post('/login')
          .send({ username: 'johnuser', password: 'userpassword' }) // Plaintext password
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            userToken = res.body.token;
            done();
          });
      });
    });

    it('should get all admins', (done) => {
      // Create and save an admin user with username 'admin_user' and password 'hashedpassword'
      const admin = new User({ username: 'admin_user', password: 'hashedpassword', role: 'Admin' });
      admin.save().then(() => {
        chai
          .request(app)
          .get('/admins')
          .set('Authorization', `Bearer ${userToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.an('array');
            expect(res.body[0]).to.have.property('username', 'admin_user');
            done();
          });
      });
    });

    it('should return unauthorized without token', (done) => {
      chai
        .request(app)
        .get('/admins')
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.have.property('error', 'Unauthorized');
          done();
        });
    });
  });


  describe('POST /upload', () => {
    let userToken;
    let adminId;

    beforeEach((done) => {
      // Create and save a user and an admin
      const user = new User({ username: 'johnuser', password: 'hashedpassword', role: 'User' });
      const admin = new User({ username: 'admin_user', password: 'hashedpassword', role: 'Admin' });

      Promise.all([user.save(), admin.save()]).then(([savedUser, savedAdmin]) => {
        adminId = savedAdmin._id;
        // Log in to get user token
        chai
          .request(app)
          .post('/login')
          .send({ username: 'johnuser', password: 'userpassword' }) 
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('token');
            userToken = res.body.token;
            done();
          });
      });
    });

    it('should upload an assignment', (done) => {
      chai
        .request(app)
        .post('/upload')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ task: 'Complete the project report', adminId })
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message', 'Assignment uploaded successfully');
          done();
        });
    });
  });
});
