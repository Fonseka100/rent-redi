const BaseService = require('../../api/src/services/baseService');

// Mock Firebase database
const mockDb = {
  ref: jest.fn()
};

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid-123')
}));

describe('BaseService', () => {
  let baseService;
  let mockRef;

  beforeEach(() => {
    jest.clearAllMocks();
    baseService = new BaseService(mockDb);
    mockRef = {
      set: jest.fn(),
      once: jest.fn(),
      update: jest.fn(),
      remove: jest.fn()
    };
    mockDb.ref.mockReturnValue(mockRef);
  });

  describe('constructor', () => {
    it('should initialize with database instance', () => {
      expect(baseService.db).toBe(mockDb);
    });
  });

  describe('create', () => {
    it('should create a new item with UUID and timestamps', async () => {
      const testData = { name: 'Test Item', value: 123 };
      const expectedItem = {
        id: 'test-uuid-123',
        name: 'Test Item',
        value: 123,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      };

      mockRef.set.mockResolvedValue();

      const result = await baseService.create('test-collection', testData);

      expect(mockDb.ref).toHaveBeenCalledWith(expect.stringMatching(/^test-collection\/[a-f0-9-]+$/));
      expect(mockRef.set).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Test Item',
        value: 123,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }));
      expect(result).toEqual(expect.objectContaining({
        name: 'Test Item',
        value: 123,
        createdAt: expect.any(String),
        updatedAt: expect.any(String)
      }));
      expect(result.id).toMatch(/^[a-f0-9-]+$/);
      expect(new Date(result.createdAt)).toBeInstanceOf(Date);
      expect(new Date(result.updatedAt)).toBeInstanceOf(Date);
    });

    it('should handle create operation errors', async () => {
      const testData = { name: 'Test Item' };
      const error = new Error('Database error');
      mockRef.set.mockRejectedValue(error);

      await expect(baseService.create('test-collection', testData))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('getAll', () => {
    it('should return all items from collection', async () => {
      const mockData = {
        'id1': { id: 'id1', name: 'Item 1' },
        'id2': { id: 'id2', name: 'Item 2' }
      };
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(mockData)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await baseService.getAll('test-collection');

      expect(mockDb.ref).toHaveBeenCalledWith('test-collection');
      expect(mockRef.once).toHaveBeenCalledWith('value');
      expect(result).toEqual([
        { id: 'id1', name: 'Item 1' },
        { id: 'id2', name: 'Item 2' }
      ]);
    });

    it('should return empty array when collection is empty', async () => {
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(null)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await baseService.getAll('test-collection');

      expect(result).toEqual([]);
    });

    it('should handle getAll operation errors', async () => {
      const error = new Error('Database error');
      mockRef.once.mockRejectedValue(error);

      await expect(baseService.getAll('test-collection'))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('getById', () => {
    it('should return item by id', async () => {
      const mockItem = { id: 'test-id', name: 'Test Item' };
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(mockItem)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await baseService.getById('test-collection', 'test-id');

      expect(mockDb.ref).toHaveBeenCalledWith('test-collection/test-id');
      expect(mockRef.once).toHaveBeenCalledWith('value');
      expect(result).toEqual(mockItem);
    });

    it('should return null when item not found', async () => {
      const mockSnapshot = {
        val: jest.fn().mockReturnValue(null)
      };

      mockRef.once.mockResolvedValue(mockSnapshot);

      const result = await baseService.getById('test-collection', 'non-existent-id');

      expect(result).toBeNull();
    });

    it('should handle getById operation errors', async () => {
      const error = new Error('Database error');
      mockRef.once.mockRejectedValue(error);

      await expect(baseService.getById('test-collection', 'test-id'))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('update', () => {
    it('should update existing item with new data', async () => {
      const updateData = { name: 'Updated Item', value: 456 };
      const expectedItem = {
        id: 'test-id',
        name: 'Updated Item',
        value: 456,
        updatedAt: expect.any(String)
      };

      mockRef.update.mockResolvedValue();

      const result = await baseService.update('test-collection', 'test-id', updateData);

      expect(mockDb.ref).toHaveBeenCalledWith('test-collection/test-id');
      expect(mockRef.update).toHaveBeenCalledWith(expectedItem);
      expect(result).toEqual(expectedItem);
      expect(result.id).toBe('test-id');
      expect(new Date(result.updatedAt)).toBeInstanceOf(Date);
    });

    it('should handle update operation errors', async () => {
      const updateData = { name: 'Updated Item' };
      const error = new Error('Database error');
      mockRef.update.mockRejectedValue(error);

      await expect(baseService.update('test-collection', 'test-id', updateData))
        .rejects
        .toThrow('Database error');
    });
  });

  describe('delete', () => {
    it('should delete item by id', async () => {
      mockRef.remove.mockResolvedValue();

      const result = await baseService.delete('test-collection', 'test-id');

      expect(mockDb.ref).toHaveBeenCalledWith('test-collection/test-id');
      expect(mockRef.remove).toHaveBeenCalled();
      expect(result).toEqual({ success: true });
    });

    it('should handle delete operation errors', async () => {
      const error = new Error('Database error');
      mockRef.remove.mockRejectedValue(error);

      await expect(baseService.delete('test-collection', 'test-id'))
        .rejects
        .toThrow('Database error');
    });
  });
}); 