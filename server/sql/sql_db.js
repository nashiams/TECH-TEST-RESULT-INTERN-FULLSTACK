let drop = `
    drop table if exists "Products", "Users"
    `;

let createUsers = `
    CREATE TABLE "Users" (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL
    );
`;
let createProducts = `
    CREATE TABLE "Products" (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL,
        description TEXT,
        "userId" INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
        image TEXT
    );
`;

let seedingUsersQuery =
  'INSERT INTO "Users" ("username", "password") VALUES ($1, $2)';

let seedingProductsQuery =
  'INSERT INTO "Products" ("name", "description", "userId", "image") VALUES ($1, $2, $3, $4)';

module.exports = {
  createUsers,
  createProducts,
  drop,
  seedingUsersQuery,
  seedingProductsQuery,
};
