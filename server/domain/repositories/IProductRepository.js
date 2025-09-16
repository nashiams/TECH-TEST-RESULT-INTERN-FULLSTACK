class IProductRepository {
  async findAll(pagination) {
    throw new Error("Method 'findAll' must be implemented");
  }

  async findById(id) {
    throw new Error("Method 'findById' must be implemented");
  }

  async save(product) {
    throw new Error("Method 'save' must be implemented");
  }

  async update(id, product) {
    throw new Error("Method 'update' must be implemented");
  }

  async delete(id) {
    throw new Error("Method 'delete' must be implemented");
  }
}

module.exports = IProductRepository;
