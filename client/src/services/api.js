import axios from 'axios';
import config from '../config';
import { API_ENDPOINTS } from '../constants';

class APIService {
  constructor() {
    this.client = axios.create({
      baseURL: `${config.apiUrl}/api`,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });
  }

  getAllUsers() {
    return this.client.get(API_ENDPOINTS.USERS).then(response => response.data);
  }

  getUserById(id) {
    return this.client.get(`${API_ENDPOINTS.USERS}/${id}`).then(response => response.data);
  }

  createUser(userData) {
    return this.client.post(API_ENDPOINTS.USERS, userData).then(response => response.data);
  }

  updateUser(id, userData) {
    return this.client.put(`${API_ENDPOINTS.USERS}/${id}`, userData).then(response => response.data);
  }

  deleteUser(id) {
    return this.client.delete(`${API_ENDPOINTS.USERS}/${id}`).then(response => response.data);
  }

  getUserWeather(id) {
    return this.client.get(`${API_ENDPOINTS.USERS}/${id}${API_ENDPOINTS.WEATHER}`).then(response => response.data);
  }
}

const apiService = new APIService();

export const userAPI = {
  getAllUsers: () => apiService.getAllUsers(),
  getUserById: (id) => apiService.getUserById(id),
  createUser: (userData) => apiService.createUser(userData),
  updateUser: (id, userData) => apiService.updateUser(id, userData),
  deleteUser: (id) => apiService.deleteUser(id),
  getUserWeather: (id) => apiService.getUserWeather(id)
};

export default apiService.client;
