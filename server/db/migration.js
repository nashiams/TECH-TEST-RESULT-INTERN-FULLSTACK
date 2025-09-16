// const { create } = require("../domain/entities/User");
const {
  createUsers,
  drop,
  createProducts,
  createDatabase,
} = require("../sql/sql_db");
const pool = require("./pool");
const { Pool } = require("pg");

async function setup() {
  // Create a temporary connection to 'postgres' database to create our target database
  const tempPool = new Pool({
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5433,
    database: "postgres",
    idleTimeoutMillis: 500,
  });

  try {
    await tempPool.query(createDatabase);
    console.log("database created ok");
  } catch (error) {
    if (error.code === "42P04") {
      // Database already exists error code
      console.log("database already exists");
    } else {
      throw error;
    }
  } finally {
    await tempPool.end();
  }

  // Now use the regular pool for table operations
  await pool.query(drop);
  console.log("drop ok");
  await pool.query(createUsers);
  console.log("table1 ok");
  await pool.query(createProducts);
  console.log("table2 ok");
}

setup();
