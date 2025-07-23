const validation = require('../../api/src/middleware/validation');

describe('Validation Middleware Tests', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('validateUser', () => {
    it('should pass validation for valid user data', () => {
      mockReq.body = {
        name: 'John Doe',
        zipCode: '12345'
      };

      validation.validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail validation for missing required fields', () => {
      mockReq.body = {
        zipCode: '12345'
        // Missing name
      };

      validation.validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Validation error',
          errors: expect.arrayContaining(['Name is required'])
        })
      );
    });

    it('should fail validation for invalid zip code format', () => {
      mockReq.body = {
        name: 'John Doe',
        zipCode: 'invalid-zip'
      };

      validation.validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Validation error',
          errors: expect.arrayContaining([expect.stringContaining('Zip code')])
        })
      );
    });

    it('should fail validation for empty name', () => {
      mockReq.body = {
        name: '',
        zipCode: '12345'
      };

      validation.validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });

    it('should pass validation with valid ZIP+4 format', () => {
      mockReq.body = {
        name: 'John Doe',
        zipCode: '12345-6789'
      };

      validation.validateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });

  describe('validateUpdateUser', () => {
    it('should pass validation for valid update data', () => {
      mockReq.body = {
        name: 'John Updated',
        zipCode: '54321'
      };

      validation.validateUpdateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should pass validation with partial update data', () => {
      mockReq.body = {
        name: 'John Updated'
        // Missing zipCode (optional in updates)
      };

      validation.validateUpdateUser(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should fail validation for invalid zip code in update', () => {
      mockReq.body = {
        name: 'John Updated',
        zipCode: 'invalid'
      };

      validation.validateUpdateUser(mockReq, mockRes, mockNext);

      expect(mockNext).not.toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });


}); 