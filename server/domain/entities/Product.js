class Product {
  constructor({ id, name, description, userId, image, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.userId = userId;
    this.image = image;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create({ name, description, userId }) {
    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_");
    const image = `https://pollinations.ai/p/photorealistic_image_of_${sanitizedName}`;

    return new Product({
      name,
      description,
      userId,
      image,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  update({ name, description }) {
    if (!name || !description) {
      throw new Error("Name and description are required");
    }

    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "_");
    const image = `https://pollinations.ai/p/photorealistic_image_of_${sanitizedName}`;

    this.name = name;
    this.description = description;
    this.image = image;
    this.updatedAt = new Date();
  }

  isOwnedBy(userId) {
    return this.userId === userId;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      userId: this.userId,
      image: this.image,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

module.exports = Product;
