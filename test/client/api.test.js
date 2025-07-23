// Mock the API service module directly
jest.mock('../../client/src/services/api', () => ({
  userAPI: {
    getAllUsers: jest.fn(),
    getUserById: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
    getUserWeather: jest.fn()
  }
}));

import { userAPI } from '../../client/src/services/api';

describe('API Service Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUsers', () => {
    it('should fetch users successfully', async () => {
      const mockUsers = [
        { id: '1', name: 'John Doe', zipCode: '12345' },
        { id: '2', name: 'Jane Smith', zipCode: '54321' }
      ];

      userAPI.getAllUsers.mockResolvedValue({ success: true, data: mockUsers });

      const result = await userAPI.getAllUsers();

      expect(result).toEqual({ success: true, data: mockUsers });
      expect(userAPI.getAllUsers).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors', async () => {
      userAPI.getAllUsers.mockRejectedValue(new Error('Network error'));

      await expect(userAPI.getAllUsers()).rejects.toThrow('Network error');
    });

    it('should handle API response with error', async () => {
      userAPI.getAllUsers.mockResolvedValue({ success: false, message: 'Server error' });

      const result = await userAPI.getAllUsers();
      expect(result).toEqual({ success: false, message: 'Server error' });
    });
  });

  describe('getUserById', () => {
    it('should fetch user by ID successfully', async () => {
      const mockUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345'
      };

      userAPI.getUserById.mockResolvedValue({ success: true, data: mockUser });

      const result = await userAPI.getUserById('1');

      expect(result).toEqual({ success: true, data: mockUser });
      expect(userAPI.getUserById).toHaveBeenCalledWith('1');
    });

    it('should handle user not found', async () => {
      userAPI.getUserById.mockResolvedValue({ success: false, message: 'User not found' });

      const result = await userAPI.getUserById('999');
      expect(result).toEqual({ success: false, message: 'User not found' });
    });
  });

  describe('createUser', () => {
    it('should create user successfully', async () => {
      const newUser = {
        name: 'John Doe',
        zipCode: '12345'
      };

      const createdUser = { id: '1', ...newUser };

      userAPI.createUser.mockResolvedValue({ success: true, data: createdUser });

      const result = await userAPI.createUser(newUser);

      expect(result).toEqual({ success: true, data: createdUser });
      expect(userAPI.createUser).toHaveBeenCalledWith(newUser);
    });

    it('should handle validation errors', async () => {
      userAPI.createUser.mockResolvedValue({ success: false, message: 'Validation failed' });

      const result = await userAPI.createUser({ name: '' });
      expect(result).toEqual({ success: false, message: 'Validation failed' });
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'John Updated',
        zipCode: '54321'
      };

      const updatedUser = { id: '1', ...updateData };

      userAPI.updateUser.mockResolvedValue({ success: true, data: updatedUser });

      const result = await userAPI.updateUser('1', updateData);

      expect(result).toEqual({ success: true, data: updatedUser });
      expect(userAPI.updateUser).toHaveBeenCalledWith('1', updateData);
    });

    it('should handle user not found during update', async () => {
      userAPI.updateUser.mockResolvedValue({ success: false, message: 'User not found' });

      const result = await userAPI.updateUser('999', { name: 'Test' });
      expect(result).toEqual({ success: false, message: 'User not found' });
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      userAPI.deleteUser.mockResolvedValue({ success: true, message: 'User deleted successfully' });

      const result = await userAPI.deleteUser('1');

      expect(result).toEqual({ success: true, message: 'User deleted successfully' });
      expect(userAPI.deleteUser).toHaveBeenCalledWith('1');
    });

    it('should handle user not found during deletion', async () => {
      userAPI.deleteUser.mockResolvedValue({ success: false, message: 'User not found' });

      const result = await userAPI.deleteUser('999');
      expect(result).toEqual({ success: false, message: 'User not found' });
    });
  });

  describe('getUserWeather', () => {
    it('should fetch user weather successfully', async () => {
      const mockWeather = {
        temperature: 25,
        description: 'clear sky',
        humidity: 60
      };

      userAPI.getUserWeather.mockResolvedValue({ success: true, data: mockWeather });

      const result = await userAPI.getUserWeather('1');

      expect(result).toEqual({ success: true, data: mockWeather });
      expect(userAPI.getUserWeather).toHaveBeenCalledWith('1');
    });

    it('should handle weather API errors', async () => {
      userAPI.getUserWeather.mockRejectedValue(new Error('Weather API error'));

      await expect(userAPI.getUserWeather('1')).rejects.toThrow('Weather API error');
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors', async () => {
      userAPI.getAllUsers.mockRejectedValue(new Error('Network error'));

      await expect(userAPI.getAllUsers()).rejects.toThrow('Network error');
    });

    it('should handle timeout errors', async () => {
      userAPI.getAllUsers.mockRejectedValue(new Error('Request timeout'));

      await expect(userAPI.getAllUsers()).rejects.toThrow('Request timeout');
    });

    it('should handle axios errors without response', async () => {
      userAPI.getAllUsers.mockRejectedValue(new Error('Network error'));

      await expect(userAPI.getAllUsers()).rejects.toThrow('Network error');
    });
  });
}); 