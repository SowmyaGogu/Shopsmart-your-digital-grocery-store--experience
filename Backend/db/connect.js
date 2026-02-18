const mongoose = require("mongoose");

// Read connection string from environment or fall back to local
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/grocery';

mongoose.set('strictQuery', false);
mongoose.set('debug', true);

const connectOptions = {
  serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS, 10) || 30000,
};

async function connect() {
  try {
    await mongoose.connect(MONGO_URI, connectOptions);
    console.log('MongoDB connection successful');
  } catch (err) {
    console.error('MongoDB connection error:', err && err.message ? err.message : err);
    // Do not throw here to allow the app to start for local development.
    // Keep the process alive; connection can be retried externally or by restarting.
  }
}

connect();

mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to', MONGO_URI.startsWith('mongodb+srv://') ? 'Atlas (SRV)' : MONGO_URI);
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err && err.message ? err.message : err);
});
mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected');
});

module.exports = { MONGO_URI, connect };
