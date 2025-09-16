let countPageQuery = `SELECT COUNT(*) FROM "Products"`;

let getProductQuery = `SELECT * FROM "Products" ORDER BY id LIMIT $1 OFFSET $2`;

let getProductByIdQuery = `SELECT * FROM "Products" WHERE id = $1`;

let createProductQuery = `
  INSERT INTO "Products" (name, description, "userId", image)
  VALUES ($1, $2, $3, $4)
  RETURNING *
`;

let updateProductQuery = `
  UPDATE "Products"
  SET name = $1, description = $2, "userId" = $3, image = $4
  WHERE id = $5
  RETURNING *
`;

let deleteProductQuery = `DELETE FROM "Products" WHERE id = $1 RETURNING *`;

module.exports = {
  getProductQuery,
  countPageQuery,
  getProductByIdQuery,
  createProductQuery,
  updateProductQuery,
  deleteProductQuery,
};
