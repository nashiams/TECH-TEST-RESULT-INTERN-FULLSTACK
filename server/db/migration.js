// const { create } = require("../domain/entities/User");
const {
  createUsers,
  drop,
  createProducts,
  createDatabase,
} = require("../sql/sql_db");
const pool = require("./pool");

async function setup() {
  await pool.query(createDatabase);
  await pool.query(drop);
  console.log("drop ok");
  await pool.query(createUsers);
  console.log("table1 ok");
  await pool.query(createProducts);
  console.log("table2 ok");
}

setup();
