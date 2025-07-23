const express = require('express');
const cors = require('cors');
const config = require('../config');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');

class Server {
  constructor() {
    this.app = express();
    this.port = config.port;
    this.setupMiddleware();
    this.setupRoutes();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({
        success: true,
        message: 'API is running',
        timestamp: new Date().toISOString(),
        status: 'healthy'
      });
    });

    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Welcome to RentRedi User Management API!',
        version: '1.0.0',
        endpoints: {
          users: '/api/users',
          health: '/health'
        }
      });
    });

    this.app.use('/api/users', userRoutes);

    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Endpoint not found',
        path: req.path
      });
    });

    this.app.use(errorHandler);
  }

  start() {
    this.app.listen(this.port, '0.0.0.0', () => {
      console.log(`Server running on port ${this.port}`);
    });
  }
}

const server = new Server();
server.start();

module.exports = server.app;
