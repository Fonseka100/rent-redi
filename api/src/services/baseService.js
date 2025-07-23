const { v4: uuidv4 } = require('uuid');

class BaseService {
  constructor(db) {
    this.db = db;
  }

  async create(collection, data) {
    const item = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await this.db.ref(`${collection}/${item.id}`).set(item);
    return item;
  }

  async getAll(collection) {
    const snapshot = await this.db.ref(collection).once('value');
    const data = snapshot.val();
    return data ? Object.values(data) : [];
  }

  async getById(collection, id) {
    const snapshot = await this.db.ref(`${collection}/${id}`).once('value');
    return snapshot.val();
  }

  async update(collection, id, data) {
    const item = {
      id: id,
      ...data,
      updatedAt: new Date().toISOString()
    };

    await this.db.ref(`${collection}/${id}`).update(item);
    return item;
  }

  async delete(collection, id) {
    await this.db.ref(`${collection}/${id}`).remove();
    return { success: true };
  }
}

module.exports = BaseService; 