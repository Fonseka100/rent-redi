const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateUser, validateUpdateUser } = require('../middleware/validation');

// CRUD endpoints
router.post('/', validateUser, userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', validateUpdateUser, userController.updateUser);
router.delete('/:id', userController.deleteUser);

// Additional endpoint for weather data
router.get('/:id/weather', userController.getUserWeather);

module.exports = router; 