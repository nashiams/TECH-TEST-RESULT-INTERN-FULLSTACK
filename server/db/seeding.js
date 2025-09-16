const pool = require("./pool");
const { hashPassword } = require("../helper/bcrypt");

let fs = require("fs").promises;

async function seeding() {
  try {
    await pool.query('DELETE FROM "Products"');
    await pool.query('DELETE FROM "Users"');

    let userData = JSON.parse(await fs.readFile("../data/user.json", "utf8"));

    for (let user of userData) {
      await pool.query(
        'INSERT INTO "Users" ("username", "password") VALUES ($1, $2)',
        [user.username, hashPassword(user.password)]
      );
    }

    let productData = JSON.parse(
      await fs.readFile("../data/products.json", "utf8")
    );

    for (let product of productData) {
      await pool.query(
        'INSERT INTO "Products" ("name", "description", "userId", "image") VALUES ($1, $2, $3, $4)',
        [product.name, product.description, product.userId, product.image]
      );
    }

    console.log("Seeding completed successfully");
  } catch (error) {
    console.log("error", error);
  }
}

seeding();
