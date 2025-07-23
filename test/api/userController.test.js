const request = require('supertest');
const express = require('express');
const userController = require('../../api/src/controllers/userController');

// Mock the userService
jest.mock('../../api/src/services/userService');

const app = express();
app.use(express.json());

// Mock routes for testing
app.get('/api/users', userController.getAllUsers);
app.post('/api/users', userController.createUser);
app.get('/api/users/:id', userController.getUserById);
app.put('/api/users/:id', userController.updateUser);
app.delete('/api/users/:id', userController.deleteUser);
app.get('/api/users/:id/weather', userController.getUserWeather);

// Mock error handler
app.use((err, req, res, next) => {
  res.status(500).json({
    success: false,
    message: err.message
  });
});

describe('User Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users successfully', async () => {
      const mockUsers = [
        { id: '1', name: 'John Doe', zipCode: '12345' },
        { id: '2', name: 'Jane Smith', zipCode: '54321' }
      ];

      const userService = require('../../api/src/services/userService');
      userService.getAllUsers.mockResolvedValue(mockUsers);

      const response = await request(app)
        .get('/api/users')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUsers);
      expect(userService.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle errors when getting users', async () => {
      const userService = require('../../api/src/services/userService');
      userService.getAllUsers.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/users')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('POST /api/users', () => {
    it('should create a user successfully', async () => {
      const newUser = {
        name: 'John Doe',
        zipCode: '12345'
      };

      const createdUser = { id: '1', ...newUser };

      const userService = require('../../api/src/services/userService');
      userService.createUser.mockResolvedValue(createdUser);

      const response = await request(app)
        .post('/api/users')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(createdUser);
      expect(response.body.message).toBe('User created successfully');
      expect(userService.createUser).toHaveBeenCalledWith(newUser);
    });

    it('should handle service errors during creation', async () => {
      const userService = require('../../api/src/services/userService');
      userService.createUser.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .post('/api/users')
        .send({ name: 'John Doe', zipCode: '12345' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Service error');
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return a user by ID successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345'
      };

      const userService = require('../../api/src/services/userService');
      userService.getUserById.mockResolvedValue(mockUser);

      const response = await request(app)
        .get('/api/users/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockUser);
      expect(userService.getUserById).toHaveBeenCalledWith('1');
    });

    it('should handle user not found', async () => {
      const userService = require('../../api/src/services/userService');
      userService.getUserById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/users/999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User not found');
    });

    it('should handle service errors', async () => {
      const userService = require('../../api/src/services/userService');
      userService.getUserById.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .get('/api/users/1')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Service error');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update a user successfully', async () => {
      const updateData = {
        name: 'John Updated',
        zipCode: '54321'
      };

      const updatedUser = {
        id: '1',
        ...updateData
      };

      const userService = require('../../api/src/services/userService');
      userService.updateUser.mockResolvedValue(updatedUser);

      const response = await request(app)
        .put('/api/users/1')
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(updatedUser);
      expect(response.body.message).toBe('User updated successfully');
      expect(userService.updateUser).toHaveBeenCalledWith('1', updateData);
    });

    it('should handle service errors during update', async () => {
      const userService = require('../../api/src/services/userService');
      userService.updateUser.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .put('/api/users/1')
        .send({ name: 'Test' })
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Service error');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user successfully', async () => {
      const userService = require('../../api/src/services/userService');
      userService.deleteUser.mockResolvedValue(undefined);

      const response = await request(app)
        .delete('/api/users/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User deleted successfully');
      expect(userService.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should handle service errors during deletion', async () => {
      const userService = require('../../api/src/services/userService');
      userService.deleteUser.mockRejectedValue(new Error('Service error'));

      const response = await request(app)
        .delete('/api/users/1')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Service error');
    });
  });

  describe('GET /api/users/:id/weather', () => {
    it('should return user weather data', async () => {
      const mockWeather = {
        temperature: 25,
        description: 'clear sky',
        humidity: 60
      };

      const userService = require('../../api/src/services/userService');
      userService.getUserWeather.mockResolvedValue(mockWeather);

      const response = await request(app)
        .get('/api/users/1/weather')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(mockWeather);
      expect(userService.getUserWeather).toHaveBeenCalledWith('1');
    });

    it('should handle weather service errors', async () => {
      const userService = require('../../api/src/services/userService');
      userService.getUserWeather.mockRejectedValue(new Error('Weather service error'));

      const response = await request(app)
        .get('/api/users/1/weather')
        .expect(500);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Weather service error');
    });
  });
}); 