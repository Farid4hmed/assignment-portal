const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
process.env.JWT_SECRET = 'testsecret';

before(async function () {

  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.disconnect(); // Disconnect any existing Mongoose connections

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {

  const { collections } = mongoose.connection;
  for (const key in collections) {
    await collections[key].deleteMany();
  }
});
