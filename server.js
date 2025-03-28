require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

const port = process.env.SERVER_PORT || 3000;

// Middleware
app.use(express.json());

// Database Connection
const connectDB = async () => {
  try {
    const useOnlineDB = process.env.USE_ONLINE_DB === 'true';
    const mongoURI = useOnlineDB
      ? process.env.MONGO_URI_ONLINE
      : process.env.MONGO_URI_LOCAL;

    if (!mongoURI) {
      throw new Error('MongoDB URI is not defined in environment variables');
    }

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if no server is selected
      maxPoolSize: 10, // Maximum number of connections in the pool
    });

    console.log(`✅ Connected to MongoDB: ${useOnlineDB ? 'Online' : 'Local'}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1); // Exit process with failure
  }
};

// Routes
const userRoutes = require('./routes/userRoute');
app.use('/api', userRoutes);

const authRoutes = require('./routes/authRoute');
app.use('/', authRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(mongoose.connection.readyState === 1 ? 200 : 503).json({
    status: mongoose.connection.readyState === 1 ? 'healthy' : 'unhealthy',
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Start Server
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
};

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

startServer();
