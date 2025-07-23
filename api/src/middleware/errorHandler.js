const ResponseHandler = require('../utils/responseHandler');

const errorHandler = (error, req, res, next) => {
  console.log('Error caught in middleware:', error.message);
  console.log('Error type:', error.name);
  console.log('Error stack:', error.stack);

  // Handle specific error types
  if (error.name === 'ValidationError') {
    return ResponseHandler.badRequest(res, 'Validation error', error.details);
  }

  if (error.message === 'User not found') {
    return ResponseHandler.notFound(res, error.message);
  }

  if (error.message.includes('Location not found for zip code')) {
    console.log('Handling zip code not found error');
    return ResponseHandler.badRequest(res, error.message);
  }

  if (error.message.includes('Failed to fetch')) {
    return ResponseHandler.error(res, error.message, 503);
  }

  // Default error
  console.log('Using default error handler');
  return ResponseHandler.error(res, error.message || 'Internal server error');
};

module.exports = errorHandler; 