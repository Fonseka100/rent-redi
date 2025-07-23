// Mock firebase
jest.mock('../../api/src/services/firebase', () => ({
  ref: jest.fn()
}));

// Mock the weatherService
jest.mock('../../api/src/services/weatherService', () => ({
  getLocationData: jest.fn(),
  getWeatherData: jest.fn()
}));

const userService = require('../../api/src/services/userService');
const weatherService = require('../../api/src/services/weatherService');

describe('User Service Tests', () => {
  let mockDb;
  let mockRef;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock Firebase database
    mockRef = {
      set: jest.fn(),
      once: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    };
    
    mockDb = {
      ref: jest.fn().mockReturnValue(mockRef)
    };

    // Replace the database instance with our mock
    userService.db = mockDb;
  });

  describe('service initialization', () => {
    it('should have correct collection name', () => {
      expect(userService.collection).toBe('users');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users from collection', async () => {
      const mockUsers = [
        { id: '1', name: 'John Doe', zipCode: '12345' },
        { id: '2', name: 'Jane Smith', zipCode: '67890' }
      ];
      
      const mockSnapshot = {
        val: jest.fn().mockReturnValue({
          '1': mockUsers[0],
          '2': mockUsers[1]
        })
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await userService.getAllUsers();

      expect(mockDb.ref).toHaveBeenCalledWith('users');
      expect(mockRef.once).toHaveBeenCalledWith('value');
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array when no users exist', async () => {
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(null)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await userService.getAllUsers();

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockRef.once.mockRejectedValue(error);

      await expect(userService.getAllUsers()).rejects.toThrow('Database error');
    });
  });

  describe('getUserById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: '1', name: 'John Doe', zipCode: '12345' };
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(mockUser)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await userService.getUserById('1');

      expect(mockDb.ref).toHaveBeenCalledWith('users/1');
      expect(mockRef.once).toHaveBeenCalledWith('value');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(null)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await userService.getUserById('999');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockRef.once.mockRejectedValue(error);

      await expect(userService.getUserById('1')).rejects.toThrow('Database error');
    });
  });

  describe('createUser', () => {
    it('should create user with location data', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '12345'
      };

      const locationData = {
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York'
      };

      const expectedUser = {
        id: expect.any(String),
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York',
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      };

      weatherService.getLocationData.mockResolvedValue(locationData);
      mockRef.set.mockResolvedValue();

      const result = await userService.createUser(userData);

      expect(weatherService.getLocationData).toHaveBeenCalledWith('12345');
      expect(mockDb.ref).toHaveBeenCalledWith(`users/${result.id}`);
      expect(mockRef.set).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });

    it('should handle weather service errors', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '99999'
      };

      weatherService.getLocationData.mockRejectedValue(
        new Error('Location not found for zip code 99999')
      );

      await expect(userService.createUser(userData))
        .rejects
        .toThrow('Location not found for zip code 99999');
    });

    it('should handle database errors', async () => {
      const userData = {
        name: 'John Doe',
        zipCode: '12345'
      };

      const locationData = {
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York'
      };

      weatherService.getLocationData.mockResolvedValue(locationData);
      mockRef.set.mockRejectedValue(new Error('Database error'));

      await expect(userService.createUser(userData)).rejects.toThrow('Database error');
    });
  });

  describe('updateUser', () => {
    it('should update user name only', async () => {
      const existingUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York'
      };

      const updateData = {
        name: 'John Updated'
      };

      const expectedUser = {
        id: '1',
        name: 'John Updated',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York',
        updatedAt: expect.any(String)
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(existingUser)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      mockRef.update.mockResolvedValue();

      const result = await userService.updateUser('1', updateData);

      expect(mockDb.ref).toHaveBeenCalledWith('users/1');
      expect(mockRef.update).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });

    it('should update user zip code and fetch new location data', async () => {
      const existingUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York'
      };

      const updateData = {
        zipCode: '67890'
      };

      const newLocationData = {
        latitude: 34.0522,
        longitude: -118.2437,
        timezone: -28800,
        cityName: 'Los Angeles'
      };

      const expectedUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '67890',
        latitude: 34.0522,
        longitude: -118.2437,
        timezone: -28800,
        cityName: 'Los Angeles',
        updatedAt: expect.any(String)
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(existingUser)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      weatherService.getLocationData.mockResolvedValue(newLocationData);
      mockRef.update.mockResolvedValue();

      const result = await userService.updateUser('1', updateData);

      expect(weatherService.getLocationData).toHaveBeenCalledWith('67890');
      expect(mockRef.update).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });

    it('should not update location data if zip code is the same', async () => {
      const existingUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York'
      };

      const updateData = {
        zipCode: '12345' // Same zip code
      };

      const expectedUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        timezone: -18000,
        cityName: 'New York',
        updatedAt: expect.any(String)
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(existingUser)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      mockRef.update.mockResolvedValue();

      const result = await userService.updateUser('1', updateData);

      expect(weatherService.getLocationData).not.toHaveBeenCalled();
      expect(mockRef.update).toHaveBeenCalledWith(expectedUser);
      expect(result).toEqual(expectedUser);
    });

    it('should throw error when user not found', async () => {
      const updateData = { name: 'John Updated' };
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(null)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      await expect(userService.updateUser('999', updateData))
        .rejects
        .toThrow('User not found');
    });

    it('should handle weather service errors during update', async () => {
      const existingUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345'
      };

      const updateData = {
        zipCode: '99999'
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(existingUser)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      weatherService.getLocationData.mockRejectedValue(
        new Error('Location not found for zip code 99999')
      );

      await expect(userService.updateUser('1', updateData))
        .rejects
        .toThrow('Location not found for zip code 99999');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      const existingUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345'
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(existingUser)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      mockRef.remove.mockResolvedValue();

      const result = await userService.deleteUser('1');

      expect(mockDb.ref).toHaveBeenCalledWith('users/1');
      expect(mockRef.remove).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should throw error when user not found', async () => {
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(null)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      await expect(userService.deleteUser('999'))
        .rejects
        .toThrow('User not found');
    });

    it('should handle database errors', async () => {
      const existingUser = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345'
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(existingUser)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      mockRef.remove.mockRejectedValue(new Error('Database error'));

      await expect(userService.deleteUser('1')).rejects.toThrow('Database error');
    });
  });

  describe('getUserWeather', () => {
    it('should return user weather data', async () => {
      const user = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060,
        cityName: 'New York'
      };

      const weatherData = {
        temperature: 25,
        description: 'clear sky',
        humidity: 60,
        windSpeed: 5.2
      };

      const expectedResult = {
        user: {
          name: 'John Doe',
          cityName: 'New York',
          zipCode: '12345'
        },
        weather: weatherData
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(user)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      weatherService.getWeatherData.mockResolvedValue(weatherData);

      const result = await userService.getUserWeather('1');

      expect(weatherService.getWeatherData).toHaveBeenCalledWith(40.7128, -74.0060);
      expect(result).toEqual(expectedResult);
    });

    it('should throw error when user not found', async () => {
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(null)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      await expect(userService.getUserWeather('999'))
        .rejects
        .toThrow('User not found');
    });

    it('should handle weather service errors', async () => {
      const user = {
        id: '1',
        name: 'John Doe',
        zipCode: '12345',
        latitude: 40.7128,
        longitude: -74.0060
      };

      const mockSnapshot = {
        val: jest.fn().mockReturnValue(user)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);
      weatherService.getWeatherData.mockRejectedValue(
        new Error('Failed to fetch weather data')
      );

      await expect(userService.getUserWeather('1'))
        .rejects
        .toThrow('Failed to fetch weather data');
    });
  });
}); 