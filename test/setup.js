const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
process.env.JWT_SECRET = 'testsecret'; // Set a test secret for JWT

// Set up an in-memory MongoDB server before all tests
before(async function () {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.disconnect(); // Ensure no previous connections
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clean up after all tests
after(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

// Clear all collections before each test
beforeEach(async () => {
  const { collections } = mongoose.connection;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
