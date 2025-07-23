const BaseService = require('./baseService');
const weatherService = require('./weatherService');
const db = require('./firebase');

class UserService extends BaseService {
  constructor() {
    super(db);
    this.collection = 'users';
  }

  async getAllUsers() {
    return await this.getAll(this.collection);
  }

  async getUserById(id) {
    return await this.getById(this.collection, id);
  }

  async createUser(userData) {
    const { name, zipCode } = userData;
    const locationData = await weatherService.getLocationData(zipCode);

    const userToCreate = {
      name,
      zipCode,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      timezone: locationData.timezone,
      cityName: locationData.cityName
    };

    return await this.create(this.collection, userToCreate);
  }

  async updateUser(id, updateData) {
    const existingUser = await this.getById(this.collection, id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    let userData = { ...existingUser };

    if (updateData.name) {
      userData.name = updateData.name;
    }

    if (updateData.zipCode && updateData.zipCode !== existingUser.zipCode) {
      const locationData = await weatherService.getLocationData(updateData.zipCode);
      userData.zipCode = updateData.zipCode;
      userData.latitude = locationData.latitude;
      userData.longitude = locationData.longitude;
      userData.timezone = locationData.timezone;
      userData.cityName = locationData.cityName;
    }

    return await this.update(this.collection, id, userData);
  }

  async deleteUser(id) {
    const existingUser = await this.getById(this.collection, id);
    if (!existingUser) {
      throw new Error('User not found');
    }

    return await this.delete(this.collection, id);
  }

  async getUserWeather(id) {
    const user = await this.getById(this.collection, id);
    if (!user) {
      throw new Error('User not found');
    }

    const weatherData = await weatherService.getWeatherData(user.latitude, user.longitude);

    return {
      user: {
        name: user.name,
        cityName: user.cityName,
        zipCode: user.zipCode
      },
      weather: weatherData
    };
  }
}

module.exports = new UserService(); 