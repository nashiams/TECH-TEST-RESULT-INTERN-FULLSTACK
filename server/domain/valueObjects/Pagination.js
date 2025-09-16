class Pagination {
  constructor(page = 1, limit = 10) {
    this.page = Math.max(1, parseInt(page));
    this.limit = Math.max(1, Math.min(100, parseInt(limit)));
    this.offset = (this.page - 1) * this.limit;
  }

  static create(page, limit) {
    return new Pagination(page, limit);
  }

  calculateTotalPages(totalItems) {
    return Math.ceil(totalItems / this.limit);
  }

  toResponse(totalItems) {
    return {
      currentPage: this.page,
      totalPages: this.calculateTotalPages(totalItems),
      totalProducts: totalItems,
      limit: this.limit,
    };
  }
}

module.exports = Pagination;
