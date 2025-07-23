const userService = require('../services/userService');
const ResponseHandler = require('../utils/responseHandler');

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

class UserController {
  createUser = asyncHandler(async (req, res) => {
    const user = await userService.createUser(req.body);
    ResponseHandler.created(res, user, 'User created successfully');
  });

  getAllUsers = asyncHandler(async (req, res) => {
    const users = await userService.getAllUsers();
    ResponseHandler.success(res, users);
  });

  getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    
    if (!user) {
      return ResponseHandler.notFound(res, 'User not found');
    }
    
    ResponseHandler.success(res, user);
  });

  updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    ResponseHandler.success(res, updatedUser, 'User updated successfully');
  });

  deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await userService.deleteUser(id);
    ResponseHandler.deleted(res, 'User deleted successfully');
  });

  getUserWeather = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const weatherData = await userService.getUserWeather(id);
    ResponseHandler.success(res, weatherData);
  });
}

module.exports = new UserController(); 