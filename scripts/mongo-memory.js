// Starts a local in-memory MongoDB and keeps it running for dev/screenshots.
const { MongoMemoryServer } = require('mongodb-memory-server');

(async () => {
  const mongod = await MongoMemoryServer.create({
    instance: { dbName: 'JOB-DATA', port: 27017 },
  });
  console.log('MONGO_READY ' + mongod.getUri('JOB-DATA'));
  const shutdown = async () => { await mongod.stop(); process.exit(0); };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  setInterval(() => {}, 1 << 30); // keep alive
})().catch((err) => {
  console.error('MONGO_FAIL', err.message);
  process.exit(1);
});
