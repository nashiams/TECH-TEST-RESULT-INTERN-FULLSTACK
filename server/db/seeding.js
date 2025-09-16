const pool = require("./pool");
const { hashPassword } = require("../helper/bcrypt");
const { seedingUsersQuery, seedingProductsQuery } = require("../sql/sql_db");
let fs = require("fs").promises;

async function seeding() {
  try {
    // Clear tables
    await pool.query('DELETE FROM "Products"');
    await pool.query('DELETE FROM "Users"');

    // Reset serial IDs
    await pool.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 1');
    await pool.query('ALTER SEQUENCE "Products_id_seq" RESTART WITH 1');

    // Insert users
    let userData = JSON.parse(await fs.readFile("../data/user.json", "utf8"));
    for (let user of userData) {
      await pool.query(seedingUsersQuery, [
        user.username,
        hashPassword(user.password),
      ]);
    }

    // Insert products
    let productData = JSON.parse(
      await fs.readFile("../data/products.json", "utf8")
    );
    for (let product of productData) {
      await pool.query(seedingProductsQuery, [
        product.name,
        product.description,
        product.userId, // now safe since IDs restart from 1
        product.image,
      ]);
    }

    console.log("Seeding completed successfully ✅");
  } catch (error) {
    console.log("error", error);
  }
}

seeding();
