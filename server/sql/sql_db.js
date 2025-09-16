let drop = `
    drop table if exists "Products", "Users"
    `;

let createUsers = `
    CREATE TABLE "Users" (
        id SERIAL PRIMARY KEY,
        username VARCHAR NOT NULL,
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

module.exports = { createUsers, createProducts, drop };
